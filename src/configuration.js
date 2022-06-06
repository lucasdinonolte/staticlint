import path from 'path'
import fs from 'fs'

import { defaultConfig } from './defaultConfig.js'

const _loadExternalConfiguration = async (externalConfig = null) => {
  if (!externalConfig) return {}

  const configPath = path.join(process.cwd(), externalConfig)

  if (!!configPath && !fs.existsSync(configPath))
    throw new Error(`Configuration not found at ${configPath}`)

  const loadedConfig = await import(configPath)
  return Object.assign({}, loadedConfig.default)
}

const mergeConfigurations = async (
  externalConfig = 'staticlint.config.mjs',
) => {
  const config = Object.assign(
    defaultConfig,
    await _loadExternalConfiguration(externalConfig),
  )

  // Check if config.rules is a non-empty object
  if (typeof config.rules !== 'object' || Array.isArray(config.rules)) {
    throw new Error('Invalid configuration: config.rules must be an object.')
  }

  return config
}

export { mergeConfigurations }
