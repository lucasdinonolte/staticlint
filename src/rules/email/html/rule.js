import assert from 'assert'

export const scriptTag = {
  name: 'email.html.script',
  description: 'Validates no script tags are being used',
  html: (_, { test, $attributes }) => {
    const scriptTags = $attributes('script')

    test(
      assert.ok,
      scriptTags.length === 0,
      `Script tags should not be used in email markup. Found ${scriptTags.length} script tags.`,
    )
  },
}

export const externalStyle = {
  name: 'email.html.externalStyle',
  description: 'Validates no external stylesheets are used',
  html: (_, { test, $attributes }) => {
    const linkTags = $attributes('link[rel="stylesheet"]')

    test(
      assert.ok,
      linkTags.length === 0,
      `External stylesheets should not be used in email markup. Found ${linkTags.length} external stylesheets.`,
    )
  },
}

export const styleBody = {
  name: 'email.html.styleInBody',
  description:
    'Validates no style tag is inside the body, as GMail does not support this.',
  html: (_, { test, $attributes }) => {
    const styleTags = $attributes('body style')

    test(
      assert.ok,
      styleTags.length === 0,
      `Style tags should not be placed in the body. Found ${styleTags.length} style tags in the body.`,
    )
  },
}

export const tableAttributes = {
  name: 'email.html.tableAttributes',
  description: 'Validates table get the correct attributes',
  html: (_, { test, $attributes }) => {
    const tables = $attributes('table')

    if (tables.length === 0) return

    tables.forEach((table) => {
      test(
        assert.ok,
        table.border === '0',
        'Table tags should have a border attribute of 0 set',
      )

      test(
        assert.ok,
        table.cellspacing === '0',
        'Table tags should have a cellspacing attribute of 0 set',
      )

      test(
        assert.ok,
        table.cellpadding === '0',
        'Table tags should have a cellpadding attribute of 0 set',
      )
    })
  },
}

export const html5Tags = {
  name: 'email.html.htmlTags',
  description: 'Validates no HTML tags are being used',
  html: (_, { test, $attributes }) => {
    const html5Tags = $attributes(
      'article, aside, bdi, details, dialog, figcaption, figure, footer, header, main, mark, menuitem, meter, nav, progress, rp, rt, ruby, section, summary, time, wbr',
    )

    const foundTags = html5Tags.map((t) => t.tag).join(', ')

    test(
      assert.ok,
      html5Tags.length === 0,
      `HTML5 tags should not be used in email markup. Found ${html5Tags.length} (${foundTags}) HTML5 tags.`,
    )
  },
}

export const htmlFileSize = {
  name: 'email.html.fileSize',
  description: 'Validates the HTML file size is below the GMail limit',
  html: (payload, { test }) => {
    const size = Buffer.byteLength(payload.source, 'utf8')
    const GMAIL_LIMIT = 102000

    test(
      assert.ok,
      size < GMAIL_LIMIT,
      `HTML file size should be below the GMail limit of ${
        GMAIL_LIMIT / 1000
      } kB. Found ${size / 1000} kB.`,
    )
  },
}
