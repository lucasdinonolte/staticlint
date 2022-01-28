#!/usr/bin/env node

import sade from 'sade'
import glob from 'glob'
import path from 'path'
import fs from 'fs'

import { testFolder, testFile } from './index.js'

sade('und-check <dir>', true)
  .version('0.0.1')
  .describe('Checks the output of a SSG for common issues.')
  .action((dir) => {
    const errors = []
    const warnings = []

    const files = {}

    // First check if the folder exists
    if (!fs.existsSync(dir)) {
      process.exit(1)
    }
    
    // Then run the folder tests
    const folderResults = testFolder(dir) 
    files[dir] = { errors: folderResults.errors, warnings: folderResults.warnings }
    
    // Next find all html files
    const htmlFiles = glob.sync(path.join(dir, '**/*.html')) 
    
    // Run the file tests on all html files
    htmlFiles.forEach((file) => {
      const fileResults = testFile(file)
      files[file] = { errors: fileResults.errors, warnings: fileResults.warnings }
    })

    // Output the errors and warnings
    // TODO: Make nicer
    for (let i = 0; i < Object.keys(files).length; i++) {
      const key = Object.keys(files)[i]
      const file = files[key]

      console.log(key)
      console.log(file.errors)
      console.log(file.warnings)
      console.log('')
    }

    // Exit accordingly
    if (errors.length > 0) process.exit(1) 
  })
  .parse(process.argv)
