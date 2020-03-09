const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
 
const outputDirectory = "dist";
 
module.exports = {
  entry: "./client/src/index.js", //번들링 시작할 엔트리 포인트 지정
  output: {
    path: path.join(__dirname, outputDirectory),
    filename: "bundle.js", //번들링 되서 나오는 결과물 이름 지정
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  devServer: {
    port: 3000,
    open: true,
    proxy: {
      "/api": "http://localhost:8080"
    }
  },
  plugins: [
    new CleanWebpackPlugin([outputDirectory]),
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    })
  ]
};