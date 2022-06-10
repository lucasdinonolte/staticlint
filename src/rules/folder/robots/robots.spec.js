import { describe, it, expect, beforeEach, vi } from 'vitest'
import rule from './rule.js'
import runTestForRule from '../../../util/testRule.js'

describe('folder.robots', () => {
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

  it('should warn if no robots.txt is found in folder', async () => {
    deps.fs.existsSync.mockImplementationOnce(() => false)

    let results = await runTestForRule(rule, '/folder', {}, {}, deps)

    expect(deps.path.join).toHaveBeenCalledWith('/folder', 'robots.txt')
    expect(deps.fs.existsSync).toHaveBeenCalledWith('/folder/robots.txt')
    expect(results.length).toBe(1)
    expect(results[0]).toBe('No robots.txt found')
  })
})
