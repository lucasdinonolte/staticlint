import { describe, it, expect, beforeEach, vi } from 'vitest'
import rule, { UNIQUE_CANONICAL_THRESHOLD } from './rule.js'
import runTestForRule from '../../../util/testRule.js'

describe('seo.uniqueCanonical', () => {
  let cache
  const takenValue = 'https://example.com/taken'
  const freeValue = 'https://example.com/free'

  beforeEach(() => {
    cache = {
      includesHowOften: vi.fn((_, value) =>
        value === takenValue ? UNIQUE_CANONICAL_THRESHOLD : 1,
      ),
      push: vi.fn((_, value) => value),
    }
  })

  it('should return a warning for duplicate canonical URLs', async () => {
    let results = await runTestForRule(
      rule,
      `<link rel="canonical" href="${takenValue}" />`,
      {},
      cache,
    )
    expect(cache.includesHowOften).toHaveBeenCalled()
    expect(cache.includesHowOften).toHaveBeenCalledWith(
      'seo.uniqueCanonical',
      takenValue,
    )
    expect(cache.push).toHaveBeenCalled()
    expect(cache.push).toHaveBeenCalledWith('seo.uniqueCanonical', takenValue)
    expect(results.length).toBe(1)
    expect(results[0]).toContain(`"${takenValue}"`)
  })

  it('should not return an error for a unique taken title', async () => {
    let results = await runTestForRule(
      rule,
      `<link rel="canonical" href="${freeValue}" />`,
      {},
      cache,
    )
    expect(cache.includesHowOften).toHaveBeenCalled()
    expect(cache.includesHowOften).toHaveBeenCalledWith(
      'seo.uniqueCanonical',
      freeValue,
    )
    expect(cache.push).toHaveBeenCalled()
    expect(cache.push).toHaveBeenCalledWith('seo.uniqueCanonical', freeValue)
    expect(results.length).toBe(0)
  })
})
