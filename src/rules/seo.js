import assert from 'assert'

export const seoRules = [{
  name: 'seo.canonical',
  description: 'Validates the presence of a canonical tag',
  html: (payload, { test, config }) => {
    const canonicals = payload.canonical

    test(
      assert.strictEqual,
      canonicals.length,
      1,
      `There should be 1 canonical tag (<link rel="canonical"). Found ${canonicals.length}`,
    )

    if (canonicals.length !== 1) return

    test(
      assert.ok,
      !!canonicals[0].href,
      'Canonical tag should have a href attribute',
    )

    if (config.host) {
      test(
        assert.ok,
        canonicals[0].href.includes(config.host),
        `Canonical tag href should include the host: ${config.host}`,
      )
    }
  },
}, {
  name: 'seo.uniqueTitle',
  description: 'Validates that every title is only used once',
  html: (payload, { test, cache }) => {
    const titles = payload.title
    if (titles.length !== 1) return
  
    const title = titles[0].innerText
    
    test(
      assert.ok,
      !cache.includes('seo.uniqueTitle', title),
      `Each page should have a unique titles. "${title}" is used multiple times`,
    )

    cache.push('seo.uniqueTitle', title)
  },
}, {
  name: 'seo.headings',
  description: 'Validates the proper use of headline tags',
  html: (payload, { test, lint }) => {
    const { h1s, h2s, h3s, h4s, h5s, h6s} = payload

    // There should be only one H1 tag
    // TODO: Research if this still is true from an SEO-standpoint
    test(
      assert.strictEqual,
      h1s.length,
      1,
      `There should be 1 H1 tag. Found ${h1s.length}.`,
    )

    // Lint heading levels
    const lintHeadingLevel = (level, name, minLength = 10, maxLength = 70) => {
      level.forEach((heading) => {
        test(
          assert.notStrictEqual,
          heading.innerText.length,
          0,
          'Headings should not be empty',
        )

        lint(
          assert.ok,
          heading.innerText.length < maxLength,
          `${name} tag is longer than the recommended limit of ${maxLength}. (${heading.innerText})`,
        )

        lint(
          assert.ok,
          heading.innerText.length >= minLength,
          `${name} tag is shorter than the recommended limit of ${minLength}. (${heading.innerText})`,
        )
      })
    }

    lintHeadingLevel(h1s, 'H1')
    lintHeadingLevel(h2s, 'H2', 7, 100)
    lintHeadingLevel(h3s, 'H3', 7, 100)
    lintHeadingLevel(h4s, 'H4', 7, 100)
    lintHeadingLevel(h5s, 'H5', 7, 100)
    lintHeadingLevel(h6s, 'H6', 7, 100)

    // Check that we do not skip heading levels
    const compareHeadingLevels = (a, b, msg) => {
      lint(
        assert.ok,
        !(a.length > 0 && b.length === 0),
        msg,
      )
    }

    compareHeadingLevels(h2s, h1s, 'There are h2 tags but no h1 tag')
    compareHeadingLevels(h3s, h2s, 'There are h3 tags but no h2 tag')
    compareHeadingLevels(h4s, h3s, 'There are h4 tags but no h3 tag')
    compareHeadingLevels(h5s, h4s, 'There are h5 tags but no h4 tag')
    compareHeadingLevels(h6s, h5s, 'There are h6 tags but no h5 tag')
  },
}]
