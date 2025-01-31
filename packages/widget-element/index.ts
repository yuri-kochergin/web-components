/* eslint-disable import/no-unused-modules */

type NonFunctionProperties<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T as T[K] extends Function ? never : K]: T[K]
}

/**
 * Custom Element that helps you to create widgets.
 *
 * Define a widget
 * ```ts
 * import {WidgetElement} from '@rambler-tech/widget-element'
 * import {createApp} from './app'
 *
 * export class CustomWidget extends WidgetElement {
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
 * Use a widget as element
 * ```html
 * <custom-widget app-id="1234"></custom-widget>
 * <script type="module">
 *   import './components/custom-widget'
 *
 *   const widget = document.querySelector('custom-widget')
 *   widget.addEventListener('ready', () => {
 *     // Widget is ready
 *   })
 * </script>
 * ```
 *
 * Or
 * ```html
 * <script type="module">
 *   import './components/custom-widget'
 *
 *   const widget = document.createElement('custom-widget')
 *   widget.appId = '1234'
 *   widget.addEventListener('ready', () => {
 *     // Widget is ready
 *   })
 * </script>
 * ```
 *
 * Or use a widget as constructor
 * ```html
 * <script type="module">
 *   import {WidgetElement} from './components/custom-widget'
 *
 *   const widget = new CustomWidget({appId: '1234'})
 *   widget.addEventListener('ready', () => {
 *     // Widget is ready
 *   })
 * </script>
 * ```
 */
export class WidgetElement<T = any> extends HTMLElement {
  #fallback!: HTMLElement
  #shadowRoot?: ShadowRoot

  /** Shadow root mode */
  static shadowRootMode: ShadowRootMode = 'closed'

  /** Register a widget custom element */
  static register(tagName: string) {
    // NOTE: exclude multiple definition of a custom element
    if (!customElements.get(tagName)) {
      customElements.define(tagName, this)
    }
  }

  /** Widget custom element constructor */
  constructor(properties?: NonFunctionProperties<T>) {
    super()

    const {observedAttributes} = this.constructor as any

    observedAttributes.forEach((attributeName: string) => {
      const name = attributeName.replace(/-(\w)/g, (_, char) =>
        char.toUpperCase()
      ) as keyof this

      Object.defineProperty(this, name, {
        get() {
          return this.getAttribute(attributeName)
        },
        set(value: string) {
          this.setAttribute(attributeName, value)
        },
        enumerable: true
      })
    })

    Object.assign(this, properties ?? {})
  }

  async connectedCallback() {
    this.#shadowRoot = this.#createRoot()
    this.#fallback = this.#createFallback()

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

  #createRoot() {
    const {shadowRootMode} = this.constructor as any

    return this.attachShadow({mode: shadowRootMode})
  }

  #createFallback() {
    const template = document.createElement('template')

    template.innerHTML = this.fallback

    return template.content.firstElementChild as HTMLElement
  }

  /** Widget is initialized, and shadow root is attached */
  // eslint-disable-next-line no-empty-function
  protected initialize(_shadowRoot: ShadowRoot) {}

  /** An attribute of widget is changed */
  // eslint-disable-next-line no-empty-function
  protected attributeChanged() {}

  /** Widget is destroyed */
  // eslint-disable-next-line no-empty-function
  protected destroy() {}

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
  protected get fallback() {
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
