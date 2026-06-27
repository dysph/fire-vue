import { describe, expect, it } from 'vitest'
import { simulatePlan } from './simulation'
import type { CashflowEvent, PlanInput } from './types'

const baseInput: PlanInput = {
  principal: 1_000_000,
  annualReturnRate: 2,
  annualBaseExpense: 50_000,
  inflationRate: 0,
  startYear: 2026,
  startAge: 40,
  maxYears: 100
}

describe('simulatePlan', () => {
  it('models the baseline FIRE calculation without events', () => {
    const result = simulatePlan(baseInput, [])

    expect(result.rows[0]).toMatchObject({
      yearIndex: 1,
      calendarYear: 2026,
      age: 40,
      baseExpense: 50_000,
      totalExpense: 50_000,
      interest: 19_000,
      endingPrincipal: 969_000
    })
    expect(result.rows[1].calendarYear).toBe(2027)
  })

  it('stops mortgage expenses after the event end age', () => {
    const mortgage: CashflowEvent = {
      id: 'mortgage',
      name: '房贷',
      category: 'mortgage',
      direction: 'expense',
      recurrence: 'yearly',
      startAge: 40,
      endAge: 41,
      amount: 20_000,
      inflationAdjusted: false
    }

    const result = simulatePlan(baseInput, [mortgage])

    expect(result.rows[0].eventExpense).toBe(20_000)
    expect(result.rows[1].eventExpense).toBe(20_000)
    expect(result.rows[2].eventExpense).toBe(0)
  })

  it('adds pension income starting at the configured age', () => {
    const pension: CashflowEvent = {
      id: 'pension',
      name: '养老金',
      category: 'pension',
      direction: 'income',
      recurrence: 'yearly',
      startAge: 42,
      endAge: null,
      amount: 30_000,
      inflationAdjusted: false
    }

    const result = simulatePlan(baseInput, [pension])

    expect(result.rows[1].eventIncome).toBe(0)
    expect(result.rows[2].eventIncome).toBe(30_000)
  })

  it('applies one-time expenses only in the matching age', () => {
    const renovation: CashflowEvent = {
      id: 'renovation',
      name: '装修',
      category: 'oneTimeExpense',
      direction: 'expense',
      recurrence: 'oneTime',
      startAge: 41,
      endAge: null,
      amount: 120_000,
      inflationAdjusted: false
    }

    const result = simulatePlan(baseInput, [renovation])

    expect(result.rows[0].eventExpense).toBe(0)
    expect(result.rows[1].eventExpense).toBe(120_000)
    expect(result.rows[2].eventExpense).toBe(0)
  })

  it('reduces old-age expenses without letting total expense go below zero', () => {
    const lowerSpending: CashflowEvent = {
      id: 'old-age',
      name: '老年消费降低',
      category: 'oldAgeExpenseAdjustment',
      direction: 'expenseAdjustment',
      recurrence: 'yearly',
      startAge: 40,
      endAge: null,
      amount: -80_000,
      inflationAdjusted: false
    }

    const result = simulatePlan(baseInput, [lowerSpending])

    expect(result.rows[0].expenseAdjustment).toBe(-80_000)
    expect(result.rows[0].totalExpense).toBe(0)
  })

  it('inflates event amounts from the event start age', () => {
    const input: PlanInput = {
      ...baseInput,
      inflationRate: 10
    }
    const medical: CashflowEvent = {
      id: 'medical',
      name: '医疗',
      category: 'medical',
      direction: 'expense',
      recurrence: 'yearly',
      startAge: 41,
      endAge: null,
      amount: 10_000,
      inflationAdjusted: true
    }

    const result = simulatePlan(input, [medical])

    expect(result.rows[1].eventExpense).toBe(10_000)
    expect(result.rows[2].eventExpense).toBe(11_000)
  })

  it('records the supported years before principal is depleted', () => {
    const result = simulatePlan(
      {
        ...baseInput,
        principal: 100_000,
        annualReturnRate: 0,
        annualBaseExpense: 40_000
      },
      []
    )

    expect(result.supportYears).toBe(2)
    expect(result.rows[2].endingPrincipal).toBe(0)
  })
})
