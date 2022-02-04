import { parseHtml } from './util/html.js'

/**
 * Factory function to make a test runner that logs
 * depending on its severity.
 *
 * @param name of the rule
 * @param severity to log to
 */
const makeTestRunner = (name, severity) => {
  return (testFunction, ...params) => {
    try {
      testFunction(...params)
    } catch(e) {
      if (!Object.prototype.hasOwnProperty.call(severity, name)) severity[name] = []
      severity[name].push(e.message)
    }
  }
}

const testFolder = function(folder, rules, { config }) {
  const errors = {}
  const warnings = {}


  const runRule = (rule) => {
    const name = rule.name

    const test = makeTestRunner(name, errors)
    const lint = makeTestRunner(name, warnings)
    rule.folder(folder, { test, lint, config })
  }

  rules.map((rule) => {
    if (!config.ignoreRules.includes(rule.name)) runRule(rule)
  })

  return { errors, warnings }
}

/**
 * This only takes an HTML string and does not read from the file itself
 * to be more encapsulated and easier to test.
 *
 * @param HTML string to test
 * @param und-check configuration object
 */
const testHtmlFile = async (html, rules, { config, cache }) => {
  const errors = {}
  const warnings = {}

  const { results, $attributes } = parseHtml(html)

  // Refactor: This could be a global factory function that accepts a callback
  const runRule = async (rule) => {
    const name = rule.name

    const test = makeTestRunner(name, errors)
    const lint = makeTestRunner(name, warnings)
    await rule.html(results, { test, lint, config, cache, $attributes })
  }

  const rulesToRun = rules

  for (let i = 0; i < rulesToRun.length; i++) {
    const rule = rulesToRun[i]
    if (!config.ignoreRules.includes(rule.name)) await runRule(rule)
  }

  return { errors, warnings }
}

/**
 * Generic test runner for files
 *
 * @param path to file
 * @param und-check configuration object
 */
const testFile = async (file, rules, { config }) => {
  const errors = {}
  const warnings = {}

  const runRule = async(rule) => {
    const name = rule.name

    const test = makeTestRunner(name, errors)
    const lint = makeTestRunner(name, warnings)

    await rule.file(file, { test, lint, config })
  }

  rules.map((rule) => {
    if (!config.ignoreRules.includes(rule.name)) runRule(rule)
  })

  return { errors, warnings }
}

export { makeTestRunner, testHtmlFile, testFile, testFolder }
