const hasKey = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key)

/**
 * Checks if an element is hidden from the accessiblity tree
 *
 * See https://allyjs.io/tutorials/hiding-elements.html
 */
export const isHidden = (element) => {
  if (hasKey(element, 'hidden')) return true
  if (element.style && element.style.display === 'none') return true
  if (element.style && element.style.visibility === 'hidden') return true
  if (element['aria-hidden'] === 'true') return true
  return false
}
