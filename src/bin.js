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
import { ERRORS, WARNINGS } from './constants.js'

const stylings = {
  error: chalk.bgRed,
  warning: chalk.bgYellow,
  info: chalk.bgGrey,
  success: chalk.bgGreen,
}

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

    // Load external config and merge with default config
    const config = await mergeConfigurations(opts.config)

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

prog
  .command('scaffold', '')
  .describe('Builds an empty config file')
  .action(() => {
    const template = `export default {
  // Production URL
  // Heads up: If you run the CLI with --host flag it will override this
  host: 'https://example.com/', 

  // Rules to ignore
  ignoreRules: [], 

  // Create custom rules
  customRules: {
    folder: [],
    html: [],
  },

  // Output both errors and warnings
  display: ['${ERRORS}', '${WARNINGS}'],
}`

    const outputPath = path.join(process.cwd(), 'und-check.config.js')
    fs.writeFileSync(outputPath, template, { encoding: 'utf-8' })

    console.log(`Written config to ${outputPath}`)
  })

prog.parse(process.argv)
