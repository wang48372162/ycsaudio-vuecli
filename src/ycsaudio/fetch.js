import audioDB from '@/audioDB.yml'

function formatAudio(audio) {
  if (!/^https?:\/\//.test(audio.url)) {
    audio.url = [
      process.env.VUE_APP_AUDIO_BASE_URL.replace(/\/+$/, ''),
      audio.url.replace(/^\/+/, '')
    ].join('/')
  }
  return audio
}

export function getAudio(id) {
  const audio = audioDB.audios.find(v => v.id === Number(id))
  return audio ? formatAudio(audio) : null
}

export function getAudios() {
  return audioDB.audios.map(formatAudio)
}

export function getList(id) {
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

export function getLists() {
  return audioDB.lists
}

export function listContainAudio(listId, audioId) {
  const list = getList(listId)
  if (!list) {
    return false
  }
  return Boolean(list.audios.find(id => id === Number(audioId)))
}

export function getAudioIndexFromList(listId, audioId) {
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
