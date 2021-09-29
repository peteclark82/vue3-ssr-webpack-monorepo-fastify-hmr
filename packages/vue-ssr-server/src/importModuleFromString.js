const { Module, createRequire } = require("module"),
	path = require("path"),
	vm = require("vm");

module.exports = (code) => {
	const moduleFilename = path.join(__dirname, `1234.js`);
	const contextModule = new Module(moduleFilename, require.main);

	contextModule.filename = moduleFilename;
	contextModule.path = __dirname;
	contextModule.paths = require.main?.paths ?? [];
	contextModule.require = createRequire(moduleFilename);

	vm.runInNewContext(code, {
		__dirname: contextModule.path,
		__filename: contextModule.filename,
		exports: contextModule.exports,
		module: contextModule,
		require: contextModule.require,
	});

	return contextModule.exports;
};
