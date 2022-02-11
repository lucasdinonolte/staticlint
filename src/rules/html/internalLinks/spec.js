import rule from './rule.js'
import runTestForRule from '../../../util/testRule.js'

describe('html.internalLinks', () => {
  it('should return an error for non lowercased internal links', async () => {
    let results = await runTestForRule(rule, '<a href="/internal/">Internal Link</a><a href="/INTERNalLink/">Another One</a>')
    expect(results.errors.length).toBe(1)
  })

  it('should return a warning for missing trailing slashes', async () => {
    let results = await runTestForRule(rule, '<a href="/hallo">Hallo</a><a href="/hello/">Hello</a>')
    expect(results.warnings.length).toBe(1)
  })

  it('should return an error for internal links with nofollow rel attribute', async () => {
    let results = await runTestForRule(rule, '<a href="/internal/" rel="nofollow">Internal</a><a href="/correct-one/">No error for this one</a>')
    expect(results.errors.length).toBe(1)
  })
})
