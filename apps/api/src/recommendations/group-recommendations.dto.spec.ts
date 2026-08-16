import 'reflect-metadata';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { CreateRecommendationSessionDto } from './group-recommendations.dto';

const IDS = [
  '00000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000000006',
];

function input(overrides: Record<string, unknown> = {}) {
  return plainToInstance(CreateRecommendationSessionDto, {
    spaceId: '00000000-0000-4000-8000-000000000010',
    participantAccountIds: IDS.slice(0, 2),
    region: 'KR',
    services: ['Netflix'],
    contentTypes: ['MOVIE'],
    runtime: { minMinutes: 70, maxMinutes: 180 },
    moodTags: ['warm'],
    avoidTags: ['horror'],
    rewatchPolicy: 'EXCLUDE',
    decisionRule: 'ALL',
    ...overrides,
  });
}

describe('group recommendation request validation', () => {
  it('accepts bounded 2- and 5-member requests', () => {
    assert.equal(validateSync(input()).length, 0);
    assert.equal(
      validateSync(input({ participantAccountIds: IDS.slice(0, 5) })).length,
      0,
    );
  });

  it('rejects duplicate, undersized, and oversized participant selections', () => {
    for (const participantAccountIds of [
      IDS.slice(0, 1),
      IDS,
      [IDS[0], IDS[0]],
    ]) {
      assert.ok(validateSync(input({ participantAccountIds })).length > 0);
    }
  });

  it('rejects invalid region, service, content type, runtime, and decision inputs', () => {
    const invalid = [
      { region: 'KOR' },
      { services: [] },
      { contentTypes: ['BOOK'] },
      { runtime: { minMinutes: 0 } },
      { decisionRule: 'MINIMUM' },
      { decisionRule: 'MINIMUM', minimumApprovals: 6 },
    ];
    invalid.forEach((overrides) => {
      assert.ok(validateSync(input(overrides)).length > 0);
    });
  });
});
