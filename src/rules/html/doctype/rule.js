import assert from 'assert'

const DOCTYPE_REGEX = /^<!DOCTYPE/i
const HTML5_DOCTYPE_REGEX = /^<!DOCTYPE html>/i

export const doctypePresent = {
  name: 'html.doctype.present',
  description: 'Checks that HTML starts with a doctype',
  html: (payload, { test }) => {
    test(
      assert.ok,
      !!payload.source.match(DOCTYPE_REGEX),
      'HTML should start with a doctype',
    )
  },
}

export const doctypeHtml5 = {
  name: 'html.doctype.html5',
  description: 'Checks the HTML5 doctype is used',
  html: (payload, { test }) => {
    test(
      assert.ok,
      !!payload.source.match(HTML5_DOCTYPE_REGEX),
      'It is recommended to use the HTML5 doctype',
    )
  },
}
