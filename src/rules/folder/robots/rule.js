import assert from 'assert'
import fs from 'fs'
import path from 'path'

export default {
  name: 'folder.robots',
  description: 'Checks presence of robots.txt',
  folder: (folder, { test }, deps = { path, fs }) => {
    test(
      assert.strictEqual,
      deps.fs.existsSync(deps.path.join(folder, 'robots.txt')),
      true,
      'No robots.txt found',
    )
  },
}
