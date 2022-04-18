import { describe, it, expect } from 'vitest'
import rule from './rule.js'
import runTestForRule from '../../../util/testRule.js'

describe('meta.viewport', () => {
  it('should return an error if no meta viewport tag is found', async () => {
    let results = await runTestForRule(rule, '<html><head></head></html>')
    expect(results.errors.length).toBe(1)
  })

  it('should return an error for meta viewport tag without or empty content', async () => {
    let results = await runTestForRule(rule, '<meta name="viewport" />')
    expect(results.errors.length).toBe(1)
  })

  it('should return an error if meta viewport does not include devide-width', async () => {
    let results = await runTestForRule(
      rule,
      '<meta name="viewport" content="initial-scale=1" />',
    )
    expect(results.errors.length).toBe(1)
    expect(results.errors[0]).toBe(
      'Meta viewport content should include width=device-width',
    )
  })

  it('should return an error if meta viewport does not include initial-scale', async () => {
    let results = await runTestForRule(
      rule,
      '<meta name="viewport" content="width=device-width" />',
    )
    expect(results.errors.length).toBe(1)
    expect(results.errors[0]).toBe(
      'Meta viewport content should include initial-scale=1',
    )
  })

  it('should not return any errors for a correct meta viewport tag', async () => {
    let results = await runTestForRule(
      rule,
      '<meta name="viewport" content="width=device-width, initial-scale=1">',
    )
    expect(results.errors.length).toBe(0)
  })
})
