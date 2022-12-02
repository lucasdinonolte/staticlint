import { describe, it, expect, beforeEach, vi } from 'vitest'
import rule from './rule.js'
import runTestForRule from '../../../util/testRule.js'

describe('html.brokenLinks', () => {
  let checkLink

  beforeEach(() => {
    checkLink = vi.fn(async (url) => url)
  })

  it('should return an error for a missing external link', async () => {
    checkLink.mockImplementationOnce(() => false)

    let results = await runTestForRule(
      rule,
      '<a href="http://broken-link.de">Broken Link</a>',
      {},
      {},
      { checkLink },
    )

    expect(checkLink).toHaveBeenCalledWith('http://broken-link.de')
    expect(results.length).toBe(1)
  })

  it('should not return an error for internal links', async () => {
    checkLink.mockImplementationOnce(() => false)
    let results = await runTestForRule(
      rule,
      '<a href="https://example.com/foo/">Foo</a> <a href="/foo/">Foo</a>',
      { host: 'https://example.com' },
      {},
      { checkLink },
    )

    expect(checkLink).not.toHaveBeenCalled()
    expect(results.length).toBe(0)
  })
})
