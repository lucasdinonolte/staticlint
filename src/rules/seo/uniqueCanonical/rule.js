import assert from 'assert'

export const UNIQUE_CANONICAL_THRESHOLD = 10

export default {
  name: 'seo.uniqueCanonical',
  description: 'Checks if the same canonical URL is used over and over again',
  html: (payload, { test, cache }) => {
    const canonicals = payload.canonical
    if (canonicals.length !== 1) return
    if (!canonicals[0].href) return

    const canonical = canonicals[0].href

    test(
      assert.ok,
      cache.includesHowOften('seo.uniqueCanonical', canonical) <
        UNIQUE_CANONICAL_THRESHOLD,
      `Heads up! The canonical URL "${canonical}" is used more than ${UNIQUE_CANONICAL_THRESHOLD} times. While this is not an error this could hint at a misconfiguration.`,
    )

    cache.push('seo.uniqueCanonical', canonical)
  },
}
