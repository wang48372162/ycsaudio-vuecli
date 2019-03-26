import audioDB from '../audioDB.json'

export const getAudio = (id) => {
  return audioDB.audio.find(v => v.id === id)
}

export const getAudioIndex = (id) => {
  return audioDB.audio.findIndex(v => v.id === id)
}

export const getList = (id) => {
  return audioDB.list.find(v => v.id === id)
}

export default {
  getAudio,
  getAudioIndex,
  getList
}
