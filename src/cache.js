import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

import { CACHE_FILE } from './constants.js'

/**
 * Checks if the result cache exists and loads it in.
 * If anything goes wrong loading or parsing the cache
 * file an empty object is returned.
 *
 * @returns {object} cache object
 */
const loadResultsCache = () => {
  const cachePath = path.join(process.cwd(), CACHE_FILE)

  if (!fs.existsSync(cachePath)) {
    return {}
  }

  try {
    const content = fs.readFileSync(cachePath, 'utf8')
    return JSON.parse(content)
  } catch (e) {
    return {}
  }
}

/**
 * Writes the results cache to disk.
 *
 * @param {object} cache object
 * @returns {void}
 */
const writeResultsCache = (cache) => {
  const cachePath = path.join(process.cwd(), CACHE_FILE)
  fs.writeFileSync(cachePath, JSON.stringify(cache))
}

/**
 * Generates a cache key by hasing a file's
 * content.
 *
 * @param {string} file path
 * @returns {string} cache key
 */
const generateCacheKey = (file) => {
  if (!fs.existsSync(file)) {
    return null
  }

  const fileContent = fs.readFileSync(file, 'utf8')
  const hash = crypto.createHash('sha256')

  return hash.update(fileContent).digest('hex')
}

/**
 * Clears the results cache.
 *
 * @returns {void}
 */
const clearResultsCache = () => {
  const cachePath = path.join(process.cwd(), CACHE_FILE)
  fs.writeFileSync(cachePath, '{}')
}

export {
  clearResultsCache,
  generateCacheKey,
  loadResultsCache,
  writeResultsCache,
}
