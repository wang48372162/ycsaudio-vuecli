import PlayerVolume from '@/components/player-volume.vue'
import { createLocalVue, mount } from '@vue/test-utils'
import VueCookies from 'vue-cookies'

const localVue = createLocalVue()
localVue.use(VueCookies)

describe('PlayerVolume', () => {
  it('emitted on-change-progress (change volume)', () => {
    const wrapper = mount(PlayerVolume, {
      localVue
    })
    wrapper.find('#player-volume-progress').vm.$emit('on-change-progress', 0.56)
    expect(wrapper.emitted('on-change-progress')[1]).toEqual([0.56])
    expect(wrapper.vm.$cookies.get('YCSAUDIO_VOLUME')).toBe('0.56')
  })

  it('emitted on-muted', () => {
    const wrapper = mount(PlayerVolume, {
      localVue
    })
    wrapper.find('.volume-muted').trigger('click')
    expect(wrapper.emitted('on-muted')[1]).toEqual([true])
    expect(wrapper.vm.$cookies.get('YCSAUDIO_MUTED')).toBe('1')
  })
})
