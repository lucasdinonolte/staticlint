import http from 'http'
import https from 'https'

import { isValidUrl } from './string.js'

const checkLink = (link) => {
  const protocol = link.startsWith('https') ? https : http

  return new Promise((resolve) => {
    if (!isValidUrl(link)) resolve(false)

    protocol
      .get(link, (res) => {
        resolve(res.statusCode)
      })
      .on('error', () => {
        resolve(false)
      })
  })
}

export { checkLink }
