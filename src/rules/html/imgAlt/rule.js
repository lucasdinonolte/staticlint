import assert from 'assert'

export const imgAltPresent = {
  name: 'html.img.alt.present',
  description: 'Validates presence of alt tags for all images',
  html: (payload, { test }) => {
    payload.imgs.forEach((i) => {
      test(
        assert.ok,
        i.alt,
        `Images should have alt attributes. ${i.src} does not`,
      )
    })
  },
}

export const imgAltNotEmpty = {
  name: 'html.img.alt.notEmpty',
  description: 'Checks for empty alt tags',
  html: (payload, { test }) => {
    payload.imgs.forEach((i) => {
      test(
        assert.ok,
        i.alt && i.alt.length > 0,
        `${i.src} has an empty alt attribute, which is ok for decorative images`,
      )
    })
  },
}
