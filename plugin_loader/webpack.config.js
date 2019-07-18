const path = require('path')
const CopyrightWebpackPlugin=require('./plugins/copyright-webpack-plugin')
module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "[name].js"
    },
    resolveLoader: {
        modules: ["node_modules", "./loaders"]
    },
    plugins:[
        new CopyrightWebpackPlugin(
            {name:'sofiya'}
        )
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    //path.resolve(__dirname, './loaders/replaceLoader.js'),
                    './loaders/replaceLoader.js',
                    {
                        //path.resolve(__dirname, './loaders/replaceLoaderAsync.js')
                        loader: './loaders/replaceLoaderAsync.js',
                        options: {
                            name: '旭旭'
                        }
                    }
                ]
            }
        ]
    }
}