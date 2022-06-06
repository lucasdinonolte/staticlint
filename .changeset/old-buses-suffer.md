---
'staticlint': major
---

BREAKING: Allow severity per rule to be set in configuration. If you use the
`rules` setting in your configuration you need to migrate from
earlies releases by refactoring the `rules` section of your configuration file to
be an object of `rule name` (key) and `severity` ('error' or 'warning') as
value.

```javascript
rules: {
  ...
  'html.favicon': 'error',
  'html.lang': 'warning',
  ...
}
```
