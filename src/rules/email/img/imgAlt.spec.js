import { describe, it, expect } from 'vitest'
import { imgDimensions } from './rule.js'
import runTestForRule from '../../../util/testRule.js'

describe('email.img.dimensions', () => {
  it('should return an error if no width attribute is set', async () => {
    let results = await runTestForRule(
      imgDimensions,
      '<img src="foo.jpg" height="200" />',
    )
    expect(results.length).toBe(1)
  })

  it('should return an error if no height attribute is set', async () => {
    let results = await runTestForRule(
      imgDimensions,
      '<img src="foo.jpg" width="200" />',
    )
    expect(results.length).toBe(1)
  })

  it('should not return an error if width and height attributes are set', async () => {
    let results = await runTestForRule(
      imgDimensions,
      '<img src="foo.jpg" width="200" height="200" />',
    )
    expect(results.length).toBe(0)
  })
})
