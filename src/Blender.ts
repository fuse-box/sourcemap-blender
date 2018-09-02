import * as sourceMap from "source-map";
import { FlatNodes } from "./FlatNode";
export class Blender {
	private originalFlatNodes: any;
	private flat: FlatNodes;
	private modifiedFlatNodes: any;
	public generatedSourceMap: any;
	constructor(
		public input: {
			parse: (content) => void;
			originalMap: any;
			originalAST: any;
			modifiedCode: string;
		}
	) {
		if (typeof input.originalMap === "string") {
			this.input.originalMap = JSON.parse(input.originalMap);
		}
	}

	public async blend(opts?: { sourceMappingURL?: string | boolean }) {
		opts = opts || {};
		let code = this.input.modifiedCode;
		const newMap = await this.start();
		if (opts.sourceMappingURL) {
			if (opts.sourceMappingURL === true) {
				code += `\n//# sourceMappingURL=module.js.map`;
			} else {
				code += `\n//# sourceMappingURL=${opts.sourceMappingURL}`;
			}
		}

		return {
			map: newMap,
			code: code
		};
	}

	private async start() {
		const modifiedAst = this.input.parse(this.input.modifiedCode);
		this.flat = new FlatNodes(this.input.originalAST, modifiedAst);

		return await this.consumeSourceMaps();
	}

	private async consumeSourceMaps() {
		const SourceMapConsumer = sourceMap.SourceMapConsumer;
		const SourceMapGenerator = sourceMap.SourceMapGenerator;
		const data = [];
		let map, sourceName;
		let newSourceMap;
		await SourceMapConsumer.with(this.input.originalMap, null, consumer => {
			sourceName = consumer.sources[0];
			map = new SourceMapGenerator({
				file: sourceName
			});

			map.setSourceContent(sourceName, consumer.sourceContentFor(sourceName)),
				this.flat.eachOriginalNode((original, modified) => {
					let isStart = true;
					let sm = consumer.originalPositionFor({
						...original.loc.start
					});
					if (!sm) {
						isStart = false;
						sm = consumer.originalPositionFor({
							...original.loc.end
						});
					}

					if (sm && modified) {
						if (sm.line) {
							map.addMapping({
								generated: {
									line: isStart ? modified.loc.start.line : modified.loc.end.line,
									column: isStart ? modified.loc.start.column : modified.loc.end.column
								},
								source: sourceName,
								original: {
									line: sm.line,
									column: sm.column
								}
							});
						}
					}
					consumer.destroy();
				});
			newSourceMap = map.toString();
		});
		return newSourceMap;
	}
}
