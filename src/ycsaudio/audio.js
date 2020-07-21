import { reactive } from 'vue'
import { getAudio } from './fetch'

export function useAudio() {
  const audio = reactive({
    id: 0,
    src: '',
    title: ''
  })

  function initAudioData() {
    audio.id = 0
    audio.src = ''
    audio.title = ''
  }

  function fetchAudioData(id) {
    if (id) {
      const audioResult = getAudio(Number(id))
      if (audioResult) {
        audio.id = audioResult.id
        audio.src = audioResult.url
        audio.title = audioResult.title
      } else {
        initAudioData()
      }
    } else {
      initAudioData()
    }
  }

  return { audio, fetchAudioData }
}
