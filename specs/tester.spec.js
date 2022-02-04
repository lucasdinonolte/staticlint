import { testFolder, testFile, testHtmlFileFactory } from '../src/tester.js'

const config = {}

describe('Tester', () => {
  describe('testFolder', () => {
    it('should return empty error and warnings if no rule is applied', () => {
      const { errors, warnings } = testFolder('/my/folder', [], {})
      expect(errors).toStrictEqual({})
      expect(warnings).toStrictEqual({})
    })

    it('should properly call each rule', () => {
      const dir = '/my/folder'

      const fakeRule = {
        folder: (folder, { test, lint, config }) => {
          expect(folder).toBe(dir)
          expect(test).toEqual(expect.any(Function))
          expect(lint).toEqual(expect.any(Function))
          expect(config).toStrictEqual({})
        },
      }

      testFolder(dir, [fakeRule], { config })
    })
  })
  
  describe('testFile', () => {
    it('should return empty error and warnings if no rule is applied', async () => {
      const { errors, warnings } = await testFile('/my/file.txt', [], {})
      expect(errors).toStrictEqual({})
      expect(warnings).toStrictEqual({})
    })

    it('should properly call each rule', async () => {
      const file = '/my/file.txt'

      const fakeRule = {
        file: (f, { test, lint, config }) => {
          expect(f).toBe(file)
          expect(test).toEqual(expect.any(Function))
          expect(lint).toEqual(expect.any(Function))
          expect(config).toStrictEqual({})
        },
      }

      await testFile(file, [fakeRule], { config })
    })
  })

  describe('testHtmlFile', () => {
    const file = '/my/file.html'

    const deps = {
      parseHtml: (f) => {
        expect(f).toBe(file)
        return {
          results: {},
          $attributes: {},
        }
      },
    }
    let testHtmlFile

    beforeEach(() => {
      testHtmlFile = testHtmlFileFactory(deps)
    })

    it('should return empty error and warnings if no rule is applied', async () => {
      const { errors, warnings } = await testHtmlFile(file, [], {})
      expect(errors).toStrictEqual({})
      expect(warnings).toStrictEqual({})
    })

    it('should properly call each rule', async () => {
      const fakeRule = {
        html: (payload, { test, lint, config }) => {
          expect(payload).toStrictEqual({})
          expect(test).toEqual(expect.any(Function))
          expect(lint).toEqual(expect.any(Function))
          expect(config).toStrictEqual({})
        },
      }

      await testHtmlFile(file, [fakeRule], { config })
    })

    it('should collect errors and warnings messages', async () => {
      const mockTestRunner = () => {
        throw new Error('Error')
      }

      const errorRule = {
        name: 'fakeRule',
        html: (payload, { test, lint }) => {
          test(mockTestRunner)
          lint(mockTestRunner)
        }
      }

      const { errors, warnings } = await testHtmlFile(file, [errorRule], {})

      expect(errors).toHaveProperty('fakeRule')
      expect(errors.fakeRule.length).toBe(1)

      expect(warnings).toHaveProperty('fakeRule')
      expect(warnings.fakeRule.length).toBe(1)
    })
  })
})
