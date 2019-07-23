import Search from '@/components/search.vue'
import { mount } from '@vue/test-utils'

describe('Search', () => {
  it('default search input is empty', () => {
    const wrapper = mount(Search)
    expect(wrapper.vm.result).toBeUndefined()
  })

  it('should search audios and lists', () => {
    const wrapper = mount(Search, {
      mocks: {
        $route: {}
      },
      stubs: ['router-link']
    })

    wrapper.setData({
      show: true,
      search: '2'
    })

    const expected = {
      audios: [
        {
          id: '2',
          title: 'Audio 02',
          url: 'https://example.com/02'
        }
      ],
      lists: [
        {
          id: 'song-2',
          name: '歌曲2',
          audios: ['1', '3']
        }
      ]
    }
    expect(wrapper.vm.result).toEqual(expected)
    expect(wrapper.vm.resultEmpty).toBe(false)
  })

  it('should search audios and lists, $route has query listId', () => {
    const wrapper = mount(Search, {
      mocks: {
        $route: {
          query: {
            list: 'song'
          }
        }
      },
      stubs: ['router-link']
    })

    wrapper.setData({
      show: true,
      search: '2'
    })

    const expected = {
      audios: [
        {
          id: '2',
          title: 'Audio 02',
          url: 'https://example.com/02'
        }
      ],
      lists: [
        {
          id: 'song-2',
          name: '歌曲2',
          audios: ['1', '3']
        }
      ]
    }
    expect(wrapper.vm.result).toEqual(expected)
    expect(wrapper.vm.resultEmpty).toBe(false)
  })

  it('should search for no results', async () => {
    const wrapper = mount(Search)

    wrapper.setData({
      show: true,
      search: 'Search Not Results'
    })

    const expected = {
      audios: [],
      lists: []
    }
    expect(wrapper.vm.result).toEqual(expected)
    expect(wrapper.vm.resultEmpty).toBe(true)
  })
})