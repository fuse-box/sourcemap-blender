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
	args: Array<string>;
}

export class FlatNodes {
	original: Array<IFlatNode>;
	modified: Array<IFlatNode>;
	constructor(original, modified) {
		this.original = [];
		this.modified = [];
		this.generate(original, modified);
	}

	public eachOriginalNode(
		fn: (original: IFlatNode, modified: IFlatNode) => void
	) {
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
		if (node.object) {
			args.push("object");
		}
		if (node.callee) {
			args.push("callee");
		}
		if (node.body) {
			args.push("body");
		}
		if (node.property) {
			args.push("property");
		}
		if (node.arguments) {
			args.push("arguments");
		}
		if (node.kind) {
			args.push("kind");
		}
		if (node.method) {
			args.push("method");
		}
		if (node.shorthand) {
			args.push("shorthand");
		}
		if (node.computed) {
			args.push("computed");
		}
		if (node.expression) {
			args.push("expression");
		}
		if (node.type) {
			args.push(`type:${node.type}`);
		}
		if (node.$prop) {
			args.push(`prop:${node.$prop}`);
		}

		if (node.value) {
			args.push(`v:${node.value}`);
		}
		
		if (typeof node.name === "string") {
			args.push(`name:${node.name}`);
		} else {
			args.push(`name`);
		}
		if (typeof node.kind === "string") {
			args.push(`kind:${node.kind}`);
		}
		const relativeID = fastHash(args.join(":"));

		return {
			relativeId: relativeID as string,
			type: node.type,
			loc: node.loc,
			args: args
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
