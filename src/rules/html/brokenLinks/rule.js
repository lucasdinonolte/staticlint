import assert from 'assert'
import { checkUrl } from '../../../util/checkUrl.js'

export default {
  name: 'html.brokenLinks',
  description: 'Checks if all external links are working',
  html: async (payload, { test, config, cache }, deps = { checkUrl }) => {
    const external = payload.aTags.filter(
      (l) => l.href.includes('http') && !l.href.includes(config.host),
    )

    for (let i = 0; i < external.length; i++) {
      const l = external[i]

      const cacheKey = `brokenLinks-${l.href}`
      let response

      if (!cache.get(cacheKey)) {
        response = await deps.checkUrl(l.href)
        cache.set(cacheKey, response)
      } else {
        response = cache.get(cacheKey)
      }

      test(assert.ok, response, `Broken link: ${l.href}`)
    }
  },
}
