'use client';

import type {
  GroupRecommendationSessionRequest,
  GroupRecommendationSessionResponse,
  RecommendationFeedbackKind,
  SpaceView,
} from '@davas/shared';
import { useCallback, useEffect, useState } from 'react';
import {
  createGroupRecommendationSession,
  RecommendationRequestError,
  submitGroupRecommendationFeedback,
} from '../lib/api/recommendations';

type RequestStatus = 'idle' | 'loading' | 'ready' | 'error' | 'provider-error';

// The spaces screen owns which space is active; a new space starts a fresh session.
export function useGroupRecommendations(space: SpaceView) {
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('idle');
  const [requestError, setRequestError] = useState('');
  const [session, setSession] = useState<GroupRecommendationSessionResponse | null>(null);
  const [lastRequest, setLastRequest] = useState<GroupRecommendationSessionRequest | null>(null);
  const [feedbackBusy, setFeedbackBusy] = useState('');
  const [feedbackError, setFeedbackError] = useState('');
  const [myFeedback, setMyFeedback] = useState<Record<string, RecommendationFeedbackKind>>({});

  useEffect(() => {
    setSession(null);
    setLastRequest(null);
    setRequestError('');
    setRequestStatus('idle');
    setFeedbackError('');
    setMyFeedback({});
  }, [space.id]);

  const requestRecommendations = useCallback(async (request: GroupRecommendationSessionRequest) => {
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
      const providerFailure = caught instanceof RecommendationRequestError && caught.status >= 500;
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
  }, []);

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
              item.exposureId === exposureId ? { ...item, consensus: response.consensus } : item,
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
    requestStatus,
    requestError,
    session,
    feedbackBusy,
    feedbackError,
    myFeedback,
    requestRecommendations,
    retryLastRequest,
    submitFeedback,
  };
}
