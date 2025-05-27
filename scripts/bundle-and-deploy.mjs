import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// Get function name from command line argument
const functionName = process.argv[2];

if (!functionName) {
  console.error("You must provide a function name. Example:");
  console.error("  node scripts/bundle-and-deploy.mjs add-friend");
  process.exit(1);
}

// Resolve paths
const functionDir = path.resolve(
  `backend/server/edge_functions/supabase/functions/${functionName}`
);
const entryFile = path.join(functionDir, "index.ts");
const distDir = path.join(functionDir, "dist");
const distFile = path.join(distDir, "index.mjs");

// Bundle function
try {
  console.log(`▶️  Bundling ${functionName} using tsup...`);
  execSync(
    `npx tsup ${entryFile} --out-dir ${distDir} --format esm --target es2020 --splitting false --sourcemap false --clean --shims`,
    { stdio: "inherit" }
  );
} catch (err) {
  console.error("Failed to bundle with tsup:", err.message);
  process.exit(1);
}

// Check if bundled file exists
if (!fs.existsSync(distFile)) {
  console.error("Bundled file not found:", distFile);
  process.exit(1);
}

console.log(`Bundled output located at: ${distFile}`);
console.log(`Deploying function ${functionName}...`);

// Deploy
try {
  execSync(`supabase functions deploy ${functionName} --use-docker=false`, {
    cwd: path.resolve("backend/server/edge_functions"), // important!
    stdio: "inherit",
  });
  console.log("Deployment complete.");
} catch (err) {
  console.error("Error deploying function:", err.message);
  process.exit(1);
}
