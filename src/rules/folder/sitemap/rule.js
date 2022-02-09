import assert from 'assert'
import fs from 'fs'
import path from 'path'

export default {
  name: 'folder.sitemap',
  description: 'Validates presence of sitemap.xml',
  folder: (folder, { test }) => {
    test(
      assert.ok,
      fs.existsSync(path.join(folder, 'sitemap.xml')),
      'No sitemap.xml found',
    )
  },
}
