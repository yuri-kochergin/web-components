export class StyleSheet {
  private content: string
  private registry = new Map<HTMLElement, HTMLStyleElement>()

  constructor(content: string) {
    this.content = content
  }

  appendTo(container: HTMLElement) {
    if (!this.registry.has(container)) {
      const element = document.createElement('style')

      element.textContent = this.content
      container.append(element)
      this.registry.set(container, element)
    }
  }

  removeFrom(container: HTMLElement) {
    const element = this.registry.get(container)

    if (element) {
      element.remove()
      this.registry.delete(container)
    }
  }
}
