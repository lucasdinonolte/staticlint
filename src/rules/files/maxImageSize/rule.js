import assert from 'assert'
import fs from 'fs'

const fileSizeInKilobytes = (file) => {
  const { size } = fs.statSync(file)
  return size / 1024
}

export default {
  name: 'file.maxImageSize',
  description: 'Warns if included images are above 500kb in size',
  files: '**/*.{jpg,jpeg,png,gif,webp}',
  file: (file, { test }) => {
    const size = fileSizeInKilobytes(file)

    test(
      assert.ok,
      size < 500,
      `This image is pretty big (${Math.round(size * 100) / 100} kb).`,
    )
  },
}
