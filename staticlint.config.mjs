export default {
  // Production URL
  // Heads up: If you run the CLI with --host flag it will override this
  host: 'https://example.com', 

  // Specify files to ignore
  // accepts glob paths
  ignoreFiles: [],

  // Rules to ignore
  ignoreRules: ['html.favicon', 'html.img.alt', 'html.internalLinks', 'html.lang', 'html.linkText', 'html.maxOutboundLinks', 'html.meta.description', 'html.meta.viewport', 'html.noVideo', 'html.title', 'html.tabindex', 'seo.canonical', 'seo.headings', 'seo.uniqueTitle', 'file.maxImageSize'], 

  // Create custom rules
  customRules: [], 

  // Output 'errors' and 'warnings'
  display: ['errors', 'warnings'],

  // If 'errors' or 'warnings' occur let the CLI exit with an error exit code
  // This will stop your build in a CI and prevent a broken site
  // from being deployed.
  failOn: ['errors', 'warnings'], 
}