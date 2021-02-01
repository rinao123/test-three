module.exports = {
	publicPath: process.env.NODE_ENV != 'github' ? '/' : process.env.VUE_APP_PATH
}