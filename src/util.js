import pkg from '@/../package.json'

export const floatFormet = (number, pow = 4) => {
  return Math.floor(number * Math.pow(10, pow)) / Math.pow(10, pow)
}

export function setTitle(obj = null) {
  const subtitle = obj !== null && 'title' in obj ? obj.title : obj
  document.title = (subtitle ? `${subtitle} - ` : '') + pkg.fullname
}

export function scrollToTop() {
  window.scrollTo(0, 0)
}
