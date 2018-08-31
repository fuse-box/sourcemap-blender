import { transpileCode, acornParse } from "../dev/devUtils";
import { Blender } from "../Blender";
import { should } from 'fuse-test-runner';

interface Opts {
	originalCode: string;
	modify: (code: string) => string;
}
export class TestBlender {
	private response;
	constructor(public opts: Opts) {}
	public static async init(opts: Opts) {
		const test = new TestBlender(opts);
		const response = await test.run();
		
		return test;
	}

	shouldMatchMapping(mapping : string){
		
		const map = JSON.parse(this.response)
		// AAAA,IAAM,QAAQ;AACd,QAAQ,IAAI;AACZ,QAAQ,IAAI
		// AAAA,MAAM,QAAQ;AACd,QAAQ,IAAI;AACZ,QAAQ,IAAI
		should(map.mappings).equal(mapping)
	}

	private async run(): Promise<string> {
		const output = transpileCode(this.opts.originalCode);
		const modifiedCode = this.opts.modify(output.transpiled);

		const blender = new Blender({
			parse: acornParse,
			originalMap: output.map,
			originalAST: output.ast,
			modifiedCode: modifiedCode
		});

		const data = await blender.blend();
		this.response = data.map;
		return data.map as string;
	}
}
