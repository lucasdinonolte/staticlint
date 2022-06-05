import assert from 'assert'

export default {
  name: 'html.internalLinks',
  description: 'Checks if internal links are well formated',
  html: (payload, { lint, test, config }) => {
    const internal = payload.aTags
      .filter((l) => l.href.includes(config.host) || !l.href.includes('http'))
      .map((l) => {
        if (l.href.includes('#')) l.href = l.href.split('#')[0]
        return l
      })
      .filter(
        (l) =>
          !l.href.includes('mailto') &&
          !l.href.includes('tel:') &&
          l.href.length > 0,
      )

    if (internal.length === 0) return

    internal.forEach((l) => {
      // Internal Links should be lowercased
      test(
        assert.ok,
        l.href === l.href.toLowerCase(),
        `Links should be lowercase. [${l.innerText}](${l.href}) is not`,
      )

      // Internal Links should end with a trailing slash
      lint(
        assert.ok,
        l.href.endsWith('/'),
        `Internal links should include a trailing slash. [${l.innerText}](${l.href}) does not`,
      )

      // Internal links should not include a nofollow rel
      test(
        assert.ok,
        !l.rel?.includes('nofollow'),
        `Internal links should not include a nofollow rel. [${l.innerText}](${l.href}) does`,
      )
    })
  },
}
