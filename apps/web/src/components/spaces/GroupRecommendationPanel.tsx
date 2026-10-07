'use client';

import {
  OTT_SERVICES,
  ottProviderNames,
  RECOMMENDATION_MOODS,
  type SpaceView,
} from '@davas/shared';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useGroupRecommendations } from '../../hooks/useGroupRecommendations';
import { relativeTime } from '../core/WatchReviews';
import {
  availabilityPresentation,
  buildGroupRecommendationRequest,
  consensusPresentation,
  FEEDBACK_OPTIONS,
  recommendationReasonText,
} from './group-recommendation-model';

const ottLabel = (key: string) => OTT_SERVICES.find((service) => service.key === key)?.label ?? key;

function toggleValue(values: string[], value: string, checked: boolean) {
  return checked ? [...new Set([...values, value])] : values.filter((item) => item !== value);
}

const CONTENT_CHOICES = [
  { label: '영화', types: ['MOVIE'] },
  { label: '드라마', types: ['TV'] },
  { label: '둘 다', types: ['MOVIE', 'TV'] },
] as const;

const sameTypes = (current: string[], choice: readonly string[]) =>
  current.length === choice.length && choice.every((type) => current.includes(type));

type GroupRecommendationPanelProps = {
  space: SpaceView;
  myAccountId: string;
  /** OTT_SERVICES keys to start from, usually the viewer's own subscriptions. */
  defaultServices?: string[];
};

