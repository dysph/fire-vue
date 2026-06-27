<script setup lang="ts">
import type { PlanInput } from '../domain/types'

const props = defineProps<{
  modelValue: PlanInput
}>()

const emit = defineEmits<{
  'update:modelValue': [value: PlanInput]
  reset: []
}>()

function updateField(field: keyof PlanInput, value: number) {
  emit('update:modelValue', {
    ...props.modelValue,
    [field]: Number.isFinite(value) ? value : 0
  })
}
</script>

<template>
  <section class="panel">
    <div class="panel-title">
      <h2>基础假设</h2>
      <button class="ghost-button" type="button" @click="emit('reset')">重置</button>
    </div>

    <label>
      <span>当前本金</span>
      <input
        type="number"
        min="0"
        step="10000"
        :value="modelValue.principal"
        @input="updateField('principal', Number(($event.target as HTMLInputElement).value))"
      />
    </label>

    <label>
      <span>年化收益率 %</span>
      <input
        type="number"
        min="0"
        step="0.1"
        :value="modelValue.annualReturnRate"
        @input="updateField('annualReturnRate', Number(($event.target as HTMLInputElement).value))"
      />
    </label>

    <label>
      <span>当前年消费</span>
      <input
        type="number"
        min="0"
        step="1000"
        :value="modelValue.annualBaseExpense"
        @input="updateField('annualBaseExpense', Number(($event.target as HTMLInputElement).value))"
      />
    </label>

    <label>
      <span>通胀率 %</span>
      <input
        type="number"
        min="0"
        step="0.1"
        :value="modelValue.inflationRate"
        @input="updateField('inflationRate', Number(($event.target as HTMLInputElement).value))"
      />
    </label>

    <label>
      <span>起始年龄</span>
      <input
        type="number"
        min="1"
        max="120"
        step="1"
        :value="modelValue.startAge"
        @input="updateField('startAge', Number(($event.target as HTMLInputElement).value))"
      />
    </label>

    <label>
      <span>模拟年数</span>
      <input
        type="number"
        min="1"
        max="120"
        step="1"
        :value="modelValue.maxYears"
        @input="updateField('maxYears', Number(($event.target as HTMLInputElement).value))"
      />
    </label>
  </section>
</template>
