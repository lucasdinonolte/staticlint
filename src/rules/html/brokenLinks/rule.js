import assert from 'assert'
import urlExists from 'url-exists-nodejs'

export default {
  name: 'html.brokenLinks',
  description: 'Checks if all external links are working',
  html: async (payload, { test, config }, deps = { urlExists }) => {
    const external = payload.aTags.filter((l) => (l.href.includes('http') && !l.href.includes(config.host)))

    for (let i = 0; i < external.length; i++) {
      const l = external[i]
      const exists = await deps.urlExists(l.href) 
      test(
        assert.ok,
        exists,
        `External URL ${l.href} does not seem to be online`,
      )
    }
  },
}
