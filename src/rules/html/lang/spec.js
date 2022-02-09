// Examplary Integration Test to test a single rule using HTML Parsing
import rule from './rule.js'
import runTestForRule from '../../../util/testRule.js'

describe('html.lang', () => {
  it('should return an error if no lang attribute is found', async () => {
    let results = await runTestForRule(rule, '<html></html>')
    expect(results.errors.length).toBe(1)
    expect(results.errors[0]).toBe('Lang attribute should be present on HTML tag')

    results = await runTestForRule(rule, '<h1>Hallo</h1>')
    expect(results.errors.length).toBe(1)
    expect(results.errors[0]).toBe('Lang attribute should be present on HTML tag')
  })
})
