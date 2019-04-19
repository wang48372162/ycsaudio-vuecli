import audioDB from '@/audioDB.json'

export const getAudio = (id) => {
  return audioDB.audios.find(v => v.id === id)
}

export const getAudios = () => audioDB.audios

export const getList = (id) => {
  let list = audioDB.lists.find(v => v.id === id)
  if (!list) {
    return
  }
  if (typeof list.audios === 'string') {
    list.audios = list.audios.split(',')
  }
  return list
}

export const getLists = () => audioDB.lists

export const listContainAudio = (listId, audioId) => {
  const list = getList(listId)
  if (!list) {
    return false
  }
  return Boolean(list.audios.find(id => id === audioId))
}

export const getListAudioIndex = (listId, audioId) => {
  const list = getList(listId)
  if (!list) {
    return
  }
  return list.audios.findIndex(id => id === audioId)
}

export const floatFormet = (number, pow = 4) => {
  return Math.floor(number * Math.pow(10, pow)) / Math.pow(10, pow)
}

export default {
  getAudio,
  getAudios,
  getList,
  getLists,
  listContainAudio,
  getListAudioIndex,
  floatFormet
}
