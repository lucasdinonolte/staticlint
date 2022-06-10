import assert from 'assert'
import { cleanString } from '../../../util/string.js'

export const metaDescriptionPresent = {
  name: 'html.meta.description.present',
  description: 'Validates presence of meta description',
  html: (payload, { test }) => {
    const metas = payload.meta.filter(
      (m) => m.name && m.name.toLowerCase() === 'description',
    )

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
      'Meta description content="" should not be missing.',
    )

    if (!(metas[0] && metas[0].content)) return

    test(
      assert.notStrictEqual,
      metas[0].content.length,
      0,
      'Meta description should not be empty',
    )
  },
}

export const metaDescriptionMaxLength = {
  name: 'html.meta.description.maxLength',
  description: 'Validates the ideal length of a meta description',
  html: (payload, { test }) => {
    const metas = payload.meta.filter(
      (m) => m.name && m.name.toLowerCase() === 'description',
    )

    test(
      assert.ok,
      metas[0].content.length < 300,
      `Investigate this meta description. Something could be wrong as it is over 300 chars: ${metas[0].content}`,
    )
  },
}

export const metaDescriptionIdealLength = {
  name: 'html.meta.description.idealLength',
  description: 'Validates the ideal length of a meta description',
  html: (payload, { test }) => {
    const metas = payload.meta.filter(
      (m) => m.name && m.name.toLowerCase() === 'description',
    )

    test(
      assert.ok,
      metas[0].content.length < 120,
      `This meta description is longer than the recommended limit of 120. ${metas[0].content.length} (${metas[0].content})`,
    )

    test(
      assert.ok,
      metas[0].content.length > 10,
      `This meta description is shorter than the recommended minimum limit of 10. (${metas[0].content})`,
    )
  },
}

export const metaDescriptionTitle = {
  name: 'html.meta.description.title',
  description: 'Validates the meta description contains a word from the title',
  html: (payload, { test }) => {
    const metas = payload.meta.filter(
      (m) => m.name && m.name.toLowerCase() === 'description',
    )
    if (payload.title[0]) {
      const titleArr = cleanString(payload.title[0].innerText)
        .split(' ')
        .filter((i) => [':', '|', '-'].indexOf(i) === -1)

      const compareArr = cleanString(metas[0].content)
        .split(' ')
        .filter((i) => [':', '|', '-'].indexOf(i) === -1)

      const matches = titleArr.filter((t) => compareArr.indexOf(t) !== -1)

      test(
        assert.ok,
        matches.length >= 1,
        'Meta description should include at least 1 of the words in the title tag.',
      )
    }
  },
}
