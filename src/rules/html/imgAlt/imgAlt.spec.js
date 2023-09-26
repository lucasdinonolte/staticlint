import { describe, it, expect } from 'vitest'
import { imgAltPresent, imgAltNotEmpty } from './rule.js'
import runTestForRule from '../../../util/testRule.js'

describe('img.alt.present', () => {
  it('should return an error if no alt attribute is set', async () => {
    let results = await runTestForRule(imgAltPresent, '<img src="foo.jpg" />')
    expect(results.length).toBe(1)
  })

  it('should ignore images that are semantically hidden', async () => {
    let results = await runTestForRule(
      imgAltPresent,
      '<img aria-hidden="true" src="foo.jpg" /><img hidden src="foo.jpg" />',
    )

    expect(results.length).toBe(0)
  })
})

describe('img.alt.notEmpty', () => {
  it('should return a warning if alt attribute is empty', async () => {
    let results = await runTestForRule(
      imgAltNotEmpty,
      '<img src="foo.jpg" alt="" />',
    )
    expect(results.length).toBe(1)
  })

  it('should ignore images that are semantically hidden', async () => {
    let results = await runTestForRule(
      imgAltPresent,
      '<img aria-hidden="true" src="foo.jpg" alt="" /><img hidden src="foo.jpg" alt="" />',
    )

    expect(results.length).toBe(0)
  })
})
