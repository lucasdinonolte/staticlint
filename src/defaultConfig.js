import htmlRules from './rules/html/index.js'
import seoRules from './rules/seo/index.js'
import folderRules from './rules/folder/index.js'
import fileRules from './rules/files/index.js'
import { ERRORS, WARNINGS } from './constants.js'

export const defaultConfig = {
  host: null,
  ignoreFiles: [],
  ignoreRules: [],
  customRules: [],
  rules: [folderRules, htmlRules, seoRules, fileRules].flat(),
  display: [ERRORS, WARNINGS],
  failOn: [ERRORS],
}
