const path = require("path");

module.exports = {
	entry: {
		score: "./plinko/score.js",
		game: "./plinko/game.js"
	},
	output: {
		filename: "[name].bundle.js",
		path: path.resolve(__dirname, "plinko/dist")
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env"]
					}
				}
			}
		]
	}
};
