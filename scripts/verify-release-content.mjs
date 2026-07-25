import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const legalSource = readFileSync(
  join(root, 'apps/web/src/content/legal/index.ts'),
  'utf8',
);
const sharedSource = readFileSync(
  join(root, 'packages/shared/src/index.ts'),
  'utf8',
);

const violations = [];
const fixturePattern = /fixture\s*:\s*true/;
const placeholderPattern =
  /개발용 문서|개발용 fixture|배포에 사용할 수 없습니다|TODO|PLACEHOLDER/i;
const versionPattern =
  /CURRENT_(?:TERMS|PRIVACY)_VERSION\s*=\s*['"]([^'"]+)['"]/g;
const versions = [...sharedSource.matchAll(versionPattern)].map((match) => match[1]);

if (fixturePattern.test(legalSource)) {
  violations.push('legalDocuments still contains fixture:true');
}
if (placeholderPattern.test(legalSource)) {
  violations.push('legalDocuments still contains fixture/placeholder copy');
}
if (versions.length !== 2 || versions.some((version) => /(?:dev|draft|fixture)/i.test(version))) {
  violations.push('legal consent versions are missing or non-production');
}
for (const required of ['support@davas.app', '시행일', '처리 목적', '보유', '권리']) {
  if (!legalSource.includes(required)) {
    violations.push(`legalDocuments is missing required marker: ${required}`);
  }
}

if (violations.length > 0) {
  console.error('Legal release guard failed:');
  for (const violation of violations) console.error(`- ${violation}`);
  process.exit(1);
}

console.log(`Legal release guard passed: ${versions.join(', ')}`);
