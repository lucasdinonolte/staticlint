import fs from 'fs'
import path from 'path'

import { defaultConfig } from './defaultConfig.js'
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
      if (!severity.hasOwnProperty(name)) severity[name] = []
      severity[name].push(e.message)
    }
  }
}

const testFolder = function(folder, config) {
  const errors = {}
  const warnings = {}


  const runRule = (rule) => {
    const name = rule.name

    const test = makeTestRunner(name, errors)
    const lint = makeTestRunner(name, warnings)
    rule.run(folder, { test, lint, config })
  }

  [config.rules.folder, config.customRules.folder].flat().map((rule) => {
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
const testFile = async (html, { config, cache }) => {
  const errors = {}
  const warnings = {}

  const { results, $attributes } = parseHtml(html)

  // Refactor: This could be a global factory function that accepts a callback
  const runRule = async (rule) => {
    const name = rule.name

    const test = makeTestRunner(name, errors)
    const lint = makeTestRunner(name, warnings)
    await rule.run(results, { test, lint, config, cache, $attributes })
  }

  const rulesToRun = [config.rules.html, config.customRules.html].flat()

  for (let i = 0; i < rulesToRun.length; i++) {
    const rule = rulesToRun[i]
    if (!config.ignoreRules.includes(rule.name)) await runRule(rule)
  }

  return { errors, warnings }
}

export { makeTestRunner, testFile, testFolder }
