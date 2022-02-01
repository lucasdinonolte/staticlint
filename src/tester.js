import cheerio from 'cheerio'

import fs from 'fs'
import path from 'path'

import { defaultConfig } from './defaultConfig.js'

/**
 * Utility to get dom nodes from a cheerio object
 *
 * @param instance of cheerio
 * @param queryselector to search for
 */
const $attributes = function($, search) {
  const arr = []
  $(search).each(function () {
    const namespace = $(this)[0].namespace
    if (!namespace || namespace.includes('html')) {
      const out = {
        tag: $(this)[0].name,
        innerHTML: $(this).html(),
        innerText: $(this).text(),
      }

      if ($(this)[0].attribs) {
        Object.entries($(this)[0].attribs).forEach((attr) => {
          out[attr[0].toLowerCase()] = attr[1]
        })
      }

      arr.push(out)
    }
  })
  return arr
}

/**
 * Factory function to make a test runner that logs
 * depending on its severity.
 *
 * @param name of the rule
 * @param severity to log to
 */
const makeTestRunner = (name, severity) => {
  return (testFunction, ...params) => {
    try {
      testFunction(...params)
    } catch(e) {
      if (!severity.hasOwnProperty(name)) severity[name] = []
      severity[name].push(e.message)
    }
  }
}

const testFolder = function(folder, config) {
  const errors = {}
  const warnings = {}


  const runRule = (rule) => {
    const name = rule.name

    const test = makeTestRunner(name, errors)
    const lint = makeTestRunner(name, warnings)
    rule.run(folder, { test, lint, config })
  }

  [config.rules.folder, config.customRules.folder].flat().map((rule) => {
    if (!config.ignoreRules.includes(rule.name)) runRule(rule)
  })

  return { errors, warnings }
}

/**
 * This only takes an HTML string and does not read from the file itself
 * to be more encapsulated and easier to test.
 *
 * @param HTML string to test
 * @param und-check configuration object
 */
const testFile = async (html, { config, cache }) => {
  const errors = {}
  const warnings = {}

  const $ = cheerio.load(html)

  // TODO: Refactor: Expose a helper function to tests instead of prebuilding
  // the payload. This makes future tests more flexible and less dependend on
  // the cache that is built here.  
  //
  // Helper function could still keep in-memory cache of already looked up
  // elements per file.
  const results = {
    html: $attributes($, 'html'),
    title: $attributes($, 'title'),
    meta: $attributes($, 'head meta'),
    ldjson: $attributes($, 'script[type="application/ld+json"]'),
    h1s: $attributes($, 'h1'),
    h2s: $attributes($, 'h2'),
    h3s: $attributes($, 'h3'),
    h4s: $attributes($, 'h4'),
    h5s: $attributes($, 'h5'),
    h6s: $attributes($, 'h6'),
    canonical: $attributes($, '[rel="canonical"]'),
    imgs: $attributes($, 'img'),
    videos: $attributes($, 'video'),
    aTags: $attributes($, 'a'),
    linkTags: $attributes($, 'link'),
    ps: $attributes($, 'p'),
  }

  // Refactor: This could be a global factory function that accepts a callback
  const runRule = async (rule) => {
    const name = rule.name

    const test = makeTestRunner(name, errors)
    const lint = makeTestRunner(name, warnings)
    await rule.run(results, { test, lint, config, cache })
  }

  const rulesToRun = [config.rules.html, config.customRules.html].flat()

  for (let i = 0; i < rulesToRun.length; i++) {
    const rule = rulesToRun[i]
    if (!config.ignoreRules.includes(rule.name)) await runRule(rule)
  }

  return { errors, warnings }
}

export { makeTestRunner, testFile, testFolder }
