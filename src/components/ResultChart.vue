<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import type { SimulationYear } from '../domain/types'

use([CanvasRenderer, GridComponent, LegendComponent, LineChart, TooltipComponent])

const props = defineProps<{
  rows: SimulationYear[]
}>()

const chartOption = computed(() => ({
  color: ['#2563eb', '#dc2626', '#16a34a', '#f59e0b'],
  tooltip: {
    trigger: 'axis',
    valueFormatter: (value: number) => formatMoney(value)
  },
  legend: {
    top: 0,
    data: ['年末本金', '总消费', '特殊收入', '特殊支出']
  },
  grid: {
    left: 56,
    right: 24,
    top: 48,
    bottom: 36
  },
  xAxis: {
    type: 'category',
    data: props.rows.map((row) => row.age)
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: (value: number) => `${Math.round(value / 10000)}万`
    }
  },
  series: [
    {
      name: '年末本金',
      type: 'line',
      smooth: true,
      data: props.rows.map((row) => row.endingPrincipal)
    },
    {
      name: '总消费',
      type: 'line',
      smooth: true,
      data: props.rows.map((row) => row.totalExpense)
    },
    {
      name: '特殊收入',
      type: 'line',
      smooth: true,
      data: props.rows.map((row) => row.eventIncome)
    },
    {
      name: '特殊支出',
      type: 'line',
      smooth: true,
      data: props.rows.map((row) => row.eventExpense)
    }
  ]
}))

function formatMoney(value: number) {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    maximumFractionDigits: 0
  }).format(value)
}
</script>

<template>
  <section class="panel chart-panel">
    <div class="panel-title">
      <h2>趋势图</h2>
      <span>年龄维度</span>
    </div>
    <VChart class="chart" :option="chartOption" autoresize />
  </section>
</template>
