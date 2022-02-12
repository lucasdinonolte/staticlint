import assert from 'assert'
import fs from 'fs'
import path from 'path'

export default {
  name: 'folder.htaccess',
  description: 'Checks if .htaccess is present',
  folder: (folder, { lint }, deps = { fs, path }) => {
    lint(
      assert.ok,
      deps.fs.existsSync(deps.path.join(folder, '.htaccess')),
      'No .htaccess found',
    )
  },
}
