const path = require("path");

const webpack = require("webpack"),
	{ VueLoaderPlugin } = require("vue-loader"),
	HtmlWebpackPlugin = require("html-webpack-plugin"),
	MiniCssExtractPlugin = require("mini-css-extract-plugin"),
	{ WebpackManifestPlugin } = require("webpack-manifest-plugin");

const config = require("./full.config.js");

module.exports = {
	mode: config.buildMode,
	output: {
		filename: path.join(config.output.assets.javascript.base, config.output.assets.javascript.filename),
		chunkFilename: path.join(config.output.assets.javascript.base, config.output.assets.javascript.filename),
		publicPath: config.output.publicPath,
		clean: config.enableOutputFolderCleaning,
	},
	devtool: config.devTool,
	resolve: {
		symlinks: config.resolveSymlinks,
	},
	optimization: {
		splitChunks: {
			filename: path.join(config.output.assets.javascript.base, config.output.assets.javascript.filename),
		},
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: "vue-loader",
			},
			{
				test: /\.css$/i,
				use: [config.isDevelopment ? "vue-style-loader" : MiniCssExtractPlugin.loader, "css-loader"],
			},
			{
				test: /\.(ico|png|jpe?g|gif|webp)(\?.*)?$/,
				use: [
					{
						loader: "url-loader",
						options: {
							limit: 4096,
							fallback: {
								loader: "file-loader",
								options: {
									name: path.join(config.output.assets.images.base, config.output.assets.images.filename),
									esModule: false,
								},
							},
						},
					},
				],
			},
			{
				test: /\.(js)(\?.*)?$/,
				exclude: config.babelLoaderExclude,
				use: {
					loader: "babel-loader",
				},
			},
		],
	},
	plugins: [
		new webpack.DefinePlugin({
			__VUE_OPTIONS_API__: "true",
			__VUE_PROD_DEVTOOLS__: "false",
		}),
		new webpack.SourceMapDevToolPlugin({
			filename: config.output.assets.sourceMaps.filename,
			publicPath: config.output.publicPath,
		}),
		new WebpackManifestPlugin({
			fileName: config.output.manifestFilename,
			useEntryKeys: true,
		}),
		new VueLoaderPlugin(),
		new HtmlWebpackPlugin({
			template: config.input.assets.pageTemplate,
		}),
		new MiniCssExtractPlugin({
			filename: path.join(config.output.assets.css.base, config.output.assets.css.filename),
		}),
	],
};
