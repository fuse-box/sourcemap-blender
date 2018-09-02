import { fastHash, visit } from "./utils";

export interface ILocation {
	line: number;
	column: number;
}
export interface IFlatNode {
	type: string;
	relativeId: string;
	looped?: boolean;
	loc: {
		start: ILocation;
		end: ILocation;
	};
}

export class FlatNodes {
	original: Array<IFlatNode>;
	modified: Array<IFlatNode>;
	constructor(original, modified) {
		this.original = [];
		this.modified = [];
		this.generate(original, modified);
	}

	public eachOriginalNode(fn: (original: IFlatNode, modified: IFlatNode) => void) {
		let successIndex = 0;
		this.original.forEach((item, index) => {
			const found = this.modified.find((mod, index) => {
				if (mod.relativeId === item.relativeId && index >= successIndex) {
					successIndex = index;
					return true;
				}
				return false;
			});
			fn(item, found);
		});
	}

	private prepareNode(node): IFlatNode {
		const args = [];
		let i = 0;
		if (node.object) args.push("a");
		if (node.callee) args.push("b");
		if (node.body) args.push("c");
		if (node.property) args.push("d");
		if (node.arguments) args.push("f");
		if (node.kind) args.push("g");
		if (node.method) args.push("h");
		if (node.shorthand) args.push("i");
		if (node.computed) args.push("g");
		if (node.expression) args.push("k");
		if (node.type) args.push(`l:${node.type}`);
		if (node.$prop) args.push(`m:${node.$prop}`);
		if (node.value) args.push(`n:${node.value}`);
		if (typeof node.name === "string") {
			args.push(`o:${node.name}`);
		} else {
			args.push(`o`);
		}
		if (typeof node.kind === "string") {
			args.push(`p:${node.kind}`);
		}
		const relativeID = fastHash(args.join(":"));
		return {
			relativeId: relativeID as string,
			type: node.type,
			loc: node.loc
		};
	}

	private generate(ast1, ast2) {
		visit(ast1, node => {
			this.original.push(this.prepareNode(node));
		});
		visit(ast2, node => {
			this.modified.push(this.prepareNode(node));
		});
	}
}
