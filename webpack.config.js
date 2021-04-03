const webpack = require('webpack');
const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const globImporter = require('node-sass-glob-importer');


module.exports = (env, argv) => {
  const is_DEVELOP = argv.mode === "development";

  return {
    entry: './src/js/main',
    output: {
      path: path.join(__dirname, 'public'),
      filename: is_DEVELOP
        ? 'assets/javascript/bundle.js'
        : 'assets/javascript/bundle.[hash].js',
    },
    devtool: is_DEVELOP ? 'source-map' : 'eval',
    watchOptions: {
      ignored: /node_modules/
    },
    plugins: [
      new CleanWebpackPlugin({
        // cleanOnceBeforeBuildPatterns: ['!/assets/images/']
      }),
      new MiniCssExtractPlugin({
        filename: is_DEVELOP
          ? 'assets/stylesheet/bundle.css'
          : 'assets/stylesheet/bundle.[hash]].css',
      }),

      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'src/ejs/index.ejs',
        // minify: false,
      }),
      new HtmlWebpackPlugin({
        filename: 'about/index.html',
        template: 'src/ejs/about/index.ejs',
        // minify: false,
      })
    ],
    resolve: {
      extensions: [
        '.js', // for style-loader
      ],
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    [
                      "autoprefixer",
                      {
                        grid: true
                      },
                    ],
                  ],
                }
              }
            },
            {
              loader: 'sass-loader',
              // options: {
              //   importer: globImporter(),
              //   sourceMap: true,
              // },
            },
          ]
        },
      ],
    },
    devServer: {
      contentBase: path.resolve(__dirname, 'public'),
      port: 8080,
    },
  }
}