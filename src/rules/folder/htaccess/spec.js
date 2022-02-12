import { jest } from '@jest/globals'
import rule from './rule.js'
import runTestForRule from '../../../util/testRule.js'

describe('folder.htaccess', () => {
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

  it('should warn if no .htaccess is found in folder', async () => {
    deps.fs.existsSync.mockImplementationOnce(() => false)

    let results = await runTestForRule(rule, '/folder', {}, {}, deps)

    expect(deps.path.join).toHaveBeenCalledWith('/folder', '.htaccess')
    expect(deps.fs.existsSync).toHaveBeenCalledWith('/folder/.htaccess')
    expect(results.warnings.length).toBe(1)
    expect(results.warnings[0]).toBe('No .htaccess found')
  })
})
