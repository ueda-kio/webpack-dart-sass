const path = require('path');
const globule = require('globule');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

// ejsファイルが増えても問題ないような処置
const assignPlugins = (env_mode) => {
	const srcFiles = globule.find(['**/*.ejs', '!**/_*.ejs'], {
		cwd: `${__dirname}/src/ejs`
	});
	const assignObject = {
		plugins: [
			new CleanWebpackPlugin({
				cleanOnceBeforeBuildPatterns: [
					'assets/stylesheet',
					'assets/javascript',
				]
			}),
			new MiniCssExtractPlugin({
				filename: env_mode ?
					'assets/stylesheet/bundle.css' :
					'assets/stylesheet/bundle.[contenthash].css',
			}),
			//なんかいいヤツらしい。
			new HtmlWebpackHarddiskPlugin({
				alwaysWriteToDisk: true
			}),
			// 画像をassets/images/にコピー
			new CopyPlugin({
				patterns: [{
					from: "src/images/",
					to: "assets/images/"
				}]
			})
		]
	};

	const entriesList = srcFiles.reduce((temp, current) => {
		temp[`${current.replace(new RegExp(`.ejs`, 'i'), `.html`)}`] = `${__dirname}/src/ejs/${current}`;
		return temp;
	}, {});

	const pushEntryFiles = (filename, template) => {
		const _obj = {
			filename: filename,
			template: template,
			// 指定しないとjsもhead内に書かれちゃう
			inject: 'body',
			// prod時にコメントだけ削除する
			minify: env_mode ?
				false :
				{
					collapseWhitespace: false,
					removeComments: true,
				},
		};

		assignObject.plugins.push(new HtmlWebpackPlugin(_obj));
	};

	for (const [htmlFileName, ejsFileName] of Object.entries(entriesList)) {
		pushEntryFiles(htmlFileName, ejsFileName);
	}

	return assignObject;
};

module.exports = (env, argv) => {
	const is_DEVELOP = argv.mode === "development";

	return [
		Object.assign({
			entry: {
				mainJs: './src/js/main',
				mainTs: './src/ts/main'
			},
			output: {
				path: path.join(__dirname, 'public'),
				filename: is_DEVELOP ?
					'assets/javascript/[name].js' :
					'assets/javascript/[name].[contenthash].js',
			},
			devtool: is_DEVELOP ? 'source-map' : 'eval',
			watchOptions: {
				ignored: /node_modules/
			},
			resolve: {
				// 拡張子を省略してimportできるようになる
				extensions: ['.js', '.ts'],
			},

			// UglifyJSPluginは非推奨
			optimization: {
				minimize: is_DEVELOP ? false : true,
				minimizer: [
					new TerserPlugin({
						terserOptions: {
							ecma: 2020,
						}
					})
				]
			},

			module: {
				rules: [{
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
									url: false, // sassで相対パスを書けるようにする
									sourceMap: true,
								},
							},
							{
								loader: 'postcss-loader',
								options: {
									postcssOptions: {
										plugins: [
											[
												require('autoprefixer')({
													grid: true
												}),
											],
										],
									}
								}
							},
							{
								loader: 'sass-loader',
								options: {
									implementation: require('sass'),
								},
							},
						]
					},
					{
						test: /\.js$/,
						exclude: /node_modules/,
						use: [{
							loader: 'babel-loader',
							options: {
								// promiseを使えるようにするヤツ
								presets: ['@babel/preset-env', '@babel/preset-react'],
								plugins: ['@babel/plugin-transform-runtime'],
							},
						}, ],
					},
					{
						test: /\.ts$/,
						exclude: /node_modules/,
						use: [{
							loader: 'babel-loader',
							options: {
								presets: ['@babel/preset-typescript'],
								plugins: ['@babel/proposal-class-properties'],
							},
						}, ],
					},
					{
						enforce: 'pre',
						test: /\.js$|\.ts$/,
						exclude: /node_modules/,
						loader: 'eslint-loader',
					},
				],
			},
			devServer: {
				contentBase: path.resolve(__dirname, 'public'),
				port: 8080,
			},
			stats: {
				children: true //現状機能していない模様
			},
			target: is_DEVELOP ?
				// dev-serverのホットリロードが効かない問題への対処
				"web" :
				// IE11対応（必須らしい）
				["web", "es5"]
		}, assignPlugins(is_DEVELOP))
	]
}