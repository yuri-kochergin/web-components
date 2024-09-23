export class StyleSheet {
  private content: string
  private registry = new Map<HTMLElement, HTMLStyleElement>()

  constructor(content: string) {
    this.content = content
  }

  appendTo(
    root: HTMLElement,
    container: HTMLElement | DocumentFragment = root
  ) {
    if (!this.registry.has(root)) {
      const element = document.createElement('style')

      element.textContent = this.content
      container.append(element)
      this.registry.set(root, element)
    }
  }

  removeFrom(root: HTMLElement) {
    const element = this.registry.get(root)

    if (element) {
      element.remove()
      this.registry.delete(root)
    }
  }

  toString() {
    return this.content
  }
}
