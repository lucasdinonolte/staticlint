import { describe, it, expect } from 'vitest'
import {
  scriptTag,
  externalStyle,
  styleBody,
  tableAttributes,
  html5Tags,
  htmlFileSize,
} from './rule.js'
import runTestForRule from '../../../util/testRule.js'

describe('email.html.script', () => {
  it('should error if a script tag is found', async () => {
    let results = await runTestForRule(
      scriptTag,
      '<html><h1>Hello</h1><script src="/foo.js"></script></html>',
    )
    expect(results.length).toBe(1)
  })

  it('should not error if no script tag is found', async () => {
    let results = await runTestForRule(scriptTag, '<html><h1>Hello</h1></html>')
    expect(results.length).toBe(0)
  })
})

describe('email.html.externalStyle', () => {
  it('should error if a stylesheet link is found', async () => {
    let results = await runTestForRule(
      externalStyle,
      '<html><h1>Hello</h1><link rel="stylesheet" href="/foo.js" /></html>',
    )
    expect(results.length).toBe(1)
  })

  it('should not error if no stylesheet link is found', async () => {
    let results = await runTestForRule(
      externalStyle,
      '<html><h1>Hello</h1></html>',
    )
    expect(results.length).toBe(0)
  })
})

describe('email.html.styleInBody', () => {
  it('should error if a style tag is found in the body', async () => {
    let results = await runTestForRule(
      styleBody,
      '<html><head></head><body><style>body { color: red; }</style><h1>Hello</h1><link rel="stylesheet" href="/foo.js" /></body></html>',
    )
    expect(results.length).toBe(1)
  })

  it('should not error if no style tag is found in the body', async () => {
    let results = await runTestForRule(
      styleBody,
      '<html><head><style>body { color: red; }</style></head><body><h1>Hello</h1><link rel="stylesheet" href="/foo.js" /></body></html>',
    )
    expect(results.length).toBe(0)
  })
})

describe('email.html.tableAttributes', () => {
  it('should error if a table has no border attribute set', async () => {
    let results = await runTestForRule(
      tableAttributes,
      '<table cellpadding="0" cellspacing="0"><tr><td>Foo</td></tr></table>',
    )
    expect(results.length).toBe(1)
  })

  it('should error if a table has no needed attributes set', async () => {
    let results = await runTestForRule(
      tableAttributes,
      '<table><tr><td>Foo</td></tr></table>',
    )
    expect(results.length).toBe(3)
  })

  it('should not error if table has needed attributes set', async () => {
    let results = await runTestForRule(
      tableAttributes,
      '<table border="0" cellspacing="0" cellpadding="0"><tr><td>Foo</td></tr></table>',
    )
    expect(results.length).toBe(0)
  })
})

describe('email.html.htmlTags', () => {
  it('should error if an HTML5 tag is being used', async () => {
    let results = await runTestForRule(html5Tags, '<article>Hallo</article>')
    expect(results.length).toBe(1)
  })

  it('should not error if no HTML5 tag is being used', async () => {
    let results = await runTestForRule(
      html5Tags,
      '<table><tr><td>Foo</td></tr></table>',
    )
    expect(results.length).toBe(0)
  })
})

describe('email.html.htmlTags', () => {
  it('should error if html string is bigger than limit', async () => {
    const html = '<table><tr><td>Foo</td></tr></table>'.repeat(3000)
    let results = await runTestForRule(htmlFileSize, html)
    expect(results.length).toBe(1)
  })

  it('should not error if html string is smaller than limit', async () => {
    let results = await runTestForRule(
      htmlFileSize,
      '<table><tr><td>Foo</td></tr></table>',
    )
    expect(results.length).toBe(0)
  })
})
