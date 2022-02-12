import assert from 'assert'
import fs from 'fs'
import path from 'path'

export default {
  name: 'folder.sitemap',
  description: 'Validates presence of sitemap.xml',
  folder: (folder, { test }, deps = { path, fs }) => {
    test(
      assert.ok,
      deps.fs.existsSync(deps.path.join(folder, 'sitemap.xml')),
      'No sitemap.xml found',
    )
  },
}
