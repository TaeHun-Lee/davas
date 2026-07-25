#!/usr/bin/env node

import { readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const scopes = {
  shared: path.join(root, 'packages/shared'),
  api: path.join(root, 'apps/api'),
  web: path.join(root, 'apps/web'),
};

async function discover(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await discover(target));
    if (entry.isFile() && /\.(?:spec|test)\.ts$/.test(entry.name)) files.push(target);
  }
  return files;
}

const requested = process.argv.slice(2);
const selected = requested.length === 0 ? Object.keys(scopes) : requested;
for (const scope of selected) {
  if (!(scope in scopes)) {
    console.error(`Unknown test scope: ${scope}. Expected one of ${Object.keys(scopes).join(', ')}`);
    process.exit(2);
  }
}

if (selected.some((scope) => scope === 'api' || scope === 'web')) {
  console.log('Building @davas/shared before workspace tests');
  const sharedBuild = spawnSync(
    'npm',
    ['run', 'build', '--workspace', '@davas/shared'],
    { cwd: root, stdio: 'inherit', env: process.env },
  );
  if (sharedBuild.error || sharedBuild.status !== 0) {
    if (sharedBuild.error) console.error(sharedBuild.error.message);
    process.exit(sharedBuild.status ?? 1);
  }
}

let failed = false;
let totalFiles = 0;
for (const scope of selected) {
  const workspace = scopes[scope];
  const files = (await discover(path.join(workspace, 'src'))).sort();
  totalFiles += files.length;

  if (files.length === 0) {
    console.log(`No test files found for: ${scope}`);
    continue;
  }

  console.log(`Running ${files.length} test files for: ${scope}`);
  const result = spawnSync(
    process.execPath,
    ['--test', '--import', 'tsx', ...files],
    { cwd: workspace, stdio: 'inherit', env: process.env },
  );

  if (result.error) {
    console.error(result.error.message);
    failed = true;
    continue;
  }
  if (result.status !== 0) failed = true;
}

console.log(`Test harness completed: ${totalFiles} files across ${selected.length} scope(s).`);
process.exit(failed ? 1 : 0);
