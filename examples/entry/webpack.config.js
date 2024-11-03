const path = require("path");
const webpack = require('../../webpack/lib/webpack')

const config = {
  context: path.join(__dirname),
  mode: 'development',
  entry: {
    a: './a.js',
		b: './b.js'
  },
  output: {
    path: path.join(__dirname,"dist"),
  }
}

webpack(config, (err, stats) => {
	if (err) {
		console.error(err);
		return;
	}

	stats.toString({
		colors: true, // 使输出带颜色
		// 添加以下选项以打印更详细的日志
		all: true, // 打印所有信息
		assets: true, // 打印资源信息
		modules: true, // 打印模块信息
		chunks: true, // 打印块信息
		errors: true, // 打印错误信息
		warnings: true // 打印警告信息
	});

	// 打印构建结果
	console.log(
		stats.toString({
			colors: true // 使输出带颜色
		})
	);
});
