import assert from 'assert'

export default {
  name: '___RULE___',
  description: '___DESCRIPTION___',
  html: (payload, { test, config }) => {
    test(assert.strictEqual, 2, 1, 'Error message for failing test')
  },
}
