import type { CashflowEvent, MatchedEvent, PlanInput, SimulationResult } from './types'

const roundMoney = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100

function isEventActive(event: CashflowEvent, age: number): boolean {
  if (event.recurrence === 'oneTime') {
    return age === event.startAge
  }
  return age >= event.startAge && (event.endAge === null || age <= event.endAge)
}

function amountForAge(event: CashflowEvent, age: number, inflationRate: number): number {
  if (!event.inflationAdjusted) {
    return event.amount
  }
  const yearsSinceStart = Math.max(0, age - event.startAge)
  return event.amount * Math.pow(1 + inflationRate / 100, yearsSinceStart)
}

export function simulatePlan(input: PlanInput, events: CashflowEvent[]): SimulationResult {
  const rows: SimulationResult['rows'] = []
  let principal = Math.max(input.principal, 0)
  let supportYears: number | '100+' = '100+'
  const maxYears = Math.max(1, Math.floor(input.maxYears))

  for (let yearOffset = 0; yearOffset < maxYears; yearOffset++) {
    const yearIndex = yearOffset + 1
    const age = input.startAge + yearOffset
    const startingPrincipal = principal
    const baseExpense = input.annualBaseExpense * Math.pow(1 + input.inflationRate / 100, yearOffset)
    const matchedEvents: MatchedEvent[] = []
    let eventIncome = 0
    let eventExpense = 0
    let expenseAdjustment = 0

    for (const event of events) {
      if (!isEventActive(event, age)) {
        continue
      }
      const appliedAmount = amountForAge(event, age, input.inflationRate)
      matchedEvents.push({ ...event, appliedAmount: roundMoney(appliedAmount) })

      if (event.direction === 'income') {
        eventIncome += appliedAmount
      } else if (event.direction === 'expense') {
        eventExpense += appliedAmount
      } else {
        expenseAdjustment += appliedAmount
      }
    }

    const totalExpense = Math.max(baseExpense + expenseAdjustment + eventExpense, 0)
    const investmentBase = Math.max(startingPrincipal - totalExpense, 0)
    const interest = investmentBase * (input.annualReturnRate / 100)
    principal = Math.max(startingPrincipal - totalExpense + eventIncome + interest, 0)

    rows.push({
      yearIndex,
      age,
      startingPrincipal: roundMoney(startingPrincipal),
      baseExpense: roundMoney(baseExpense),
      expenseAdjustment: roundMoney(expenseAdjustment),
      eventExpense: roundMoney(eventExpense),
      eventIncome: roundMoney(eventIncome),
      totalExpense: roundMoney(totalExpense),
      interest: roundMoney(interest),
      endingPrincipal: roundMoney(principal),
      matchedEvents
    })

    if (supportYears === '100+' && principal <= 0) {
      supportYears = yearIndex - 1
    }
  }

  return { supportYears, rows }
}
