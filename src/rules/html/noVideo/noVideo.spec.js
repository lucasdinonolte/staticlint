import { describe, it, expect } from 'vitest'
import rule from './rule.js'
import runTestForRule from '../../../util/testRule.js'

describe('html.noVideo', () => {
  it('should return a warning for self-hosted videos', async () => {
    let results = await runTestForRule(rule, '<video src="/my-video.mp4" />')
    expect(results.length).toBe(1)
  })
})
