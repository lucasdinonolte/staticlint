import cheerio from 'cheerio'

import fs from 'fs'
import path from 'path'

import { htmlRules } from './rules/html.js'
import { folderRules } from './rules/folder.js'
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

const testFolder = function(folder, ignoreRules = [], addRules = []) {
  const errors = {}
  const warnings = {}

  const runRule = (rule) => {
    const name = rule.name

    const test = makeTestRunner(name, errors)
    const lint = makeTestRunner(name, warnings)
    rule.run(folder, { test, lint })
  }

  [folderRules, addRules].flat().map((rule) => {
    if (!ignoreRules.includes(rule.name)) runRule(rule)
  })

  return { errors, warnings }
}

const testFile = function(file, ignoreRules = [], addRules = []) {
  const errors = {}
  const warnings = {}

  const html = fs.readFileSync(path.resolve(file), 'utf-8')
  const $ = cheerio.load(html)

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
    aTags: $attributes($, 'a'),
    linkTags: $attributes($, 'link'),
    ps: $attributes($, 'p'),
  }

  const runRule = (rule) => {
    const name = rule.name

    const test = makeTestRunner(name, errors)
    const lint = makeTestRunner(name, warnings)
    rule.run(results, { test, lint })
  }

  [htmlRules, addRules].flat().map((rule) => {
    if (!ignoreRules.includes(rule.name)) runRule(rule)
  })

  return { errors, warnings }
}

export { makeTestRunner, testFile, testFolder }
