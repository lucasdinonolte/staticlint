import { jest } from '@jest/globals'
import rule from './rule.js'
import runTestForRule from '../../../util/testRule.js'

describe('html.missingImages', () => {
  let urlExists

  beforeEach(() => {
    urlExists = jest.fn(async (url) => url)
  })

  it('should return an error for a missing external image', async () => {
    urlExists.mockImplementationOnce(() => false)

    let results = await runTestForRule(rule, '<img src="http://broken-link.de/foo.png" alt="broken" />', {}, {}, { urlExists })

    expect(urlExists).toHaveBeenCalledWith('http://broken-link.de/foo.png')
    expect(results.errors.length).toBe(1)
  })

  it('should not return an error for internal images', async () => {
    urlExists.mockImplementationOnce(() => false)
    let results = await runTestForRule(rule, '<img src="https://example.com/foo.png" alt="Foo" /><img src="/foo.png" alt="Foo"/>', { host: 'https://example.com' }, {}, { urlExists })

    expect(urlExists).not.toHaveBeenCalled()
    expect(results.errors.length).toBe(0)
  })
})
