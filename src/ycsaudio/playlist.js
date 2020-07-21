import { reactive } from 'vue'
import { getList } from './fetch'

export function usePlaylist() {
  const list = reactive({
    id: '',
    title: '',
    audios: []
  })

  function initListData() {
    list.id = ''
    list.title = ''
    list.audios = []
  }

  function fetchListData(id) {
    if (id) {
      const listResult = getList(id)
      if (listResult) {
        list.id = listResult.id
        list.title = listResult.name
        list.audios = listResult.audios
      } else {
        initListData()
      }
    } else {
      initListData()
    }
  }

  return { list, fetchListData }
}
