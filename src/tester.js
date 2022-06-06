import { parseHtml } from './util/html.js'
import { ERROR, WARNING } from './constants.js'

/**
 * Factory function returning a function to run a set of rules on
 * a given input (folder, files or html documents).
 */
const testFactory = ({ prepareInput, ruleRunner }) => {
  if (typeof ruleRunner !== 'function') {
    throw new Error('Rule runner must be a function')
  }

  /**
   * Factory function to make a test runner that logs
   * depending on its severity.
   *
   * This has side effects, as it's mutating the value of externally given
   * variables containing the errors or warnings.
   *
   * @param name of the rule
   * @param severity to log to
   */
  const makeTestRunner = (name, severity) => {
    return (testFunction, ...params) => {
      try {
        testFunction(...params)
      } catch (e) {
        if (!Object.prototype.hasOwnProperty.call(severity, name))
          severity[name] = []
        severity[name].push(e.message)
      }
    }
  }

  return async (input, rules, dependencies, depsForRule) => {
    const errors = {}
    const warnings = {}

    const preparedInput =
      typeof prepareInput === 'function'
        ? await prepareInput.call(null, input)
        : input

    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i]
      const severity = rule.severity || ERROR
      const test = makeTestRunner(
        rule.name,
        severity === ERROR ? errors : warnings,
      )
      const lint = makeTestRunner(rule.name, warnings)
      await ruleRunner.call(null, {
        depsForRule,
        rule,
        dependencies,
        test,
        lint,
        input: preparedInput,
      })
    }

    return { errors, warnings }
  }
}

const folderRuleRunner = async ({
  input,
  rule,
  dependencies,
  test,
  lint,
  depsForRule,
}) => {
  const { config } = dependencies
  await rule.folder(input, { test, lint, config }, depsForRule)
}

const testFolder = testFactory({
  ruleRunner: folderRuleRunner,
})

const htmlRuleRunner = async ({
  input,
  rule,
  test,
  lint,
  depsForRule,
  dependencies,
}) => {
  const { config, cache } = dependencies
  const { results, $attributes } = input
  await rule.html(
    results,
    { test, lint, config, $attributes, cache },
    depsForRule,
  )
}

const testHtmlFile = testFactory({
  prepareInput: async (input) => {
    const { results, $attributes } = parseHtml(input)
    return { results, $attributes }
  },
  ruleRunner: htmlRuleRunner,
})

const testFile = testFactory({
  ruleRunner: async ({ input, rule, test, lint, dependencies }) => {
    const { config } = dependencies
    await rule.file(input, { test, lint, config })
  },
})

export { testHtmlFile, testFile, testFolder, testFactory, htmlRuleRunner }
