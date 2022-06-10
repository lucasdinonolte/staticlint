import assert from 'assert'
import fs from 'fs'
import path from 'path'

export default {
  name: 'folder.htaccess',
  description: 'Checks if .htaccess is present',
  folder: (folder, { test }, deps = { fs, path }) => {
    test(
      assert.ok,
      deps.fs.existsSync(deps.path.join(folder, '.htaccess')),
      'No .htaccess found',
    )
  },
}
