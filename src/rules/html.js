import assert from 'assert'
import urlExists from 'url-exists-nodejs'

const cleanString = (str) =>
  str
    .toLowerCase()
    .replace('|', '')
    .replace('-', '')
    .replace('.', '')
    .replace(':', '')
    .replace('!', '')
    .replace('?', '')

export const htmlRules = [{
  name: 'html.lang',
  description: 'Validates the presence of a lang attribute on the html tag',
  html: (payload, { test }) => {
    const html = payload.html
    if (html.length !== 1) return

    test(
      assert.ok,
      !!html[0].lang,
      'Lang attribute should be present on HTML tag',
    )
  },
}, {
  name: 'html.title',
  description: 'Checks if a title tag is present',
  html: (payload, { test, lint }) => {
    const titles = payload.title

    // Test for presence of one and only one title tag
    test(
      assert.strictEqual,
      titles.length,
      1,
      `There should be one title tag. Found ${titles.length}.`,
    )

    if (titles.length !== 1) return

    test(
      assert.strictEqual,
      titles[0].innerText,
      titles[0].innerHTML,
      'Title tag should not contain other tags',
    )

    test(
      assert.notStrictEqual,
      titles[0].innerText.length,
      0,
      'Title tag should not be empty',
    )

    lint(
      assert.ok,
      titles[0].innerText.length > 10,
      'This title tag is shorter than the recommended minimum limit of 10.',  
    )

    lint(
      assert.ok,
      titles[0].innerText.length < 70,
      'This title tag is longer than the recommended limit of 70.',
    )

    test(
      assert.ok,
      titles[0].innerText.length < 200,
      `Something could be wrong this title tag is over 200 chars. : ${titles[0].innerText}`,
    )

    const stopWords = ['a', 'and', 'but', 'so', 'on', 'or', 'the', 'was', 'with']
    stopWords.forEach((sw) => {
      lint(
        assert.ok,
        titles[0].innerText.toLowerCase().indexOf(` ${sw} `),
        `Title tag includes stopword ${sw}`,
      )
    })
  },
}, {
  name: 'html.meta.viewport',
  description: 'Checks for meta viewport tag',
  html: (payload, { test }) => {
    const viewport = payload.meta.find((m) => m.name === 'viewport')
      
    test(
      assert.notStrictEqual,
      viewport,
      undefined,
      'There should be a meta viewport tag on the page',
    )

    if (!viewport) return

    test(
      assert.ok,
      !!viewport.content,
      'Meta Viewport should have a content attribute',
    )

    test(
      assert.ok,
      viewport.content.includes('width=device-width'),
      'Meta viewport content should include width=device-width',
    )

    test(
      assert.ok,
      viewport.content.includes('initial-scale=1'),
      'Meta viewport content should include initial-scale=1',
    )
  },
}, {
  name: 'html.meta.description',
  description: 'Validates presence of meta description',
  html: (payload, { test, lint }) => {
    const metas = payload.meta.filter((m) => m.name && m.name.toLowerCase() === 'description')

    test(
      assert.strictEqual,
      metas.length,
      1,
      `There should be 1 meta description. Found ${metas.length}`,
    )

    if (metas.length !== 1) return

    test(
      assert.ok,
      metas[0] && metas[0].content,
      'Meta description content="" should not be missing.',
    )

    test(
      assert.notStrictEqual,
      metas[0].content.length,
      0,
      'Meta description should not be empty',
    )

    lint(
      assert.ok,
      metas[0].content.length > 10,
      `This meta description is shorter than the recommended minimum limit of 10. (${metas[0].content})`,
    )

    lint(
      assert.ok,
      metas[0].content.length < 120,
      `This meta description is longer than the recommended limit of 120. ${metas[0].content.length} (${metas[0].content})`,
    )

    test(
      assert.ok,
      metas[0].content.length < 300,
      `Investigate this meta description. Something could be wrong as it is over 300 chars: ${metas[0].content}`,
    )

    if (payload.title[0]) {
      const titleArr = cleanString(payload.title[0].innerText)
        .split(' ')
        .filter((i) => [':', '|', '-'].indexOf(i) === -1)

      const compareArr = cleanString(metas[0].content)
        .split(' ')
        .filter((i) => [':', '|', '-'].indexOf(i) === -1)

      const matches = titleArr.filter((t) => compareArr.indexOf(t) !== -1)

      lint(
        assert.ok,
        matches.length >= 1,
        'Meta description should include at least 1 of the words in the title tag.',
      )
    }
  },
}, {
  name: 'html.img.alt',
  description: 'Validates presence of alt tags for all images',
  html: (payload, { test }) => {
    payload.imgs.forEach((i) => {
      test(
        assert.ok,
        i.alt && i.alt.length > 0,
        `Images should have alt tags. ${i.src} does not`,
      )
    })
  },
}, {
  name: 'html.brokenLinks',
  description: 'Checks if all external links are working',
  html: async (payload, { test, config }) => {
    const external = payload.aTags.filter((l) => (l.href.includes('http') && !l.href.includes(config.host)))

    for (let i = 0; i < external.length; i++) {
      const l = external[i]
      const exists = await urlExists(l.href) 
      test(
        assert.ok,
        exists,
        `External URL ${l.href} does not seem to be online`,
      )
    }
  },
}, {
  name: 'html.missingImages',
  description: 'Checks for missing external images',
  html: async (payload, { test, config }) => {
    const external = payload.imgs.filter((i) => (i.src.includes('http') && !i.src.includes(config.host)))

    for (let i = 0; i < external.length; i++) {
      const l = external[i]

      const exists = await urlExists(l.src) 
        
      test(
        assert.ok,
        exists,
        `External image ${l.src} does not seem to be online`,
      )
    }
  },
}, {
  name: 'html.maxOutboundLinks',
  descriptions: 'Checks if there are a lot of outbound links on a page',
  html: (payload, { lint, config }) => {
    const external = payload.aTags.filter((l) => (l.href.includes('http') && !l.href.includes(config.host)))

    lint(
      assert.ok,
      external.length < 50,
      `This page contains a lot of outbound links (${external.length})`,
    )
  },
}, {
  name: 'html.favicon',
  description: 'Checks if favicon is set',
  html: (payload, { test }) => {
    const favicons = payload.linkTags.filter(l => l.rel === 'shortcut icon')

    test(
      assert.strictEqual,
      favicons.length,
      1,
      `There should be 1 shortcut icon (favicon) link tag. Found ${favicons.length}`,
    )
  },
}, {
  name: 'html.internalLinks',
  descriptions: 'Checks if internal links are well formated',
  html: (payload, { lint, test, config }) => {
    const internal = payload.aTags.filter((l) => (l.href.includes(config.host) || !l.href.includes('http')))
      .map((l) => {
        if (l.href.includes('#')) l.href = l.href.split('#')[0]
        return l
      })
      .filter((l) => !l.href.includes('mailto') && !l.href.includes('tel:') && l.href.length > 0)

    if (internal.length === 0) return

    internal.forEach((l) => {
      // Internal Links should be lowercased
      test(
        assert.ok,
        l.href === l.href.toLowerCase(),
        `Links should be lowercase. [${l.innerText}](${l.href}) is not`,
      )

      // Internal Links should end with a trailing slash
      lint(
        assert.ok,
        l.href.endsWith('/'),
        `Internal links should include a trailing slash. [${l.innerText}](${l.href}) does not`,
      )

      // Internal links should not include a nofollow rel
      test(
        assert.ok,
        !l.rel?.includes('nofollow'),
        `Internal links should not include a nofollow rel. [${l.innerText}](${l.href}) does`,
      )
    })
  },
}, {
  name: 'html.noVideo',
  description: 'Warns if self hosted video is found',
  html: (payload, { lint, config }) => {
    const internal = payload.videos.filter((v) => (v.src.includes(config.host) || !v.src.includes('http')))

    lint(
      assert.strictEqual,
      internal.length,
      0,
      'Self-hosting videos is probably not a good idea. Maybe consider using a service like vimeo.',
    )
  },
}]
