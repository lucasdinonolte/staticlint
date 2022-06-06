import { ERRORS, WARNINGS, ERROR, WARNING } from './constants.js'

export const defaultConfig = {
  host: null,
  ignoreFiles: [],
  ignoreRules: [],
  customRules: [],
  rules: {
    'html.favicon': ERROR,
    'html.lang': ERROR,
  },
  display: [ERRORS, WARNINGS],
  failOn: [ERRORS],
}
