import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const source = (relativePath: string) =>
  readFileSync(join(process.cwd(), 'src', relativePath), 'utf8');

describe('Spaces REST API contract', () => {
  it('registers a standalone spaces module without replacing friend features', () => {
    const appModule = source('app.module.ts');
    const module = source('spaces/spaces.module.ts');
    assert.match(appModule, /FriendsModule/);
    assert.match(appModule, /SpacesModule/);
    assert.match(module, /SpaceEntity/);
    assert.match(module, /SpaceMembershipEntity/);
    assert.match(module, /SpaceInviteEntity/);
  });

  it('exposes creation, membership lifecycle, and invite issue/cancel routes', () => {
    const controller = source('spaces/spaces.controller.ts');
    assert.match(controller, /@Controller\('v1\/spaces'\)/);
    assert.match(controller, /@Post\(\)/);
    assert.match(controller, /@Get\(\)/);
    assert.match(controller, /@Get\(':spaceId'\)/);
    assert.match(controller, /@Post\(':spaceId\/invites'\)/);
    assert.match(controller, /@Delete\(':spaceId\/invites\/:inviteId'\)/);
    assert.match(controller, /@Patch\(':spaceId\/owner'\)/);
    assert.match(controller, /@Delete\(':spaceId\/members\/me'\)/);
    assert.match(controller, /@Delete\(':spaceId'\)/);
  });

  it('exposes public invite inspection and authenticated acceptance', () => {
    const controller = source('spaces/space-invites.controller.ts');
    assert.match(controller, /@Controller\('v1\/invites'\)/);
    assert.match(controller, /@Get\(':token'\)/);
    assert.match(controller, /@Post\(':token\/accept'\)/);
    assert.match(controller, /auth\.findMe/);
  });

  it('uses transaction-scoped write locks for invite and space capacity checks', () => {
    const service = source('spaces/spaces.service.ts');
    assert.match(service, /dataSource\.transaction/);
    assert.match(service, /lock: \{ mode: 'pessimistic_write' \}/);
    assert.match(service, /memberships\.count/);
    assert.match(service, /activeMemberCount >= space\.maxMembers/);
  });
});
