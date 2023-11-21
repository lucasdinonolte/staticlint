import fs from 'fs'
import path from 'path'
import glob from 'glob'
import groupBy from 'lodash.groupby'
import memoize from 'lodash.memoize'

import { buildTestJob, testFolder, testHtmlFile, testFile } from './tester.js'
import { getRuleByName } from './rules.js'
import { defaultConfig } from './defaultConfig.js'
import { ERRORS, WARNINGS, ERROR } from './constants.js'
import { generateCacheKey } from './cache.js'

// The cache provides a way of persisting data between tests.
// Check rultes/seo/uniqueTitle for an example using the cache.
export const Cache = {
  entries: {},

  push: function(name, value) {
    if (!Object.prototype.hasOwnProperty.call(this.entries, name))
      this.entries[name] = []
    this.entries[name].push(value)
  },

  includes: function(name, value) {
    if (!Object.prototype.hasOwnProperty.call(this.entries, name)) return false
    return this.entries[name].includes(value)
  },

  set: function(name, value) {
    this.entries[name] = value
  },

  get: function(name) {
    return this.entries[name] || false
  },

  includesHowOften: function(name, value) {
    if (!Object.prototype.hasOwnProperty.call(this.entries, name)) return 0
    return this.entries[name].filter((v) => v === value).length
  },
}

// Util to build rules from a given config
export const buildRulesFromConfig = (config, ruleType = null) => {
  return [
    Object.keys(config.rules)
      .filter((r) => {
        const rule = getRuleByName(r)
        // Filter out rules with severity set to false
        if (!config.rules[r]) return false
        return ruleType !== null ? typeof rule[ruleType] === 'function' : true
      })
      .map((r) => ({
        severity: config.rules[r] || ERROR,
        ...getRuleByName(r),
      })),
    config.customRules.filter((r) =>
      ruleType !== null ? typeof r[ruleType] === 'function' : true,
    ),
  ].flat()
}

// Util to resolve ignored files glob (memoized for speed)
//
// arguments passed in as object as lodash.memoize by default only uses the
// first argument of a function to build the cache key
const buildIgnoredFilesFromConfig = memoize(({ ignoreFiles, dir }) => {
  return ignoreFiles.map((f) => glob.sync(path.join(dir, f))).flat()
})

// Util to build a list of files to be tested
export const buildFilesToTest = (dir, { fileGlob, ignoreFiles }) => {
  const ignoredFiles = buildIgnoredFilesFromConfig({ dir, ignoreFiles })
  return glob.sync(path.join(dir, fileGlob)).filter((f) => {
    return !ignoredFiles.includes(f)
  })
}

// Restructure the errors and warnings
export const buildErrorMessages = (file, messages, severity = 'error') => {
  return Object.keys(messages)
    .map((key) => {
      return messages[key].map((m) => ({
        file,
        severity,
        rule: key,
        message: m,
      }))
    })
    .flat()
}

/**
 * Checks a directory
 * Returns an object with errors and warnings.
 *
 * @param directory to check
 * @param staticlint configuration object
 */
export default async function(
  dir,
  _config = {},
  cachedResults = {},
  { logger = () => null } = {},
) {
  // Check if the target dir exists
  if (!fs.existsSync(dir)) throw new Error(`${dir} does not exist`)

  const config = Object.assign(defaultConfig, _config)

  // Figure out the rules
  const folderRules = buildRulesFromConfig(config, 'folder')
  const fileRules = buildRulesFromConfig(config, 'file')
  const htmlRules = buildRulesFromConfig(config, 'html')

  const files = {}
  const runCache = { ...cachedResults }

  // First it performs rules from the folder namespace
  logger('Running folder tests')
  const folderResults = await testFolder(dir, folderRules, { config })
  files[dir] = {
    errors: folderResults.errors,
    warnings: folderResults.warnings,
  }

  // Utility to build file tester
  const runFileTester = async (
    fileGlob,
    { rules, testRunner, ignoreFiles, withRunCache = false },
  ) => {
    const filesToTest = buildFilesToTest(dir, { fileGlob, ignoreFiles })
    const jobs = []

    for (let i = 0; i < filesToTest.length; i++) {
      const file = filesToTest[i]

      if (!fs.lstatSync(file).isDirectory()) {
        const job = buildTestJob({
          file,
          testRunner,
          rules,
          config,
          Cache,
        })

        const jobRunner = async () => {
          let cacheKey
          let cacheResult

          if (withRunCache) {
            cacheKey = generateCacheKey(file)
            cacheResult = runCache[cacheKey] ?? null
          }

          if (cacheResult) {
            logger(`Using cached result for ${file}`)
            files[file] = { ...cacheResult }
            return
          }

          const { errors, warnings } = await job.run()
          files[file] = { errors, warnings }

          if (withRunCache && cacheKey) {
            logger(`Caching result for ${file}`)
            runCache[cacheKey] = { errors, warnings }
          }
        }

        jobs.push(jobRunner())
      }
    }

    await Promise.all(jobs)
  }

  // Next it performs rules from the html namespace
  logger('Running HTML tests')
  await runFileTester('**/*.html', {
    rules: htmlRules,
    testRunner: testHtmlFile,
    ignoreFiles: config.ignoreFiles,
    withRunCache: true,
  })

  // Next it performs generic file rules
  const fileRulesByGlob = groupBy(fileRules, 'files')

  logger('Running generic file tests')
  for (const [fileGlob, rules] of Object.entries(fileRulesByGlob)) {
    await runFileTester(fileGlob, {
      rules,
      testRunner: testFile,
      ignoreFiles: config.ignoreFiles,
    })
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
    runCache,
  }
}
