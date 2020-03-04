module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/ycsaudio/'
    : '/',
  pwa: {
    name: 'ycsAudio',
    themeColor: '#202020',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black'
  }
}
