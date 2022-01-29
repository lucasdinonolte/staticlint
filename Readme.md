# und Check

CLI tool to check the output of a static site generator for common errors.

## Usage
```bash
$ und-check ./dist
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
