import assert from 'assert'
import fs from 'fs'
import path from 'path'

export const folderRules = [{
  name: 'folder.htaccess',
  description: 'Checks if .htaccess is present',
  run: (folder, { lint }) => {
    lint(
      assert.ok,
      fs.existsSync(path.join(folder, '.htaccess')),
      'No .htaccess found',
    )
  },
}, {
  name: 'folder.robots',
  description: 'Checks presence of robots.txt',
  run: (folder, { lint }) => {
    lint(
      assert.strictEqual,
      fs.existsSync(path.join(folder, 'robots.txt')),
      true,
      'No robots.txt found',
    )
  }
}]
