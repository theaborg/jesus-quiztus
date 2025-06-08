import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["index.ts"],
  outDir: "dist",
  format: "esm",
  target: "es2020",
  splitting: false,
  sourcemap: false,
  clean: true,
  dts: false,
  shims: true,
  external: [], // Make sure 'lib' is bundled
  outExtension: () => ({ js: ".js" }),
});
