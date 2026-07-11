#!/usr/bin/env node
import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["./api/_index.ts"],
  bundle: true,
  platform: "node",
  format: "esm",
  outfile: "./api/index.mjs",
  alias: {
    "@shared": "./shared",
  },
  packages: "external",
  logLevel: "info",
});
