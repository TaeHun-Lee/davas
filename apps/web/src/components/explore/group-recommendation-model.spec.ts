import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import type { GroupRecommendationDraft } from './group-recommendation-model';
import {
  availabilityPresentation,
  buildGroupRecommendationRequest,
  consensusPresentation,
  recommendationReasonText,
} from './group-recommendation-model';

function draft(
  participantCount: number,
  overrides: Partial<GroupRecommendationDraft> = {},
): GroupRecommendationDraft {
  return {
    spaceId: '11111111-1111-4111-8111-111111111111',
    participantAccountIds: Array.from(
      { length: participantCount },
      (_, index) => `participant-${index + 1}`,
    ),
    region: 'kr',
    services: ['Netflix'],
    contentTypes: ['MOVIE', 'TV'],
    runtimeMin: '80',
    runtimeMax: '150',
    moodTags: ['따뜻한'],
    avoidTagsText: '공포, 잔인한, 공포',
    rewatchPolicy: 'EXCLUDE',
    decisionRule: 'ALL',
    minimumApprovals: participantCount,
    ...overrides,
  };
}

describe('group recommendation request model', () => {
  it('builds the exact request payload for 2, 3, and 5 participants', () => {
    for (const participantCount of [2, 3, 5]) {
      const request = buildGroupRecommendationRequest(draft(participantCount));
      assert.equal(request.participantAccountIds.length, participantCount);
      assert.equal(request.region, 'KR');
      assert.deepEqual(request.services, ['Netflix']);
      assert.deepEqual(request.contentTypes, ['MOVIE', 'TV']);
      assert.deepEqual(request.runtime, { minMinutes: 80, maxMinutes: 150 });
      assert.deepEqual(request.moodTags, ['따뜻한']);
      assert.deepEqual(request.avoidTags, ['공포', '잔인한']);
      assert.equal(request.rewatchPolicy, 'EXCLUDE');
      assert.equal(request.decisionRule, 'ALL');
      assert.equal(request.minimumApprovals, undefined);
    }
  });

  it('keeps minimum-consensus rules explicit and validates participant bounds', () => {
    const request = buildGroupRecommendationRequest(
      draft(3, { decisionRule: 'MINIMUM', minimumApprovals: 2 }),
    );
    assert.equal(request.minimumApprovals, 2);
    assert.throws(() => buildGroupRecommendationRequest(draft(1)), /2명에서 5명/);
    assert.throws(() => buildGroupRecommendationRequest(draft(6)), /2명에서 5명/);
  });
});

describe('group recommendation presentation privacy and states', () => {
  it('uses server reason codes without exposing internal participant scores', () => {
    assert.match(
      recommendationReasonText('GROUP_CONTENT_AFFINITY'),
      /참여자들의 함께 본 기록/,
    );
    const panel = readFileSync(
      join(process.cwd(), 'src/components/explore/GroupRecommendationPanel.tsx'),
      'utf8',
    );
    assert.match(panel, /reason\.reasonCode/);
    assert.doesNotMatch(panel, /participantScores|groupScore|preferenceScore/);
    assert.match(panel, /개인별 선택과 내부 추천 점수는 공개하지 않고 집계만 보여요/);
  });

  it('shows consensus progress for 2, 3, and 5 participant sessions', () => {
    assert.deepEqual(
      consensusPresentation({
        status: 'MATCHED',
        interestedCount: 2,
        respondedCount: 2,
        requiredCount: 2,
        participantCount: 2,
      }),
      { label: '합의 완료', progress: '2/2명 동의 · 2/2명 응답' },
    );
    assert.match(
      consensusPresentation({
        status: 'PENDING',
        interestedCount: 2,
        respondedCount: 2,
        requiredCount: 3,
        participantCount: 3,
      }).progress,
      /2\/3명 동의.*2\/3명 응답/,
    );
    assert.equal(
      consensusPresentation({
        status: 'REJECTED',
        interestedCount: 1,
        respondedCount: 4,
        requiredCount: 5,
        participantCount: 5,
      }).label,
      '현재 규칙으로 합의 불가',
    );
  });

  it('distinguishes provider errors, uncertainty, and expired observations', () => {
    assert.equal(availabilityPresentation(null).state, 'PROVIDER_ERROR');
    const snapshot = {
      region: 'KR',
      providers: ['Netflix'],
      observedAt: '2026-08-15T00:00:00.000Z',
      expiresAt: '2026-08-16T00:00:00.000Z',
      confidence: 0.7,
    };
    assert.equal(
      availabilityPresentation(snapshot, Date.parse('2026-08-15T12:00:00.000Z'))
        .state,
      'UNCERTAIN',
    );
    assert.equal(
      availabilityPresentation(snapshot, Date.parse('2026-08-16T01:00:00.000Z'))
        .state,
      'EXPIRED',
    );
  });

  it('keeps zero-candidate filters unchanged until an explicit user action', () => {
    const panel = readFileSync(
      join(process.cwd(), 'src/components/explore/GroupRecommendationPanel.tsx'),
      'utf8',
    );
    assert.match(panel, /필터는 몰래 완화하지 않았어요/);
    assert.match(panel, /러닝타임 제한 해제/);
    assert.match(panel, /제외 조건 비우기/);
    assert.match(panel, /재감상 허용 검토/);
  });
});
