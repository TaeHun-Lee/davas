'use client';

import type {
  GroupRecommendationSessionRequest,
  GroupRecommendationSessionResponse,
  GroupRecommendationSessionSummary,
  RecommendationFeedbackKind,
  SpaceView,
} from '@davas/shared';
import { useCallback, useEffect, useState } from 'react';
import { requestFromSession } from '../components/spaces/group-recommendation-model';
import {
  closeGroupRecommendationSession,
  createGroupRecommendationSession,
  decideGroupRecommendation,
  getGroupRecommendationSession,
  listGroupRecommendationSessions,
  RecommendationRequestError,
  submitGroupRecommendationFeedback,
} from '../lib/api/recommendations';

/** My earlier answers in a pick, keyed by exposure, so reopening it shows what I chose. */
const answersOf = (session: GroupRecommendationSessionResponse) =>
  Object.fromEntries(
    session.items.flatMap((item) => (item.myFeedback ? [[item.exposureId, item.myFeedback]] : [])),
  ) as Record<string, RecommendationFeedbackKind>;

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
  const [decisionBusy, setDecisionBusy] = useState(false);
  // Picks in this space I started or was asked into, so anyone in one can come back and answer.
  const [sessions, setSessions] = useState<GroupRecommendationSessionSummary[]>([]);

  const refreshSessions = useCallback(async () => {
    try {
      setSessions((await listGroupRecommendationSessions(space.id)).items);
    } catch {
      // The list is a shortcut; starting a new pick still works without it.
    }
  }, [space.id]);

  useEffect(() => {
    setSession(null);
    setLastRequest(null);
    setRequestError('');
    setRequestStatus('idle');
    setFeedbackError('');
    setMyFeedback({});
    setSessions([]);
    void refreshSessions();
  }, [refreshSessions]);

  const openSession = useCallback(async (sessionId: string) => {
    setRequestStatus('loading');
    setRequestError('');
    setFeedbackError('');
    try {
      const next = await getGroupRecommendationSession(sessionId);
      setSession(next);
      // A pick opened from the list keeps its conditions, so "같은 조건으로" works here too.
      setLastRequest(requestFromSession(next.session));
      setMyFeedback(answersOf(next));
      setRequestStatus('ready');
      return next;
    } catch (caught) {
      setRequestStatus('error');
      setRequestError(caught instanceof Error ? caught.message : '함께 고르기를 열지 못했어요.');
      return null;
    }
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
        void refreshSessions();
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
    [refreshSessions],
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
                ? { ...item, consensus: response.consensus, myFeedback: kind }
                : item,
            ),
          };
        });
        void refreshSessions();
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
    [refreshSessions],
  );

  // "이걸로 볼게요" and "그만 고르기" both end the pick; the list then shows how it ended.
  const finish = useCallback(
    async (work: () => Promise<GroupRecommendationSessionResponse>, failure: string) => {
      setDecisionBusy(true);
      setFeedbackError('');
      try {
        const next = await work();
        setSession(next);
        setMyFeedback(answersOf(next));
        void refreshSessions();
      } catch (caught) {
        setFeedbackError(caught instanceof Error && caught.message ? caught.message : failure);
      } finally {
        setDecisionBusy(false);
      }
    },
    [refreshSessions],
  );

  const settle = useCallback(
    async (exposureId: string) => {
      if (!session) return;
      await finish(
        () => decideGroupRecommendation(session.session.id, { exposureId }),
        '이 작품으로 정하지 못했어요. 다시 시도해 주세요.',
      );
    },
    [finish, session],
  );

  const closeSession = useCallback(async () => {
    if (!session) return;
    await finish(
      () => closeGroupRecommendationSession(session.session.id),
      '함께 고르기를 끝내지 못했어요. 다시 시도해 주세요.',
    );
  }, [finish, session]);

  return {
    requestStatus,
    requestError,
    session,
    feedbackBusy,
    feedbackError,
    myFeedback,
    sessions,
    decisionBusy,
    canRetry: lastRequest !== null,
    openSession,
    requestRecommendations,
    retryLastRequest,
    submitFeedback,
    settle,
    closeSession,
  };
}
