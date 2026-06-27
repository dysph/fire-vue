<script setup lang="ts">
import type { MatchedEvent, SimulationYear } from '../domain/types'

defineProps<{
  rows: SimulationYear[]
}>()

function formatMoney(value: number) {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    maximumFractionDigits: 0
  }).format(value)
}

function formatEvent(event: MatchedEvent) {
  const sign = event.direction === 'income' ? '+' : ''
  return `${event.name} ${sign}${formatMoney(event.appliedAmount)}`
}
</script>

<template>
  <section class="panel table-panel">
    <div class="panel-title">
      <h2>逐年结果</h2>
      <span>{{ rows.length }} 年</span>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>年份</th>
            <th>年龄</th>
            <th>基础消费</th>
            <th>消费调整</th>
            <th>特殊支出</th>
            <th>特殊收入</th>
            <th>投资收益</th>
            <th>年末本金</th>
            <th>命中事件</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.yearIndex" :class="{ depleted: row.endingPrincipal <= 0 }">
            <td class="year-cell">
              <span class="year-index">{{ row.yearIndex }}</span>
              <span class="calendar-year">{{ row.calendarYear }}</span>
            </td>
            <td>{{ row.age }}</td>
            <td>{{ formatMoney(row.baseExpense) }}</td>
            <td>{{ formatMoney(row.expenseAdjustment) }}</td>
            <td>{{ formatMoney(row.eventExpense) }}</td>
            <td>{{ formatMoney(row.eventIncome) }}</td>
            <td>{{ formatMoney(row.interest) }}</td>
            <td>{{ formatMoney(row.endingPrincipal) }}</td>
            <td>
              <span v-if="row.matchedEvents.length === 0" class="muted">-</span>
              <span v-for="event in row.matchedEvents" v-else :key="`${event.id}-${row.yearIndex}`" class="event-chip">
                {{ formatEvent(event) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
