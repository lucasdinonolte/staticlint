# Staticlint

CLI tool to check the output of a static site generator for common errors.

## Setup
### 1. Install package
via NPM
```bash
$ npm install staticlint
```

### 2. Add a script to `package.json`
```json
"test": "staticlint BUILD_FOLDER --config=./staticlint.config.mjs",
```
Replace `BUILD_FOLDER` with the path to your final build directory.

### 3. Add config
Add `staticlint.config.js` to your project root. (See below for details about the config.)

`staticlint.config.js` is expected to be an ES module (`export` syntax). So
depending on your project, you might need to use the `.mjs` file extension.

You can also generate an empty config file using the staticlint CLI in your
project's root.

```bash
$ staticlint scaffold
```


## Usage
```bash
$ staticlint ./dist --host="https://example.com/"
```

## Programmatic Usage
You can also use staticlint from within your own script like so.

```js
import staticlint from 'staticlint'

// See below for config example
const { errors, warnings } = await staticlint('./BUILD_FOLDER', config)
```

## Goal
- A simple to use CLI to check for common errors.
- Should return suitable exit codes, so it could stop the build, when run in CI
- Should distinguish errors (severe, like a missing title tag) and warnings (annoying but not bad, like a stop word in the title tag)
- Should be configurable through a config file at the project's root
- Should allow users to inject their own tests via the config file

## Configuration File
```js
// staticlint.config.js in your project root
export default {
  // Production URL
  // Heads up, if script is run with --host flag this will be overridden
  host: 'https://example.com/',

  // Specify rules to ignore
  ignoreRules: [],

  // Create custom rules
  customRules: [],

  // Output both errors and warnings
  display: ['errors', 'warnings'],

  // Return with an error exit code if errors were found
  failOn: ['errors'],
}
```
