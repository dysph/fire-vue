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

    <section class="workspace">
      <aside class="control-panel">
        <PlanInputs v-model="input" @reset="resetPlan" />
        <EventEditor v-model="events" />
      </aside>

      <section class="result-panel">
        <ResultChart :rows="result.rows" />
        <ResultTable :rows="result.rows" />
      </section>
    </section>
  </main>
</template>
