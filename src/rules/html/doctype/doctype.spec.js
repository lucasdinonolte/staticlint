import { describe, it, expect } from 'vitest'
import { doctypePresent, doctypeHtml5 } from './rule.js'
import runTestForRule from '../../../util/testRule.js'

describe('html.doctype.present', () => {
  it('should fail if HTML does not start with doctype', async () => {
    const results = await runTestForRule(
      doctypePresent,
      '<html><head></head></html>',
    )
    expect(results.length).toBe(1)
    expect(results[0]).toContain('HTML should start with a doctype')
  })
})

describe('html.doctype.html5', () => {
  it('should warn if a non HTML5 doctype is used', async () => {
    const results = await runTestForRule(
      doctypeHtml5,
      '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd"><html><head></head></html>',
    )
    expect(results.length).toBe(1)
    expect(results[0]).toContain('It is recommended to use the HTML5 doctype')
  })
})
