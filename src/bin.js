#!/usr/bin/env node

import sade from 'sade'
import chalk from 'chalk'
import path from 'path'
import fs from 'fs'
import url from 'url'
import groupBy from 'lodash.groupby'
import inquirer from 'inquirer'
import { performance } from 'perf_hooks'

import performTests, { buildRulesFromConfig } from './index.js'
import { mergeConfigurations } from './configuration.js'
import { defaultConfig } from './defaultConfig.js'
import { ERRORS, WARNINGS, ICONS } from './constants.js'

const stylings = {
  errors: chalk.red,
  warnings: chalk.yellow,
  info: chalk.bgGrey,
  success: chalk.bgGreen,
  secondary: chalk.grey,
}

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json')))
const prog = sade('staticlint').version(pkg.version)

prog
  .command('check <dir>', '', { default: true })
  .describe('Checks the output of a SSG for common issues.')
  .option('--config', 'Path to custom config file', 'staticlint.config.mjs')
  .option(
    '--host',
    'Production URL. If set it overrides the host set in your config file',
    null,
  )
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
    const outputMessages = function (messages) {
      messages.forEach((m) => {
        if (config.display.includes(m.severity))
          console.log(
            `  ${stylings[m.severity](ICONS[m.severity])} ${stylings.secondary(
              m.rule,
            )} ${m.message}`,
          )
      })
    }

    for (const [fileName, messages] of Object.entries(output)) {
      const fName = fileName.replace(dir, '')
      console.log(`${chalk.grey(dir)}${chalk.white.bold(fName)}`)
      outputMessages(messages)
      console.log('')
    }

    const end = performance.now()
    console.log(
      chalk.bold('Rules'),
      '      ',
      chalk.white(config.rules.length + config.customRules.length),
    )
    console.log(
      chalk.bold('Time'),
      '       ',
      chalk.white(Math.round(end - start) / 1000 + 's'),
    )

    // Output number of errors and warnings
    if (config.display.includes(ERRORS))
      console.log(chalk.bold('Errors'), '     ', chalk.red.bold(errors.length))
    if (config.display.includes(WARNINGS))
      console.log(
        chalk.bold('Warnings'),
        '   ',
        chalk.yellow.bold(warnings.length),
      )

    if (
      (errors.length > 0 && config.failOn.includes(ERRORS)) ||
      (warnings.length > 0 && config.failOn.includes(WARNINGS))
    ) {
      console.log(chalk.bold.red('\nCheck failed. See above for details'))
      process.exit(1)
    }
  })

prog
  .command('rules', '')
  .describe('List the rules, that will be applied in the current configuration')
  .option('--config', 'Path to custom config file', 'staticlint.config.mjs')
  .action(async (opts) => {
    const config = await mergeConfigurations(opts.config)
    const rules = buildRulesFromConfig(config).map((r) => r.name)
    console.log(
      'The current configuration will run staticlint with the following rules\n',
    )
    console.log(rules.join('\n'))
  })

prog
  .command('scaffold', '')
  .describe('Builds an empty config file')
  .action(async () => {
    const rules = buildRulesFromConfig(defaultConfig).map((r) => r.name)

    const answers = await inquirer.prompt([
      {
        name: 'hostName',
        type: 'input',
        message:
          'What’s the production hostname of the website you want to test?',
        default: 'https://example.com',
      },
      {
        name: 'rulesToInclude',
        type: 'checkbox',
        message: 'Which rules do you want to include? (defaults to all rules)',
        choices: rules.map((r) => ({ name: r, checked: true })),
      },
      {
        name: 'display',
        type: 'checkbox',
        message: 'What messages do you want to display in linting output?',
        choices: [
          {
            name: ERRORS,
            checked: true,
          },
          {
            name: WARNINGS,
            checked: true,
          },
        ],
      },
      {
        name: 'failOn',
        type: 'checkbox',
        message: 'On what messages do you want to exit with an error code?',
        choices: [
          {
            name: ERRORS,
            checked: true,
          },
          {
            name: WARNINGS,
            checked: false,
          },
        ],
      },
    ])

    const rulesToIgnore = rules
      .filter((r) => !answers.rulesToInclude.includes(r))
      .map((r) => `'${r}'`)
      .join(', ')

    const display = answers.display.map((d) => `'${d}'`).join(', ')
    const failOn = answers.failOn.map((f) => `'${f}'`).join(', ')

    const template = `export default {
  // Production URL
  // Heads up: If you run the CLI with --host flag it will override this
  host: '${answers.hostName}', 

  // Specify files to ignore
  // accepts glob paths
  ignoreFiles: [],

  // Rules to ignore
  ignoreRules: [${rulesToIgnore}], 

  // Create custom rules
  customRules: [], 

  // Output ${display.split(', ').join(' and ')}
  display: [${display}],

  // If ${failOn
    .split(', ')
    .join(' or ')} occur let the CLI exit with an error exit code
  // This will stop your build in a CI and prevent a broken site
  // from being deployed.
  failOn: [${failOn}], 
}`

    const outputPath = path.join(process.cwd(), 'staticlint.config.mjs')
    fs.writeFileSync(outputPath, template, { encoding: 'utf-8' })

    console.log(`Written config to ${outputPath}`)
  })

prog.parse(process.argv)
