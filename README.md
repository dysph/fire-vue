# FIRE 现金流模拟器 Vue 版

这是一个独立的 Vue 3 + TypeScript 重写版本，位于仓库的 `fire-vue/` 子目录中。它不会替换或修改根目录下的旧版 `index.html`，也不会读取旧版页面保存的 `localStorage` 数据。

## 功能概览

本应用用于模拟 FIRE 退休场景下的长期资产变化。用户可以输入基础财务假设，并通过“现金流事件”明确描述真实生活中的特殊情况，例如：

- 房贷在某个年龄结束
- 某个年龄开始领取养老金
- 出租房产生租金收入
- 老年后生活消费降低
- 高龄后医疗支出增加
- 某一年发生一次性大额收入或支出
- 自定义收入、支出或消费调整

页面会输出：

- 资产可支撑年数
- 年度现金流趋势图
- 逐年结果表
- 每一年命中的特殊事件说明

## 技术栈

- Vue 3
- TypeScript
- Vite
- Vitest
- ECharts
- Vue-ECharts

## 本地开发

进入子目录：

```powershell
cd fire-vue
```

安装依赖：

```powershell
npm install
```

启动开发服务器：

```powershell
npm run dev
```

默认访问：

```text
http://127.0.0.1:5173/
```

生产构建：

```powershell
npm run build
```

预览生产构建：

```powershell
npm run preview
```

运行测试：

```powershell
npm test
```

## 计算模型

核心计算逻辑在：

```text
src/domain/simulation.ts
```

基础输入模型：

```ts
type PlanInput = {
  principal: number
  annualReturnRate: number
  annualBaseExpense: number
  inflationRate: number
  startAge: number
  maxYears: number
}
```

每一年按以下逻辑模拟：

```text
基础消费 = 初始年消费按通胀逐年增长
事件收入 = 当前年龄命中的收入事件之和
事件支出 = 当前年龄命中的支出事件之和
消费调整 = 当前年龄命中的消费调整事件之和

总消费 = max(基础消费 + 消费调整 + 事件支出, 0)
投资基数 = max(年初本金 - 总消费, 0)
投资收益 = 投资基数 × 年化收益率
年末本金 = max(年初本金 - 总消费 + 事件收入 + 投资收益, 0)
```

当本金第一次耗尽时，系统记录资产可支撑年数；如果模拟期内没有耗尽，则显示 `100+` 或对应最大年数内未耗尽的结果。

## 现金流事件

事件类型定义在：

```text
src/domain/types.ts
```

事件模型：

```ts
type CashflowEvent = {
  id: string
  name: string
  category:
    | 'mortgage'
    | 'pension'
    | 'rent'
    | 'medical'
    | 'oldAgeExpenseAdjustment'
    | 'oneTimeIncome'
    | 'oneTimeExpense'
    | 'custom'
  direction: 'income' | 'expense' | 'expenseAdjustment'
  recurrence: 'oneTime' | 'yearly'
  startAge: number
  endAge: number | null
  amount: number
  inflationAdjusted: boolean
}
```

事件命中规则：

- `oneTime`：仅在 `age === startAge` 时生效
- `yearly`：从 `startAge` 开始生效，直到 `endAge`；`endAge` 为 `null` 表示长期有效
- `inflationAdjusted`：事件金额从开始年龄起按通胀率逐年增长

## 项目结构

```text
fire-vue/
  index.html
  package.json
  vite.config.ts
  src/
    App.vue
    main.ts
    storage.ts
    style.css
    components/
      EventEditor.vue
      PlanInputs.vue
      ResultChart.vue
      ResultTable.vue
    domain/
      simulation.ts
      simulation.test.ts
      types.ts
```

## 数据存储

新版使用独立的 `localStorage` key：

```text
fire-vue-plan-v1
```

它不会读取旧版页面使用的 `principal`、`annualInterestRate`、`annualExpenses` 等 key。

## 测试覆盖

当前核心测试覆盖：

- 无事件时的基础 FIRE 计算
- 房贷在结束年龄后停止
- 养老金从指定年龄开始
- 一次性支出只命中指定年龄
- 老年消费降低不会让总消费小于 0
- 随通胀增长的事件金额
- 本金耗尽年数计算

测试文件：

```text
src/domain/simulation.test.ts
```

## 与旧版页面的关系

旧版页面仍保留在仓库根目录：

```text
index.html
```

Vue 版目前是独立子项目：

```text
fire-vue/
```

后续如果确认 Vue 版功能和体验稳定，可以再决定是否将根目录入口迁移到 Vue 构建产物。
