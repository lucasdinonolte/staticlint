import assert from 'assert'

export default {
  name: 'html.lang',
  description: 'Validates the presence of a lang attribute on the html tag',
  html: (payload, { test }) => {
    const html = payload.html
    if (html.length !== 1) return

    test(
      assert.ok,
      !!html[0].lang,
      'Lang attribute should be present on HTML tag',
    )
  },
}
