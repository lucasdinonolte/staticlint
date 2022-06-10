import assert from 'assert'

export default {
  name: 'html.maxOutboundLinks',
  description: 'Checks if there are a lot of outbound links on a page',
  html: (payload, { test, config }) => {
    const external = payload.aTags.filter(
      (l) => l.href.includes('http') && !l.href.includes(config.host),
    )

    test(
      assert.ok,
      external.length < 50,
      `This page contains a lot of outbound links (${external.length})`,
    )
  },
}
