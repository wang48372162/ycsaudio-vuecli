import Playlist from '@/components/playlist.vue'
import { mount } from '@vue/test-utils'

describe('Playlist', () => {
  it('mounted playlist', () => {
    const wrapper = mount(Playlist, {
      mocks: {
        $route: {
          query: {
            id: '1'
          }
        }
      },
      stubs: ['router-link'],
      propsData: {
        id: 'song',
        title: '歌曲',
        audios: ['1', '2', '3']
      }
    })

    expect(wrapper.find('.list-title').text()).toBe('歌曲')
    expect(wrapper.vm.audioList).toEqual([
      {
        id: '1',
        title: 'Audio 01',
        url: 'https://example.com/01'
      },
      {
        id: '2',
        title: 'Audio 02',
        url: 'https://example.com/02'
      },
      {
        id: '3',
        title: 'Audio 03',
        url: 'https://example.com/03'
      }
    ])
  })
})
