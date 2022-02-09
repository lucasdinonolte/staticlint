import assert from 'assert'
import fs from 'fs'
import path from 'path'

export default {
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
}
