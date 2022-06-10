import { describe, it, expect } from 'vitest'
import {
  internalLinksLowercase,
  internalLinksTrailinsSlash,
  internalLinksNoFollow,
} from './rule.js'
import runTestForRule from '../../../util/testRule.js'

describe('html.interinks.lowercase', () => {
  it('should return an error for non lowercased internal links', async () => {
    let results = await runTestForRule(
      internalLinksLowercase,
      '<a href="/internal/">Internal Link</a><a href="/INTERink/">Another One</a>',
    )
    expect(results.length).toBe(1)
  })
})

describe('html.interinks.trailingSlash', () => {
  it('should return a warning for missing trailing slashes', async () => {
    let results = await runTestForRule(
      internalLinksTrailinsSlash,
      '<a href="/o">o</a><a href="/hello/">Hello</a>',
    )
    expect(results.length).toBe(1)
  })
})

describe('html.interinks.noFollow', () => {
  it('should return an error for internal links with nofollow rel attribute', async () => {
    let results = await runTestForRule(
      internalLinksNoFollow,
      '<a href="/internal/" rel="nofollow">Internal</a><a href="/correct-one/">No error for this one</a>',
    )
    expect(results.length).toBe(1)
  })
})
