import assert from 'assert'

export default {
  name: 'html.favicon',
  description: 'Checks if favicon is set',
  html: (payload, { test }) => {
    const favicons = payload.linkTags.filter(l => l.rel === 'shortcut icon')

    test(
      assert.strictEqual,
      favicons.length,
      1,
      `There should be 1 shortcut icon (favicon) link tag. Found ${favicons.length}`,
    )

    if (favicons.length !== 1) return

    test(
      assert.ok,
      favicons[0].href && (favicons[0].href.length !== 0),
      'Favicon should have a href attribute',
    )

  },
}
