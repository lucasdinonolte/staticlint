import { describe, it, expect, beforeEach, vi } from 'vitest'
import rule from './rule.js'
import runTestForRule from '../../../util/testRule.js'

describe('folder.htaccess', () => {
  let deps

  beforeEach(() => {
    deps = {
      fs: {
        existsSync: vi.fn((f) => f),
      },
      path: {
        join: vi.fn((a, b) => `${a}/${b}`),
      },
    }
  })

  it('should warn if no .htaccess is found in folder', async () => {
    deps.fs.existsSync.mockImplementationOnce(() => false)

    let results = await runTestForRule(rule, '/folder', {}, {}, deps)

    expect(deps.path.join).toHaveBeenCalledWith('/folder', '.htaccess')
    expect(deps.fs.existsSync).toHaveBeenCalledWith('/folder/.htaccess')
    expect(results.all.length).toBe(1)
    expect(results.all[0]).toBe('No .htaccess found')
  })
})
