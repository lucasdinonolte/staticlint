import assert from 'assert'

export default {
  name: 'html.linkText^',
  description: 'Validates that all links have discernable text',
  html: (payload, { test }) => {
    payload.aTags.forEach((a) => {
      test(
        assert.ok,
        a.innerText !== '' || !!a['aria-label'],
        `Links should have discernable text (or a descriptive aria-label). ${a.href} does not.`,
      )

      if (a['aria-label']) {
        test(
          assert.notStrictEqual,
          a['aria-label'].length,
          0,
          `aria-label for link should not be empty. ${a.href} has empty aria-label`,
        )
      }
    })
  },
}
