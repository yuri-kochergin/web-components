import {registerRoot, registerStyles, unregisterRoot} from '.'
import {sheetsRegistry} from './registry'

test('append styles to document head', () => {
  const sheet = ':root { background-color: white; }'

  registerStyles(sheet)
  registerRoot()

  const headStyle = document.head.querySelector('style')

  expect(headStyle?.textContent).toBe(sheet)

  unregisterRoot()
})

test('append styles to some element', () => {
  const sheet = ':host { background-color: black; }'
  const root = document.createElement('div')

  document.body.append(root)

  registerStyles(sheet)
  registerRoot(root)

  const headStyle = document.head.querySelector('style')
  const rootStyle = root.querySelector('style')

  expect(headStyle).toBeNull()
  expect(rootStyle?.textContent).toBe(sheet)

  unregisterRoot(root)
})

test('register multiple roots for same sheets', () => {
  const sheet = ':host { background-color: red; }'
  const root = document.createElement('div')
  const customRoot = document.createElement('div')

  document.body.append(root)
  document.body.append(customRoot)

  registerStyles(sheet)
  registerRoot(root)
  registerRoot(customRoot)

  const headStyle = document.head.querySelector('style')
  const rootStyle = root.querySelector('style')
  const customRootStyle = customRoot.querySelector('style')

  expect(headStyle).toBeNull()
  expect(rootStyle?.textContent).toBe(sheet)
  expect(customRootStyle?.textContent).toBe(sheet)

  unregisterRoot(root)
  unregisterRoot(customRoot)
})

afterEach(() => {
  sheetsRegistry.clear()
})
