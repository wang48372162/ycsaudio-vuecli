import PlayerTime from '@/components/player-time.vue'
import { mount } from '@vue/test-utils'

describe('PlayerTime', () => {
  it('should be able to see the time text', () => {
    const wrapper = mount(PlayerTime, {
      propsData: {
        duration: 123,
        currentTime: 77
      }
    })
    const expectedHtml = `<div><span>01:17</span>
  /
  <span>02:03</span></div>`
    expect(wrapper.html()).toBe(expectedHtml)
  })

  it('set NaN duration', () => {
    const wrapper = mount(PlayerTime, {
      propsData: {
        duration: undefined,
        currentTime: undefined
      }
    })
    const expectedHtml = `<div><span>00:00</span>
  /
  <span>00:00</span></div>`
    expect(wrapper.html()).toBe(expectedHtml)
  })
})
