import audioDB from '@/audioDB.yml'

export const getAudio = (id) => {
  return audioDB.audios.find(v => v.id === Number(id))
}

export const getAudios = () => audioDB.audios

export const getList = (id) => {
  const list = audioDB.lists.find(v => v.id === id)
  if (!list) {
    return
  }
  if (typeof list.audios === 'string') {
    list.audios = list.audios.split(',')
  }
  list.audios = list.audios.map(id => Number(id))
  return list
}

export const getLists = () => audioDB.lists

export const listContainAudio = (listId, audioId) => {
  const list = getList(listId)
  if (!list) {
    return false
  }
  return Boolean(list.audios.find(id => id === Number(audioId)))
}

export const getAudioIndexFromList = (listId, audioId) => {
  const list = getList(listId)
  if (!list) {
    return
  }
  return list.audios.findIndex(id => id === Number(audioId))
}

export default {
  getAudio,
  getAudios,
  getList,
  getLists,
  listContainAudio,
  getAudioIndexFromList
}
