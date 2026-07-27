import { statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error('Usage: npm run format -- <explicit-file> [more-files...]');
  process.exit(2);
}
for (const file of files) {
  if (file === '.' || file === './' || statSync(file).isDirectory()) {
    console.error(`Refusing repository or directory-wide formatting: ${file}`);
    process.exit(2);
  }
}
const result = spawnSync('prettier', ['--write', '--ignore-unknown', ...files], {
  stdio: 'inherit',
});
process.exit(result.status ?? 1);
