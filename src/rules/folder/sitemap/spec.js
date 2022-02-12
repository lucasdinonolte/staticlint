import { jest } from '@jest/globals'
import rule from './rule.js'
import runTestForRule from '../../../util/testRule.js'

describe('folder.sitemap', () => {
  let deps

  beforeEach(() => {
    deps = {
      fs: {
        existsSync: jest.fn((f) => f),
      }, path: {
        join: jest.fn((a, b) => `${a}/${b}`),
      }
    }
  })

  it('should error if no sitemap.xml is found in folder', async () => {
    deps.fs.existsSync.mockImplementationOnce(() => false)

    let results = await runTestForRule(rule, '/folder', {}, {}, deps)

    expect(deps.path.join).toHaveBeenCalledWith('/folder', 'sitemap.xml')
    expect(deps.fs.existsSync).toHaveBeenCalledWith('/folder/sitemap.xml')
    expect(results.errors.length).toBe(1)
    expect(results.errors[0]).toBe('No sitemap.xml found')
  })
})
