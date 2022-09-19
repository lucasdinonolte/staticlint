import { it, describe, expect } from 'vitest'
import { isValidUrl } from '../../src/util/string.js'

describe('String Utils', () => {
  describe('isValidUrl', () => {
    it('should return true for valid URLs', () => {
      expect(isValidUrl('http://example.com')).toBe(true)
      expect(isValidUrl('https://example.com')).toBe(true)

      expect(isValidUrl('http://example.com/')).toBe(true)
      expect(isValidUrl('https://example.com/')).toBe(true)

      expect(isValidUrl('http://example.com/subpage')).toBe(true)
      expect(isValidUrl('https://example.com/subpage')).toBe(true)

      expect(isValidUrl('http://example.com/subpage/')).toBe(true)
      expect(isValidUrl('https://example.com/subpage/')).toBe(true)

      expect(isValidUrl('http://example.com/subpage/file.html')).toBe(true)
      expect(isValidUrl('https://example.com/subpage/file.html')).toBe(true)

      expect(isValidUrl('https://designsystems.international/')).toBe(true)

      expect(
        isValidUrl('http://example.com/subpage/file.html?query=string&param=1'),
      ).toBe(true)
      expect(
        isValidUrl(
          'https://example.com/subpage/file.html?query=string&param=1',
        ),
      ).toBe(true)

      expect(
        isValidUrl(
          'http://subdomain.nested.example.com/subpage/file.html?query=string&param=1',
        ),
      ).toBe(true)
      expect(
        isValidUrl(
          'https://subdomain.nestedsubdomain.nested..example.com/subpage/file.html?query=string&param=1',
        ),
      ).toBe(true)
    })

    it('should return false for invalid URLs', () => {
      expect(isValidUrl('example.com')).toBe(false)
      expect(isValidUrl('example.com/')).toBe(false)

      expect(isValidUrl('ftp://example.com')).toBe(false)
      expect(isValidUrl('smpt://example.com/')).toBe(false)

      expect(isValidUrl('http://example')).toBe(false)
      expect(isValidUrl('https://example')).toBe(false)

      expect(isValidUrl('http://example/')).toBe(false)
      expect(isValidUrl('https://example/')).toBe(false)
    })
  })
})
