import assert from 'assert'

export const absoluteLinks = {
  name: 'email.links.absolute',
  description: 'Validates that images have width/height specified.',
  html: (payload, { test }) => {
    payload.aTags.forEach((a) => {
      if (a.href.startsWith('mailto:')) return

      test(
        assert.ok,
        a.href && a.href.startsWith('http'),
        `All links should be absolute. ${a.href} is not`,
      )
    })
  },
}
