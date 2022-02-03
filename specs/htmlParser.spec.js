import { parseHtml } from '../src/util/html.js'

describe('HTML Parser', () => {
  it('should build a results object from HTML', () => {
    const { results } = parseHtml('<head><title>Foo</title></head>')
    expect(results.title.length).toBe(1)
    expect(results.h1s).toStrictEqual([])
  })

  it('should provide a curried function to perform query selector lookups', () => {
    const { $attributes } = parseHtml('<p>Hallo</p><p>Hello</p><div>Yes!</div>')
    expect($attributes('div').length).toBe(1)
    expect($attributes('p').length).toBe(2)
  })
})
