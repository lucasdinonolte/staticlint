import cheerio from 'cheerio'
import { parseHtmlFactory } from '../src/util/html.js'

describe('HTML Parser', () => {
  const file = 'my/file.html'

  let parseHtml
  let deps
  let html

  beforeEach(() => {
    html = '<html><head><title>Foo</title></head></html>' 
    deps = {
      fs: {
        readFileSync(f) {
          expect(f).toBe(file) 
          return html
        }
      },
      // TODO: Refactor, as now we are also testing an external library...
      parse: cheerio.load,
    }

    parseHtml = parseHtmlFactory(deps)
  })

  it('should build a results object from HTML', () => {
    const { results } = parseHtml(file)
    expect(results.title.length).toBe(1)
    expect(results.h1s).toStrictEqual([])
  })

  it('should provide a curried function to perform query selector lookups', () => {
    html = '<p>Hallo</p><p>Hello</p><div>Yes!</div>'
    const { $attributes } = parseHtml(file)
    expect($attributes('div').length).toBe(1)
    expect($attributes('p').length).toBe(2)
  })
})
