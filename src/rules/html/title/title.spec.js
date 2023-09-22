import { describe, it, expect } from 'vitest'
import {
  titlePresent,
  titleMaxLength,
  titleIdealLength,
  titleStopWords,
} from './rule.js'
import runTestForRule from '../../../util/testRule.js'

describe('html.title.present', () => {
  it('should return an error for missing title tag', async () => {
    let results = await runTestForRule(
      titlePresent,
      '<html><head></head></html>',
    )
    expect(results.length).toBe(1)
    expect(results[0]).toBe('There should be one title tag. Found 0.')
  })

  it('should return an error for multiple title tags', async () => {
    let results = await runTestForRule(
      titlePresent,
      '<html><head><title>i</title><title>o</title></head></html>',
    )
    expect(results.length).toBe(1)
    expect(results[0]).toBe('There should be one title tag. Found 2.')
  })

  it('should return an error for an empty title tag', async () => {
    let results = await runTestForRule(
      titlePresent,
      '<html><head><title></title></head></html>',
    )
    expect(results.length).toBe(1)
    expect(results[0]).toBe('Title tag should not be empty')
  })

  it('should return an error for nested html in title tag', async () => {
    let results = await runTestForRule(
      titlePresent,
      '<html><head><title><strong>Bold Title</strong></title></head></html>',
    )
    expect(results.length).toBe(1)
    expect(results[0]).toBe('Title tag should not contain other tags')
  })
})

describe('html.title.maxLength', () => {
  it('should return an error for title tag longer than 200 characters', async () => {
    let results = await runTestForRule(
      titleMaxLength,
      '<html><head><title>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</title></head></html>',
    )
    expect(results.length).toBe(1)
    expect(results[0]).toContain(
      'Something could be wrong this title tag is over 200 chars.',
    )
  })

  it('should ignore empty titles', async () => {
    let results = await runTestForRule(
      titleMaxLength,
      '<html><head><title></title></head></html>',
    )
    expect(results.length).toBe(0)
  })

  it('should ignore missing titles', async () => {
    let results = await runTestForRule(
      titleMaxLength,
      '<html><head></head></html>',
    )
    expect(results.length).toBe(0)
  })
})

describe('html.title.idealLength', () => {
  it('should return a warning for title tag shorter than 10 characters', async () => {
    let results = await runTestForRule(
      titleIdealLength,
      '<html><head><title>Bold</title></head></html>',
    )
    expect(results.length).toBe(1)
    expect(results[0]).toBe(
      'This title tag is shorter than the recommended minimum limit of 10.',
    )
  })

  it('should return for an empty title tag', async () => {
    let results = await runTestForRule(
      titleIdealLength,
      '<html><head><title></title></head></html>',
    )
    expect(results.length).toBe(1)
    expect(results[0]).toBe(
      'This title tag is shorter than the recommended minimum limit of 10.',
    )
  })

  it('should return a warning for title tag longer than 70 characters', async () => {
    let results = await runTestForRule(
      titleIdealLength,
      '<html><head><title>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonum</title></head></html>',
    )
    expect(results.length).toBe(1)
    expect(results[0]).toBe(
      'This title tag is longer than the recommended limit of 70.',
    )
  })

  it('should ignore missing titles', async () => {
    let results = await runTestForRule(
      titleIdealLength,
      '<html><head></head></html>',
    )
    expect(results.length).toBe(0)
  })
})

describe('html.title.stopWords', () => {
  it('should return a warning for title tag containing stopword', async () => {
    let results = await runTestForRule(
      titleStopWords,
      '<html><head><title>A and B but also C</title></head></html>',
    )
    expect(results.length).toBe(2)
    expect(results[0]).toContain('Title tag includes stopword')
  })

  it('should ignore empty titles', async () => {
    let results = await runTestForRule(
      titleStopWords,
      '<html><head><title></title></head></html>',
    )
    expect(results.length).toBe(0)
  })

  it('should ignore missing titles', async () => {
    let results = await runTestForRule(
      titleStopWords,
      '<html><head></head></html>',
    )
    expect(results.length).toBe(0)
  })
})
