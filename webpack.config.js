const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const proxyIp = `http://121.41.51.24:4400`;
module.exports = {
	entry: {
		app: path.resolve(__dirname, 'src/scripts/main.js'),
		vendor: [
			'jquery',
			'bootstrap-sass/assets/javascripts/bootstrap.js',
			'admin-lte/dist/js/app.js'
		]
	},
	resolve: {
		extensions: ['.js', '.jsx', '.scss', '.css']
	},
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'scripts/bundle.js'
	},
	module: {
		rules:[
			{
				test: /\.jsx?$/,
				use: ['babel-loader'],
				include: [path.join(__dirname, 'src')]
			}, {
				test:/\.scss$/,
				use:[
					'style-loader',
					'css-loader',
					'postcss-loader',
					'sass-loader',
				],
			}, {
				test: /\.css$/,
				use:[
					'style-loader',
					'css-loader',
					'postcss-loader',
				]
			}, {
				test:/\.(woff|svg|eot|ttf)\??.*$/,
				use:'url-loader?limit=8192&name=/fonts/[name].[ext]'
			}, {
				test:/\.(gif|jpg|png)\??.*$/,
				use:'url-loader?limit=8192&name=/images/[name].[ext]'
			}
		]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': '"development"'
		}),
		new webpack.optimize.CommonsChunkPlugin({name:'vendor',filename:'/scripts/vendor.js'}),
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery",
			"window.jQuery": "jquery"
		}),
	],
	// devServer: {
	// 	contentBase: path.join(__dirname, "src"),
	// 	hot: true,
	// 	port: 8081,
	// 	proxy: {
	// 		'/query/*': {
	// 			target: proxyIp,
	// 			secure: false
	// 		},
	// 		'/api/*': {
	// 			target: proxyIp,
	// 			secure: false
	// 		},
	// 		'/signIn': {
	// 			target: proxyIp,
	// 			secure: false
	// 		},
	// 		'/webjars/*':{
	// 			target: proxyIp,
	// 			secure: false
	// 		},
	// 		'/authenticate/*':{
	// 			target: proxyIp,
	// 			secure: false
	// 		},
	// 	},
	// },
}
