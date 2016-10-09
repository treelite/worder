module.exports = {
    entry: './src/main.js',
    output: {
        path: './asset',
        filename: 'main.js'
    },
    module: {
        loaders: [
            {
                test: /\.vue/, exclude: /node_modules/, loader: 'vue'
            }
        ]
    }
};
