import fs from 'fs'
import path from 'path'
import glob from 'glob'
import groupBy from 'lodash.groupby'

import { testFolder, testHtmlFile, testFile } from './tester.js'
import { defaultConfig } from './defaultConfig.js'
import { ERRORS, WARNINGS } from './constants.js'

const Cache = {
  entries: {},

  push: function(name, value) {
    if (!Object.prototype.hasOwnProperty.call(this.entries, name)) this.entries[name] = []
    this.entries[name].push(value)
  },

  includes: function(name, value) {
    if (!Object.prototype.hasOwnProperty.call(this.entries, name)) return false
    return this.entries[name].includes(value)
  },
}

// Util to build rules from a given config
const buildRulesFromConfig = (config, ruleType) => {
  return [
    config.rules.filter(r => (typeof r[ruleType] === 'function')),
    config.customRules.filter(r => (typeof r[ruleType] === 'function')),
  ].flat().filter(r => !config.ignoreRules.includes(r.name))
}

// Restructure the errors and warnings
const buildErrorMessages = (file, messages, severity = 'error') => {
  return Object.keys(messages).map((key) => {
    return messages[key].map((m) => ({
      file, 
      severity,
      rule: key,
      message: m,
    }))
  }).flat()
}


/**
 * Checks a directory
 * Returns an object with errors and warnings.
 *
 * @param directory to check
 * @param staticlint configuration object
 */
export default async function(dir, _config = {}) {
  // Check if the target dir exists
  if (!fs.existsSync(dir)) throw new Error(`${dir} does not exist`)

  const config = Object.assign(defaultConfig, _config)

  // Figure out the rules
  const folderRules = buildRulesFromConfig(config, 'folder')
  const fileRules = buildRulesFromConfig(config, 'file') 
  const htmlRules = buildRulesFromConfig(config, 'html')

  const files = {}

  // First it performs rules from the folder namespace
  const folderResults = testFolder(dir, folderRules, { config }) 
  files[dir] = { errors: folderResults.errors, warnings: folderResults.warnings }
  
  // Utility to build file tester
  const runFileTester = async (fileGlob, { rules, testRunner }) => {
    const filesToTest = glob.sync(path.join(dir, fileGlob))
    for (let i = 0; i < filesToTest.length; i++) {
      const file = filesToTest[i]
      const results = await testRunner(file, rules, { config, cache: Cache })
      files[file] = { errors: results.errors, warnings: results.warnings }
    }
  }
  
  // Next it performs rules from the html namespace
  await runFileTester('**/*.html', { rules: htmlRules, testRunner: testHtmlFile })

  // Next it performs generic file rules
  const fileRulesByGlob = groupBy(fileRules, 'files')

  for (const [fileGlob, rules] of Object.entries(fileRulesByGlob)) {
    await runFileTester(fileGlob, { rules, testRunner: testFile })
  }
  
  const _tempErrors = []
  const _tempWarnings = []

  for (let i = 0; i < Object.keys(files).length; i++) {
    const key = Object.keys(files)[i]
    const file = files[key]

    _tempErrors.push(buildErrorMessages(key, file.errors, ERRORS))
    _tempWarnings.push(buildErrorMessages(key, file.warnings, WARNINGS))
  }

  return {
    errors: _tempErrors.flat(),
    warnings: _tempWarnings.flat(),
  }
}
