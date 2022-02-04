import { htmlRules } from './rules/html.js'
import { seoRules } from './rules/seo.js'
import { folderRules } from './rules/folder.js'
import { ERRORS, WARNINGS } from './constants.js'

export const defaultConfig = {
  host: null,
  ignoreRules: [],
  customRules: [],
  rules: [folderRules, htmlRules, seoRules].flat(),
  display: [ERRORS, WARNINGS],
  failOn: [ERRORS],
}
