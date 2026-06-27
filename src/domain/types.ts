export type EventCategory =
  | 'mortgage'
  | 'pension'
  | 'rent'
  | 'medical'
  | 'oldAgeExpenseAdjustment'
  | 'oneTimeIncome'
  | 'oneTimeExpense'
  | 'custom'

export type EventDirection = 'income' | 'expense' | 'expenseAdjustment'

export type EventRecurrence = 'oneTime' | 'yearly'

export type PlanInput = {
  principal: number
  annualReturnRate: number
  annualBaseExpense: number
  inflationRate: number
  startYear: number
  startAge: number
  maxYears: number
}

export type CashflowEvent = {
  id: string
  name: string
  category: EventCategory
  direction: EventDirection
  recurrence: EventRecurrence
  startAge: number
  endAge: number | null
  amount: number
  inflationAdjusted: boolean
}

export type MatchedEvent = CashflowEvent & {
  appliedAmount: number
}

export type SimulationYear = {
  yearIndex: number
  calendarYear: number
  age: number
  startingPrincipal: number
  baseExpense: number
  expenseAdjustment: number
  eventExpense: number
  eventIncome: number
  totalExpense: number
  interest: number
  endingPrincipal: number
  matchedEvents: MatchedEvent[]
}

export type SimulationResult = {
  supportYears: number | '100+'
  rows: SimulationYear[]
}
