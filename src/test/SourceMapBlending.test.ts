import { TestBlender } from "./testUtils";

const simpleString =
	"const hello = 'world';\nconsole.log(hello);\nconsole.log(1)";
export class SourceMapsBlending {
	async "blend #1 - No modifications"() {
		const test = await TestBlender.init({
			originalCode: simpleString,
			modify: code => code
		});
		test.shouldMatchMapping("AAAA,IAAM,QAAQ;AACd,QAAQ,IAAI;AACZ,QAAQ,IAAI");
	}

	async "blend #2 - Replace all line breaks"() {
		const test = await TestBlender.init({
			originalCode: simpleString,
			modify: code => code.replace(/(?:\r\n|\r|\n)/g, "")
		});
		test.shouldMatchMapping("AAAA,IAAM,QAAQ,QACd,QAAQ,IAAI,OACZ,QAAQ,IAAI");
	}

	async "blend #3 - Prepend one extra line"() {
		const test = await TestBlender.init({
			originalCode: simpleString,
			modify: code => "console.log(123)\n" + code
		});
		test.shouldMatchMapping(
			"AAAA;AAAA,IAAM,QAAQ;AACd,QAAQ,IAAI;AACZ,QAAQ,IAAI"
		);
	}

	async "blend #3 - Append one extra line"() {
		const test = await TestBlender.init({
			originalCode: simpleString,
			modify: code => code + "\nconsole.log(123)"
		});
		test.shouldMatchMapping("AAAA,IAAM,QAAQ;AACd,QAAQ,IAAI;AACZ,QAAQ,IAAI");
	}

	async "blend #4 - Replace line with something else"() {
		const test = await TestBlender.init({
			originalCode:
				"const hello = 'world';\nconsole.log(hello);\nconsole.log(hello);\nconsole.log(2)",
			modify: code => code.replace("console.log(hello)", "alert(2)")
		});
		test.shouldMatchMapping(
			"AAAA,IAAM,QAAQ;AACd;AAAA,QAAQ,IAAI;AACZ,QAAQ,AACA,IAAI"
		);
	}

	async "blend #5 - Should understand es5 without spaces"() {
		const test = await TestBlender.init({
			originalCode:
				"class FooBar{ \nconstructor(){ \nconst foo = 1;\nconsole.log(foo)\n}\n} \nnew FooBar()",
			modify: code => code.replace(/(?:\r\n|\r|\n)/g, "")
		});
		test.shouldMatchMapping(
			"AAAA,IAAA,wBAAA,YAAA,KACA,SAAA,SAAA,SACA,IAAM,MAAM,UACZ,QAAQ,IAAI,cAEZ,OAAA,YACA,IAAI"
		);
	}
	async "blend #6 - Should understand removed if statements"() {
		const test = await TestBlender.init({
			originalCode:
				"const foo = 'foo'; \nif (foo !== 'foo'){\nconsole.log('nope') }\nelse {\n console.log('yes', foo)}\n console.log(1)",
			modify: code => `var foo = 'foo'; console.log('yes', foo); console.log(1);`
		});
		test.shouldMatchMapping(
			"AAAA,IAAM,MAAM,OAEZ,QAAQ,iBAEP,QAAQ,AACA,IAAI"
		);
	}
}
