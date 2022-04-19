import { describe, it, expect } from 'vitest'
import rule from './rule.js'
import runTestForRule from '../../../util/testRule.js'

describe('html.tabindex', () => {
  it('should warn for greater than zero tabindex values', async () => {
    let results = await runTestForRule(
      rule,
      '<div tabindex="2">This should be avoided</div><div tabindex="34">This should be avoided</div>',
    )
    expect(results.warnings.length).toBe(2)
    expect(results.warnings[0]).toBe(
      'Using tabindex values other than 0 or 1 is not recommended.',
    )
  })

  it('should not warn for correctly used tabindex values', async () => {
    let results = await runTestForRule(
      rule,
      '<div tabindex="0">This is ok</div><div tabindex="-1">This is also ok</div>',
    )
    expect(results.warnings.length).toBe(0)
  })
})
