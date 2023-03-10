// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProduction = process.env.NODE_ENV == "production";

const stylesHandler = MiniCssExtractPlugin.loader;

const config = {
  entry: {
    index: './src/index.js',
    instructions: './src/instructions.js',
  },
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    static: './src/pages/*.html',
    open: true,
    host: "localhost",
  },
  devtool: 'inline-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      instructions: 'index.html',
      template: "./src/pages/index.html",
      chunks: ['index'],
    }),
    new HtmlWebpackPlugin({
      filename: 'instructions.html',
      template: './src/pages/instructions.html',
      chunks: ['instructions']
    }),

    new MiniCssExtractPlugin(),

    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: "babel-loader",
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, "css-loader", "postcss-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};
