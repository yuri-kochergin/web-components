export function createElementFromHtml(html: string) {
  const template = document.createElement('template')

  template.innerHTML = html

  return template.content.firstElementChild as HTMLElement
}

export function getAttributesFromElement({attributes}: HTMLElement) {
  const params: Record<string, any> = {}

  for (let i = 0; i < attributes.length; i++) {
    const node = attributes.item(i)

    if (node != null) {
      const nodeName = node.nodeName.replace(/-(\w)/g, (_, char) =>
        char.toUpperCase()
      )

      params[nodeName] = node.nodeValue
    }
  }

  return params
}
