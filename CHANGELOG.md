# Change Log

This project adheres to [Semantic Versioning](http://semver.org/).

## Unreleased

### Added
- feat: improve developer experience of scaffold command by adding an interactive prompt

### Fixed
- fix: read staticlint version from package.json
- fix: add descriptions for all rules

## 0.2.0

### Added
- feat: ignore files from linting using a glob in the config
- feat: html.linkText rule to validate that links have discernable text or an aria-label describing them

## 0.1.1
- fix: explitily check that file to check is not a directory so directories with file extensions in their name do not crash the linter

## 0.1.0
- Initial public release after some minor private versions
