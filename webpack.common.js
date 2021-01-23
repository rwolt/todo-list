const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
module.exports = {
    entry: "./src/app/app.js",
    plugins: [new HtmlWebpackPlugin({
        template: "./src/template.html"
    })],
    module: {
    rules: [
        {
            test: /\.html$/,
            use: ["html-loader"],
        },
        {
            test: /\.svg|png|jpg|gif$/,
            use: {
                loader: "file-loader",
                options: {
                    esModule: false,
                    name: "[name].[hash].[ext]",
                    outputPath: "imgs"
                }
            }
        },
    ]
    } 
};