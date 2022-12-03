import assert from 'assert'
import { checkLink } from '../../../util/checkUrl.js'

export default {
  name: 'html.brokenLinks',
  description: 'Checks if all external links are working',
  html: async (payload, { test, config, cache }, deps = { checkLink }) => {
    const external = payload.aTags.filter(
      (l) => l.href.includes('http') && !l.href.includes(config.host),
    )

    for (let i = 0; i < external.length; i++) {
      const l = external[i]

      const cacheKey = `brokenLinks-${l.href}`
      let response

      if (!cache.get(cacheKey)) {
        response = await deps.checkLink(l.href)
        cache.set(cacheKey, response)
      } else {
        response = cache.get(cacheKey)
      }

      test(
        assert.ok,
        typeof response === 'number' && response < 400,
        `Broken link: ${l.href}`,
      )
    }
  },
}
