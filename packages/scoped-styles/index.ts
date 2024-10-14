/* eslint-disable import/no-unused-modules */
import {rootsRegistry, sheetsRegistry} from './registry'
import {StyleSheet} from './style-sheet'

function appendStyles(...roots: HTMLElement[]) {
  roots.forEach((root) => {
    const fragment = document.createDocumentFragment()

    sheetsRegistry.forEach((sheet) => {
      sheet.appendTo(root, fragment)
    })

    root.append(fragment)
  })
}

function removeStyles(...roots: HTMLElement[]) {
  roots.forEach((root) => {
    sheetsRegistry.forEach((sheet) => {
      sheet.removeFrom(root)
    })
  })
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
  sheets.forEach((css) => {
    sheetsRegistry.set(css, new StyleSheet(css))
  })

  appendStyles(...rootsRegistry)
}

/**
 * Extract scoped style sheets as string
 *
 * ```tsx
 * const styleSheets = extractStyles()
 *
 * styleSheets.forEach((sheetText) => {
 *   const style = document.createElement('style')
 *   style.textContent = sheetText
 *   document.head.append(style)
 * })
 * ```
 */
export function extractStyles() {
  return Array.from(sheetsRegistry.values()).map((sheet) => sheet.toString())
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
  if (!rootsRegistry.has(root)) {
    rootsRegistry.add(root)
    appendStyles(root)
  }
}

/**
 * Unregister scoped root and remove styles
 *
 * ```tsx
 * class App extends HTMLElement {
 *   disconnectedCallback() {
 *     unregisterRoot(this.shadowRoot)
 *   }
 * }
 * ```
 */
export function unregisterRoot(root: HTMLElement = document.head) {
  if (rootsRegistry.has(root)) {
    rootsRegistry.delete(root)
    removeStyles(root)
  }
}
