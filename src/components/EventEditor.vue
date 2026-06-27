<script setup lang="ts">
import { computed, reactive } from 'vue'
import type { CashflowEvent, EventDirection, EventRecurrence } from '../domain/types'

const props = defineProps<{
  modelValue: CashflowEvent[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: CashflowEvent[]]
}>()

type PresetKey =
  | 'mortgage'
  | 'pension'
  | 'rent'
  | 'medical'
  | 'oldAgeExpenseAdjustment'
  | 'oneTimeIncome'
  | 'oneTimeExpense'
  | 'custom'

const presetLabels: Record<PresetKey, string> = {
  mortgage: '房贷',
  pension: '养老金',
  rent: '租金收入',
  medical: '医疗支出',
  oldAgeExpenseAdjustment: '老年消费降低',
  oneTimeIncome: '一次性收入',
  oneTimeExpense: '一次性支出',
  custom: '自定义'
}

const form = reactive<CashflowEvent>({
  id: '',
  name: '房贷',
  category: 'mortgage',
  direction: 'expense',
  recurrence: 'yearly',
  startAge: 36,
  endAge: 60,
  amount: 60_000,
  inflationAdjusted: false
})

const sortedEvents = computed(() =>
  [...props.modelValue].sort((a, b) => a.startAge - b.startAge || a.name.localeCompare(b.name))
)

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function applyPreset(key: PresetKey) {
  const presets: Record<PresetKey, Omit<CashflowEvent, 'id'>> = {
    mortgage: {
      name: '房贷',
      category: 'mortgage',
      direction: 'expense',
      recurrence: 'yearly',
      startAge: 36,
      endAge: 60,
      amount: 60_000,
      inflationAdjusted: false
    },
    pension: {
      name: '养老金',
      category: 'pension',
      direction: 'income',
      recurrence: 'yearly',
      startAge: 60,
      endAge: null,
      amount: 48_000,
      inflationAdjusted: true
    },
    rent: {
      name: '租金收入',
      category: 'rent',
      direction: 'income',
      recurrence: 'yearly',
      startAge: 40,
      endAge: null,
      amount: 36_000,
      inflationAdjusted: true
    },
    medical: {
      name: '医疗支出',
      category: 'medical',
      direction: 'expense',
      recurrence: 'yearly',
      startAge: 75,
      endAge: null,
      amount: 30_000,
      inflationAdjusted: true
    },
    oldAgeExpenseAdjustment: {
      name: '老年消费降低',
      category: 'oldAgeExpenseAdjustment',
      direction: 'expenseAdjustment',
      recurrence: 'yearly',
      startAge: 70,
      endAge: null,
      amount: -20_000,
      inflationAdjusted: false
    },
    oneTimeIncome: {
      name: '一次性收入',
      category: 'oneTimeIncome',
      direction: 'income',
      recurrence: 'oneTime',
      startAge: 55,
      endAge: null,
      amount: 200_000,
      inflationAdjusted: false
    },
    oneTimeExpense: {
      name: '一次性支出',
      category: 'oneTimeExpense',
      direction: 'expense',
      recurrence: 'oneTime',
      startAge: 45,
      endAge: null,
      amount: 200_000,
      inflationAdjusted: false
    },
    custom: {
      name: '自定义事件',
      category: 'custom',
      direction: 'expense',
      recurrence: 'yearly',
      startAge: 50,
      endAge: null,
      amount: 10_000,
      inflationAdjusted: false
    }
  }

  Object.assign(form, { id: '', ...presets[key] })
}

function addEvent() {
  emit('update:modelValue', [...props.modelValue, { ...form, id: createId() }])
}

function removeEvent(id: string) {
  emit(
    'update:modelValue',
    props.modelValue.filter((event) => event.id !== id)
  )
}

function updateEvent(id: string, patch: Partial<CashflowEvent>) {
  emit(
    'update:modelValue',
    props.modelValue.map((event) => (event.id === id ? { ...event, ...patch } : event))
  )
}
</script>

