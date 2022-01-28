import assert from 'assert'
import fs from 'fs'
import path from 'path'

export const folderRules = [{
  name: 'htaccess',
  description: 'Checks if .htaccess is present',
  run: (folder, { lint }) => {
    lint(
      assert.ok,
      fs.existsSync(path.join(folder, '.htaccess')),
      'No .htaccess found',
    )
  },
}, {
  name: 'robots',
  description: 'Checks presence of robots.txt',
  run: (folder, { lint }) => {
    console.log(path.join(folder, 'robots.txt'))
    lint(
      assert.strictEqual,
      fs.existsSync(path.join(folder, 'robots.txt')),
      true,
      'No robots.txt found',
    )
  }
}]
