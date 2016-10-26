const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const node_modules_dir = path.resolve(__dirname, 'node_modules');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

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
        filename: 'scripts/bundle.js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: [node_modules_dir],
                loaders: ['babel'],
                include: [path.join(__dirname, 'src')]
            },  
            {
                test: /\.scss$/,
                exclude:[path.resolve(__dirname,'node_modules/react-toolbox')],
                loader: ExtractMain.extract('style-loader', 'css!autoprefixer?browsers=last 5 version!sass')
            }, 
            {
                test: /\.scss$/,
                include:[path.resolve(__dirname,'node_modules/react-toolbox')],
                loader: ExtractMain.extract('style-loader', 'css?modules&localIdentName=[name]-[local]-[hash:base64:5]!autoprefixer?browsers=last 5 version!sass')
            }, 
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

    ]
};

module.exports = config;