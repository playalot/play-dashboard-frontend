const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const node_modules_dir = path.resolve(__dirname, 'node_modules');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const cheerio = require('cheerio');
const fs =  require('fs');

// var ExtractVendor = new ExtractTextPlugin('styles/vendor.css');
// const ExtractMain = new ExtractTextPlugin('styles/main.css');

const config = {
    entry: {
        app: path.resolve(__dirname, 'src/scripts/main.js'),
        vendor: [
            'jquery',
            path.resolve(__dirname, 'src/scripts/metronic/popper.js'),
			'bootstrap-sass/assets/javascripts/bootstrap.js',
            // path.resolve(__dirname, 'src/scripts/metronic/app.js'),
            path.resolve(__dirname, 'src/scripts/metronic/scripts.bundle.js')
		]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'scripts/bundle.[hash].js'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.scss']
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: [node_modules_dir],
                use: ['babel-loader'],
                include: [path.join(__dirname, 'src')]
            },
            {
                test: /\.scss$/,
                use:[
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.css$/,
                use:[
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                ]
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader?limit=1&name=/images/[name].[ext]'
            },
            {
                test: /\.(woff|svg|eot|ttf)\??.*$/,
                loader: 'url-loader?limit=1&name=/fonts/[name].[ext]'
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
        new webpack.optimize.CommonsChunkPlugin({name:'vendor',filename:'/scripts/vendor.js'}),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery",
        }),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, "src/index.html"),
            to: path.resolve(__dirname, "dist/index.html")
        }]),
        // ExtractVendor,
        // ExtractMain,
        function() {
            this.plugin('done', stats => {
                fs.readFile('./dist/index.html', (err, data) => {
                    const $ = cheerio.load(data.toString());
                    $('#bundle').attr('src', '/scripts/bundle.'+stats.hash+'.js');
                    fs.writeFile('./dist/index.html', $.html(), err => {
                        !err && console.log('Set has success: '+stats.hash)
                    })
                })
            })
        }

    ]
};

module.exports = config;
