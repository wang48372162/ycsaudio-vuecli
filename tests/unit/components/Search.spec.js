import { shallowMount } from '@vue/test-utils'
import Search from '@/components/Search'

describe('Search', () => {
  it('default search input is empty', () => {
    const wrapper = shallowMount(Search)
    expect(wrapper.vm.result).toBeUndefined()
  })

  it('should search audios and lists', () => {
    const wrapper = shallowMount(Search, {
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
          id: 2,
          title: 'Audio 02',
          url: 'https://example.com/02'
        }
      ],
      lists: [
        {
          id: 'song-2',
          name: '歌曲2',
          audios: [1, 3]
        }
      ]
    }
    expect(wrapper.vm.result).toEqual(expected)
    expect(wrapper.vm.resultEmpty).toBe(false)
  })

  it('should search audios and lists, $route has query listId', () => {
    const wrapper = shallowMount(Search, {
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
          id: 2,
          title: 'Audio 02',
          url: 'https://example.com/02'
        }
      ],
      lists: [
        {
          id: 'song-2',
          name: '歌曲2',
          audios: [1, 3]
        }
      ]
    }
    expect(wrapper.vm.result).toEqual(expected)
    expect(wrapper.vm.resultEmpty).toBe(false)
  })

  it('should search for no results', async () => {
    const wrapper = shallowMount(Search)

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
