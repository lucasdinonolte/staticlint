import { describe, it, expect, beforeEach, vi } from 'vitest'
import rule from './rule.js'
import runTestForRule from '../../../util/testRule.js'

describe('html.missingImages', () => {
  let checkUrl, cache

  beforeEach(() => {
    checkUrl = vi.fn(async (url) => url)
    cache = {
      set: vi.fn(),
      get: vi.fn(() => false),
    }
  })

  it('should return an error for a missing external image', async () => {
    checkUrl.mockImplementationOnce(() => false)

    let results = await runTestForRule(
      rule,
      '<img src="http://broken-link.de/foo.png" alt="broken" />',
      {},
      cache,
      { checkUrl },
    )

    expect(checkUrl).toHaveBeenCalledWith('http://broken-link.de/foo.png')
    expect(results.length).toBe(1)
  })

  it('should not return an error for internal images', async () => {
    checkUrl.mockImplementationOnce(() => false)
    let results = await runTestForRule(
      rule,
      '<img src="https://example.com/foo.png" alt="Foo" /><img src="/foo.png" alt="Foo"/>',
      { host: 'https://example.com' },
      cache,
      { checkUrl },
    )

    expect(checkUrl).not.toHaveBeenCalled()
    expect(results.length).toBe(0)
  })
})
