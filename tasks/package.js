console.log("Init task: Generate ZIP file");

import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import AdmZip from 'adm-zip';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths
const build_folder = resolve(__dirname, '../dist');
const zip_folder = resolve(__dirname, '../distZip');
const zip_path = join(zip_folder, 'dist.zip');

if (!fs.existsSync(build_folder)) {
  console.log("❌ No build folder was found");
  process.exit(1);
}

//Remove previous ZIP file
if (fs.existsSync(zip_folder)) {
  fs.removeSync(zip_folder);
}

fs.ensureDirSync(zip_folder);

try {
  const stdout = execSync("npm run build", { stdio: 'inherit' });
} catch (err) {
  console.error("❌ Error during build:");
  console.error(err.message);
  process.exit(1);
}

// Create new ZIP file
const zip = new AdmZip();
zip.addLocalFolder(build_folder);
zip.writeZip(zip_path);

console.log("✅ Task finished. ZIP created at:", zip_path);