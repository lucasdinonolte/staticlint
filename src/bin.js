#!/usr/bin/env node

import sade from 'sade'
import chalk from 'chalk'
import path from 'path'
import fs from 'fs'
import groupBy from 'lodash.groupby'
import { performance } from 'perf_hooks'

import performTests from './index.js'
import { mergeConfigurations } from './configuration.js'
import { ERRORS, WARNINGS } from './constants.js'

const stylings = {
  errors: chalk.red,
  warnings: chalk.yellow,
  info: chalk.bgGrey,
  success: chalk.bgGreen,
  secondary: chalk.grey,
}

const icons = {
  errors: '×',
  warnings: '!', 
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
    const start = performance.now()

    // Load external config and merge with default config
    const config = await mergeConfigurations(opts.config)

    // Flag overrides config
    if (opts.host) config.host = opts.host

    // Run the tests
    const { errors, warnings } = await performTests(dir, config)

    // Output the errors and warnings
    const output = groupBy([errors, warnings].flat(), 'file')
    const outputMessages = function(messages) {
      messages.forEach(m => {
        if (config.display.includes(m.severity)) console.log(`  ${stylings[m.severity](icons[m.severity])} ${stylings.secondary(m.rule)} ${m.message}`)
      })
    }

    for (const [fileName, messages] of Object.entries(output)) {
      const fName = fileName.replace(dir, '')
      console.log(`${chalk.grey(dir)}${chalk.white.bold(fName)}`)
      outputMessages(messages)
      console.log('')
    }

    const end = performance.now() 
    console.log(chalk.bold('Rules'), '      ', chalk.white(config.rules.length + config.customRules.length))
    console.log(chalk.bold('Time'), '       ', chalk.white(Math.round((end - start)) / 1000 + 's'))

    // Output number of errors and warnings
    if (config.display.includes(ERRORS)) console.log(chalk.bold('Errors'), '     ', chalk.red.bold(errors.length))
    if (config.display.includes(WARNINGS)) console.log(chalk.bold('Warnings'), '   ', chalk.yellow.bold(warnings.length))

    if ((errors.length > 0 && config.failOn.includes(ERRORS)) || (warnings.length > 0 && config.failOn.includes(WARNINGS))) {
      console.log(chalk.bold.red('\nCheck failed. See above for details'))
      process.exit(1) 
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

  // If errors occur let the CLI exit with an error exit code
  // This will stop your build in a CI and prevent a broken site
  // from being deployed.
  failOn: ['${ERRORS}'], 
}`

    const outputPath = path.join(process.cwd(), 'und-check.config.js')
    fs.writeFileSync(outputPath, template, { encoding: 'utf-8' })

    console.log(`Written config to ${outputPath}`)
  })

prog.parse(process.argv)
