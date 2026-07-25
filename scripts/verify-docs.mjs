#!/usr/bin/env node

import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const required = [
  'README.md',
  'AGENTS.md',
  'docs/README.md',
  'docs/product/core-experience.md',
  'docs/architecture/system-overview.md',
  'docs/development/local-development.md',
  'docs/operations/raspberry-pi-deployment.md',
  'docs/verification/quality-gates.md',
  'docs/harness/agent-harness.md',
  '.agents/skills/davas-core-development/SKILL.md',
];
const forbidden = [
  'docs/product/davas-app-draft.md',
  'docs/product/davas-pwa-self-hosted-design.md',
  'docs/product/davas-design-implementation-prompts.md',
  'docs/product/davas-high-value-screen-flow-codex-prompt-pair.md',
  'docs/product/davas-high-value-screen-flow-todo.md',
  'docs/product/davas-high-value-screen-flow-implementation-status.md',
  'docs/product/davas-high-value-screen-flow-revalidation.md',
  'docs/product/davas-core-experience-codex-prompts.md',
  'docs/development/docker.md',
  'docs/deployment/raspberry-pi-duckdns.md',
  '.hermes/reports/docs-audit-2026-07-25.md',
];

async function exists(target) {
  try { await stat(target); return true; } catch { return false; }
}

async function markdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await markdownFiles(target));
    if (entry.isFile() && entry.name.endsWith('.md')) files.push(target);
  }
  return files;
}

const errors = [];
for (const relative of required) {
  if (!await exists(path.join(root, relative))) errors.push(`Missing required file: ${relative}`);
}
for (const relative of forbidden) {
  if (await exists(path.join(root, relative))) errors.push(`Forbidden stale file exists: ${relative}`);
}

const files = [
  path.join(root, 'README.md'),
  path.join(root, 'AGENTS.md'),
  ...await markdownFiles(path.join(root, 'docs')),
  path.join(root, '.agents/skills/davas-core-development/SKILL.md'),
];
const decoder = new TextDecoder('utf-8', { fatal: true });

for (const file of files) {
  let text;
  try {
    const bytes = await readFile(file);
    if ((bytes[0] === 0xff && bytes[1] === 0xfe) || (bytes[0] === 0xfe && bytes[1] === 0xff)) {
      throw new Error('UTF-16 BOM is not allowed');
    }
    text = decoder.decode(bytes);
  } catch (error) {
    errors.push(`${path.relative(root, file)} is not valid UTF-8: ${error.message}`);
    continue;
  }

  const links = [...text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)].map((match) => match[1]);
  for (const raw of links) {
    const link = raw.trim().split('#')[0];
    if (!link || link.startsWith('#') || /^[a-z][a-z0-9+.-]*:/i.test(link) || link.startsWith('/')) continue;
    const target = path.resolve(path.dirname(file), decodeURI(link));
    if (!await exists(target)) {
      errors.push(`Broken link in ${path.relative(root, file)}: ${raw}`);
    }
  }
}

const agents = await readFile(path.join(root, 'AGENTS.md'), 'utf8');
if (agents.length > 20_000) errors.push(`AGENTS.md exceeds Hermes 20,000 character context limit: ${agents.length}`);

const skill = await readFile(path.join(root, '.agents/skills/davas-core-development/SKILL.md'), 'utf8');
if (!skill.startsWith('---\n')) errors.push('SKILL.md frontmatter must start at byte 0');
const closing = skill.indexOf('\n---\n', 4);
if (closing < 0) errors.push('SKILL.md frontmatter closing delimiter is missing');
const frontmatter = closing < 0 ? '' : skill.slice(4, closing);
if (!/^name:\s*davas-core-development\s*$/m.test(frontmatter)) errors.push('SKILL.md name is missing or invalid');
const description = frontmatter.match(/^description:\s*(.+)$/m)?.[1]?.trim() ?? '';
if (!description) errors.push('SKILL.md description is missing');
if (description.length > 1024) errors.push(`SKILL.md description exceeds 1024 chars: ${description.length}`);
if (closing >= 0 && !skill.slice(closing + 5).trim()) errors.push('SKILL.md body is empty');

if (errors.length > 0) {
  console.error(`Documentation harness failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Documentation harness passed: ${files.length} Markdown files, ${required.length} required files, ${forbidden.length} stale-file guards.`);
