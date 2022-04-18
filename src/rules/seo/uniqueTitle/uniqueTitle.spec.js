import { describe, it, expect, beforeEach, vi } from 'vitest'
import rule from './rule.js'
import runTestForRule from '../../../util/testRule.js'

describe('seo.uniqueTitle', () => {
  let cache
  const takenValue = 'Already taken title'
  const freeValue = 'Not yet assigned'

  beforeEach(() => {
    cache = {
      includes: vi.fn((key, value) => value === takenValue),
      push: vi.fn((key, value) => value),
    }
  })

  it('should return an error for an already taken title', async () => {
    let results = await runTestForRule(
      rule,
      `<title>${takenValue}</title>`,
      {},
      cache,
    )
    expect(cache.includes).toHaveBeenCalled()
    expect(cache.includes).toHaveBeenCalledWith('seo.uniqueTitle', takenValue)
    expect(cache.push).toHaveBeenCalled()
    expect(cache.push).toHaveBeenCalledWith('seo.uniqueTitle', takenValue)
    expect(results.errors.length).toBe(1)
    expect(results.errors[0]).toContain(`"${takenValue}"`)
  })

  it('should not return an error for a unique taken title', async () => {
    let results = await runTestForRule(
      rule,
      `<title>${freeValue}</title>`,
      {},
      cache,
    )
    expect(cache.includes).toHaveBeenCalled()
    expect(cache.includes).toHaveBeenCalledWith('seo.uniqueTitle', freeValue)
    expect(cache.push).toHaveBeenCalled()
    expect(cache.push).toHaveBeenCalledWith('seo.uniqueTitle', freeValue)
    expect(results.errors.length).toBe(0)
  })
})
