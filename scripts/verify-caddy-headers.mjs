import { createServer } from 'node:http';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fetchWhenReady } from './fetch-when-ready.mjs';

const projectRoot = resolve(import.meta.dirname, '..');
const sourceCaddyfile = readFileSync(join(projectRoot, 'deploy', 'Caddyfile'), 'utf8');
const containerName = `davas-caddy-header-${process.pid}`;
const tempDirectory = mkdtempSync(join(tmpdir(), 'davas-caddy-'));
const testCaddyfile = join(tempDirectory, 'Caddyfile');

function runDocker(args, options = {}) {
  const direct = spawnSync('docker', args, {
    encoding: 'utf8',
    ...options,
  });
  if (direct.status === 0 || !`${direct.stderr}${direct.stdout}`.includes('permission denied')) {
    return direct;
  }
  return spawnSync('sudo', ['-n', 'docker', ...args], {
    encoding: 'utf8',
    ...options,
  });
}

function listen(server) {
  return new Promise((resolveListen, reject) => {
    server.once('error', reject);
    server.listen(0, '0.0.0.0', () => {
      const address = server.address();
      if (!address || typeof address === 'string') {
        reject(new Error('Origin server did not expose a TCP port.'));
        return;
      }
      resolveListen(address.port);
    });
  });
}

function close(server) {
  server.closeAllConnections?.();
  return new Promise((resolveClose) => server.close(resolveClose));
}

const conflictingHeaders = {
  'Strict-Transport-Security': 'max-age=0',
  'X-Content-Type-Options': 'legacy-value',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'unsafe-url',
  'Permissions-Policy': 'camera=*',
};

const apiOrigin = createServer((_request, response) => {
  for (const [name, value] of Object.entries(conflictingHeaders)) {
    response.setHeader(name, value);
  }
  response.setHeader('content-type', 'application/json');
  response.end(JSON.stringify({ ok: true, source: 'api' }));
});
const webOrigin = createServer((_request, response) => {
  response.setHeader('content-type', 'text/html; charset=utf-8');
  response.end('<!doctype html><title>Davas</title>');
});

const expectedHeaders = {
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'SAMEORIGIN',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=()',
};

function assertHeaders(response, label) {
  const failures = [];
  for (const [name, expected] of Object.entries(expectedHeaders)) {
    const actual = response.headers.get(name);
    if (actual !== expected) {
      failures.push(`${label} ${name}: expected "${expected}", received "${actual}"`);
    }
  }
  if (failures.length > 0) throw new Error(failures.join('\n'));
}

let containerStarted = false;
try {
  const [apiPort, webPort] = await Promise.all([listen(apiOrigin), listen(webOrigin)]);
  const transformedCaddyfile = sourceCaddyfile
    .replace('{$DOMAIN}', 'http://:80')
    .replaceAll('api:4000', `host.docker.internal:${apiPort}`)
    .replaceAll('web:3000', `host.docker.internal:${webPort}`);
  writeFileSync(testCaddyfile, transformedCaddyfile);

  const started = runDocker([
    'run',
    '--detach',
    '--rm',
    '--name',
    containerName,
    '--add-host',
    'host.docker.internal:host-gateway',
    '--publish',
    '127.0.0.1::80',
    '--volume',
    `${testCaddyfile}:/etc/caddy/Caddyfile:ro`,
    'caddy:2-alpine',
  ]);
  if (started.status !== 0) {
    throw new Error(`Could not start Caddy: ${started.stderr || started.stdout}`);
  }
  containerStarted = true;

  const portResult = runDocker(['port', containerName, '80/tcp']);
  if (portResult.status !== 0) {
    throw new Error(`Could not inspect Caddy port: ${portResult.stderr}`);
  }
  const hostPort = portResult.stdout.trim().split(':').at(-1);
  if (!hostPort) throw new Error('Caddy host port was not found.');

  const [apiResponse, webResponse] = await Promise.all([
    fetchWhenReady(`http://127.0.0.1:${hostPort}/api/health`),
    fetchWhenReady(`http://127.0.0.1:${hostPort}/`),
  ]);
  assertHeaders(apiResponse, 'API');
  assertHeaders(webResponse, 'Web');
  console.log(
    `Caddy header boundary passed: api=${apiResponse.status}, web=${webResponse.status}, headers=${Object.keys(expectedHeaders).length}.`,
  );
} finally {
  if (containerStarted) runDocker(['rm', '--force', containerName]);
  await Promise.all([close(apiOrigin), close(webOrigin)]);
  rmSync(tempDirectory, { recursive: true, force: true });
}
