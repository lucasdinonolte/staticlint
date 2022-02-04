import assert from 'assert'
import fs from 'fs'
import path from 'path'

export const folderRules = [{
  name: 'folder.sitemap',
  description: 'Validates presence of sitemap.xml',
  folder: (folder, { test }) => {
    test(
      assert.ok,
      fs.existsSync(path.join(folder, 'sitemap.xml')),
      'No sitemap.xml found',
    )
  },
}, {
  name: 'folder.htaccess',
  description: 'Checks if .htaccess is present',
  folder: (folder, { lint }) => {
    lint(
      assert.ok,
      fs.existsSync(path.join(folder, '.htaccess')),
      'No .htaccess found',
    )
  },
}, {
  name: 'folder.robots',
  description: 'Checks presence of robots.txt',
  folder: (folder, { lint }) => {
    lint(
      assert.strictEqual,
      fs.existsSync(path.join(folder, 'robots.txt')),
      true,
      'No robots.txt found',
    )
  },
}]
