import { describe, it, expect } from 'vitest'
import rule from './rule.js'
import runTestForRule from '../../../util/testRule.js'

describe('img.alt', () => {
  it('should return an error if no alt attribute is set', async () => {
    let results = await runTestForRule(rule, '<img src="foo.jpg" />')
    expect(results.errors.length).toBe(1)
  })

  it('should return a warning if alt attribute is empty', async () => {
    let results = await runTestForRule(rule, '<img src="foo.jpg" alt="" />')
    expect(results.warnings.length).toBe(1)
  })
})
