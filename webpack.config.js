const path = require('path');
const HtmlWepackPlugin = require('html-webpack-plugin');
const { WebpackOpenBrowser } = require('webpack-open-browser');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const SimpleProgressPlugin = require('webpack-simple-progress-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (options) => {
	return {
		mode: options.production ? 'production': 'development',
		entry: './src/js/app.js',
		output: {
			filename: 'js/game.[fullhash].js',
			path: path.resolve(__dirname, 'client'),
			clean: true,
		},

		performance: { hints: false },

		devtool: options.production ? undefined : 'source-map',

		module: {
			rules: [
				{
					test: /\.m?js$/,
					exclude: /node_modules/,
					use: {
					  loader: 'babel-loader',
					  options: {
						presets: ['@babel/preset-env'],
						plugins: ['@babel/plugin-proposal-class-properties'],
					  },
					}
				}
			],
		},

		plugins: [
			new HtmlWepackPlugin({
				hash: true,
				minify: {
					html5: true,
					collapseWhitespace: true,
					removeComments: true,
				},
				inject: 'body',
				filename: 'index.html',
				template: __dirname + '/src/index.html',
			}),
			new CopyWebpackPlugin({
				patterns: [
					{
						from: 'src/images/',
						to: 'images/',
					}
				],
			}),
			new SimpleProgressPlugin(),
			new WebpackOpenBrowser({ url: 'http://localhost:3000', browser: 'chrome' }),
		],

		resolve: {
			extensions: ['.js'],
		},

		devServer: {
			host: '127.0.0.1',
			port: 3000,
			hot: true,
			liveReload: true,
		},

		optimization: {
			minimize: options.production,
			minimizer: [
				new TerserPlugin({
					terserOptions: {
						ecma: 5,
						compress: { drop_console: true },
						output: { comments: false, beautify: false },
					},
				}),
			],
		},
	};
};
