import { describe, expect, it } from 'vitest'
import { formatWan } from './format'

describe('formatWan', () => {
  it('formats yuan values as wan without noisy decimals', () => {
    expect(formatWan(4_000_000)).toBe('400 万')
    expect(formatWan(35_000)).toBe('3.5 万')
    expect(formatWan(12_345)).toBe('1.23 万')
  })
})
