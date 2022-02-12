import { testHtmlFileFactory, testFolder } from '../../src/tester.js'
import { parseHtmlFactory, getAttributes } from '../../src/util/html.js'

const parseHtml = parseHtmlFactory({
  fs: {
    readFileSync: (html) => html,
  },
  getAttributes,
})

const testHtmlFile = testHtmlFileFactory({ parseHtml })

const runTestForRule = async (rule, payload, config = {}, cache = {}, deps = {}) => {
  const testMethod = (typeof rule.folder === 'function') ? testFolder : testHtmlFile
  const { errors, warnings } = await testMethod(payload, [rule], { config, cache }, deps)

  return {
    errors: errors[rule.name] || [],
    warnings: warnings[rule.name] || [],
  }
}

export default runTestForRule
