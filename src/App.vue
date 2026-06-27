<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import EventEditor from './components/EventEditor.vue'
import PlanInputs from './components/PlanInputs.vue'
import ResultChart from './components/ResultChart.vue'
import ResultTable from './components/ResultTable.vue'
import { simulatePlan } from './domain/simulation'
import type { CashflowEvent, PlanInput } from './domain/types'
import { clearStoredPlan, loadStoredPlan, saveStoredPlan, type StoredPlan } from './storage'

const defaultPlan: StoredPlan = {
  input: {
    principal: 1_600_000,
    annualReturnRate: 2,
    annualBaseExpense: 35_000,
    inflationRate: 2.229,
    startYear: new Date().getFullYear(),
    startAge: 36,
    maxYears: 100
  },
  events: []
}

const storedPlan = loadStoredPlan(defaultPlan)
const input = ref<PlanInput>({ ...storedPlan.input })
const events = ref<CashflowEvent[]>(storedPlan.events)
const activeTab = ref<'inputs' | 'chart' | 'table'>('inputs')

const result = computed(() => simulatePlan(input.value, events.value))
const supportYearsLabel = computed(() => `${result.value.supportYears}`)

watch(
  [input, events],
  () => {
    saveStoredPlan({ input: input.value, events: events.value })
  },
  { deep: true }
)

function resetPlan() {
  input.value = { ...defaultPlan.input }
  events.value = []
  clearStoredPlan()
}
</script>

<template>
  <main class="app-shell">
    <!-- Desktop Header -->
    <header class="app-header">
      <div>
        <h1>FIRE 现金流模拟器</h1>
        <p>用明确的收入和支出事件模拟房贷、养老金、租金、医疗和老年消费变化。</p>
      </div>
      <div class="support-card">
        <span>资产可支撑</span>
        <strong>{{ supportYearsLabel }}</strong>
        <span>年</span>
      </div>
    </header>

    <!-- Mobile Sticky Header -->
    <header class="mobile-header">
      <div class="mobile-top-bar">
        <h1>FIRE 模拟器</h1>
        <div class="mobile-support-card">
          <span>可支撑 </span>
          <strong>{{ supportYearsLabel }}</strong>
          <span> 年</span>
        </div>
      </div>
      <nav class="mobile-tabs">
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'inputs' }"
          @click="activeTab = 'inputs'"
        >
          参数设置
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'chart' }"
          @click="activeTab = 'chart'"
        >
          趋势图表
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'table' }"
          @click="activeTab = 'table'"
        >
          逐年数据
        </button>
      </nav>
    </header>

    <section class="workspace">
      <aside class="control-panel" :class="{ 'mobile-hide': activeTab !== 'inputs' }">
        <PlanInputs v-model="input" @reset="resetPlan" />
        <EventEditor v-model="events" />
      </aside>

      <section class="result-panel" :class="{ 'mobile-hide': activeTab === 'inputs' }">
        <ResultChart :rows="result.rows" :class="{ 'mobile-hide': activeTab !== 'chart' }" />
        <ResultTable :rows="result.rows" :class="{ 'mobile-hide': activeTab !== 'table' }" />
      </section>
    </section>
  </main>
</template>
