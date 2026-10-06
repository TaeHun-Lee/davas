import { readFileSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const listed = spawnSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard'], {
  encoding: 'buffer',
});
if (listed.status !== 0) {
  process.stderr.write(listed.stderr);
  process.exit(listed.status ?? 1);
}

const binaryExtensions = new Set([
  '.gif',
  '.ico',
  '.jpeg',
  '.jpg',
  '.pdf',
  '.png',
  '.webp',
  '.woff',
  '.woff2',
]);
const files = listed.stdout.toString('utf8').split('\0').filter(Boolean);
const violations = [];
let checked = 0;

for (const file of files) {
  if (!statSync(file, { throwIfNoEntry: false })?.isFile()) continue;
  const extension = file.includes('.') ? file.slice(file.lastIndexOf('.')).toLowerCase() : '';
  if (binaryExtensions.has(extension)) continue;
  const content = readFileSync(file);
  if (content.includes(0)) continue;
  checked += 1;
  if (content.includes(13)) violations.push(file);
}

if (violations.length > 0) {
  console.error(`LF check failed: ${violations.length} project text files contain CR bytes.`);
  for (const file of violations.slice(0, 50)) console.error(`- ${file}`);
  if (violations.length > 50) {
    console.error(`- ... ${violations.length - 50} more`);
  }
  process.exit(1);
}

console.log(`LF check passed: ${checked} project text files.`);
