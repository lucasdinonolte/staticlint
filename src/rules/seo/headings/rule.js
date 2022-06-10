import assert from 'assert'

export const headingsHasH1 = {
  name: 'seo.headings.hasH1',
  description: 'Checks that there is one (and only one) h1 tag per page',
  html: (payload, { test }) => {
    const { h1s } = payload

    // There should be only one H1 tag
    // TODO: Research if this still is true from an SEO-standpoint
    test(
      assert.strictEqual,
      h1s.length,
      1,
      `There should be 1 H1 tag. Found ${h1s.length}.`,
    )
  },
}

export const headingNotEmpty = {
  name: 'seo.headings.notEmpty',
  description: 'Checks that heading tags are not empty',
  html: (payload, { test }) => {
    const { h1s, h2s, h3s, h4s, h5s, h6s } = payload
    // Lint heading levels
    const testHeadingLevel = (level) => {
      level.forEach((heading) => {
        test(
          assert.notStrictEqual,
          heading.innerText.length,
          0,
          'Headings should not be empty',
        )
      })
    }

    testHeadingLevel(h1s, 'H1')
    testHeadingLevel(h2s, 'H2')
    testHeadingLevel(h3s, 'H3')
    testHeadingLevel(h4s, 'H4')
    testHeadingLevel(h5s, 'H5')
    testHeadingLevel(h6s, 'H6')
  },
}

export const headingsIdealLength = {
  name: 'seo.headings.idealLength',
  description: 'Checks headings for ideal text length',
  html: (payload, { test }) => {
    const { h1s, h2s, h3s, h4s, h5s, h6s } = payload
    // Lint heading levels
    const testHeadingLevel = (level, name, minLength = 10, maxLength = 70) => {
      level.forEach((heading) => {
        test(
          assert.ok,
          heading.innerText.length < maxLength,
          `${name} tag is longer than the recommended limit of ${maxLength}. (${heading.innerText})`,
        )

        test(
          assert.ok,
          heading.innerText.length >= minLength,
          `${name} tag is shorter than the recommended limit of ${minLength}. (${heading.innerText})`,
        )
      })
    }

    testHeadingLevel(h1s, 'H1')
    testHeadingLevel(h2s, 'H2', 7, 100)
    testHeadingLevel(h3s, 'H3', 7, 100)
    testHeadingLevel(h4s, 'H4', 7, 100)
    testHeadingLevel(h5s, 'H5', 7, 100)
    testHeadingLevel(h6s, 'H6', 7, 100)
  },
}

export const headingsLevels = {
  name: 'seo.headings.levels',
  description: 'Checks that no heading level is skipped',
  html: (payload, { test }) => {
    const { h1s, h2s, h3s, h4s, h5s, h6s } = payload
    // Check that we do not skip heading levels
    const compareHeadingLevels = (a, b, msg) => {
      test(assert.ok, !(a.length > 0 && b.length === 0), msg)
    }

    compareHeadingLevels(h2s, h1s, 'There are h2 tags but no h1 tag')
    compareHeadingLevels(h3s, h2s, 'There are h3 tags but no h2 tag')
    compareHeadingLevels(h4s, h3s, 'There are h4 tags but no h3 tag')
    compareHeadingLevels(h5s, h4s, 'There are h5 tags but no h4 tag')
    compareHeadingLevels(h6s, h5s, 'There are h6 tags but no h5 tag')
  },
}
