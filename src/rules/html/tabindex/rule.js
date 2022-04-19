import assert from 'assert'

export default {
  name: 'html.tabindex',
  description: 'Warns if tabindex values other than -1 and 0 are being used.',
  html: (_, { lint, $attributes }) => {
    const elements = $attributes('[tabindex]')

    elements.forEach((element) => {
      lint(
        assert.ok,
        element.tabindex === '-1' || element.tabindex === '0',
        'Using tabindex values other than 0 or 1 is not recommended.',
      )
    })
  },
}
