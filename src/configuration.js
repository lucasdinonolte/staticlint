import path from 'path'
import fs from 'fs'

import { defaultConfig } from './defaultConfig.js'

const _loadExternalConfiguration = async (externalConfig) => {
  let config = {}
  const configPath = path.join(process.cwd(), externalConfig)

  if (fs.existsSync(configPath)) {
    const externalConfig = await import(configPath)
    config = Object.assign({}, externalConfig.default) 
  }

  return config
}

const mergeConfigurations = async (externalConfig = 'und-check.config.js') => {
  return Object.assign(defaultConfig, await _loadExternalConfiguration(externalConfig)) 
}

export {
  mergeConfigurations,
}
