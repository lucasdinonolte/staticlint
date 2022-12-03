import http from 'http'
import https from 'https'

import { isValidUrl } from './string.js'

const checkLink = (link) => {
  const protocol = link.startsWith('https') ? https : http

  return new Promise((resolve) => {
    if (!isValidUrl(link)) resolve(false)

    protocol
      .get(link, (res) => {
        const statusCode = res.statusCode
        resolve(typeof statusCode === 'number' && statusCode < 400)
      })
      .on('error', () => {
        resolve(false)
      })
  })
}

export { checkLink }
