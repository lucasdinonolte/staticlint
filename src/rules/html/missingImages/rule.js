import assert from 'assert'
import { checkUrl } from '../../../util/checkUrl.js'

export default {
  name: 'html.missingImages',
  description: 'Checks for missing external images',
  html: async (payload, { test, config, cache }, deps = { checkUrl }) => {
    const external = payload.imgs.filter(
      (i) => i.src.includes('http') && !i.src.includes(config.host),
    )

    for (let i = 0; i < external.length; i++) {
      const l = external[i]

      const cacheKey = `missingImages-${l.src}`
      let response

      if (!cache.get(cacheKey)) {
        response = await deps.checkUrl(l.src)
        cache.set(cacheKey, response)
      } else {
        response = cache.get(cacheKey)
      }

      test(
        assert.ok,
        response,
        `External image ${l.src} does not seem to be online`,
      )
    }
  },
}
