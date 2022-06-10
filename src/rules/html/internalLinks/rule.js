import assert from 'assert'

const getInternalLinks = (links, host) =>
  links
    .filter((l) => l.href.includes(host) || !l.href.includes('http'))
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

export const internalLinksLowercase = {
  name: 'html.internalLinks.lowercase',
  description: 'Checks if internal links are lowercase',
  html: (payload, { test, config }) => {
    const internal = getInternalLinks(payload.aTags, config.host)

    if (internal.length === 0) return

    internal.forEach((l) => {
      // Internal Links should be lowercased
      test(
        assert.ok,
        l.href === l.href.toLowerCase(),
        `Links should be lowercase. [${l.innerText}](${l.href}) is not`,
      )
    })
  },
}

export const internalLinksTrailinsSlash = {
  name: 'html.internalLinks.trailingSlash',
  description: 'Checks if internal links end with a trailing slash',
  html: (payload, { test, config }) => {
    const internal = getInternalLinks(payload.aTags, config.host)

    if (internal.length === 0) return

    internal.forEach((l) => {
      // Internal Links should end with a trailing slash
      test(
        assert.ok,
        l.href.endsWith('/'),
        `Internal links should include a trailing slash. [${l.innerText}](${l.href}) does not`,
      )
    })
  },
}

export const internalLinksNoFollow = {
  name: 'html.internalLinks.noFollow',
  description: 'Checks that internal links do not have a nofollow attribute',
  html: (payload, { test, config }) => {
    const internal = getInternalLinks(payload.aTags, config.host)

    if (internal.length === 0) return // Internal Links should end with a trailing slash

    internal.forEach((l) => {
      // Internal links should not include a nofollow rel
      test(
        assert.ok,
        !l.rel?.includes('nofollow'),
        `Internal links should not include a nofollow rel. [${l.innerText}](${l.href}) does`,
      )
    })
  },
}
