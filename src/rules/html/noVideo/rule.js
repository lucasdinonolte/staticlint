import assert from 'assert'

export default {
  name: 'html.noVideo',
  description: 'Warns if self hosted video is found',
  html: (payload, { test, config }) => {
    const internal = payload.videos.filter(
      (v) => v.src.includes(config.host) || !v.src.includes('http'),
    )

    test(
      assert.strictEqual,
      internal.length,
      0,
      'Self-hosting videos is probably not a good idea. Maybe consider using a service like vimeo.',
    )
  },
}
