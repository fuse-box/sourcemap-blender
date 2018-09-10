import { transpileCode, writeTestIndex, acornParse } from "./devUtils";
import * as escodegen from "escodegen";
import { Blender } from "../Blender";
import * as fs from "fs";
import * as path from "path";

const cnt = fs.readFileSync(path.resolve(__dirname, "../src/dev/test.txt")).toString();
const simpleString = cnt
const output = transpileCode(simpleString);


const modifiedCode = escodegen.generate(output.ast);

// modifiedCode = `
// window.somestuff = [1,2, "3", "oho"]
// console.log("some bullshit here")
// ${modifiedCode}
// `;

const blender = new Blender({
	parse: acornParse,
	originalMap: output.map,
	originalAST: output.ast,
	modifiedCode: modifiedCode
});

const data = blender.blend({sourceMappingURL : true});
data.then(data => {
	writeTestIndex({
		source: output.transpiled,
		maps: JSON.stringify(output.map)//data.map
	});

	// writeTestIndex({
	// 	source: data.code,
	// 	maps: data.map
	// });

	// writeTestIndex({
	//     source :output.transpiled,
	//     maps : JSON.stringify(output.map)
	// })
});
