'use client';

import type {
  GroupRecommendationSessionRequest,
  GroupRecommendationSessionResponse,
  RecommendationFeedbackKind,
  SpaceView,
} from '@davas/shared';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getMe } from '../lib/api/auth';
import {
  createGroupRecommendationSession,
  RecommendationRequestError,
  submitGroupRecommendationFeedback,
} from '../lib/api/recommendations';
import { listSpaces } from '../lib/api/spaces';

const ACTIVE_SPACE_KEY = 'davas:active-space-id';

type RequestStatus =
  | 'idle'
  | 'loading'
  | 'ready'
  | 'error'
  | 'provider-error';

export function useGroupRecommendations() {
  const [spaces, setSpaces] = useState<SpaceView[]>([]);
  const [activeSpaceId, setActiveSpaceId] = useState('');
  const [myAccountId, setMyAccountId] = useState('');
  const [setupLoading, setSetupLoading] = useState(true);
  const [setupError, setSetupError] = useState('');
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('idle');
  const [requestError, setRequestError] = useState('');
  const [session, setSession] =
    useState<GroupRecommendationSessionResponse | null>(null);
  const [lastRequest, setLastRequest] =
    useState<GroupRecommendationSessionRequest | null>(null);
  const [feedbackBusy, setFeedbackBusy] = useState('');
  const [feedbackError, setFeedbackError] = useState('');
  const [myFeedback, setMyFeedback] = useState<
    Record<string, RecommendationFeedbackKind>
  >({});

  const loadSetup = useCallback(async () => {
    setSetupLoading(true);
    setSetupError('');
    try {
      const [{ items }, me] = await Promise.all([listSpaces(), getMe()]);
      const activeSpaces = items.filter((space) => space.status === 'ACTIVE');
      const preferred = window.localStorage.getItem(ACTIVE_SPACE_KEY);
      const selected =
        activeSpaces.find((space) => space.id === preferred) ?? activeSpaces[0];
      setSpaces(activeSpaces);
      setMyAccountId(me.id ?? '');
      setActiveSpaceId(selected?.id ?? '');
    } catch {
      setSetupError('공간과 참여자 정보를 불러오지 못했어요.');
    } finally {
      setSetupLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSetup();
  }, [loadSetup]);

  const activeSpace = useMemo(
    () => spaces.find((space) => space.id === activeSpaceId) ?? null,
    [activeSpaceId, spaces],
  );

  const selectSpace = useCallback((spaceId: string) => {
    setActiveSpaceId(spaceId);
    setSession(null);
    setRequestError('');
    setRequestStatus('idle');
    setMyFeedback({});
    window.localStorage.setItem(ACTIVE_SPACE_KEY, spaceId);
  }, []);

  const requestRecommendations = useCallback(
    async (request: GroupRecommendationSessionRequest) => {
      setRequestStatus('loading');
      setRequestError('');
      setFeedbackError('');
      setLastRequest(request);
      try {
        const next = await createGroupRecommendationSession(request);
        setSession(next);
        setMyFeedback({});
        setRequestStatus('ready');
        return next;
      } catch (caught) {
        const providerFailure =
          caught instanceof RecommendationRequestError && caught.status >= 500;
        setRequestStatus(providerFailure ? 'provider-error' : 'error');
        setRequestError(
          providerFailure
            ? '시청 경로 공급자 응답을 확인하지 못했어요. 조건을 유지한 채 다시 시도해 주세요.'
            : caught instanceof Error
              ? caught.message
              : '그룹 추천을 만들지 못했어요.',
        );
        throw caught;
      }
    },
    [],
  );

  const retryLastRequest = useCallback(async () => {
    if (!lastRequest) return null;
    try {
      return await requestRecommendations(lastRequest);
    } catch {
      return null;
    }
  }, [lastRequest, requestRecommendations]);

  const submitFeedback = useCallback(
    async (exposureId: string, kind: RecommendationFeedbackKind) => {
      setFeedbackBusy(exposureId);
      setFeedbackError('');
      try {
        const response = await submitGroupRecommendationFeedback(exposureId, {
          kind,
        });
        setMyFeedback((current) => ({ ...current, [exposureId]: kind }));
        setSession((current) => {
          if (!current) return current;
          const matched = response.consensus.status === 'MATCHED';
          return {
            ...current,
            session: {
              ...current.session,
              status: matched ? 'MATCHED' : current.session.status,
            },
            items: current.items.map((item) =>
              item.exposureId === exposureId
                ? { ...item, consensus: response.consensus }
                : item,
            ),
          };
        });
      } catch (caught) {
        setFeedbackError(
          caught instanceof Error
            ? caught.message
            : '의견을 반영하지 못했어요. 다시 시도해 주세요.',
        );
      } finally {
        setFeedbackBusy('');
      }
    },
    [],
  );

  return {
    spaces,
    activeSpace,
    activeSpaceId,
    myAccountId,
    setupLoading,
    setupError,
    requestStatus,
    requestError,
    session,
    feedbackBusy,
    feedbackError,
    myFeedback,
    loadSetup,
    selectSpace,
    requestRecommendations,
    retryLastRequest,
    submitFeedback,
  };
}
