import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// Get function name from command line argument
const functionName = process.argv[2];

if (!functionName) {
  console.error("You must provide a function name. Example:");
  console.error(" node scripts/bundle-edge.js add-friend");
  process.exit(1);
}

// Resolve paths
const functionDir = path.resolve(
  `backend/server/edge_functions/supabase/functions/${functionName}`
);
const entryFile = path.join(functionDir, "index.ts");
const distDir = path.join(functionDir, "dist");
const distFile = path.join(distDir, "index.mjs");
const destFile = path.join(functionDir, "index.ts");
const backupFile = path.join(functionDir, "unbundled.ts"); // 👈 new backup file path

// Step 1: Run tsup to bundle the function
try {
  console.log(`📦 Bundling ${functionName} using tsup...`);
  execSync(
    `npx tsup ${entryFile} --out-dir ${distDir} --format esm --target es2020 --splitting false --sourcemap false --clean --shims`,
    {
      stdio: "inherit",
    }
  );
} catch (err) {
  console.error("Failed to bundle with tsup:", err.message);
  process.exit(1);
}

// Check if dist file exists
if (!fs.existsSync(distFile)) {
  console.error("Bundled file not found:", distFile);
  process.exit(1);
}

// Backup the original index.ts
try {
  if (fs.existsSync(entryFile)) {
    fs.copyFileSync(entryFile, backupFile);
    console.log(`Backed up original index.ts to unbundled.ts`);
  } else {
    console.warn(`No original index.ts found to back up.`);
  }
} catch (err) {
  console.error("Failed to back up index.ts:", err.message);
  process.exit(1);
}

// Copy bundled file to index.ts (overwrite)
fs.copyFileSync(distFile, destFile);
console.log(`Copied ${distFile} to ${destFile}`);
