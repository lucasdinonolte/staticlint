#!/usr/bin/env node

import sade from 'sade'
import chalk from 'chalk'
import glob from 'glob'
import path from 'path'
import fs from 'fs'

import { testFolder, testFile } from './index.js'
import { defaultConfig } from './defaultConfig.js'

sade('und-check <dir>', true)
  .version('0.0.1')
  .describe('Checks the output of a SSG for common issues.')
  .action(async (dir) => {
    if (!fs.existsSync(dir)) {
      console.error(`Could not find directory to check: ${dir}`)
      process.exit(1)
    }

    const errors = []
    const warnings = []
    const files = {}

    // Check for external config
    // if present load external config and merge with default config
    let config = defaultConfig

    const configPath = path.join(process.cwd(), 'und-check.config.js')
    if (fs.existsSync(configPath)) {
      const externalConfig = await import(configPath)
      config = Object.assign(defaultConfig, externalConfig.default)
    }

    const { ignoreRules } = config

    // First it performs rules from the folder namespace
    const folderResults = testFolder(dir, ignoreRules, config.customRules.folder) 
    files[dir] = { errors: folderResults.errors, warnings: folderResults.warnings }
    
    // Next it performs rules from the html namespace
    const htmlFiles = glob.sync(path.join(dir, '**/*.html')) 
    
    htmlFiles.forEach((file) => {
      const fileResults = testFile(file, ignoreRules, config.customRules.html)
      files[file] = { errors: fileResults.errors, warnings: fileResults.warnings }
    })

    // Output the errors and warnings
    
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

    // TODO: Output number of errors and warnings
    // Exit accordingly
    if (errors.length > 0) process.exit(1) 
  })
  .parse(process.argv)
