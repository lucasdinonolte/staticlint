import { buildFilesToTest, buildRulesFromConfig } from '../src/index.js'

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
})
