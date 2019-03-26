module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/ycsaudio/'
    : '/',
  pwa: {
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black'
  }
}
