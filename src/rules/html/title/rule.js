import assert from 'assert'

export const titlePresent = {
  name: 'html.title.present',
  description: 'Checks if a title tag is present',
  html: (payload, { test }) => {
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
  },
}

export const titleIdealLength = {
  name: 'html.title.idealLength',
  description: 'Checks if title tag is between 10 and 70 characters',
  html: (payload, { test }) => {
    const titles = payload.title

    test(
      assert.ok,
      titles[0].innerText.length > 10,
      'This title tag is shorter than the recommended minimum limit of 10.',
    )

    test(
      assert.ok,
      titles[0].innerText.length < 70,
      'This title tag is longer than the recommended limit of 70.',
    )
  },
}

export const titleMaxLength = {
  name: 'html.title.maxLength',
  description: 'Checks if title tag is not above 200 characters',
  html: (payload, { test }) => {
    const titles = payload.title

    test(
      assert.ok,
      titles[0].innerText.length < 200,
      `Something could be wrong this title tag is over 200 chars. : ${titles[0].innerText}`,
    )
  },
}

export const titleStopWords = {
  name: 'html.title.stopWords',
  description: 'Checks if the title contains any english stopwords',
  html: (payload, { test }) => {
    const titles = payload.title

    const stopWords = [
      'a',
      'and',
      'but',
      'so',
      'on',
      'or',
      'the',
      'was',
      'with',
    ]
    stopWords.forEach((sw) => {
      test(
        assert.ok,
        !titles[0].innerText.toLowerCase().includes(` ${sw} `),
        `Title tag includes stopword ${sw}`,
      )
    })
  },
}
