import assert from 'assert'

export default {
  name: 'html.img.alt',
  description: 'Validates presence of alt tags for all images',
  html: (payload, { test }) => {
    payload.imgs.forEach((i) => {
      test(
        assert.ok,
        i.alt && i.alt.length > 0,
        `Images should have alt attributes. ${i.src} does not`,
      )
    })
  },
}
