import assert from 'assert'

export default {
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
}
