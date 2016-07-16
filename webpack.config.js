/* global process */

var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackMerge = require('webpack-merge');

var common = {
    entry: [
        './src/index.js'
    ],

    output: {
        path: './dist',
        filename: 'index.js'
    },

    resolve: {
        modulesDirectories: ['node_modules'],
        extensions: ['', '.js', '.elm']
    },

    module: {
        loaders: [{
            test: /\.elm$/,
            exclude: [/elm-stuff/, /node_modules/, /src\/Stylesheets.elm$/],
            loader: 'elm'
        }]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.tpl.html'
        })
    ],

    target: 'web'
};


var devOnly = {
    module: {
        loaders: [{
            test: /src\/Stylesheets.elm$/,
            loaders: [
                'style-loader',
                'css-loader',
                'elm-css-webpack-loader'
            ]
        }]
    },

    devServer: {
        inline: true,
        progress: true,
        stats: 'errors-only'
    }
};

var prodOnly = {
    module: {
        loaders: [{
            test: /src\/Stylesheets.elm/,
            loader: ExtractTextPlugin.extract(
                'style-loader', [
                    'css-loader',
                    'elm-css-webpack-loader'
                ])
        }]
    },

    plugins: [
        new CopyWebpackPlugin([{
            from: 'src/index.html'
        }]),
        new ExtractTextPlugin('app.css')
    ]
};

var npm_target = process.env.npm_lifecycle_event;
var environment;

if (npm_target === 'start') {
    environment = 'development';
} else {
    environment = 'production';
}

if (environment === 'development') {
    console.log('running development');
    module.exports = WebpackMerge(common, devOnly);
} else {
    console.log('building for production');
    module.exports = WebpackMerge(common, prodOnly);
}
