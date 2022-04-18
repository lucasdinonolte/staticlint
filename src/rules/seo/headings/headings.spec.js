import { describe, it, expect } from 'vitest'
import rule from './rule.js'
import runTestForRule from '../../../util/testRule.js'

describe('seo.headings', () => {
  it('should error if there is no H1 tag on the page', async () => {
    let results = await runTestForRule(rule, '<html><body></body></html>')
    expect(results.errors.length).toBe(1)
    expect(results.errors[0]).toBe('There should be 1 H1 tag. Found 0.')
  })

  it('should error if there is more than one H1 tag on the page', async () => {
    let results = await runTestForRule(
      rule,
      '<html><body><h1>Titel Nummer 1</h1><h1>Titel Nummer 2</h1></body></html>',
    )
    expect(results.errors.length).toBe(1)
    expect(results.errors[0]).toBe('There should be 1 H1 tag. Found 2.')
  })

  it('should error if heading tags are empty', async () => {
    let results = await runTestForRule(
      rule,
      '<h1>Titel Nummer 1</h1><h2></h2><h3></h3>',
    )
    expect(results.errors.length).toBe(2)
    expect(results.errors[0]).toBe('Headings should not be empty')
  })

  it('should warn if a heading level is skipped', async () => {
    let results = await runTestForRule(
      rule,
      '<h1>Titel Nummer 1</h1><h3>Untertitel</h3>',
    )
    expect(results.warnings.length).toBe(1)
    expect(results.warnings[0]).toBe('There are h3 tags but no h2 tag')
  })
})
