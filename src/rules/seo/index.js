import canonical from './canonical/rule.js'
import {
  headingsHasH1,
  headingNotEmpty,
  headingsIdealLength,
  headingsLevels,
} from './headings/rule.js'
import uniqueTitle from './uniqueTitle/rule.js'
import uniqueCanonical from './uniqueCanonical/rule.js'

export default [
  canonical,
  headingsHasH1,
  headingNotEmpty,
  headingsIdealLength,
  headingsLevels,
  uniqueTitle,
  uniqueCanonical,
]
