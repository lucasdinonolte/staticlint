import fs from 'fs'
import cheerio from 'cheerio'

/**
 * Utility to get dom nodes from a cheerio object
 * Curried function, so this can be passed to individual tests
 * without passing the HTML string to the tests
 *
 * @param instance of cheerio
 * @param queryselector to search for
 */
const getAttributes = $ => (search) => {
  const arr = []
  $(search).each(function () {
    const namespace = $(this)[0].namespace
    if (!namespace || namespace.includes('html')) {
      const out = {
        tag: $(this)[0].name,
        innerHTML: $(this).html(),
        innerText: $(this).text(),
      }

      if ($(this)[0].attribs) {
        Object.entries($(this)[0].attribs).forEach((attr) => {
          out[attr[0].toLowerCase()] = attr[1]
        })
      }

      arr.push(out)
    }
  })
  return arr
}

const parseHtmlFactory = ({ fs, parse }) => (file) => {
  const html = fs.readFileSync(file, 'utf-8')
  const $ = parse(html)
  const $attributes = getAttributes($)

  return {
    results: {
      html: $attributes('html'),
      title: $attributes('title'),
      meta: $attributes('head meta'),
      ldjson: $attributes('script[type="application/ld+json"]'),
      h1s: $attributes('h1'),
      h2s: $attributes('h2'),
      h3s: $attributes('h3'),
      h4s: $attributes('h4'),
      h5s: $attributes('h5'),
      h6s: $attributes('h6'),
      canonical: $attributes('[rel="canonical"]'),
      imgs: $attributes('img'),
      videos: $attributes('video'),
      aTags: $attributes('a'),
      linkTags: $attributes('link'),
      ps: $attributes('p'),
    },
    $attributes,
  }
}

const parseHtml = parseHtmlFactory({ fs, parse: cheerio.load })

export {
  parseHtml,
  parseHtmlFactory,
}
