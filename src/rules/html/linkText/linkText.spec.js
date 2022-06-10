import { describe, it, expect } from 'vitest'
import rule from './rule.js'
import runTestForRule from '../../../util/testRule.js'

describe('html.linkText', () => {
  it('should return an error if a link has no text', async () => {
    let results = await runTestForRule(
      rule,
      '<a href="/foo"><img src="/logo.png" alt="Our Logo" /></a>',
    )
    expect(results.length).toBe(1)
  })

  it('should return no error if link has text', async () => {
    let results = await runTestForRule(
      rule,
      '<a href="/test">I am a link with text</a>',
    )
    expect(results.length).toBe(0)
  })

  it('should return no error if link has text within nested tags', async () => {
    let results = await runTestForRule(
      rule,
      '<a href="/test"><div><img src="/logo.png" alt="My logo" /><span>I am a link with text<span></div></a>',
    )
    expect(results.length).toBe(0)
  })

  it('should return no error if link has aria-label', async () => {
    let results = await runTestForRule(
      rule,
      '<a href="/test" aria-label="Link to the homepage"><img src="/logo.png" alt="Our logo" /></a>',
    )
    expect(results.length).toBe(0)
  })

  it('should return error for empty aria label', async () => {
    let results = await runTestForRule(
      rule,
      '<a href="/test" aria-label=""><img src="/logo.png" alt="Our logo" /></a>',
    )
    expect(results.length).toBe(1)
  })
})
