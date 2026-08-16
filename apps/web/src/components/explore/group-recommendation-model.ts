import type {
  GroupRecommendationConsensus,
  GroupRecommendationSessionRequest,
  GroupRecommendationSessionResponse,
  RecommendationFeedbackKind,
} from '@davas/shared';

export type GroupRecommendationDraft = {
  spaceId: string;
  participantAccountIds: string[];
  region: string;
  services: string[];
  contentTypes: Array<'MOVIE' | 'TV'>;
  runtimeMin: string;
  runtimeMax: string;
  moodTags: string[];
  avoidTagsText: string;
  rewatchPolicy: 'EXCLUDE' | 'ALLOW';
  decisionRule: 'ALL' | 'MINIMUM';
  minimumApprovals: number;
};

export type GroupRecommendationItem =
  GroupRecommendationSessionResponse['items'][number];

export const FEEDBACK_OPTIONS: Array<{
  kind: RecommendationFeedbackKind;
  label: string;
}> = [
  { kind: 'INTERESTED', label: '관심 있어요' },
  { kind: 'HOLD', label: '보류' },
  { kind: 'REJECTED', label: '거절' },
  { kind: 'ALREADY_WATCHED', label: '이미 봄' },
  { kind: 'AVAILABILITY_ERROR', label: '시청 경로 오류' },
];

const REASON_LABELS: Record<string, string> = {
  AVAILABLE_ON_SELECTED_SERVICES: '선택한 지역과 시청 서비스에서 확인된 작품이에요.',
  GROUP_CONTENT_AFFINITY: '참여자들의 함께 본 기록과 선호 경향에 고르게 맞아요.',
  QUALITY_COLD_START: '취향 정보가 적어 작품 품질과 대중 신호를 함께 참고했어요.',
  RECENT_RELEASE: '최근 공개된 작품을 찾는 조건에 맞아요.',
  MATCHES_REQUESTED_MOOD: '선택한 분위기와 작품 특성이 맞아요.',
  DIVERSITY_RERANKED: '비슷한 후보만 반복되지 않도록 목록의 다양성을 반영했어요.',
};

function numberOrUndefined(value: string) {
  if (!value.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function unique(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

export function buildGroupRecommendationRequest(
  draft: GroupRecommendationDraft,
): GroupRecommendationSessionRequest {
  const participants = unique(draft.participantAccountIds);
  const services = unique(draft.services);
  const contentTypes = [...new Set(draft.contentTypes)];
  const runtimeMin = numberOrUndefined(draft.runtimeMin);
  const runtimeMax = numberOrUndefined(draft.runtimeMax);
  const avoidTags = unique(draft.avoidTagsText.split(','));

  if (!draft.spaceId) throw new Error('추천을 시작할 공간을 선택해 주세요.');
  if (participants.length < 2 || participants.length > 5) {
    throw new Error('추천 참여자는 2명에서 5명까지 선택해 주세요.');
  }
  if (!services.length) throw new Error('하나 이상의 시청 경로를 선택해 주세요.');
  if (!contentTypes.length) throw new Error('영화 또는 드라마를 하나 이상 선택해 주세요.');
  if (runtimeMin !== undefined && runtimeMax !== undefined && runtimeMin > runtimeMax) {
    throw new Error('최소 러닝타임은 최대 러닝타임보다 짧아야 해요.');
  }
  if (
    draft.decisionRule === 'MINIMUM' &&
    (draft.minimumApprovals < 1 || draft.minimumApprovals > participants.length)
  ) {
    throw new Error('최소 동의 인원은 참여자 수 안에서 정해 주세요.');
  }

  return {
    spaceId: draft.spaceId,
    participantAccountIds: participants,
    region: draft.region.trim().toUpperCase() || 'KR',
    services,
    contentTypes,
    ...(runtimeMin !== undefined || runtimeMax !== undefined
      ? { runtime: { minMinutes: runtimeMin, maxMinutes: runtimeMax } }
      : {}),
    moodTags: unique(draft.moodTags),
    avoidTags,
    rewatchPolicy: draft.rewatchPolicy,
    decisionRule: draft.decisionRule,
    ...(draft.decisionRule === 'MINIMUM'
      ? { minimumApprovals: draft.minimumApprovals }
      : {}),
  };
}

export function recommendationReasonText(reasonCode: string) {
  return REASON_LABELS[reasonCode] ?? '요청한 그룹 추천 조건과 일치한 후보예요.';
}

export type AvailabilityPresentation = {
  state: 'CONFIRMED' | 'UNCERTAIN' | 'EXPIRED' | 'PROVIDER_ERROR';
  title: string;
  detail: string;
};

export function availabilityPresentation(
  availability: GroupRecommendationItem['availability'] | null | undefined,
  now = Date.now(),
): AvailabilityPresentation {
  if (!availability?.observedAt || !availability.expiresAt || !availability.providers.length) {
    return {
      state: 'PROVIDER_ERROR',
      title: '시청 경로 확인 실패',
      detail: '공급자 응답을 확인하지 못했어요. 경로를 확정하지 말고 다시 조회해 주세요.',
    };
  }

  const checkedAt = new Date(availability.observedAt);
  const expiresAt = new Date(availability.expiresAt);
  const checkedLabel = Number.isNaN(checkedAt.getTime())
    ? availability.observedAt
    : checkedAt.toLocaleString('ko-KR');
  if (!Number.isNaN(expiresAt.getTime()) && expiresAt.getTime() <= now) {
    return {
      state: 'EXPIRED',
      title: `${availability.providers.join(', ')} · 확인 정보 만료`,
      detail: `${checkedLabel} 확인 · 현재 시청 가능 여부는 불확실해요.`,
    };
  }

  const uncertain = availability.confidence < 0.8;
  return {
    state: uncertain ? 'UNCERTAIN' : 'CONFIRMED',
    title: `${availability.providers.join(', ')} · ${availability.region}`,
    detail: `${checkedLabel} 확인 · ${uncertain ? '공급자 신뢰도가 낮아 불확실해요.' : '현재 시청 가능 경로로 확인됐어요.'}`,
  };
}

export function consensusPresentation(consensus: GroupRecommendationConsensus) {
  const progress = `${consensus.interestedCount}/${consensus.requiredCount}명 동의 · ${consensus.respondedCount}/${consensus.participantCount}명 응답`;
  if (consensus.status === 'MATCHED') {
    return { label: '합의 완료', progress };
  }
  if (consensus.status === 'REJECTED') {
    return { label: '현재 규칙으로 합의 불가', progress };
  }
  return { label: '합의 진행 중', progress };
}
