import assert from 'assert'

export default {
  name: 'html.title',
  description: 'Checks if a title tag is present',
  html: (payload, { test, lint }) => {
    const titles = payload.title

    // Test for presence of one and only one title tag
    test(
      assert.strictEqual,
      titles.length,
      1,
      `There should be one title tag. Found ${titles.length}.`,
    )

    if (titles.length !== 1) return

    test(
      assert.strictEqual,
      titles[0].innerText,
      titles[0].innerHTML,
      'Title tag should not contain other tags',
    )

    test(
      assert.notStrictEqual,
      titles[0].innerText.length,
      0,
      'Title tag should not be empty',
    )

    lint(
      assert.ok,
      titles[0].innerText.length > 10,
      'This title tag is shorter than the recommended minimum limit of 10.',  
    )

    lint(
      assert.ok,
      titles[0].innerText.length < 70,
      'This title tag is longer than the recommended limit of 70.',
    )

    test(
      assert.ok,
      titles[0].innerText.length < 200,
      `Something could be wrong this title tag is over 200 chars. : ${titles[0].innerText}`,
    )

    const stopWords = ['a', 'and', 'but', 'so', 'on', 'or', 'the', 'was', 'with']
    stopWords.forEach((sw) => {
      lint(
        assert.ok,
        titles[0].innerText.toLowerCase().indexOf(` ${sw} `),
        `Title tag includes stopword ${sw}`,
      )
    })
  },
}