export function GroupRecommendationPanel({
  space,
  myAccountId,
  defaultServices = [],
}: GroupRecommendationPanelProps) {
  const group = useGroupRecommendations(space);
  const [participants, setParticipants] = useState<string[]>([]);
  const region = 'KR';
  // Selected OTT_SERVICES keys; the request sends the TMDB provider names behind them.
  const [services, setServices] = useState<string[]>(
    defaultServices.length ? defaultServices : ['netflix'],
  );
  const defaultServicesKey = defaultServices.join(',');
  useEffect(() => {
    if (defaultServicesKey) setServices(defaultServicesKey.split(','));
  }, [defaultServicesKey]);
  const [contentTypes, setContentTypes] = useState<Array<'MOVIE' | 'TV'>>(['MOVIE', 'TV']);
  const [runtimeMin, setRuntimeMin] = useState('');
  const [runtimeMax, setRuntimeMax] = useState('');
  const [moodTags, setMoodTags] = useState<string[]>([]);
  const [avoidTagsText, setAvoidTagsText] = useState('');
  const [rewatchPolicy, setRewatchPolicy] = useState<'EXCLUDE' | 'ALLOW'>('EXCLUDE');
  const [decisionRule, setDecisionRule] = useState<'ALL' | 'MINIMUM'>('ALL');
  const [minimumApprovals, setMinimumApprovals] = useState(2);
  const [formError, setFormError] = useState('');
  const resultsRef = useRef<HTMLDivElement>(null);

  const activeMembers = useMemo(
    () => space.members.filter((member) => member.status === 'ACTIVE'),
    [space],
  );

  useEffect(() => {
    const memberIds = activeMembers.map((member) => member.accountId);
    const defaultParticipants = myAccountId
      ? [myAccountId, ...memberIds.filter((accountId) => accountId !== myAccountId)]
      : memberIds;
    const selected = defaultParticipants.slice(0, Math.min(2, memberIds.length));
    setParticipants(selected);
    setMinimumApprovals(Math.max(1, selected.length));
    setFormError('');
  }, [activeMembers, myAccountId]);

  useEffect(() => {
    setMinimumApprovals((current) =>
      Math.min(Math.max(1, current), Math.max(1, participants.length)),
    );
  }, [participants.length]);

  /** "나" for the viewer unless `own` asks for the nickname itself (for an avatar letter). */
  const memberName = (accountId: string, own = false) =>
    accountId === myAccountId && !own
      ? '나'
      : activeMembers.find((member) => member.accountId === accountId)?.nickname || '공간 멤버';

  async function openSession(sessionId: string) {
    if (await group.openSession(sessionId)) {
      // The results sit below the long form, so bring them into view.
      requestAnimationFrame(() =>
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      );
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError('');
    let request: ReturnType<typeof buildGroupRecommendationRequest>;
    try {
      request = buildGroupRecommendationRequest({
        spaceId: space.id,
        participantAccountIds: participants,
        region,
        services: ottProviderNames(services),
        contentTypes,
        runtimeMin,
        runtimeMax,
        moodTags,
        avoidTagsText,
        rewatchPolicy,
        decisionRule,
        minimumApprovals,
      });
    } catch (caught) {
      setFormError(caught instanceof Error ? caught.message : '추천 조건을 확인해 주세요.');
      return;
    }
    await group.requestRecommendations(request).catch(() => undefined);
  }

  return (
    <div id="group-recommendation" className="choose-together">
      {group.sessions.length ? (
        <section aria-labelledby="group-sessions-title">
          <h2 id="group-sessions-title" className="choose-section-title">
            최근 함께 고르기
          </h2>
          <ul className="choose-sessions">
            {group.sessions.map((item) => {
              const mine = item.requesterAccountId === myAccountId;
              const starter = mine ? '내가' : `${memberName(item.requesterAccountId)}님이`;
              const status =
                item.status === 'MATCHED'
                  ? `정해졌어요${item.matchedTitle ? ` · ${item.matchedTitle}` : ''}`
                  : item.itemCount
                    ? `후보 ${item.itemCount}개 중 ${item.answeredByMe}개에 답했어요`
                    : '조건에 맞는 후보가 없었어요';
              const viewing = group.session?.session.id === item.id;
              const waitingForMe = item.status === 'OPEN' && item.answeredByMe < item.itemCount;
              return (
                <li key={item.id}>
                  <span className="choose-face" data-me={mine || undefined} aria-hidden="true">
                    {[...memberName(item.requesterAccountId, true)][0]}
                  </span>
                  <span className="choose-session-text">
                    <span>
                      {starter} 시작
                      {item.createdAt ? ` · ${relativeTime(item.createdAt)}` : ''}
                    </span>
                    <strong data-decided={item.status === 'MATCHED' || undefined}>{status}</strong>
                  </span>
                  {viewing ? (
                    <button
                      type="button"
                      disabled
                      aria-current="true"
                      className="choose-session-button"
                      data-tone="viewing"
                    >
                      보는 중
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={group.requestStatus === 'loading'}
                      aria-label={`${starter} 시작한 함께 고르기 ${waitingForMe ? '답하기' : '열기'}`}
                      onClick={() => void openSession(item.id)}
                      className="choose-session-button"
                      data-tone={waitingForMe ? 'answer' : 'open'}
                    >
                      {waitingForMe ? '답하기' : '열기'}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <form onSubmit={handleSubmit} className="choose-form" aria-labelledby="new-pick-title">
        <h2 id="new-pick-title">새로 함께 고르기</h2>
        <p className="choose-form-hint">조건을 정하면 모두 볼 수 있는 후보를 찾아요.</p>

        <fieldset className="choose-field">
          <legend>참여자</legend>
          <div className="choose-people">
            {activeMembers.map((member) => {
              const selected = participants.includes(member.accountId);
              const isMe = member.accountId === myAccountId;
              const name = member.nickname || (isMe ? '내 계정' : '공간 멤버');
              return (
                <button
                  key={member.accountId}
                  type="button"
                  aria-pressed={selected}
                  // The person asking is always in it.
                  aria-disabled={isMe || undefined}
                  disabled={!isMe && !selected && participants.length >= 5}
                  onClick={() => {
                    if (isMe) return;
                    setParticipants((current) => toggleValue(current, member.accountId, !selected));
                  }}
                  className="choose-person"
                >
                  <span className="choose-face" data-me={isMe || undefined} aria-hidden="true">
                    {[...name][0]}
                  </span>
                  {isMe ? `${name} (나)` : name}
                </button>
              );
            })}
          </div>
          {activeMembers.length < 2 ? (
            <p className="choose-warning">
              추천을 시작하려면 공간에 활성 구성원이 2명 이상 필요해요.
            </p>
          ) : null}
        </fieldset>

        <fieldset className="choose-field">
          <legend>작품 유형</legend>
          <div className="choose-segment" data-columns="3">
            {CONTENT_CHOICES.map((choice) => (
              <button
                key={choice.label}
                type="button"
                aria-pressed={sameTypes(contentTypes, choice.types)}
                onClick={() => setContentTypes([...choice.types])}
              >
                {choice.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="choose-field">
          <legend>
            오늘의 분위기 <span>여러 개 골라도 돼요</span>
          </legend>
          <div className="choose-moods">
            {RECOMMENDATION_MOODS.map((mood) => {
              const selected = moodTags.includes(mood);
              return (
                <button
                  key={mood}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setMoodTags((current) => toggleValue(current, mood, !selected))}
                >
                  {mood}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="choose-field">
          <label htmlFor="choose-max-runtime" className="choose-label">
            최대 러닝타임
          </label>
          <div className="choose-runtime">
            <input
              id="choose-max-runtime"
              type="number"
              min="30"
              max="600"
              inputMode="numeric"
              value={runtimeMax}
              onChange={(event) => setRuntimeMax(event.target.value)}
              placeholder="제한 없음"
            />
            <span>분까지</span>
          </div>
        </div>

        <label className="choose-check">
          <input
            type="checkbox"
            checked={rewatchPolicy === 'EXCLUDE'}
            onChange={(event) => setRewatchPolicy(event.target.checked ? 'EXCLUDE' : 'ALLOW')}
          />
          누군가 이미 본 작품 제외
        </label>

        <fieldset className="choose-field">
          <legend>합의 규칙</legend>
          <div className="choose-segment" data-columns="2">
            {(
              [
                ['ALL', '전원 동의'],
                ['MINIMUM', '최소 인원 동의'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={decisionRule === value}
                onClick={() => setDecisionRule(value)}
              >
                {label}
              </button>
            ))}
          </div>
          {decisionRule === 'MINIMUM' ? (
            <label className="choose-minimum">
              <span className="sr-only">최소 동의 인원</span>
              <select
                value={Math.min(minimumApprovals, participants.length || 1)}
                onChange={(event) => setMinimumApprovals(Number(event.target.value))}
                className="text-input"
              >
                {Array.from(
                  { length: Math.max(1, participants.length) },
                  (_, index) => index + 1,
                ).map((count) => (
                  <option key={count} value={count}>
                    {count}명 이상 동의
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </fieldset>

        {/* Where to watch starts from the subscriptions in settings; it and the exclusions stay
            folded away unless someone wants to change them. */}
        <details className="choose-more">
          <summary>
            <span>볼 수 있는 곳 · {services.map(ottLabel).join(', ') || '고르지 않았어요'}</span>
            <span className="choose-more-toggle">조건 더 보기</span>
          </summary>
          <fieldset className="choose-field">
            <legend>볼 수 있는 곳 · 하나 이상</legend>
            <div className="choose-services">
              {OTT_SERVICES.map((service) => {
                const selected = services.includes(service.key);
                return (
                  <button
                    key={service.key}
                    type="button"
                    aria-pressed={selected}
                    onClick={() =>
                      setServices((current) => toggleValue(current, service.key, !selected))
                    }
                  >
                    {service.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
          <label className="choose-field block">
            <span className="choose-label">제외할 장르나 분위기</span>
            <input
              value={avoidTagsText}
              onChange={(event) => setAvoidTagsText(event.target.value)}
              placeholder="쉼표로 구분, 예: 공포, 전쟁"
              className="text-input"
            />
          </label>
        </details>

        {formError ? (
          <p role="alert" className="form-error mt-3">
            {formError}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={group.requestStatus === 'loading' || activeMembers.length < 2}
          className="primary-button choose-submit"
        >
          {group.requestStatus === 'loading'
            ? '조건을 확인하고 있어요…'
            : '이 조건으로 함께 고르기'}
        </button>
      </form>

      {group.requestError ? (
        <div role="alert" className="mt-5 rounded-2xl border border-[#f5c9d1] bg-[#fff5f7] p-4">
          <p className="text-[13px] font-extrabold text-[#9f2942]">
            {group.requestStatus === 'provider-error' ? '공급자 확인 실패' : '추천 요청 실패'}
          </p>
          <p className="mt-1 text-[12px] font-semibold leading-5 text-[#7a4652]">
            {group.requestError}
          </p>
          <button
            type="button"
            onClick={() => void group.retryLastRequest()}
            className="mt-3 min-h-11 rounded-full border border-[#dba5b1] bg-white px-4 text-[12px] font-extrabold text-[#9f2942]"
          >
            같은 조건으로 다시 시도
          </button>
        </div>
      ) : null}

      {group.session ? (
        <div ref={resultsRef} className="mt-7 scroll-mt-4" aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-[18px] font-black text-[var(--heading)]">함께 볼 후보</h3>
              <p className="mt-1 text-[12px] font-semibold text-[var(--muted)]">
                {group.session.session.createdAt
                  ? `${relativeTime(group.session.session.createdAt)} 요청`
                  : '방금 요청'}
                {' · '}조건과 이유 코드는 이 세션에 고정돼요.
              </p>
            </div>
            {group.session.session.status === 'MATCHED' ? (
              <span className="rounded-full bg-[#dff7eb] px-3 py-1.5 text-[12px] font-extrabold text-[#17714a]">
                최종 합의 완료
              </span>
            ) : group.session.session.status === 'CLOSED' ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#f2f4f7] px-3 py-1.5 text-[12px] font-extrabold text-[#65758a]">
                  세션 만료
                </span>
                <button
                  type="button"
                  onClick={() => void group.retryLastRequest()}
                  className="min-h-11 rounded-full border border-[#d8e4f2] bg-white px-4 text-[12px] font-extrabold text-[#52677e]"
                >
                  같은 조건으로 새 추천
                </button>
              </div>
            ) : null}
          </div>

          {group.session.items.length === 0 ? (
            <div className="mt-3 rounded-2xl border border-[#eed9aa] bg-[#fffaf0] p-4">
              <h4 className="text-[14px] font-black text-[#875c10]">
                현재 조건과 정확히 맞는 후보가 없어요
              </h4>
              <p className="mt-1 text-[12px] font-semibold leading-5 text-[#806b43]">
                필터는 몰래 완화하지 않았어요. 아래 변경은 버튼을 누른 뒤 다시 요청할 때만 적용돼요.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {runtimeMin || runtimeMax ? (
                  <button
                    type="button"
                    onClick={() => {
                      setRuntimeMin('');
                      setRuntimeMax('');
                    }}
                    className="min-h-11 rounded-full border border-[#dfc37e] bg-white px-4 text-[12px] font-extrabold text-[#875c10]"
                  >
                    러닝타임 제한 해제
                  </button>
                ) : null}
                {avoidTagsText ? (
                  <button
                    type="button"
                    onClick={() => setAvoidTagsText('')}
                    className="min-h-11 rounded-full border border-[#dfc37e] bg-white px-4 text-[12px] font-extrabold text-[#875c10]"
                  >
                    제외 조건 비우기
                  </button>
                ) : null}
                {rewatchPolicy === 'EXCLUDE' ? (
                  <button
                    type="button"
                    onClick={() => setRewatchPolicy('ALLOW')}
                    className="min-h-11 rounded-full border border-[#dfc37e] bg-white px-4 text-[12px] font-extrabold text-[#875c10]"
                  >
                    재감상 허용 검토
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => void group.retryLastRequest()}
                  className="min-h-11 rounded-full bg-[#875c10] px-4 text-[12px] font-extrabold text-white"
                >
                  조건 그대로 다시 조회
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-3 space-y-4">
              {group.session.items.map((item) => {
                const availability = availabilityPresentation(item.availability);
                const consensus = consensusPresentation(item.consensus);
                const selectedFeedback = group.myFeedback[item.exposureId];
                const closed = group.session?.session.status !== 'OPEN';
                return (
                  <article
                    key={item.exposureId}
                    className="rounded-[22px] border border-[#dce7f4] bg-white p-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8f2ff] text-[14px] font-black text-[var(--blue-ink)]">
                        {item.rank}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <h4 className="text-[16px] font-black text-[var(--heading)]">
                              {item.content.title || '제목 정보 없음'}
                            </h4>
                            <p className="mt-1 text-[12px] font-bold text-[var(--muted)]">
                              {item.content.mediaType === 'TV' ? '드라마' : '영화'}
                              {item.content.runtime ? ` · ${item.content.runtime}분` : ''}
                            </p>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1.5 text-[12px] font-extrabold ${
                              item.consensus.status === 'MATCHED'
                                ? 'bg-[#dff7eb] text-[#17714a]'
                                : item.consensus.status === 'REJECTED'
                                  ? 'bg-[#fff0f2] text-[#a93850]'
                                  : 'bg-[#eef4fb] text-[#52677e]'
                            }`}
                          >
                            {consensus.label}
                          </span>
                        </div>

                        <div
                          className={`mt-3 rounded-2xl p-3 ${
                            availability.state === 'CONFIRMED'
                              ? 'bg-[#eff9f4] text-[#245f48]'
                              : 'bg-[#fff7e8] text-[#805f27]'
                          }`}
                        >
                          <p className="text-[12px] font-extrabold">{availability.title}</p>
                          <p className="mt-1 text-[12px] font-semibold leading-5">
                            {availability.detail}
                          </p>
                          {availability.state === 'EXPIRED' ? (
                            <button
                              type="button"
                              onClick={() => void group.retryLastRequest()}
                              className="mt-2 min-h-11 rounded-full border border-current px-3 text-[12px] font-extrabold"
                            >
                              조건 그대로 다시 확인
                            </button>
                          ) : null}
                        </div>

                        <div className="mt-3">
                          <p className="text-[12px] font-extrabold text-[var(--heading)]">
                            추천 이유
                          </p>
                          <ul className="mt-2 space-y-2">
                            {item.reasons.map((reason, index) => (
                              <li
                                key={`${reason.reasonCode}-${index}`}
                                className="rounded-xl bg-[#f6f9fd] px-3 py-2 text-[12px] font-semibold leading-5 text-[#52677e]"
                              >
                                {recommendationReasonText(reason.reasonCode)}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-4 rounded-2xl border border-[#e1e9f3] p-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-[12px] font-extrabold text-[var(--heading)]">
                              {consensus.label}
                            </p>
                            <p className="text-[12px] font-bold text-[#65758a]">
                              {consensus.progress}
                            </p>
                          </div>
                          <div
                            className="mt-2 h-2 overflow-hidden rounded-full bg-[#e6edf6]"
                            role="progressbar"
                            aria-label="합의 진행률"
                            aria-valuemin={0}
                            aria-valuemax={item.consensus.requiredCount}
                            aria-valuenow={Math.min(
                              item.consensus.interestedCount,
                              item.consensus.requiredCount,
                            )}
                          >
                            <span
                              className="block h-full rounded-full bg-[var(--blue)]"
                              style={{
                                width: `${Math.min(
                                  100,
                                  (item.consensus.interestedCount /
                                    Math.max(1, item.consensus.requiredCount)) *
                                    100,
                                )}%`,
                              }}
                            />
                          </div>
                          <p className="mt-2 text-[12px] font-semibold text-[var(--muted)]">
                            개인별 선택과 내부 추천 점수는 공개하지 않고 집계만 보여요.
                          </p>
                        </div>

                        <fieldset className="mt-4" disabled={closed}>
                          <legend className="text-[12px] font-extrabold text-[var(--heading)]">
                            내 의견
                          </legend>
                          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {FEEDBACK_OPTIONS.map((option) => (
                              <button
                                key={option.kind}
                                type="button"
                                aria-pressed={selectedFeedback === option.kind}
                                disabled={closed || group.feedbackBusy === item.exposureId}
                                onClick={() =>
                                  void group.submitFeedback(item.exposureId, option.kind)
                                }
                                className={`min-h-11 rounded-xl px-2 text-[12px] font-extrabold disabled:opacity-50 ${
                                  selectedFeedback === option.kind
                                    ? 'bg-[var(--blue)] text-white'
                                    : 'border border-[#dce7f4] bg-white text-[#52677e]'
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </fieldset>
                      </div>
                    </div>
                  </article>
                );
              })}
              {/* TMDB's watch-provider data comes from JustWatch, which asks to be credited. */}
              <p className="text-[12px] font-semibold text-[var(--muted)]">
                볼 수 있는 곳 정보: TMDB(JustWatch 제공). 서비스 사정에 따라 실제와 다를 수 있어요.
              </p>
            </div>
          )}
          {group.feedbackError ? (
            <p role="alert" className="mt-3 text-[12px] font-bold text-[#c24156]">
              {group.feedbackError}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
