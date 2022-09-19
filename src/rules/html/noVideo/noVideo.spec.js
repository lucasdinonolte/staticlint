import { describe, it, expect } from 'vitest'
import rule from './rule.js'
import runTestForRule from '../../../util/testRule.js'

describe('html.noVideo', () => {
  it('should do nothing if a video tag does not have an src attribute', async () => {
    let results = await runTestForRule(rule, '<video></video>')
    expect(results.length).toBe(0)
  })

  it('should return a warning for self-hosted videos', async () => {
    let results = await runTestForRule(rule, '<video src="/my-video.mp4" />')
    expect(results.length).toBe(1)
  })
})
