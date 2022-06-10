---
'staticlint': major
---

BREAKING: Removed `ignoreRules` configuration option. Ignoring rules was merged
with spceifying the severity. If you want to ignore a rule you can set it to
`false` in the `rules` part of your configuration.

```javascript
rules: {
  // Output error
  'html.img.alt': 'error',
  // Output warning
  'html.lang': 'warning',
  // Disable rule
  'html.favicon': false,
}
```
