import path from 'path'
import fs from 'fs'

import { defaultConfig } from './defaultConfig.js'

const _loadExternalConfiguration = async (externalConfig) => {
  let config = {}
  const configPath = !!externalConfig && path.join(process.cwd(), externalConfig)

  if (!!configPath && fs.existsSync(configPath)) {
    const externalConfig = await import(configPath)
    config = Object.assign({}, externalConfig.default) 
  }

  return config
}

const mergeConfigurations = async (externalConfig = 'staticlint.config.mjs') => {
  return Object.assign(defaultConfig, await _loadExternalConfiguration(externalConfig)) 
}

export {
  mergeConfigurations,
}
