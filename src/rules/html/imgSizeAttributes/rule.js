import assert from 'assert'

export const imgSizeAttributes = {
  name: 'html.img.sizeAttributes',
  description:
    'Checks for explicit width and height attributes on img tags to prevent layout shifts',
  html: (payload, { test }) => {
    payload.imgs.forEach((i) => {
      test(
        assert.ok,
        i.width,
        `Missing explicit width attribute on <img> element ${i.src}. See https://web.dev/optimize-cls/#images-without-dimensions`,
      )

      test(
        assert.ok,
        i.height,
        `Missing explicit height attribute on <img> element ${i.src}. See https://web.dev/optimize-cls/#images-without-dimensions`,
      )
    })
  },
}
