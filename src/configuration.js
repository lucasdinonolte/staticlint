import path from 'path'
import fs from 'fs'
import merge from 'lodash.merge'
import glob from 'glob'
import debug from 'debug'

import { defaultConfig } from './defaultConfig.js'

const _searchExternalConfiguration = () => {
  const configFiles = glob.sync(
    path.join(process.cwd(), 'staticlint.config.{js,mjs}'),
  )

  if (configFiles.length > 1) {
    console.log(
      `Multiple config files found. Using ${configFiles[0]}. You can specify to use another config file using the --config flag.`,
    )
  }

  return configFiles[0] || null
}

const _loadExternalConfiguration = async (externalConfig = null) => {
  debug('staticlint:configuration')(
    `Loading external configuration from ${externalConfig}`,
  )

  if (!externalConfig) {
    console.log('No external config found. Using default config\n')
  }

  let config = {}

  if (!!externalConfig && fs.existsSync(externalConfig)) {
    const loadedConfig = await import(externalConfig)
    config = Object.assign({}, loadedConfig.default)
  }

  return config
}

const mergeConfigurations = async (externalConfig = null) => {
  const externalConfigToUse = externalConfig
    ? externalConfig
    : _searchExternalConfiguration()

  const config = merge(
    defaultConfig,
    await _loadExternalConfiguration(externalConfigToUse),
  )

  // Check if config.rules is a non-empty object
  if (typeof config.rules !== 'object' || Array.isArray(config.rules)) {
    throw new Error('Invalid configuration: config.rules must be an object.')
  }

  return config
}

export { mergeConfigurations }
