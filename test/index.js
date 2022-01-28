import { testFile, testFolder } from '../src/index.js'
import assert from 'assert'

console.log(testFolder('./fixtures/public', ['robots']))
console.log(testFile('./fixtures/01-sample.html', ['img.alt'], [{
  name: 'custom.rule',
  run: (payload, { test, lint }) => {
    test(
      assert.strictEqual,
      1,
      2,
      'Custom Rule Error',
    )

    lint(
      assert.strictEqual,
      1,
      2,
      'Custom Rule Warning',
    )
  }
}]))
