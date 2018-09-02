export function fastHash(text: string) {
	let hash = 0;
	if (text.length == 0) return hash;
	for (let i = 0; i < text.length; i++) {
		let char = text.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash; // Convert to 32bit integer
	}
	let result = hash.toString(16).toString();
	if (result.charAt(0) === "-") {
		result = result.replace(/-/, "0");
	}
	return result;
}

export function visit(ast, fn) {
	let visit = (node, parent, prop?, idx?) => {
		if (!node || typeof node.type !== "string") {
			return;
		}
		if (node.__nodeVisited) {
			return;
		}
		node.$parent = parent;
		node.$prop = prop;
		node.$idx = idx;
		let res = undefined;
		res = fn(node, parent, prop, idx);
		node.__nodeVisited = true;
		if (typeof res === "object" && res.type) {
			return visit(res, null);
		}
		if (res !== false) {
			for (let prop in node) {
				if (prop[0] === "$") {
					continue;
				}
				let child = node[prop];
				if (Array.isArray(child)) {
					for (let i = 0; i < child.length; i++) {
						visit(child[i], node, prop, i);
					}
				} else {
					visit(child, node, prop);
				}
			}
		}
	};
	visit(ast, null);
}
