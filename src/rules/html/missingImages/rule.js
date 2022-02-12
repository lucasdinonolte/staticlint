import assert from 'assert'
import urlExists from 'url-exists-nodejs'

export default {
  name: 'html.missingImages',
  description: 'Checks for missing external images',
  html: async (payload, { test, config }, deps = { urlExists }) => {
    const external = payload.imgs.filter((i) => (i.src.includes('http') && !i.src.includes(config.host)))

    for (let i = 0; i < external.length; i++) {
      const l = external[i]

      const exists = await deps.urlExists(l.src) 
        
      test(
        assert.ok,
        exists,
        `External image ${l.src} does not seem to be online`,
      )
    }
  },
}
