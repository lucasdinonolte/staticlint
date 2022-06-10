import { describe, it, expect } from 'vitest'
import {
  headingsHasH1,
  headingNotEmpty,
  headingsIdealLength,
  headingsLevels,
} from './rule.js'
import runTestForRule from '../../../util/testRule.js'

describe('seo.headings.hasH1', () => {
  it('should error if there is no H1 tag on the page', async () => {
    let results = await runTestForRule(
      headingsHasH1,
      '<html><body></body></html>',
    )
    expect(results.length).toBe(1)
    expect(results[0]).toBe('There should be 1 H1 tag. Found 0.')
  })

  it('should error if there is more than one H1 tag on the page', async () => {
    let results = await runTestForRule(
      headingsHasH1,
      '<html><body><h1>Titel Nummer 1</h1><h1>Titel Nummer 2</h1></body></html>',
    )
    expect(results.length).toBe(1)
    expect(results[0]).toBe('There should be 1 H1 tag. Found 2.')
  })
})

describe('seo.headings.notEmpty', () => {
  it('should error if heading tags are empty', async () => {
    let results = await runTestForRule(
      headingNotEmpty,
      '<h1>Titel Nummer 1</h1><h2></h2><h3></h3>',
    )
    expect(results.length).toBe(2)
    expect(results[0]).toBe('Headings should not be empty')
  })
})

describe('seo.headings.idength', () => {
  it('should error if heading tags are too long', async () => {
    let results = await runTestForRule(
      headingsIdealLength,
      '<h1>This heading is super long, it ry should not be that long. That’s a few characters. Ry hard to read. Such text. Wow. Amaze.</h1>',
    )
    expect(results.length).toBe(1)
  })

  it('should error if heading tags are too short', async () => {
    let results = await runTestForRule(headingsIdealLength, '<h2>Wow</h1>')
    expect(results.length).toBe(1)
  })
})

describe('seo.headings.levels', () => {
  it('should warn if a heading level is skipped', async () => {
    let results = await runTestForRule(
      headingsLevels,
      '<h1>Titel Nummer 1</h1><h3>Untertitel</h3>',
    )
    expect(results.length).toBe(1)
    expect(results[0]).toBe('There are h3 tags but no h2 tag')
  })
})
