/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath, callback);
    } else if (file.endsWith(".js")) {
      callback(filePath);
    }
  });
}

function fixEsmImports(dir) {
  walkDir(dir, (file) => {
    let content = fs.readFileSync(file, "utf8");
    let changed = false;

    // Fix relative imports - handle all variations
    content = content.replace(
      /from\s+["'](\.\.[/\\][^"']*|\.\/[^"']*)["']/g,
      (match, importPath) => {
        if (!importPath.endsWith(".js")) {
          changed = true;
          return match.replace(importPath, importPath + ".js");
        }
        return match;
      }
    );

    // Fix import statements too
    content = content.replace(
      /import\s+["'](\.\.[/\\][^"']*|\.\/[^"']*)["']/g,
      (match, importPath) => {
        if (!importPath.endsWith(".js")) {
          changed = true;
          return match.replace(importPath, importPath + ".js");
        }
        return match;
      }
    );

    if (changed) {
      fs.writeFileSync(file, content);
      console.log(`Fixed imports in: ${file}`);
    }
  });
}

const targetDir = process.argv[2] || "./dist/esm";
fixEsmImports(targetDir);
console.log("ESM imports fixed successfully");
