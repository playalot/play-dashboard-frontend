const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const OpenBrowserPlugin = require('open-browser-webpack-plugin');
// const proxyIp = `http://121.41.51.24:4400`;
module.exports = {
	entry: {
		app: ['webpack/hot/dev-server',
			// 'webpack-dev-server/client?http://localhost:8081',
			path.resolve(__dirname, 'src/scripts/main.js')
		],
		vendor: [
			'jquery',
			'bootstrap-sass/assets/javascripts/bootstrap.js',
			'admin-lte/dist/js/app.js'
		]
	},
	resolve: {
		extensions: ['', '.js', '.jsx', '.scss', '.css']
	},
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'scripts/bundle.js'
	},
	module: {
		loaders: [{
			test: /\.jsx?$/,
			// exclude:/node_modules/,
			loaders: ['babel'],
			include: [path.join(__dirname, 'src')]
		}, {
			test:/\.scss$/,
			loader:'style!css!autoprefixer!sass',
		}, {
			test: /\.css$/,
			loader: 'style!css!autoprefixer?browsers=last 5 version',
		}, {
			test:/\.(woff|svg|eot|ttf)\??.*$/,
			loader:'url?limit=8192&name=/fonts/[name].[ext]'
		}, {
			test:/\.(gif|jpg|png)\??.*$/,
			loader:'url?limit=8192&name=/images/[name].[ext]'
		}]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': '"development"'
		}),
		new webpack.optimize.CommonsChunkPlugin( /* chunkName= */ 'vendor', /* filename= */ '/scripts/vendor.js'),
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery",
			"window.jQuery": "jquery"
		}),
		new CopyWebpackPlugin([
			{ from: path.resolve(__dirname,"src/index.html"), to: path.resolve(__dirname,"build/index.html") }
		])
	]
}
