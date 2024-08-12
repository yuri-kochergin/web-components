export function createElementFromHtml(html: string) {
  const template = document.createElement('template')

  template.innerHTML = html

  return template.content.firstElementChild as HTMLElement
}

export function getAttributesFromElement(element: HTMLElement) {
  const params: Record<string, any> = {}

  for (let i = 0; i < element.attributes.length; i++) {
    const node = element.attributes.item(i)

    if (node != null) {
      params[node.nodeName] = node.nodeValue
    }
  }

  return params
}
