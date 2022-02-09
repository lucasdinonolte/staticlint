import assert from 'assert'

export default {
  name: 'seo.uniqueTitle',
  description: 'Validates that every title is only used once',
  html: (payload, { test, cache }) => {
    const titles = payload.title
    if (titles.length !== 1) return
  
    const title = titles[0].innerText
    
    test(
      assert.ok,
      !cache.includes('seo.uniqueTitle', title),
      `Each page should have a unique titles. "${title}" is used multiple times`,
    )

    cache.push('seo.uniqueTitle', title)
  },
}
