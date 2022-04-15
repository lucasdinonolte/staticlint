import { mergeConfigurations } from '../src/configuration.js'
import { defaultConfig } from '../src/defaultConfig.js'

describe('Configuration', () => {
  it('should return the default config if no external config is provided', async () => {
    expect(await mergeConfigurations(null)).toStrictEqual(defaultConfig)
  })

  it('should override default config with external config', async () => {
    expect(
      await mergeConfigurations('./specs/fixtures/empty.config.js'),
    ).toStrictEqual({
      host: 'https://spec-host.com/',
      ignoreFiles: [],
      ignoreRules: [],
      customRules: [],
      rules: [],
      display: [],
      failOn: [],
    })
  })
})
