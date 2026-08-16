import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const source = (relativePath: string) =>
  readFileSync(join(process.cwd(), 'src', relativePath), 'utf8');

describe('watch events REST API contract', () => {
  it('adds versioned watch-event routes while preserving the legacy diaries controller', () => {
    const legacy = source('diaries/diaries.controller.ts');
    const controller = source('diaries/watch-events.controller.ts');
    assert.match(legacy, /@Controller\('diaries'\)/);
    assert.match(controller, /@Controller\('v1\/watch-events'\)/);
    assert.match(controller, /@Post\(\)/);
    assert.match(controller, /@Get\(':watchEventId'\)/);
    assert.match(controller, /@Patch\(':watchEventId'\)/);
    assert.match(controller, /@Delete\(':watchEventId'\)/);
    assert.match(controller, /@Patch\(':watchEventId\/participants\/me'\)/);
    assert.match(controller, /@Put\(':watchEventId\/reaction'\)/);
  });

  it('exposes a space timeline and title-level member reaction comparison', () => {
    const controller = source('diaries/space-watch.controller.ts');
    assert.match(controller, /@Controller\('v1\/spaces'\)/);
    assert.match(controller, /@Get\(':spaceId\/timeline'\)/);
    assert.match(controller, /@Get\(':spaceId\/titles\/:mediaId\/reactions'\)/);
  });

  it('keeps legacy FRIENDS and SELECTED reads while adding active membership checks', () => {
    const access = source('diaries/diary-access.service.ts');
    assert.match(access, /diary\.visibility === 'FRIENDS'/);
    assert.match(access, /diary\.visibility === 'SELECTED'/);
    assert.match(access, /WatchShareEntity/);
    assert.match(access, /SpaceAccessService/);
    assert.match(access, /isActiveMemberOfAny/);
  });

  it('dual-writes legacy author reviews into the separated personal reaction projection', () => {
    const service = source('diaries/diaries.service.ts');
    assert.match(service, /WatchParticipantEntity/);
    assert.match(service, /WatchReactionEntity/);
    assert.match(service, /syncAuthorProjection/);
    assert.match(service, /ratingScale/);
    assert.match(service, /reviewText/);
  });

  it('models watch-time source separately and never treats it as current availability', () => {
    const entity = source('database/entities/watch-source.entity.ts');
    assert.match(entity, /WatchSourceKind/);
    assert.match(entity, /providerName/);
    assert.match(entity, /placeText/);
    assert.doesNotMatch(entity, /availability/i);
  });
});
