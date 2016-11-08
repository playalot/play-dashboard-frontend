const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const node_modules_dir = path.resolve(__dirname, 'node_modules');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const cheerio = require('cheerio');
const fs =  require('fs');

// var ExtractVendor = new ExtractTextPlugin('styles/vendor.css');
const ExtractMain = new ExtractTextPlugin('styles/main.css');

const config = {
    entry: {
        app: path.resolve(__dirname, 'src/scripts/main.js'),
        vendor: [
            'jquery',
            'bootstrap-sass/assets/javascripts/bootstrap.js',
            'admin-lte/dist/js/app.js'
        ]
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'scripts/bundle.[hash].js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.scss']
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: [node_modules_dir],
                loaders: ['babel'],
                include: [path.join(__dirname, 'src')]
            },
            // {
            //     test: /\.less$/,
            //     loader: 'style!css!autoprefixer!less',
            // },
            {
                test: /\.scss$/,
                loader:'style!css!autoprefixer!sass'
                // loader: ExtractTextPlugin.extract('style','css','autoprefixer','sass'),
            },
            // {
            //     test: /\.css$/,
            //     loader: ExtractTextPlugin.extract('style','css','autoprefixer')
            // },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'url?limit=1&name=/images/[name].[ext]'
            },
            {
                test: /\.(woff|svg|eot|ttf)\??.*$/,
                loader: 'url?limit=1&name=/fonts/[name].[ext]'
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
        new webpack.optimize.CommonsChunkPlugin( /* chunkName= */ 'vendor', /* filename= */ 'scripts/vendor.js'),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, "src/index.html"),
            to: path.resolve(__dirname, "build/index.html")
        }]),
        // ExtractVendor,
        ExtractMain,
        function() {
            this.plugin('done', stats => {
                fs.readFile('./build/index.html', (err, data) => {
                    const $ = cheerio.load(data.toString());
                    $('#bundle').attr('src', '/scripts/bundle.'+stats.hash+'.js');
                    fs.writeFile('./build/index.html', $.html(), err => {
                        !err && console.log('Set has success: '+stats.hash)
                    })
                })
            })
        }

    ]
};

module.exports = config;
