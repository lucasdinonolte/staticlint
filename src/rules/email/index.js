import {
  scriptTag,
  externalStyle,
  styleBody,
  tableAttributes,
  html5Tags,
  htmlFileSize,
} from './html/rule.js'

import { absoluteLinks } from './links/rule.js'
import { imgDimensions } from './images/rule.js'

export default [
  imgDimensions,
  absoluteLinks,
  scriptTag,
  externalStyle,
  styleBody,
  tableAttributes,
  html5Tags,
  htmlFileSize,
]
