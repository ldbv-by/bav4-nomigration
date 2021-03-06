const baseConfig = require('./karma.conf.js');
const fs = require('fs');
const path = require('path');

function findInDir(dir, filter, fileList = []) {
	const files = fs.readdirSync(dir);

	files.forEach((file) => {
		const filePath = path.join(dir, file);
		const fileStat = fs.lstatSync(filePath);

		if (fileStat.isDirectory()) {
			findInDir(filePath, filter, fileList);
		}
		else if (filter.test(filePath)) {
			fileList.push(filePath);
		}
	});

	return fileList;
}

const files = findInDir('./test', /\.test.js$/).filter(file => {
	// eslint-disable-next-line no-undef
	return file.split('/').pop() === process.env.KARMA_SPEC;
});
if (files.length < 1) {
	// eslint-disable-next-line no-undef
	throw new Error('Designated test file "' + process.env.KARMA_SPEC + '" not found');
}
else if (files.length > 1) {
	// eslint-disable-next-line no-undef
	throw new Error('More than one test file found for "' + process.env.KARMA_SPEC + '"');
}

module.exports = function (config) {

	// Load base config
	baseConfig(config);

	config.set({
		frameworks: ['jasmine', 'webpack'],
		// list of files / patterns to load in the browser
		files: [
			{ pattern: files[0], watched: false },
		],
		// preprocess matching files before serving them to the browser
		preprocessors: {
			'test/**/*.test.js': ['webpack'],
		},
		browsers: ['FirefoxHeadless'],
	});
};
