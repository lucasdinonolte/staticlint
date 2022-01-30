import { htmlRules } from './rules/html.js'
import { seoRules } from './rules/seo.js'
import { folderRules } from './rules/folder.js'

export const defaultConfig = {
  host: null,
  ignoreRules: [],
  customRules: {
    folder: [],
    html: [],
  },
  rules: {
    folder: folderRules,
    html: [htmlRules, seoRules].flat(),
  },
  display: ['error', 'warning'],
}
