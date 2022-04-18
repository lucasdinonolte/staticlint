import { describe, it, expect, beforeEach } from 'vitest'
import rule from './rule.js'
import runTestForRule from '../../../util/testRule.js'

describe('html.maxOutboundLinks', () => {
  let links

  beforeEach(() => {
    links = new Array(51)
      .fill(0)
      .map((_, i) => `<a href="http://outbound-link.com/${i}">${i}</a>`)
  })

  it('should warn if there are more than 50 outbound links', async () => {
    let results = await runTestForRule(rule, links.join(''))

    expect(results.warnings.length).toBe(1)
    expect(results.warnings[0]).toBe(
      'This page contains a lot of outbound links (51)',
    )
  })
})
