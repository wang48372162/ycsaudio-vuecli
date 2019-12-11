import PlayerControls from '@/components/player-controls.vue'
import { createLocalVue, mount } from '@vue/test-utils'
import VueRouter from 'vue-router'
import VueCookies from 'vue-cookies'

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(VueCookies)

describe('PlayerControls', () => {
  it('emitted on-play', () => {
    const wrapper = mount(PlayerControls, {
      localVue
    })
    wrapper.find('.button-play').trigger('click')
    expect(wrapper.emitted('on-play')).toBeTruthy()
  })

  it('emitted on-stop', () => {
    const wrapper = mount(PlayerControls, {
      localVue
    })
    wrapper.find('.button-stop').trigger('click')
    expect(wrapper.emitted('on-stop')).toBeTruthy()
  })

  it('click repeat', () => {
    const wrapper = mount(PlayerControls, {
      localVue
    })
    expect(wrapper.vm.repeatStatus).toBe(0)

    wrapper.find('.button-repeat').trigger('click')
    expect(wrapper.emitted('on-update-repeat')[0]).toEqual([2])
    expect(wrapper.vm.$cookies.get('YCSAUDIO_REPEAT_STATUS')).toBe('2')

    wrapper.setProps({
      repeatStatus: 2
    })

    wrapper.find('.button-repeat').trigger('click')
    expect(wrapper.emitted('on-update-repeat')[1]).toEqual([0])
    expect(wrapper.vm.$cookies.get('YCSAUDIO_REPEAT_STATUS')).toBe('0')
  })

  it('click repeat and has listId', () => {
    const wrapper = mount(PlayerControls, {
      localVue,
      propsData: {
        listId: 'song'
      }
    })
    expect(wrapper.vm.repeatStatus).toBe(0)

    wrapper.find('.button-repeat').trigger('click')
    expect(wrapper.emitted('on-update-repeat')[0]).toEqual([1])
    expect(wrapper.vm.$cookies.get('YCSAUDIO_REPEAT_STATUS')).toBe('1')

    wrapper.setProps({
      repeatStatus: 1
    })

    wrapper.find('.button-repeat').trigger('click')
    expect(wrapper.emitted('on-update-repeat')[1]).toEqual([2])
    expect(wrapper.vm.$cookies.get('YCSAUDIO_REPEAT_STATUS')).toBe('2')

    wrapper.setProps({
      repeatStatus: 2
    })

    wrapper.find('.button-repeat').trigger('click')
    expect(wrapper.emitted('on-update-repeat')[2]).toEqual([0])
    expect(wrapper.vm.$cookies.get('YCSAUDIO_REPEAT_STATUS')).toBe('0')
  })

  it('init set repeat cookie', () => {
    localVue.cookies.set('YCSAUDIO_REPEAT_STATUS', 2)

    const wrapper = mount(PlayerControls, {
      localVue
    })

    expect(wrapper.emitted('on-update-repeat')[0]).toEqual([2])
    expect(wrapper.vm.$cookies.get('YCSAUDIO_REPEAT_STATUS')).toBe('2')
  })

  it('init get repeat cookie value is "1" and listId nit found', async () => {
    localVue.cookies.set('YCSAUDIO_REPEAT_STATUS', 1)

    const wrapper = mount(PlayerControls, {
      localVue
    })

    expect(wrapper.emitted('on-update-repeat')[0]).toEqual([2])
    expect(wrapper.vm.$cookies.get('YCSAUDIO_REPEAT_STATUS')).toBe('2')
  })

  it('should see prev button and next button', () => {
    const wrapper = mount(PlayerControls, {
      localVue,
      stubs: ['router-link'],
      propsData: {
        listId: 'song',
        prevId: 1,
        nextId: 3
      }
    })

    const btnPrev = wrapper.find('.button-prev')
    expect(btnPrev.is('router-link-stub')).toBe(true)

    const btnNext = wrapper.find('.button-next')
    expect(btnNext.is('router-link-stub')).toBe(true)
  })

  it('should see disabled prev button and next button', () => {
    const wrapper = mount(PlayerControls, {
      localVue,
      propsData: {
        listId: 'song'
      }
    })

    const btnPrev = wrapper.find('.button-prev')
    expect(btnPrev.is('div')).toBe(true)

    const btnNext = wrapper.find('.button-next')
    expect(btnNext.is('div')).toBe(true)
  })
})
