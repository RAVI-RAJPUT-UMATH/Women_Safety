const path = require('path');

module.exports = {
    entry: './WomenSafety/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    devServer: {
        static: {
            directory: path.join(__dirname),
        },
        compress: true,
        port: 8080,
        proxy: {
            '/api': 'http://localhost:3000'
        }
    },
    mode: 'development'
};