<template>
  <section class="panel">
    <div class="panel-title">
      <h2>现金流事件</h2>
      <span>{{ modelValue.length }} 项</span>
    </div>

    <div class="event-form">
      <label>
        <span>事件模板</span>
        <select :value="form.category" @change="applyPreset(($event.target as HTMLSelectElement).value as PresetKey)">
          <option v-for="(label, key) in presetLabels" :key="key" :value="key">{{ label }}</option>
        </select>
      </label>
      <label>
        <span>名称</span>
        <input v-model="form.name" />
      </label>
      <label>
        <span>方向</span>
        <select v-model="form.direction">
          <option value="income">收入</option>
          <option value="expense">支出</option>
          <option value="expenseAdjustment">消费调整</option>
        </select>
      </label>
      <label>
        <span>频率</span>
        <select v-model="form.recurrence">
          <option value="yearly">每年</option>
          <option value="oneTime">一次性</option>
        </select>
      </label>
      <label>
        <span>开始年龄</span>
        <input v-model.number="form.startAge" type="number" min="1" max="120" />
      </label>
      <label>
        <span>结束年龄</span>
        <input
          :value="form.endAge ?? ''"
          type="number"
          min="1"
          max="120"
          placeholder="不限"
          @input="form.endAge = ($event.target as HTMLInputElement).value === '' ? null : Number(($event.target as HTMLInputElement).value)"
        />
      </label>
      <label>
        <span>金额</span>
        <input v-model.number="form.amount" type="number" step="1000" />
      </label>
      <label class="checkbox-label">
        <input v-model="form.inflationAdjusted" type="checkbox" />
        <span>随通胀增长</span>
      </label>
      <button class="primary-button" type="button" @click="addEvent">添加事件</button>
    </div>

    <div v-if="sortedEvents.length === 0" class="empty-state">还没有特殊现金流事件。</div>

    <div v-else class="event-list">
      <article v-for="event in sortedEvents" :key="event.id" class="event-item">
        <div class="event-item-header">
          <input :value="event.name" @input="updateEvent(event.id, { name: ($event.target as HTMLInputElement).value })" />
          <button class="ghost-button danger" type="button" @click="removeEvent(event.id)">删除</button>
        </div>
        <div class="event-grid">
          <label>
            <span>方向</span>
            <select :value="event.direction" @change="updateEvent(event.id, { direction: ($event.target as HTMLSelectElement).value as EventDirection })">
              <option value="income">收入</option>
              <option value="expense">支出</option>
              <option value="expenseAdjustment">消费调整</option>
            </select>
          </label>
          <label>
            <span>频率</span>
            <select :value="event.recurrence" @change="updateEvent(event.id, { recurrence: ($event.target as HTMLSelectElement).value as EventRecurrence })">
              <option value="yearly">每年</option>
              <option value="oneTime">一次性</option>
            </select>
          </label>
          <label>
            <span>开始</span>
            <input :value="event.startAge" type="number" @input="updateEvent(event.id, { startAge: Number(($event.target as HTMLInputElement).value) })" />
          </label>
          <label>
            <span>结束</span>
            <input
              :value="event.endAge ?? ''"
              type="number"
              placeholder="不限"
              @input="updateEvent(event.id, { endAge: ($event.target as HTMLInputElement).value === '' ? null : Number(($event.target as HTMLInputElement).value) })"
            />
          </label>
          <label>
            <span>金额</span>
            <input :value="event.amount" type="number" step="1000" @input="updateEvent(event.id, { amount: Number(($event.target as HTMLInputElement).value) })" />
          </label>
          <label class="checkbox-label">
            <input
              :checked="event.inflationAdjusted"
              type="checkbox"
              @change="updateEvent(event.id, { inflationAdjusted: ($event.target as HTMLInputElement).checked })"
            />
            <span>随通胀</span>
          </label>
        </div>
      </article>
    </div>
  </section>
</template>
