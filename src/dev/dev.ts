import { transpileCode, writeTestIndex, acornParse } from "./devUtils";
import * as escodegen from "escodegen";
import { Blender } from "../Blender";

const simpleString = "const foo = 'foo'; \nif (foo !== 'foo'){\nconsole.log('nope') }\nelse {\n console.log('yes', foo)}\n console.log(1)";
const output = transpileCode(simpleString);


let modifiedCode = output.transpiled
	.replace("if (foo !== 'foo'){\nconsole.log('nope') }\nelse {\n", "")
	.replace("foo)}", "foo)")
modifiedCode =`var foo = 'foo'; console.log('yes', foo); console.log(1);`
//console.log(modifiedCode);
//escodegen.generate(output.ast);
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
console.log("here");

const data = blender.blend();
data.then(data => {
    
	writeTestIndex({
		source: data.code,
		maps: data.map
	});

	// writeTestIndex({
	//     source :output.transpiled,
	//     maps : JSON.stringify(output.map)
	// })
});
