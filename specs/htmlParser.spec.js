import { parseHtmlFactory, getAttributes } from '../src/util/html.js'

describe('HTML Parser', () => {
  describe('getAttributes', () => {
    it('should transform HTML into a lookup function', () => {
      const html = '<p>Hallo</p><p>Hello</p><div>Yes!</div>'
      const $attributes = getAttributes(html)
      expect($attributes('div').length).toBe(1)
      expect($attributes('p').length).toBe(2)
      expect($attributes('h1').length).toBe(0)
    })

    it('should expose HTML attributes as object keys', () => {
      const html = '<link rel="stylesheet" href="style.css" /><div data-something="anything">Hallo</div>'
      const $attributes = getAttributes(html)
      const linkTag = $attributes('link')[0]
      const divTag = $attributes('div')[0]

      expect(linkTag).toHaveProperty('rel')
      expect(linkTag).toHaveProperty('href')
      expect(linkTag.rel).toBe('stylesheet')
      expect(linkTag.href).toBe('style.css')

      expect(divTag).toHaveProperty('data-something')
      expect(divTag).toHaveProperty('innerText')
      expect(divTag['data-something']).toBe('anything')
      expect(divTag.innerText).toBe('Hallo')
    })
  })

  describe('parseHtml', () => {
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
        getAttributes(h) {
          expect(h).toBe(html)
          return getAttributes(h)
        },
      }

      parseHtml = parseHtmlFactory(deps)
    })
    
    it('should prebuild an object with commonly used query selectors', () => {
      const { results } = parseHtml(file)
      expect(results.title.length).toBe(1)
      expect(results.h1s).toStrictEqual([])
    })
  })
})
