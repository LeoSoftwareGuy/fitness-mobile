const fs = require('fs');
const path = require('path');

/**
 * Metro crashes on Windows when it tries to lstat the Linux symlink that npm
 * creates for the tailwindcss -> yaml binary while running inside WSL. This
 * replaces that symlink with a small JS shim so both environments can read it.
 */
const problematicBins = [
  path.join('node_modules', 'tailwindcss', 'node_modules', '.bin', 'yaml'),
];

const repoRoot = path.resolve(__dirname, '..');
let replacements = 0;

for (const relativePath of problematicBins) {
  const binPath = path.join(repoRoot, relativePath);
  try {
    if (!fs.existsSync(binPath)) {
      continue;
    }

    const stat = fs.lstatSync(binPath);
    if (!stat.isSymbolicLink()) {
      continue;
    }

    const linkTarget = fs.readlinkSync(binPath);
    const absoluteTarget = path.resolve(path.dirname(binPath), linkTarget);
    const relativeTarget = path
      .relative(path.dirname(binPath), absoluteTarget)
      .replace(/\\/g, '/');

    const shimContents = [
      '#!/usr/bin/env node',
      `require(require('path').resolve(__dirname, ${JSON.stringify(relativeTarget)}));`,
      '',
    ].join('\n');

    fs.unlinkSync(binPath);
    fs.writeFileSync(binPath, shimContents, { mode: 0o755 });
    replacements += 1;
    console.log(`Replaced ${relativePath} symlink with JS shim.`);
  } catch (error) {
    console.warn(`Failed to patch ${relativePath}: ${error.message}`);
  }
}

if (replacements === 0) {
  console.log('No symlinks needed patching.');
}
