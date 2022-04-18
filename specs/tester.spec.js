import { it, describe, expect, beforeEach, vi } from 'vitest'

import { testFactory } from '../src/tester.js'

describe('Tester', () => {
  describe('testFactory', () => {
    let fakeTest, mockPrepareInput, mockRunRule
    const sampleInput = 'foo.html'

    const fakeRule = {
      name: 'fakeRule',
      folder: () => {
        return 'I am just a fake rule object'
      },
    }

    beforeEach(() => {
      mockPrepareInput = vi.fn()

      mockRunRule = vi.fn().mockImplementation((argObject) => {
        expect(argObject.rule).toStrictEqual(fakeRule)
      })

      fakeTest = testFactory({
        prepareInput: mockPrepareInput,
        ruleRunner: mockRunRule,
      })
    })

    it('should return a function', () => {
      expect(fakeTest).toEqual(expect.any(Function))
    })

    it('should properly set up test functions', async () => {
      await fakeTest(sampleInput, [fakeRule], {})

      expect(mockPrepareInput).toHaveBeenCalledWith(sampleInput)
      expect(mockRunRule).toHaveBeenCalledTimes(1)
    })

    it('should not call any rule if no rules are supplied', async () => {
      await fakeTest(sampleInput, [], {})

      expect(mockPrepareInput).toHaveBeenCalledWith(sampleInput)
      expect(mockRunRule).not.toHaveBeenCalled()
    })

    it('should call the test runner once for each supplied rule', async () => {
      await fakeTest(sampleInput, [fakeRule, fakeRule], {})
      expect(mockRunRule).toHaveBeenCalledTimes(2)
    })

    it('should throw if no rule runner function is given', () => {
      expect(() => testFactory({})).toThrow()
      expect(() => testFactory({ ruleRunner: 'foo' })).toThrow()
    })

    it('should return empty error and warnings if it is run without rules', async () => {
      const { errors, warnings } = await fakeTest(sampleInput, [], {})

      expect(errors).toStrictEqual({})
      expect(warnings).toStrictEqual({})
    })

    it('should properly pass needed data to supplied rule runner', async () => {
      const ruleDependencies = { config: {} }

      const ruleRunner = ({ input, test, lint, rule, dependencies }) => {
        expect(input).toBe(sampleInput)
        expect(test).toEqual(expect.any(Function))
        expect(lint).toStrictEqual(expect.any(Function))
        expect(rule).toStrictEqual(fakeRule)
        expect(dependencies).toStrictEqual(ruleDependencies)
      }

      const advancedFakeTester = testFactory({
        ruleRunner,
      })

      await advancedFakeTester(sampleInput, [fakeRule], ruleDependencies)
    })

    /* This is more of an integration test */
    it('should integrate all modules properly', async () => {
      const ruleRunner = async ({ rule, test, lint }) => {
        await rule.test({ test, lint })
      }

      const mockTestRunner = () => {
        throw new Error('Error')
      }

      const fakeRule = {
        name: 'fakeRule',
        test: async ({ test, lint }) => {
          test(mockTestRunner)
          lint(mockTestRunner)
        },
      }

      const testingFunction = testFactory({ ruleRunner })

      const { errors, warnings } = await testingFunction(
        sampleInput,
        [fakeRule],
        {},
      )

      expect(errors).toHaveProperty('fakeRule')
      expect(errors.fakeRule.length).toBe(1)

      expect(warnings).toHaveProperty('fakeRule')
      expect(warnings.fakeRule.length).toBe(1)
    })
  })
})
