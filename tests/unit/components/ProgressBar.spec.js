import { mount } from '@vue/test-utils'
import ProbressBar from '@/components/ProgressBar'

describe('ProbressBar', () => {
  it('should numberToPercentage method apply', () => {
    const wrapper = mount(ProbressBar)
    const percentage = wrapper.vm.numberToPercentage(17, 39)
    expect(percentage).toBe(43.5897)
  })

  it('use width typeof string in percentageToNumber method', () => {
    const wrapper = mount(ProbressBar)
    const number = wrapper.vm.percentageToNumber('62.4789%', 39)
    expect(number).toBe(24.3667)
  })

  it('use width typeof string and not % in percentageToNumber method', () => {
    const wrapper = mount(ProbressBar)
    const number = wrapper.vm.percentageToNumber('62.4789', 39)
    expect(number).toBe(24.3667)
  })

  it('use width typeof number in percentageToNumber method', () => {
    const wrapper = mount(ProbressBar)
    const number = wrapper.vm.percentageToNumber(62.4789, 39)
    expect(number).toBe(24.3667)
  })
})
