import type { CashflowEvent, PlanInput } from './domain/types'

const STORAGE_KEY = 'fire-vue-plan-v1'

export type StoredPlan = {
  input: PlanInput
  events: CashflowEvent[]
}

export function loadStoredPlan(defaultValue: StoredPlan): StoredPlan {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return defaultValue
  }

  try {
    const parsed = JSON.parse(raw) as Partial<StoredPlan>
    if (!parsed.input || !Array.isArray(parsed.events)) {
      return defaultValue
    }
    return {
      input: { ...defaultValue.input, ...parsed.input },
      events: parsed.events
    }
  } catch {
    return defaultValue
  }
}

export function saveStoredPlan(value: StoredPlan): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
}

export function clearStoredPlan(): void {
  localStorage.removeItem(STORAGE_KEY)
}
