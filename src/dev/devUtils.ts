import * as acorn from "acorn";
import * as ts from "typescript";

import * as path from "path";
import * as fs from "fs";

const tsconfig: any = {
	compilerOptions: {
		module: "commonjs",
		target: "es5",
		sourceMap: true,
		inlineSources: true,
		importHelpers: true,
		lib: ["es2015"],
		emitDecoratorMetadata: true,
		experimentalDecorators: true
	}
};

export function writeTestIndex(input: { source: string; maps: string }) {
	const content = `
    <!doctype html>
<html>
<head>
    <title></title>
</head>

<body>
    <script type="text/javascript" src="/module.js"></script>
</body>

</html>`;
	const moduleJS = path.resolve("./dist/module.js");
	const sourceMaps = path.resolve("./dist/module.js.map");
	const index = path.resolve("./dist/index.html");

	fs.writeFileSync(moduleJS, input.source);
	fs.writeFileSync(sourceMaps, input.maps);
	fs.writeFileSync(index, content);
}

export function writeToDist(name: string, contents) {
	const target = path.resolve("./dist/", name);
	fs.writeFileSync(target, contents);
}

export function acornParse(source) {
	return acorn.parse(source, {
		...{
			sourceType: "module",
			tolerant: true,
			locations: true,
			ranges: true,
			ecmaVersion: "2018"
		}
	});
}

export function transpileCode(contents) {
	const response = ts.transpileModule(contents, tsconfig);
	const text = response.outputText;
	return {
		map: JSON.parse(response.sourceMapText),
		ast: acornParse(response.outputText),
		transpiled: response.outputText
	};
}
