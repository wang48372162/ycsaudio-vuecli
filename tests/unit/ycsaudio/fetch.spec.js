import {
  getAudio,
  getAudios,
  getList,
  getLists,
  listContainAudio,
  getAudioIndexFromList
} from '@/ycsaudio/fetch'

describe('fetch ycsAudio DB test', () => {
  it('getAudio()', () => {
    const audioData = getAudio(String(1))
    const expected = {
      id: 1,
      url: 'https://example.com/01',
      title: 'Audio 01'
    }
    expect(audioData).toEqual(expected)
  })

  it('getAudios()', () => {
    const audiosData = getAudios()
    const expected = [
      {
        id: 1,
        title: 'Audio 01',
        url: 'https://example.com/01'
      },
      {
        id: 2,
        title: 'Audio 02',
        url: 'https://example.com/02'
      },
      {
        id: 3,
        title: 'Audio 03',
        url: 'https://example.com/03'
      }
    ]
    expect(audiosData).toEqual(expected)
  })

  it('getList() audios typeof string', () => {
    const listData = getList('song')
    const expected = {
      id: 'song',
      name: '歌曲',
      audios: [1, 2, 3]
    }
    expect(listData).toEqual(expected)
  })

  it('getList() audios typeof array', () => {
    const listData = getList('song-2')
    const expected = {
      id: 'song-2',
      name: '歌曲2',
      audios: [1, 3]
    }
    expect(listData).toEqual(expected)
  })

  it('getList() to be undefined', () => {
    const listData = getList('this-list-is-null')
    expect(listData).toBeUndefined()
  })

  it('getLists()', () => {
    const listsData = getLists()
    const expected = [
      {
        id: 'song',
        name: '歌曲',
        audios: [1, 2, 3]
      },
      {
        id: 'song-2',
        name: '歌曲2',
        audios: [1, 3]
      }
    ]
    expect(listsData).toEqual(expected)
  })

  it('listContainAudio() to be true', () => {
    const has = listContainAudio('song', 1)
    expect(has).toBe(true)
  })

  it('listContainAudio() set not found list', () => {
    const has = listContainAudio('list-is-not-found', 100)
    expect(has).toBe(false)
  })

  it('getAudioIndexFromList()', () => {
    const audioIndex = getAudioIndexFromList('song', 1)
    expect(audioIndex).toBe(0)
  })

  it('getAudioIndexFromList() to be -1', () => {
    const audioIndex = getAudioIndexFromList('song', 100)
    expect(audioIndex).toBe(-1)
  })
})
