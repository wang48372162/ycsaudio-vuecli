import audioDB from '@/audioDB.json'

export const getAudio = (id) => {
  return audioDB.audio.find(v => v.id === id)
}

export const getList = (id) => {
  let list = audioDB.list.find(v => v.id === id)
  if (!list) return
  if (typeof list.audios === 'string') {
    list.audios = list.audios.split(',')
  }
  return list
}

export const getListAudioIndex = (listId, id) => {
  const list = getList(listId)
  return list
    ? list.audios.findIndex(audioId => audioId === id)
    : null
}

export const floatFormet = (number, pow = 4) => {
  return Math.floor(number * Math.pow(10, pow)) / Math.pow(10, pow)
}

export default {
  getAudio,
  getList,
  getListAudioIndex,
  floatFormet
}
