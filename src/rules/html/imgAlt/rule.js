import assert from 'assert'

export default {
  name: 'html.img.alt',
  description: 'Validates presence of alt tags for all images',
  html: (payload, { test, lint }) => {
    payload.imgs.forEach((i) => {
      test(
        assert.ok,
        i.alt,
        `Images should have alt attributes. ${i.src} does not`,
      )

      lint(
        assert.ok,
        i.alt && i.alt.length > 0,
        `${i.src} has an empty alt attribute, which is ok for decorative images`,
      )
    })
  },
}
