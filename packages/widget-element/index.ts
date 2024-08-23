/* eslint-disable import/no-unused-modules */

/**
 * Custom Element that helps you to create widgets.
 *
 * Define a widget
 * ```ts
 * import {WidgetElement} from '@rambler-tech/widget-element'
 * import {createApp} from './app'
 *
 * class CustomWidget extends WidgetElement {
 *   static observedAttributes = ['app-id']
 *
 *   async initialize(shadowRoot: ShadowRoot) {
 *     const {appId} = this
 *     this.app = createApp(shadowRoot)
 *     await this.app.render({appId})
 *   }
 *
 *   attributeChanged() {
 *     const {appId} = this
 *     this.app.render({appId})
 *   }
 *
 *   destroy() {
 *     this.app.destroy()
 *   }
 * }
 *
 * CustomWidget.register('custom-widget')
 * ```
 *
 * Use a widget
 * ```tsx
 * import React from 'react'
 *
 * export function Page() {
 *   const widgetRef = useRef()
 *
 *   useEffect(() => {
 *     const onReady = () => {
 *       // Widget is ready
 *     }
 *     widgetRef.current.addEventListener('ready', onReady)
 *     return () => {
 *       widgetRef.current.removeEventListener('ready', onReady)
 *     }
 *   }, [])
 *
 *   return (
 *     <div className="page">
 *       <h1>Hello World</h1>
 *       <custom-widget app-id="1234" ref={widgetRef} />
 *     </div>
 *   )
 * }
 * ```
 */
export class WidgetElement extends HTMLElement {
  #fallback!: HTMLElement
  #shadowRoot?: ShadowRoot

  /** Register a widget custom element */
  static register(tagName: string) {
    // NOTE: exclude multiple definition of a custom element
    if (!customElements.get(tagName)) {
      customElements.define(tagName, this)
    }
  }

  async connectedCallback() {
    this.#shadowRoot = this.#createRoot()
    this.#fallback = this.#createFallback()

    await this.initialize(this.#shadowRoot)
    this.emit('ready')
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    this.#updateAttribute(name, oldValue, newValue)

    if (this.#shadowRoot) {
      this.attributeChanged()
    }
  }

  disconnectedCallback() {
    this.destroy()
    this.emit('destroy')
  }

  #createRoot() {
    return this.attachShadow({mode: 'closed'})
  }

  #createFallback() {
    const template = document.createElement('template')

    template.innerHTML = this.fallback

    return template.content.firstElementChild as HTMLElement
  }

  #updateAttribute(name: string, oldValue: string, newValue: string) {
    if (newValue !== oldValue) {
      const key = name.replace(/-(\w)/g, (_, char) =>
        char.toUpperCase()
      ) as keyof this

      if (typeof newValue === 'undefined') {
        delete this[key]
      } else {
        this[key] = newValue as any
      }
    }
  }

  /** Widget is initialized, and shadow root is attached */
  // eslint-disable-next-line no-empty-function
  initialize(_shadowRoot: ShadowRoot) {}

  /** An attribute of widget is changed */
  // eslint-disable-next-line no-empty-function
  attributeChanged() {}

  /** Widget is destroyed */
  // eslint-disable-next-line no-empty-function
  destroy() {}

  /**
   * Get fallback (slot element by default)
   *
   * ```ts
   * class CustomWidget extends WidgetElement {
   *   get fallback() {
   *     return `<span class="${styles.loader}">Loading...</span>`
   *   }
   * }
   * ```
   */
  get fallback() {
    return `<slot></slot>`
  }

  /** Show fallback (slot element by default) */
  showFallback() {
    this.#shadowRoot?.append(this.#fallback)
  }

  /** Hide fallback (slot element by default) */
  hideFallback() {
    this.#fallback?.remove()
  }

  /** Dispatch event */
  emit(eventType: string, options?: CustomEventInit) {
    this.dispatchEvent(new CustomEvent(eventType, options))
  }

  /** Dispatch error */
  emitError(error: Error, options?: ErrorEventInit) {
    this.dispatchEvent(
      new ErrorEvent('error', {error, message: error.message, ...options})
    )
  }
}
