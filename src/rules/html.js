import assert from 'assert'

export const htmlRules = [
  {
    name: 'html.title',
    description: 'Checks if a title tag is present',
    run: (payload, { test, lint }) => {
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
    }
  }, {
    name: 'html.meta.description',
    description: 'Validates presence of meta description',
    run: (payload, { test, lint }) => {
      const metas = payload.meta.filter((m) => m.name && m.name.toLowerCase() === 'description')

      test(
        assert.strictEqual,
        metas.length,
        1,
        `There should be 1 meta description. Found ${metas.length}`,
      )

      if (metas.length !== 1) return

      test(
        assert.ok,
        metas[0] && metas[0].content,
        'Meta description content="" should not be missing.'
      )

      test(
        assert.notStrictEqual,
        metas[0].content.length,
        0,
        'Meta description should not be empty'
      )

       lint(
        assert.ok,
        metas[0].content.length > 10,
        `This meta description is shorter than the recommended minimum limit of 10. (${metas[0].content})`,
      )

      lint(
        assert.ok,
        metas[0].content.length < 120,
        `This meta description is longer than the recommended limit of 120. ${metas[0].content.length} (${metas[0].content})`,
      )

      test(
        assert.ok,
        metas[0].content.length < 300,
        `Investigate this meta description. Something could be wrong as it is over 300 chars: ${metas[0].content}`,
      )
    }
  }, {
    name: 'html.img.alt',
    description: 'Validates presence of alt tags for all images',
    run: (payload, { test }) => {
      payload.imgs.forEach((i) => {
        test(
          assert.ok,
          i.alt && i.alt.length > 0,
          `Images should have alt tags. ${i.src} does not`,
        )
      })
    },
  }
]
