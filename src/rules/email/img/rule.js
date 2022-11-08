import assert from 'assert'

export const imgDimensions = {
  name: 'email.img.dimensions',
  description: 'Validates that images have width/height specified.',
  html: (payload, { test }) => {
    payload.imgs.forEach((i) => {
      test(
        assert.ok,
        i.width && i.width !== '',
        `Images should have explicit width attributes. ${i.src} does not`,
      )

      test(
        assert.ok,
        i.height && i.height !== '',
        `Images should have explicit height attributes. ${i.src} does not`,
      )
    })
  },
}
