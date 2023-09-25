# Change Log

This project adheres to [Semantic Versioning](http://semver.org/).

## UNRELEASED

## 1.0.0-rc9

### Fixed

- Prevent missing image rule from failing if no src attribute is present
- Prevent missing image rule from failing if src is inline base64 string containing the character sequence `http`

### Changed

- Only output files that have errors or warning (depending on the output display mode)

## 1.0.0-rc8

### Fixed

- Prevent title length rules from failing for missing title tags

## 1.0.0-rc7

### Added

- adds a rule that checks for explicit width and height on image tags in order to prevent layout shifts.

### Fixed

- fixed merging of user config with default config. Rules are merged, for all other options the user config is overwriting the default configuration.
- broken link rule no longer fails for a tag without href

## 1.0.0-rc6

### Changed

- refactor: test runs are now somewhat parallelized using `Promise.all`

## 1.0.0-rc5

### Added
- feat: improve developer experience of scaffold command by adding an interactive prompt

### Fixed
- fix: read staticlint version from package.json
- fix: add descriptions for all rules

## 0.2.1

### Fixed
- fix: turn lodash.memoize into a dependency

## 0.2.0

### Added
- feat: ignore files from linting using a glob in the config
- feat: html.linkText rule to validate that links have discernable text or an aria-label describing them

## 0.1.1
- fix: explitily check that file to check is not a directory so directories with file extensions in their name do not crash the linter

## 0.1.0
- Initial public release after some minor private versions
