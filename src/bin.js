#!/usr/bin/env node

import sade from 'sade'
import chalk from 'chalk'
import ora from 'ora'
import glob from 'glob'
import path from 'path'
import fs from 'fs'

import { testFolder, testFile } from './index.js'
import { defaultConfig } from './defaultConfig.js'

sade('und-check <dir>', true)
  .version('0.1.0')
  .describe('Checks the output of a SSG for common issues.')
  .option('--config', 'Path to custom config file', 'und-check.config.js')
  .option('--host', 'Production URL. If set it overrides the host set in your config file', null)
  .action(async (dir, opts) => {
    if (!fs.existsSync(dir)) {
      console.error(`Could not find directory to check: ${dir}`)
      process.exit(1)
    }

    const spinner = ora('Starting check').start()
    const files = {}

    // Check for external config
    // if present load external config and merge with default config
    let config = defaultConfig

    const configPath = path.join(process.cwd(), opts.config)
    if (fs.existsSync(configPath)) {
      const externalConfig = await import(configPath)
      config = Object.assign(defaultConfig, externalConfig.default)
    }

    // Flag overrides config
    if (!!opts.host) config.host = opts.host

    // First it performs rules from the folder namespace
    const folderResults = testFolder(dir, config) 
    files[dir] = { errors: folderResults.errors, warnings: folderResults.warnings }
    
    // Next it performs rules from the html namespace
    const htmlFiles = glob.sync(path.join(dir, '**/*.html')) 
    
    for (let i = 0; i < htmlFiles.length; i++) {
      const file = htmlFiles[i]
      const fileResults = await testFile(file, config)
      files[file] = { errors: fileResults.errors, warnings: fileResults.warnings }
    }

    // Restructure the errors and warnings
    const buildErrorMessages = (file, messages) => {
      return Object.keys(messages).map((key) => {
        return messages[key].map((m) => ({
          file, 
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

      _tempErrors.push(buildErrorMessages(key, file.errors))
      _tempWarnings.push(buildErrorMessages(key, file.warnings))
    }

    const errors = _tempErrors.flat()
    const warnings = _tempWarnings.flat()

    // Output the errors and warnings
    spinner.stop()

    const outputMessages = (messages, styling) => {
      Object.keys(messages).forEach((key) => {
        messages[key].forEach(m => console.log(`${styling(key)} ${m}`))
      })
    }

    for (let i = 0; i < Object.keys(files).length; i++) {
      const key = Object.keys(files)[i]
      const file = files[key]

      console.log(chalk.gray(key))
      if (config.display.includes('errors')) outputMessages(file.errors, chalk.bgRed)
      if (config.display.includes('warnings')) outputMessages(file.warnings, chalk.bgYellow)
      console.log('')
    }

    // Output number of errors and warnings
    if (errors.length > 0 || warnings.length > 0) {
      console.log(chalk.bgRed(`${errors.length} errors`), chalk.bgYellow(`${warnings.length} warnings`))

      // If errors are present exit with a non-sucess status code
      if (errors.length > 0) process.exit(1) 
    } else {
      console.log(chalk.bgGreen('Looks good to me 🍻'))
    }
  })
  .parse(process.argv)
