import { describe, it, expect, beforeEach, vi } from 'vitest'
import rule from './rule.js'
import runTestForRule from '../../../util/testRule.js'

describe('html.brokenLinks', () => {
  let urlExists

  beforeEach(() => {
    urlExists = vi.fn(async (url) => url)
  })

  it('should return an error for a missing external link', async () => {
    urlExists.mockImplementationOnce(() => false)

    let results = await runTestForRule(
      rule,
      '<a href="http://broken-link.de">Broken Link</a>',
      {},
      {},
      { urlExists },
    )

    expect(urlExists).toHaveBeenCalledWith('http://broken-link.de')
    expect(results.errors.length).toBe(1)
  })

  it('should not return an error for internal links', async () => {
    urlExists.mockImplementationOnce(() => false)
    let results = await runTestForRule(
      rule,
      '<a href="https://example.com/foo/">Foo</a> <a href="/foo/">Foo</a>',
      { host: 'https://example.com' },
      {},
      { urlExists },
    )

    expect(urlExists).not.toHaveBeenCalled()
    expect(results.errors.length).toBe(0)
  })
})
