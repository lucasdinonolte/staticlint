#!/usr/bin/env node

import sade from 'sade'
import chalk from 'chalk'
import path from 'path'
import fs from 'fs'
import url from 'url'
import groupBy from 'lodash.groupby'
import inquirer from 'inquirer'
import { performance } from 'perf_hooks'
import logUpdate from 'log-update'

import performTests, { buildRulesFromConfig } from './index.js'
import { mergeConfigurations } from './configuration.js'
import { defaultConfig } from './defaultConfig.js'
import { ERRORS, WARNINGS, ICONS } from './constants.js'
import { allRules } from './rules.js'

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
  .option('--config', 'Path to custom config file')
  .option('--verbose', 'Show more information')
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

    const logger = opts.verbose
      ? (msg, replace) => {
        if (replace) {
          logUpdate(msg)
        } else {
          console.log(msg)
        }
      }
      : () => null

    // Run the tests
    const { errors, warnings } = await performTests(dir, config, {
      logger,
    })

    // Output the errors and warnings
    const output = groupBy([errors, warnings].flat(), 'file')

    const shouldDisplayFile = (messages) => {
      const matchingMessages = messages.filter((m) =>
        config.display.includes(m.severity),
      )
      return matchingMessages && matchingMessages.length > 0
    }

    const outputMessages = function(messages) {
      messages.forEach((m) => {
        if (config.display.includes(m.severity))
          console.log(
            `  ${stylings[m.severity](ICONS[m.severity])} ${stylings.secondary(
              m.rule,
            )} ${m.message}`,
          )
      })
    }

    if (opts.verbose) console.log('\n\nResults:\n')

    for (const [fileName, messages] of Object.entries(output)) {
      if (!shouldDisplayFile(messages)) continue
      const fName = fileName.replace(dir, '')
      console.log(chalk.white.bold(fName))
      outputMessages(messages)
      console.log('')
    }

    const end = performance.now()
    console.log(
      chalk.bold('Rules'),
      '      ',
      chalk.white(Object.keys(config.rules).length + config.customRules.length),
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
    const rules = buildRulesFromConfig(config).map(
      (r) => `${r.name} (${r.severity})`,
    )
    console.log(
      'The current configuration will run staticlint with the following rules\n',
    )
    console.log(rules.join('\n'))
  })

prog
  .command('allRules', '')
  .describe('Lists all the rulese that are available in staticlint')
  .action(() => {
    console.log('The following rules are available in staticlint\n')
    console.log(allRules.map((r) => `${r.name}`).join('\n'))
  })

prog
  .command('scaffold', '')
  .describe('Builds an empty config file')
  .action(async () => {
    const rules = buildRulesFromConfig(defaultConfig).map((r) => {
      const spaces = Array.from({ length: 40 - r.name.length }).join(' ')
      return { name: `${r.name}${spaces}(${r.description})`, value: r.name }
    })

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
        choices: rules.map((r) => ({
          name: r.name,
          value: r.value,
          checked: true,
        })),
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
      .filter((r) => !answers.rulesToInclude.includes(r.value))
      .map((r) => `'${r.value}': false,`)
      .join('\n    ')

    const display = answers.display.map((d) => `'${d}'`).join(', ')
    const failOn = answers.failOn.map((f) => `'${f}'`).join(', ')

    const template = `export default {
  // Production URL
  // Heads up: If you run the CLI with --host flag it will override this
  host: '${answers.hostName}', 

  // Specify files to ignore
  // accepts glob paths
  ignoreFiles: [],

  // Rules
  rules: {
    ${rulesToIgnore}
  },
  
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

    // Determine if we're in a module scope or commonjs scope and
    // set the file extension accordingly
    const resolveFileExtension = (rootPath) => {
      if (!fs.existsSync(path.join(rootPath, 'package.json'))) return 'mjs'

      const pkg = JSON.parse(
        fs.readFileSync(path.join(rootPath, 'package.json')),
      )
      return pkg.type === 'module' ? 'js' : 'mjs'
    }

    const outName = `staticlint.config.${resolveFileExtension(process.cwd())}`
    const outputPath = path.join(process.cwd(), outName)
    fs.writeFileSync(outputPath, template, { encoding: 'utf-8' })

    console.log(`Written config to ${outputPath}`)
  })

prog.parse(process.argv)
