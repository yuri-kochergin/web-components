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
 *   static get observedAttributes() {
 *     return ['appId']
 *   }
 *
 *   async initialize(shadowRoot: ShadowRoot) {
 *     const {appId} = this.params
 *     this.app = createApp(shadowRoot)
 *     await this.app.render({appId})
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
  #fallback!: HTMLSlotElement
  #shadowRoot?: ShadowRoot

  /** Register a widget custom element */
  static register(tagName: string) {
    customElements.define(tagName, this)
  }

  /** Widget params (attributes map) */
  get params() {
    const params: Record<string, any> = {
      provider: this
    }

    for (let i = 0; i < this.attributes.length; i++) {
      const node = this.attributes.item(i)

      if (node != null) {
        params[node.nodeName] = node.nodeValue
      }
    }

    return params
  }

  async connectedCallback() {
    this.#fallback = document.createElement('slot')
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

  /** Show fallback (slot element) */
  showFallback() {
    this.#shadowRoot?.appendChild(this.#fallback)
  }

  /** Hide fallback (slot element) */
  hideFallback() {
    this.#shadowRoot?.removeChild(this.#fallback)
  }

  /** Dispatch event */
  emit(eventType: string, options?: CustomEventInit) {
    this.dispatchEvent(new CustomEvent(eventType, options))
  }
}
