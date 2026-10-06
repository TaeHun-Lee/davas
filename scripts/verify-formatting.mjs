import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import prettier from 'prettier';
import baseline from './prettier-baseline.json' with { type: 'json' };

function gitPaths(args) {
  const result = spawnSync('git', args, { encoding: 'buffer' });
  if (result.status !== 0) {
    process.stderr.write(result.stderr);
    process.exit(result.status ?? 1);
  }
  return result.stdout.toString('utf8').split('\0').filter(Boolean);
}

const files = gitPaths(['ls-files', '-z', '--cached', '--others', '--exclude-standard']).sort();
const changedFiles = new Set([
  ...gitPaths(['diff', '--name-only', '-z', 'HEAD', '--']),
  ...gitPaths(['ls-files', '--others', '--exclude-standard', '-z']),
]);
const prettierIgnore = resolve('.prettierignore');
const failures = [];
const acceptedBaseline = new Set();
let checked = 0;
let formatted = 0;

for (const path of files) {
  const absolute = resolve(path);
  const info = await prettier.getFileInfo(absolute, { ignorePath: prettierIgnore });
  if (info.ignored || !info.inferredParser) continue;
  checked += 1;
  const content = readFileSync(absolute, 'utf8');
  const config = (await prettier.resolveConfig(absolute)) ?? {};
  const expected = await prettier.format(content, { ...config, filepath: absolute });
  if (content === expected) {
    formatted += 1;
    continue;
  }
  const hash = createHash('sha256').update(content).digest('hex');
  if (baseline[path] === hash) {
    if (changedFiles.has(path)) {
      failures.push(`${path}: changed files cannot use the legacy baseline`);
      continue;
    }
    acceptedBaseline.add(path);
    continue;
  }
  failures.push(`${path}: not formatted and does not match the legacy baseline`);
}

for (const path of Object.keys(baseline)) {
  if (!acceptedBaseline.has(path)) {
    failures.push(`${path}: stale legacy baseline entry`);
  }
}

if (failures.length > 0) {
  console.error(`Formatting check failed: ${failures.length} issue(s).`);
  for (const failure of failures.slice(0, 50)) console.error(`- ${failure}`);
  if (failures.length > 50) console.error(`- ... ${failures.length - 50} more`);
  process.exit(1);
}

console.log(
  `Formatting check passed: ${checked} files (${formatted} formatted, ${acceptedBaseline.size} unchanged legacy baseline).`,
);
