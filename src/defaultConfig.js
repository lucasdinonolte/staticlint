import { htmlRules } from './rules/html.js'
import { seoRules } from './rules/seo.js'
import { folderRules } from './rules/folder.js'
import { fileRules } from './rules/files.js'
import { ERRORS, WARNINGS } from './constants.js'

export const defaultConfig = {
  host: null,
  ignoreRules: [],
  customRules: [],
  rules: [folderRules, htmlRules, seoRules, fileRules].flat(),
  display: [ERRORS, WARNINGS],
  failOn: [ERRORS],
}
