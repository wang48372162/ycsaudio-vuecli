class Hotkey {
  constructor() {
    this.hotkeys = new Map()
    this.excludeArea = new Set()

    this.events = [
      'keydown',
      'keypress',
      'keyup'
    ]

    this.hotkeyNameLog = false
  }

  eventListener(e) {
    const triggerdKey = this.formatKey(e.key)
    const eventType = e.type
    const hotkeyStack = this.hotkeys.get(triggerdKey)

    // Enabled hotkey name log
    if (this.hotkeyNameLog &&
      eventType === 'keydown' &&
      ['develop', 'local'].includes(process.env.NODE_ENV)) {
      /* eslint-disable-next-line no-console */
      console.log(`Clicked key: "${triggerdKey}"`)
    }

    if (!hotkeyStack) return

    // Loop current clicked hotkey stack
    for (const hotkey of hotkeyStack) {
      const isValidArea = [...hotkey.excludeArea].every(selector => !e.target.matches(selector))

      if (!hotkey || hotkey.event !== eventType || !isValidArea) continue

      e.preventDefault()
      hotkey.callback(e)
    }
  }

  formatKey(key) {
    if (typeof key === 'string' && /^[A-Za-z]{1}$/.test(key)) {
      key = key.toUpperCase()
    }
    return key
  }

  addHotkey(key, event, callback) {
    if (!this.events.includes(event)) return
    key = this.formatKey(key)

    const hotkeyStack = this.hotkeys.get(key) || []
    hotkeyStack.push({
      event,
      callback,
      excludeArea: new Set([...this.excludeArea])
    })
    this.hotkeys.set(key, hotkeyStack)
  }

  enableHotkeyNameLog() {
    this.hotkeyNameLog = true
  }

  excludeHotkeyArea(selectors, callback) {
    const originalExcludeArea = this.excludeArea
    selectors = Array.isArray(selectors) ? selectors : [selectors]
    this.excludeArea = new Set([...this.excludeArea, ...selectors])

    callback()

    this.excludeArea = originalExcludeArea
  }
}

const hotkeyHandler = new Hotkey()

hotkeyHandler.install = (app, options) => {
  //
}

export function hotkey(key, callback) {
  hotkeyHandler.addHotkey(key, 'keydown', callback)
}

export function hotkeypress(key, callback) {
  hotkeyHandler.addHotkey(key, 'keypress', callback)
}

export function hotkeyup(key, callback) {
  hotkeyHandler.addHotkey(key, 'keypress', callback)
}

export function enableHotkeyNameLog() {
  hotkeyHandler.enableHotkeyNameLog()
}

export function excludeHotkeyArea(...selectors) {
  hotkeyHandler.excludeHotkeyArea(...selectors)
}

export function registerHotkeyEvent() {
  for (const event of hotkeyHandler.events) {
    window.addEventListener(event, hotkeyHandler.eventListener.bind(hotkeyHandler))
  }
}

export function unregisterHotkeyEvent() {
  for (const event of hotkeyHandler.events) {
    window.removeEventListener(event, hotkeyHandler.eventListener.bind(hotkeyHandler))
  }
}

export default hotkeyHandler
