import rule from './rule.js'
import runTestForRule from '../../../util/testRule.js'

describe('meta.description', () => {
  it('should return an error if no meta description tag is found', async () => {
    let results = await runTestForRule(rule, '<html><head></head></html>')
    expect(results.errors.length).toBe(1)
    expect(results.errors[0]).toBe('There should be 1 meta description. Found 0')
  })

  it('should return an error if more than one meta description tag is found', async () => {
    let results = await runTestForRule(rule, '<meta name="description" content="foo" /><meta name="description" content="bar" />')
    expect(results.errors.length).toBe(1)
    expect(results.errors[0]).toBe('There should be 1 meta description. Found 2')
  })

  it('should return an error for meta description tag without content attribute', async () => {
    let results = await runTestForRule(rule, '<meta name="description" />')
    expect(results.errors.length).toBe(1)
  })

  it('should return an error for meta description tag with empty content attribute', async () => {
    let results = await runTestForRule(rule, '<meta name="description" content="" />')
    expect(results.errors.length).toBe(1)
  })

  it('should return an error if meta description content is too long', async () => {
    let results = await runTestForRule(rule, '<meta name="description" content="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem" />')
    expect(results.errors.length).toBe(1)
    expect(results.errors[0]).toContain('Something could be wrong as it is over 300 chars')
  })

  it('should return a warning for meta description tag with content attribute with less than 10 characters', async () => {
    let results = await runTestForRule(rule, '<meta name="description" content="Hallo" />')
    expect(results.warnings.length).toBe(1)
    expect(results.warnings[0]).toContain('This meta description is shorter than the recommended minimum limit of 10.')
  })

  it('should return a warning for meta description tag with content attribute with more than 120 characters', async () => {
    let results = await runTestForRule(rule, '<meta name="description" content="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna" />')
    expect(results.warnings.length).toBe(1)
    expect(results.warnings[0]).toContain('This meta description is longer than the recommended limit of 120.')
  })

  it('should return a warning if meta description tag’s content attribute does not contain any of title words', async () => {
    let results = await runTestForRule(rule, '<title>Halli Hallo</title><meta name="description" content="Hier steht eine Beschreibung, die kein Wort des Titels enthält" />')
    expect(results.warnings.length).toBe(1)
    expect(results.warnings[0]).toContain('Meta description should include at least 1 of the words in the title tag.')
  })

  it('should return no errors and warnings for a valid meta description tag', async () => {
    let results = await runTestForRule(rule, '<title>Hier steht ein Titel</title><meta name="description" content="Diese Beschreibung hat eine gute Länge und nimmt das Wort Titel auf" />')
    expect(results.warnings.length).toBe(0)
    expect(results.errors.length).toBe(0)
  })
})
