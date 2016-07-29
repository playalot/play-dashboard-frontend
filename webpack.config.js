const path = require('path');
const webpack = require('webpack');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
module.exports = {
	entry: {
		app: ['webpack/hot/dev-server',
			'webpack-dev-server/client?http://localhost:8081',
			path.resolve(__dirname, 'app/scripts/main.js')
		],
		vendor: [
			'jquery',
			'bootstrap-sass/assets/javascripts/bootstrap.js',
			'admin-lte/dist/js/app.js'
		]
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	output: {
		path: path.resolve(__dirname, 'app'),
		filename: '/scripts/bundle.js'
	},
	module: {
		loaders: [{
			test: /\.jsx?$/,
			// exclude:/node_modules/,
			loaders: ['babel'],
			include: [path.join(__dirname, 'app')]
		}, {
			test: /\.scss$/,
			loader: 'style!css!autoprefixer?browsers=last 5 version!sass',
		}, {
			test: /\.less$/,
			loader: 'style!css!autoprefixer?browsers=last 5 version!less',
		}, {
			test: /\.css$/,
			loader: 'style!css!autoprefixer?browsers=last 5 version',
		}, {
			test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
			loader: 'url?limit=50000'
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
		new OpenBrowserPlugin({
			url: 'http://localhost:8081'
		})
	],
	devServer: {
		contentBase: "app",
		hot: true,
		progress: true,
		inline: true,
		port: 8081,
		proxy: {
			'/query/*': {
				target: 'http://114.55.30.61:4300',
				secure: false
			},
			'/api/*': {
				target: 'http://114.55.30.61:4300',
				secure: false
			},
			'/signIn': {
				target: 'http://114.55.30.61:4300',
				secure: false
			},
			'/webjars/*':{
				target: 'http://114.55.30.61:4300',
				secure: false
			},
			'/authenticate/*':{
				target: 'http://114.55.30.61:4300',
				secure: false
			}
		},
		stats: {
			colors: true
		},
	},
}