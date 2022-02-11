import assert from 'assert'

export default {
  name: 'html.meta.viewport',
  description: 'Checks for meta viewport tag',
  html: (payload, { test }) => {
    const viewport = payload.meta.find((m) => m.name === 'viewport')
      
    test(
      assert.notStrictEqual,
      viewport,
      undefined,
      'There should be a meta viewport tag on the page',
    )

    if (!viewport) return

    test(
      assert.ok,
      !!viewport.content,
      'Meta Viewport should have a content attribute',
    )

    if (!viewport.content) return

    test(
      assert.ok,
      viewport.content.includes('width=device-width'),
      'Meta viewport content should include width=device-width',
    )

    test(
      assert.ok,
      viewport.content.includes('initial-scale=1'),
      'Meta viewport content should include initial-scale=1',
    )
  },
}
