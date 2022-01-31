#!/usr/bin/env node

import sade from 'sade'
import chalk from 'chalk'
import ora from 'ora'
import glob from 'glob'
import path from 'path'
import fs from 'fs'
import groupBy from 'lodash.groupby'

import performTests from './index.js'
import { defaultConfig } from './defaultConfig.js'
import { mergeConfigurations } from './configuration.js'

// IDEA: Add more commands
// - generate config file
const prog = sade('und-check')
  .version('0.1.0')

prog
  .command('check <dir>', '', { default: true })
  .describe('Checks the output of a SSG for common issues.')
  .option('--config', 'Path to custom config file', 'und-check.config.js')
  .option('--host', 'Production URL. If set it overrides the host set in your config file', null)
  .action(async (dir, opts) => {
    const spinner = ora('Starting check').start()

    const stylings = {
      error: chalk.bgRed,
      warning: chalk.bgYellow,
      info: chalk.bgGrey,
      success: chalk.bgGreen,
    }

    // Check for external config
    // if present load external config and merge with default config
    let config = {}

    const configPath = path.join(process.cwd(), opts.config)
    if (fs.existsSync(configPath)) {
      const externalConfig = await import(configPath)
      config = Object.assign({}, externalConfig.default)
    }

    // Flag overrides config
    if (!!opts.host) config.host = opts.host

    // Run the tests
    const { errors, warnings } = await performTests(dir, config)

    // Output the errors and warnings
    spinner.stop()
    const output = groupBy([errors, warnings].flat(), 'file')
    const outputMessages = function(messages) {
      messages.forEach(m => {
        console.log(`${stylings[m.severity](m.rule)} ${m.message}`)
      })
    }

    for (const [fileName, messages] of Object.entries(output)) {
      console.log(`${stylings.info(fileName)}`)
      outputMessages(messages)
      console.log('\n')
    }

    // Output number of errors and warnings
    if (errors.length > 0 || warnings.length > 0) {
      console.log(chalk.bgRed(`${errors.length} errors`), chalk.bgYellow(`${warnings.length} warnings`))

      // If errors are present exit with a non-sucess status code
      if (errors.length > 0) process.exit(1) 
    } else {
      console.log(stylings.success('Looks good to me 🍻'))
    }
  })

prog
  .command('rules', '')
  .describe('List the rules, that will be applied in the current configuration')
  .option('--config', 'Path to custom config file', 'und-check.config.js')
  .action(async (opts) => {
    const config = await mergeConfigurations(opts.config)
    const rules = Object.values(config.rules).flat().map(r => r.name)
    console.log('The current configuration will run und-check with the following rules\n')
    console.log(rules.join('\n'))
  })

prog.parse(process.argv)
