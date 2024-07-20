import {WidgetElement} from '.'

class TestWidget extends WidgetElement {
  ready = false
  changed = false
  destroyed = false

  static get observedAttributes() {
    return ['test']
  }

  initialize(_shadowRoot: ShadowRoot) {
    this.ready = true
  }

  attributeChanged() {
    this.changed = true
  }

  destroy() {
    this.destroyed = true
  }
}

TestWidget.register('test-widget')

test('widget is ready', async () => {
  const widget = document.createElement('test-widget') as TestWidget
  const onReady = jest.fn()

  widget.addEventListener('ready', onReady)

  expect(widget.ready).toBe(false)

  document.body.append(widget)

  await Promise.resolve()

  expect(widget.ready).toBe(true)
  expect(onReady).toHaveBeenCalledTimes(1)
})

test('widget attribute is changed', async () => {
  const widget = document.createElement('test-widget') as TestWidget

  widget.setAttribute('test', '123')

  expect(widget.changed).toBe(false)
  expect(widget.params).toEqual({test: '123', provider: widget})

  document.body.append(widget)
  widget.setAttribute('test', '456')

  await Promise.resolve()

  expect(widget.changed).toBe(true)
  expect(widget.params).toEqual({test: '456', provider: widget})
})

test('widget is destroyed', async () => {
  const widget = document.createElement('test-widget') as TestWidget
  const onDestroy = jest.fn()

  widget.addEventListener('destroy', onDestroy)

  document.body.append(widget)

  await Promise.resolve()

  expect(widget.destroyed).toBe(false)
  expect(onDestroy).toHaveBeenCalledTimes(0)

  document.body.removeChild(widget)

  await Promise.resolve()

  expect(widget.destroyed).toBe(true)
  expect(onDestroy).toHaveBeenCalledTimes(1)
})
