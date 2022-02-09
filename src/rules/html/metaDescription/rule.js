import assert from 'assert'
import { cleanString } from '../../../util/string.js'

export default {
  name: 'html.meta.description',
  description: 'Validates presence of meta description',
  html: (payload, { test, lint }) => {
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
      'Meta description content="" should not be missing.',
    )

    if (!(metas[0] && metas[0].content)) return

    test(
      assert.notStrictEqual,
      metas[0].content.length,
      0,
      'Meta description should not be empty',
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

    if (payload.title[0]) {
      const titleArr = cleanString(payload.title[0].innerText)
        .split(' ')
        .filter((i) => [':', '|', '-'].indexOf(i) === -1)

      const compareArr = cleanString(metas[0].content)
        .split(' ')
        .filter((i) => [':', '|', '-'].indexOf(i) === -1)

      const matches = titleArr.filter((t) => compareArr.indexOf(t) !== -1)

      lint(
        assert.ok,
        matches.length >= 1,
        'Meta description should include at least 1 of the words in the title tag.',
      )
    }
  },
}
