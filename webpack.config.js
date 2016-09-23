module.exports = {
    entry: './src/app.js',
    output: {
        path: './asset',
        filename: 'app.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'
            }
        ]
    }
};
