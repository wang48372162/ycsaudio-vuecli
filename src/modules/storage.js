export default {
  install(app, options) {
    const storage = {
      get(key) {
        return localStorage.getItem(key)
      },
      getJson(key) {
        return JSON.parse(this.get(key))
      },
      set(key, value) {
        return localStorage.setItem(key, JSON.stringify(value))
      },
      remove(key) {
        return localStorage.removeItem(key)
      },
      clear() {
        return localStorage.clear()
      }
    }

    app.provide('storage', storage)
  }
}
