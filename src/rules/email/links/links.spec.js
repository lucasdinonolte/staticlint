import { describe, it, expect } from 'vitest'
import { absoluteLinks } from './rule.js'
import runTestForRule from '../../../util/testRule.js'

describe('email.links.absolute', () => {
  it('should error on non absolute links', async () => {
    let results = await runTestForRule(
      absoluteLinks,
      '<a href="/foo.jpg">Demo</a>',
    )
    expect(results.length).toBe(1)
  })

  it('should not error on absolute links', async () => {
    let results = await runTestForRule(
      absoluteLinks,
      '<a href="http://designsystems.international/foo.jpg">Demo</a>',
    )
    expect(results.length).toBe(0)
  })

  it('should not error on mailto links', async () => {
    let results = await runTestForRule(
      absoluteLinks,
      '<a href="mailto: demo@example.com">Demo</a>',
    )
    expect(results.length).toBe(0)
  })
})
