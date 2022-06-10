import brokenLinks from './brokenLinks/rule.js'
import favicon from './favicon/rule.js'
import { imgAltPresent, imgAltNotEmpty } from './imgAlt/rule.js'
import {
  internalLinksLowercase,
  internalLinksTrailinsSlash,
  internalLinksNoFollow,
} from './internalLinks/rule.js'
import lang from './lang/rule.js'
import linkText from './linkText/rule.js'
import maxOutboundLinks from './maxOutboundLinks/rule.js'
import {
  metaDescriptionPresent,
  metaDescriptionMaxLength,
  metaDescriptionIdealLength,
  metaDescriptionTitle,
} from './metaDescription/rule.js'
import metaViewport from './metaViewport/rule.js'
import missingImages from './missingImages/rule.js'
import noVideo from './noVideo/rule.js'
import tabIndex from './tabindex/rule.js'
import {
  titlePresent,
  titleMaxLength,
  titleIdealLength,
  titleStopWords,
} from './title/rule.js'

export default [
  brokenLinks,
  favicon,
  imgAltPresent,
  imgAltNotEmpty,
  internalLinksLowercase,
  internalLinksNoFollow,
  internalLinksTrailinsSlash,
  lang,
  linkText,
  maxOutboundLinks,
  metaDescriptionPresent,
  metaDescriptionMaxLength,
  metaDescriptionIdealLength,
  metaDescriptionTitle,
  metaViewport,
  missingImages,
  noVideo,
  tabIndex,
  titlePresent,
  titleIdealLength,
  titleMaxLength,
  titleStopWords,
]
