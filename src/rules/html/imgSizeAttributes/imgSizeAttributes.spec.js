import { describe, it, expect } from 'vitest'
import { imgSizeAttributes } from './rule.js'
import runTestForRule from '../../../util/testRule.js'

describe('img.sizeAttributes', () => {
  it('should return an error if no width attribute is set', async () => {
    let results = await runTestForRule(
      imgSizeAttributes,
      '<img src="foo.jpg" height="200" />',
    )
    expect(results.length).toBe(1)
  })

  it('should return an error if no height attribute is set', async () => {
    let results = await runTestForRule(
      imgSizeAttributes,
      '<img src="foo.jpg" width="200" />',
    )
    expect(results.length).toBe(1)
  })

  it('should return an error if no height and no width attribute are set', async () => {
    let results = await runTestForRule(
      imgSizeAttributes,
      '<img src="foo.jpg" />',
    )
    expect(results.length).toBe(2)
  })

  it('should return no error if width and height attribute are set', async () => {
    let results = await runTestForRule(
      imgSizeAttributes,
      '<img src="foo.jpg" width="200" height="100" />',
    )
    expect(results.length).toBe(0)
  })
})
