import rule from './rule.js'
import runTestForRule from '../../../util/testRule.js'

describe('seo.canonical', () => {
  it('Should return an error if no canonical tag is found', async () => {
    let results = await runTestForRule(rule, '<html><head></head></html>')
    expect(results.errors.length).toBe(1)
    expect(results.errors[0]).toContain('There should be 1 canonical tag')
  })

  it('Should return an error if multiple canonical tags are found', async () => {
    let results = await runTestForRule(rule, '<link rel="canonical" href="foo" /><link rel="canonical" href="bar" />')
    expect(results.errors.length).toBe(1)
    expect(results.errors[0]).toContain('There should be 1 canonical tag')
  })

  it('Should return an error canonical tag does not have a href attribute', async () => {
    let results = await runTestForRule(rule, '<link rel="canonical" />')
    expect(results.errors.length).toBe(1)
    expect(results.errors[0]).toContain('Canonical tag should have a href attribute')
  })

  it('Should return an error if canonical tag has an empty href attribute', async () => {
    let results = await runTestForRule(rule, '<link rel="canonical" href="" />')
    expect(results.errors.length).toBe(1)
    expect(results.errors[0]).toContain('Canonical tag should have a href attribute')
  })

  it('Should return an error if canonical tag href does not include the host given via config', async () => {
    let results = await runTestForRule(rule, '<link rel="canonical" href="http://exmaple.com/foo" />', { host: 'https://example.com/' })
    expect(results.errors.length).toBe(1)
    expect(results.errors[0]).toContain('Canonical tag href should include the host')
  })

  it('Should not return any errors if canonical tag is set correctly', async () => {
    let results = await runTestForRule(rule, '<link rel="canonical" href="https://example.com/foo" />', { host: 'https://example.com/' })
    expect(results.errors.length).toBe(0)
  })
})
