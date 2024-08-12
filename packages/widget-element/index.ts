/* eslint-disable import/no-unused-modules */
import {getAttributesFromElement, createElementFromHtml} from './utils'

/**
 * Custom Element that helps you to create widgets.
 *
 * Define a widget
 * ```ts
 * import {WidgetElement} from '@rambler-tech/widget-element'
 * import {createApp} from './app'
 *
 * class CustomWidget extends WidgetElement {
 *   static get observedAttributes() {
 *     return ['appid']
 *   }
 *
 *   async initialize(shadowRoot: ShadowRoot) {
 *     const {appid} = this.params
 *     this.app = createApp(shadowRoot)
 *     await this.app.render({appid})
 *   }
 *
 *   attributeChanged() {
 *     const {appid} = this.params
 *     this.app.render({appid})
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
 *       <custom-widget appid="1234" ref={widgetRef} />
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
    customElements.define(tagName, this)
  }

  /** Widget params (attributes map) */
  get params(): Record<string, any> {
    const params = getAttributesFromElement(this)

    return {...params, provider: this}
  }

  async connectedCallback() {
    this.#fallback = createElementFromHtml(this.fallback)
    this.#shadowRoot = this.attachShadow({mode: 'closed'})

    await this.initialize(this.#shadowRoot)
    this.emit('ready')
  }

  attributeChangedCallback() {
    if (this.#shadowRoot) {
      this.attributeChanged()
    }
  }

  disconnectedCallback() {
    this.destroy()
    this.emit('destroy')
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
}
