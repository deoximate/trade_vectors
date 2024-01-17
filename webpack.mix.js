// webpack.mix.js

const mix = require('laravel-mix');
const path = require('path');

mix.webpackConfig({
    resolve: {
        alias: {
            "three/addons/": "examples/jsm/"
        },
    },
});


mix.options({
    terser: {
        extractComments: false,
        terserOptions: {
            format: {
                comments: false,
            },
        },
    },
    manifest: false
});


mix.js('client/app.js', 'dist').setPublicPath('client/dist');
mix.disableNotifications();