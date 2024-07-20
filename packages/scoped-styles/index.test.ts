import {registerRoot, registerStyles, unregisterRoot} from '.'

test('append styles to document head', () => {
  const sheet = ':root { background-color: white; }'

  registerStyles(sheet)
  registerRoot()

  const headStyle = document.head.querySelector('style')

  expect(headStyle?.textContent).toBe(sheet)

  unregisterRoot()
})

test('append styles to some element', () => {
  const sheet = ':host { background-color: white; }'
  const root = document.createElement('div')

  document.body.appendChild(root)

  registerRoot(root)
  registerStyles(sheet)

  const headStyle = document.head.querySelector('style')
  const rootStyle = root.querySelector('style')

  expect(headStyle).toBeNull()
  expect(rootStyle?.textContent).toBe(sheet)

  unregisterRoot(root)
})
