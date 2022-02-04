import fs from 'fs'
import path from 'path'
import glob from 'glob'

import { testFolder, testFile } from './tester.js'
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

/**
 * Checks a directory
 * Returns an object with errors and warnings.
 *
 * @param directory to check
 * @param und-check configuration object
 */
export default async function(dir, _config = {}) {
  if (!fs.existsSync(dir)) throw new Error(`${dir} does not exist`)

  const files = {}
  const config = Object.assign(defaultConfig, _config)

  // First it performs rules from the folder namespace
  const folderResults = testFolder(dir, config) 
  files[dir] = { errors: folderResults.errors, warnings: folderResults.warnings }
  
  // Next it performs rules from the html namespace
  const htmlFiles = glob.sync(path.join(dir, '**/*.html')) 
  
  for (let i = 0; i < htmlFiles.length; i++) {
    const file = htmlFiles[i]
    const html = fs.readFileSync(path.resolve(file), 'utf-8')
    const fileResults = await testFile(html, { config, cache: Cache })
    files[file] = { errors: fileResults.errors, warnings: fileResults.warnings }
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

  const _tempErrors = []
  const _tempWarnings = []

  for (let i = 0; i < Object.keys(files).length; i++) {
    const key = Object.keys(files)[i]
    const file = files[key]

    _tempErrors.push(buildErrorMessages(key, file.errors, ERRORS))
    _tempWarnings.push(buildErrorMessages(key, file.warnings, WARNINGS))
  }

  const errors = _tempErrors.flat()
  const warnings = _tempWarnings.flat()

  return {
    errors,
    warnings,
  }
}
