import { testFactory, htmlRuleRunner, testFolder } from '../../src/tester.js'
import { parseHtmlFactory, getAttributes } from '../../src/util/html.js'

// Build a mock rule runner that doesn't do anything to the input
// (so not trying to read from file)

const parseHtml = parseHtmlFactory({
  fs: {
    readFileSync: (html) => html,
  },
  getAttributes,
})

const mockTestHtmlFile = testFactory({
  prepareInput: (input) => parseHtml(input),
  ruleRunner: htmlRuleRunner,
})

const runTestForRule = async (
  rule,
  payload,
  config = {},
  cache = {},
  deps = {},
) => {
  const testMethod =
    typeof rule.folder === 'function' ? testFolder : mockTestHtmlFile
  const { errors, warnings } = await testMethod(
    payload,
    [rule],
    { config, cache },
    deps,
  )

  return {
    errors: errors[rule.name] || [],
    warnings: warnings[rule.name] || [],
  }
}

export default runTestForRule
