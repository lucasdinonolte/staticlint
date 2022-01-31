# und Check

CLI tool to check the output of a static site generator for common errors.

## Setup
### 1. Install package
via NPM
```bash
$ npm install @und-pohlen/und-check@0.1.0
```
or YARN
```bash
$ yarn add @und-pohlen/und-check@0.1.0
```

### 2. Add a script to `package.json`
```json
"test": "und-check BUILD_FOLDER --config=./und-check.config.js",
```
Replace `BUILD_FOLDER` with the path to your final build directory.

### 3. Add config
Add `und-check.config.js` to your project root. (See below for details about the config.)

`und-check.config.js` is expected to be an ES module (`export` syntax). So
depending on your project, you might need to use the `.mjs` file extension.

## Usage
```bash
$ und-check ./dist --host="https://example.com/"
```

## Goal
- A simple to use CLI to check for common errors.
- Should return suitable exit codes, so it could stop the build, when run in CI
- Should distinguish errors (severe, like a missing title tag) and warnings (annoying but not bad, like a stop word in the title tag)
- Should be configurable through a config file at the project's root
- Should allow users to inject their own tests via the config file

## Configuration File
```js
// und-check.config.js in your project root
export default {
  // Production URL
  // Heads up, if script is run with --host flag this will be overridden
  host: 'https://example.com/',

  // Specify rules to ignore
  ignoreRules: [],

  // Create custom rules
  customRules: {
    folder: [],
    html: [],
  },

  // Output both errors and warnings
  display: ['errors', 'warnings'],
}
```
