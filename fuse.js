const {
	src,
	task,
	exec,
	context,
	tsc,
	bumpVersion,
	npmPublish
} = require("fuse-box/sparky");
const { FuseBox, WebIndexPlugin } = require("fuse-box");

task("default", async context => {
	await context.clean();
	await context.development();
});

task("tsc", async () => {
	await tsc("src", {
		target: "esnext",
		declaration: true,
		outDir: "dist/"
	});
});

task("test", async context => {
	await context.test();
});
task("dist", async context => {
	await context.clean();
	await context.prepareDistFolder();

	await exec("tsc");
});

task("publish", async () => {
	await exec("dist");
	await npmPublish({ path: "dist" });
});

context(
	class {
		async tsc() {
			await tsc("src", {
				target: "esnext"
			});
		}
		getConfig(){
			return FuseBox.init({
				homeDir: "src",
				log : !!this.log,
				output: "dist/$name.js",
				target: "server",
				plugins: [WebIndexPlugin()]
			});
		}
		async test() {
			this.log = false;
			this.target = "server@esnext";
			this.bundleName = "app";
			const fuse = this.getConfig();
			await fuse.bundle("app").test(`[**/**.test.ts]`);
			await fuse.run();
		}

		async clean() {
			await src("./dist")
				.clean("dist/")
				.exec();
		}

		async prepareDistFolder() {
			await bumpVersion("package.json", { type: "patch" });
			await src("./package.json")
				.dest("dist/")
				.exec();
		}

		development() {
			const fuse = this.getConfig();
			fuse.dev();
			fuse
				.bundle("app")
				.watch()
				.completed(proc => proc.start())
				.instructions(" > [dev/dev.ts]");
			fuse.run();
		}
	}
);
