#!/usr/bin/env node

import sade from 'sade'
import path from 'path'
import fs from 'fs'

import { makeTestRunner, testFile } from './index.js'

sade('und-check <dir>', true)
  .version('0.0.1')
  .describe('Checks the output of a SSG for common issues.')
  .action((dir) => {
    const errors = {}
    const warnings = {}
  })
  .parse(process.argv)
