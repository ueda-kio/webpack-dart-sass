const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = (env, argv) => {
  const is_DEVELOP = argv.mode === "development";

  return {
    entry: './src/js/main',
    output: {
      path: path.join(__dirname, 'public'),
      filename: is_DEVELOP
        ? 'assets/javascript/bundle.js'
        : 'assets/javascript/bundle.[contenthash].js',
    },
    devtool: is_DEVELOP ? 'source-map' : 'eval',
    watchOptions: {
      ignored: /node_modules/
    },
    plugins: [
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: [
          'assets/stylesheet',
          'assets/javascript',
        ]
      }),
      new MiniCssExtractPlugin({
        filename: is_DEVELOP
          ? 'assets/stylesheet/bundle.css'
          : 'assets/stylesheet/bundle.[contenthash].css',
      }),

      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'src/ejs/index.ejs',
        // 指定しないとstylesheetもhead内に書かれちゃう
        inject: 'body',
        // MODEによって切り替える方法とどっちがいいのかわかんない
        // hash: true,
        // prod時にコメントだけ削除する
        minify: is_DEVELOP ?
          false :
          {
            collapseWhitespace: false,
            removeComments: true,
          },
      }),
      new HtmlWebpackPlugin({
        filename: 'about/index.html',
        template: 'src/ejs/about/index.ejs',
        inject: 'body',
        minify: is_DEVELOP ?
          false :
          {
            collapseWhitespace: false,
            removeComments: true,
          },
      }),

      //なんかいいヤツらしい。ggrks
      new HtmlWebpackHarddiskPlugin({
        alwaysWriteToDisk: true
      })
    ],
    resolve: {
      // 拡張子を省略してimportできるようになる
      extensions: ['.js', '.ts'],
    },

    // UglifyJSPluginは非推奨
    optimization: {
      minimize: is_DEVELOP ?
        false :
        true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            ecma: 2020,
          }
        })
      ]
    },

    module: {
      rules: [
        {
          test: /\.ejs$/,
          use: 'ejs-compiled-loader',
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                url: false,// sassで相対パスを書けるようにする
                sourceMap: true,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    [
                      require('autoprefixer')({grid: true}),
                    ],
                  ],
                }
              }
            },
            {
              loader: 'sass-loader',
              options: {
                implementation: require('sass'),
                // importer: globImporter(),
                // sourceMap: true,
              },
            },
          ]
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                // promiseを使えるようにするヤツ
                presets: ['@babel/preset-env', '@babel/preset-react'],
                plugins: ['@babel/plugin-transform-runtime'],
              },
            },
          ],
        },
        {
          enforce: 'pre',
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'eslint-loader',
        },
      ],
    },
    devServer: {
      contentBase: path.resolve(__dirname, 'public'),
      port: 8080,
    },
    // エラーの詳細を吐かせる（？）
    stats: {
      children: true
    },
    target: is_DEVELOP ?
      // dev-serverのホットリロードが聞かない問題への対処
      "web" :
      // IE11対応（必須らしい）
      ["web", "es5"]
  }
}