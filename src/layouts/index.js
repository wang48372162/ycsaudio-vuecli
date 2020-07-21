import { ref } from 'vue'
import DefaultLayout from './Default'
import BlankLayout from './Blank'

export function setLayout() {
  const layout = ref(getLayoutName())

  function getLayoutName(name) {
    return (name || 'default') + '-layout'
  }

  function updateLayout(newLayout) {
    layout.value = getLayoutName(newLayout)
  }

  return { layout, updateLayout }
}

export const useLayout = {
  emits: ['layout'],
  methods: {
    updateLayout() {
      this.$emit('layout', 'default')
    }
  },
  created() {
    this.updateLayout()
  }
}

export default {
  install(app, options) {
    app.component(DefaultLayout.name, DefaultLayout)
    app.component(BlankLayout.name, BlankLayout)
  }
}
