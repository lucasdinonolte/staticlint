import { testHtmlFileFactory } from '../../src/tester.js'
import { parseHtmlFactory, getAttributes } from '../../src/util/html.js'

const parseHtml = parseHtmlFactory({
  fs: {
    readFileSync: (html) => html,
  },
  getAttributes,
})

const testHtmlFile = testHtmlFileFactory({ parseHtml })

const runTestForRule = async (rule, html, config = {}, cache = {}) => {
  const { errors, warnings } = await testHtmlFile(html, [rule], { config, cache })
  return {
    errors: errors[rule.name] || [],
    warnings: warnings[rule.name] || [],
  }
}

export default runTestForRule
