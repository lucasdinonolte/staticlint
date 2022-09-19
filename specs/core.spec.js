import { it, describe, expect } from 'vitest'
import { buildFilesToTest, Cache } from '../src/index.js'

const KEY = 'test'
const INCLUDED_ONCE_NAME = 'included'
const INCLUDED_TWICE_NAME = 'included-twice'
const EXCLUDED_NAME = 'excluded'

Cache.push(KEY, INCLUDED_ONCE_NAME)
Cache.push(KEY, INCLUDED_TWICE_NAME)
Cache.push(KEY, INCLUDED_TWICE_NAME)

describe('core', () => {
  describe('buildFilesToTest', () => {
    const dir = './specs/fixtures/example-build/'
    it('should output all files if no files are set to be ignored', () => {
      const result = buildFilesToTest(dir, {
        fileGlob: '**/*.html',
        ignoreFiles: [],
      })

      expect(result.length).toBe(2)
    })

    it('should respect ignored files', () => {
      const result = buildFilesToTest(dir, {
        fileGlob: '**/*.html',
        ignoreFiles: ['ignore-files-in-here/*'],
      })

      expect(result.length).toBe(1)
    })
  })

  describe('Cache', () => {
    it('should return the correct boolean value when inclusion of a key is checked', () => {
      expect(Cache.includes(KEY, INCLUDED_ONCE_NAME)).toBe(true)
      expect(Cache.includes(KEY, INCLUDED_TWICE_NAME)).toBe(true)
      expect(Cache.includes(KEY, EXCLUDED_NAME)).toBe(false)
    })

    it('should return the correct count of times a key has been included', () => {
      expect(Cache.includesHowOften(KEY, INCLUDED_ONCE_NAME)).toBe(1)
      expect(Cache.includesHowOften(KEY, INCLUDED_TWICE_NAME)).toBe(2)
      expect(Cache.includesHowOften(KEY, EXCLUDED_NAME)).toBe(0)
    })
  })
})
