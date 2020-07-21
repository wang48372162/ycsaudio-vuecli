import { createLocalVue, shallowMount } from '@vue/test-utils'
import PlayerVolume from '@/components/Player/PlayerVolume'

const localVue = createLocalVue()

describe('PlayerVolume', () => {
  it('emitted change-progress event (change volume)', () => {
    const wrapper = shallowMount(PlayerVolume, {
      localVue
    })
    wrapper.find('#player-volume-progress').vm.$emit('change-progress', 0.56)
    expect(wrapper.emitted('change-progress')[1]).toEqual([0.56])
    expect(wrapper.vm.$cookies.get('YCSAUDIO_VOLUME')).toBe('0.56')
  })

  it('emitted on-muted', () => {
    const wrapper = shallowMount(PlayerVolume, {
      localVue
    })
    wrapper.find('.volume-muted').trigger('click')
    expect(wrapper.emitted('muted')[1]).toEqual([true])
    expect(wrapper.vm.$cookies.get('YCSAUDIO_MUTED')).toBe('1')
  })
})
