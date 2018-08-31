# Sourcemap Blender

[![Build Status](https://travis-ci.com/fuse-box/sourcemap-blender.svg?branch=master)](https://travis-ci.com/fuse-box/sourcemap-blender)

This project is for those who struggle with broken source maps because of:

* Re-formatted code.
* AST modifications

`sourcemap-blender` works magic. It takes original source maps, original AST and the generated code (could be generated with pretty much any generator with any format), walks the AST nodes and updates the original source maps with new positions. What's really unique about this library is that you can modify the code, as in, add new nodes, remove e.t.c and the library will still find the unchanged nodes and re-wire them.

## How to use

First install it from NPM

```bash
npm install sourcemap-blender
```

```ts
import { Blender } from "sourcemap-blender";
import * as acorn from "acorn";

const blender = new Blender({
  parse: source =>  acorn.parse(source),
  originalMap: originalMap,
  originalAST: originalAST,
  modifiedCode: modifiedCode
});
async function init(){
  const blender = await blender.blend();
  // blender.map
}
init();
```

`originalMap` is the source map that you want to be fixed, `originalAST` is the AST tree that contains the correct mappins. 

After you've played around with nodes, you can generate the code with `escodegen` for example:

```ts
escodegen.generate(modifiedAST)
```

`escodegen` is a great library, but what i've been struggling with is that it changes the formatting, ignoring the locations.
The generated code will break the sourcemaps 100%. But that's where `sourcemap-blender` comes in handy


Have fun!

