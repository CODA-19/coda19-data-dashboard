module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  devServer: {
    port: process.env.VUE_APP_CODA19_DASHBOARD_PORT,
    https: true,
    disableHostCheck: true
  }
}
