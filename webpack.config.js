const path = require('path');
const webpack = require('webpack');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const proxyIp = `http://121.41.51.24:4400`;
module.exports = {
	entry: {
		app: ['webpack/hot/dev-server',
			'webpack-dev-server/client?http://localhost:8081',
			path.resolve(__dirname, 'src/scripts/main.js')
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
		path: path.resolve(__dirname, 'src'),
		filename: '/scripts/bundle.js'
	},
	module: {
		loaders: [{
			test: /\.jsx?$/,
			// exclude:/node_modules/,
			loaders: ['babel'],
			include: [path.join(__dirname, 'src')]
		}, {
			test: /\.scss$/,
			exclude:[path.resolve(__dirname,'node_modules/react-toolbox')],
			loader: 'style!css!autoprefixer?browsers=last 5 version!sass',
		}, {
			test: /\.scss$/,
			include:[path.resolve(__dirname,'node_modules/react-toolbox')],
			loader: 'style!css?modules&localIdentName=[name]-[local]-[hash:base64:5]!autoprefixer?browsers=last 5 version!sass',
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
		contentBase: "src",
		hot: true,
		progress: true,
		inline: true,
		port: 8081,
		proxy: {
			'/query/*': {
				target: proxyIp,
				secure: false
			},
			'/api/*': {
				target: proxyIp,
				secure: false
			},
			'/signIn': {
				target: proxyIp,
				secure: false
			},
			'/webjars/*':{
				target: proxyIp,
				secure: false
			},
			'/authenticate/*':{
				target: proxyIp,
				secure: false
			}
		},
		stats: {
			colors: true
		},
	},
}