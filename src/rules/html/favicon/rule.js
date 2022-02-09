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
  },
}
