import { describe, it, expect } from 'vitest'
import rule from './rule.js'
import runTestForRule from '../../../util/testRule.js'

describe('img.favicon', () => {
  it('should return an error if no favicon is found', async () => {
    let results = await runTestForRule(rule, '<html><head></head></html>')
    expect(results.length).toBe(1)
  })

  it('should return an error if favicon has no href attribute', async () => {
    let results = await runTestForRule(rule, '<link rel="shortcut icon" />')
    expect(results.length).toBe(1)
  })

  it('should return an error if favicon has empty href attribute', async () => {
    let results = await runTestForRule(
      rule,
      '<link rel="shortcut icon" href="" />',
    )
    expect(results.length).toBe(1)
  })
})
