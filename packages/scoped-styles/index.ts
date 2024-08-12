/* eslint-disable import/no-unused-modules */

class StyleSheet {
  content: string
  element?: HTMLStyleElement

  constructor(content: string) {
    this.content = content
  }
}

let sheetsRegistry: StyleSheet[] = []
let stylesRoot: HTMLElement | undefined

function injectStyles() {
  if (stylesRoot) {
    const fragment = document.createDocumentFragment()

    sheetsRegistry.forEach((sheet) => {
      if (!sheet.element) {
        sheet.element = document.createElement('style')
        sheet.element.textContent = sheet.content
        fragment.append(sheet.element)
      }
    })

    stylesRoot.append(fragment)
  }
}

/**
 * Register scoped style sheets
 *
 * ```tsx
 * // using css-loader exportType 'string'
 * import sheets, * as styles from './styles.module.css'
 *
 * registerStyles(sheets)
 *
 * class Container extends HTMLElement {
 *   connectedCallback() {
 *     const shadowRoot = this.attachShadow({mode: 'open'})
 *     shadowRoot.innerHTML = `
 *       <div class=${styles.container}>
 *         ...
 *       </div>
 *     `
 *   }
 * }
 * ```
 */
export function registerStyles(...sheets: string[]) {
  sheets.forEach((content) => {
    const isExists = sheetsRegistry.some((sheet) => sheet.content === content)

    if (!isExists) {
      sheetsRegistry.push(new StyleSheet(content))
    }
  })

  injectStyles()
}

/**
 * Register scoped root and inject styles
 *
 * ```tsx
 * class App extends HTMLElement {
 *   connectedCallback() {
 *     const shadowRoot = this.attachShadow({mode: 'open'})
 *     registerRoot(shadowRoot)
 *   }
 * }
 * ```
 */
export function registerRoot(root: HTMLElement = document.head) {
  stylesRoot = root

  injectStyles()
}

/**
 * Unregister scoped root and remove styles
 */
export function unregisterRoot(root: HTMLElement = document.head) {
  if (stylesRoot === root) {
    stylesRoot = undefined

    sheetsRegistry.forEach((sheet) => {
      sheet.element?.remove()
    })

    sheetsRegistry = []
  }
}
