import htmlRules from './rules/html/index.js'
import seoRules from './rules/seo/index.js'
import folderRules from './rules/folder/index.js'
import fileRules from './rules/files/index.js'

export const allRules = [htmlRules, seoRules, folderRules, fileRules].flat()

export const getRuleByName = (name) => {
  const rule = allRules.find((r) => r.name === name)

  if (!rule) {
    throw new Error(`Rule ${name} does not exist`)
  }

  return rule
}
