'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useGroupRecommendations } from '../../hooks/useGroupRecommendations';
import {
  availabilityPresentation,
  buildGroupRecommendationRequest,
  consensusPresentation,
  FEEDBACK_OPTIONS,
  recommendationReasonText,
} from './group-recommendation-model';

const PROVIDERS = ['Netflix', 'Disney Plus', 'TVING', 'Wavve', 'Watcha'];
const MOODS = ['가벼운', '따뜻한', '긴장감', '웃긴', '몰입감', '잔잔한'];

function toggleValue(values: string[], value: string, checked: boolean) {
  return checked
    ? [...new Set([...values, value])]
    : values.filter((item) => item !== value);
}

export function GroupRecommendationPanel() {
  const group = useGroupRecommendations();
  const [participants, setParticipants] = useState<string[]>([]);
  const [region, setRegion] = useState('KR');
  const [services, setServices] = useState<string[]>(['Netflix']);
  const [contentTypes, setContentTypes] = useState<Array<'MOVIE' | 'TV'>>([
    'MOVIE',
    'TV',
  ]);
  const [runtimeMin, setRuntimeMin] = useState('');
  const [runtimeMax, setRuntimeMax] = useState('');
  const [moodTags, setMoodTags] = useState<string[]>([]);
  const [avoidTagsText, setAvoidTagsText] = useState('');
  const [rewatchPolicy, setRewatchPolicy] = useState<'EXCLUDE' | 'ALLOW'>(
    'EXCLUDE',
  );
  const [decisionRule, setDecisionRule] = useState<'ALL' | 'MINIMUM'>('ALL');
  const [minimumApprovals, setMinimumApprovals] = useState(2);
  const [formError, setFormError] = useState('');

  const activeMembers = useMemo(
    () =>
      group.activeSpace?.members.filter((member) => member.status === 'ACTIVE') ??
      [],
    [group.activeSpace],
  );

  useEffect(() => {
    if (!group.activeSpace) {
      setParticipants([]);
      return;
    }
    const memberIds = activeMembers.map((member) => member.accountId);
    const defaultParticipants = group.myAccountId
      ? [
          group.myAccountId,
          ...memberIds.filter((accountId) => accountId !== group.myAccountId),
        ]
      : memberIds;
    const selected = defaultParticipants.slice(0, Math.min(2, memberIds.length));
    setParticipants(selected);
    setMinimumApprovals(Math.max(1, selected.length));
    setFormError('');
  }, [activeMembers, group.activeSpace, group.myAccountId]);

  useEffect(() => {
    setMinimumApprovals((current) =>
      Math.min(Math.max(1, current), Math.max(1, participants.length)),
    );
  }, [participants.length]);

  const participantNames = participants.map((accountId) => {
    const member = activeMembers.find((item) => item.accountId === accountId);
    if (accountId === group.myAccountId) return '나';
    return member?.nickname || '공간 멤버';
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError('');
    let request: ReturnType<typeof buildGroupRecommendationRequest>;
    try {
      request = buildGroupRecommendationRequest({
        spaceId: group.activeSpaceId,
        participantAccountIds: participants,
        region,
        services,
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
      setFormError(
        caught instanceof Error ? caught.message : '추천 조건을 확인해 주세요.',
      );
      return;
    }
    await group.requestRecommendations(request).catch(() => undefined);
  }

  if (group.setupLoading) {
    return (
      <section
        aria-busy="true"
        aria-label="함께 고르기 준비 중"
        className="card-surface rounded-[24px] p-5"
      >
        <div className="h-5 w-32 animate-pulse rounded-full bg-[#dfe9f7]" />
        <div className="mt-3 h-16 animate-pulse rounded-2xl bg-[#f0f5fb]" />
      </section>
    );
  }

  if (group.setupError) {
    return (
      <section className="card-surface rounded-[24px] p-5" role="alert">
        <h1 className="text-[18px] font-black text-[#172947]">함께 고르기</h1>
        <p className="mt-2 text-[13px] font-semibold text-[#65758a]">
          {group.setupError}
        </p>
        <button
          type="button"
          onClick={() => void group.loadSetup()}
          className="mt-4 min-h-11 rounded-full bg-[#172947] px-5 text-[13px] font-extrabold text-white"
        >
          다시 불러오기
        </button>
      </section>
    );
  }

  if (!group.spaces.length) {
    return (
      <section className="card-surface rounded-[24px] p-5">
        <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#2f7eea]">
          함께 고르기
        </p>
        <h1 className="mt-2 text-[20px] font-black text-[#172947]">
          먼저 공유 공간을 만들어 주세요
        </h1>
        <p className="mt-2 text-[13px] font-semibold leading-6 text-[#65758a]">
          활성 공간 구성원 2~5명이 같은 조건으로 후보를 보고 합의할 수 있어요.
        </p>
        <Link
          href="/spaces"
          className="mt-4 inline-flex min-h-11 items-center rounded-full bg-[#172947] px-5 text-[13px] font-extrabold text-white"
        >
          공간 관리로 이동
        </Link>
      </section>
    );
  }

  return (
    <section
      className="rounded-[26px] border border-[#dbe7f7] bg-gradient-to-br from-white via-[#f7fbff] to-[#edf5ff] p-4 shadow-[0_16px_42px_rgba(31,65,114,0.10)] sm:p-6"
      aria-labelledby="group-recommendation-title"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#2f7eea]">
            오늘, 함께 볼 작품
          </p>
          <h1
            id="group-recommendation-title"
            className="mt-1 text-[22px] font-black text-[#172947]"
          >
            함께 고르기
          </h1>
          <p className="mt-1 max-w-xl text-[13px] font-semibold leading-6 text-[#65758a]">
            참여자와 조건을 직접 정하면, 모두가 실제로 볼 수 있는 후보와 합의
            진행만 보여드려요. 개인 점수와 숨은 선호는 공개하지 않아요.
          </p>
        </div>
        <span className="rounded-full bg-[#e7f1ff] px-3 py-1.5 text-[11px] font-extrabold text-[#2f7eea]">
          2~5명 전용
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-[12px] font-extrabold text-[#263b59]">공간</span>
            <select
              value={group.activeSpaceId}
              onChange={(event) => group.selectSpace(event.target.value)}
              className="mt-2 min-h-11 w-full rounded-2xl border border-[#d8e4f2] bg-white px-3 text-[14px] font-bold text-[#172947]"
            >
              {group.spaces.map((space) => (
                <option key={space.id} value={space.id}>
                  {space.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-[12px] font-extrabold text-[#263b59]">
              지역
            </span>
            <select
              value={region}
              onChange={(event) => setRegion(event.target.value)}
              className="mt-2 min-h-11 w-full rounded-2xl border border-[#d8e4f2] bg-white px-3 text-[14px] font-bold text-[#172947]"
            >
              <option value="KR">대한민국 (KR)</option>
            </select>
          </label>
        </div>

        <fieldset>
          <legend className="text-[12px] font-extrabold text-[#263b59]">
            추천 참여자 · {participants.length}명 선택
          </legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {activeMembers.map((member) => {
              const selected = participants.includes(member.accountId);
              const isMe = member.accountId === group.myAccountId;
              const disabled = isMe || (!selected && participants.length >= 5);
              return (
                <label
                  key={member.accountId}
                  className="flex min-h-11 cursor-pointer items-center gap-3 rounded-2xl border border-[#d8e4f2] bg-white px-3 text-[13px] font-bold text-[#263b59]"
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    disabled={disabled}
                    onChange={(event) =>
                      setParticipants((current) =>
                        toggleValue(
                          current,
                          member.accountId,
                          event.target.checked,
                        ),
                      )
                    }
                    className="h-5 w-5 accent-[#2f7eea]"
                  />
                  <span>
                    {isMe
                      ? `${member.nickname || '내 계정'} (나)`
                      : member.nickname || '공간 멤버'}
                    {isMe ? (
                      <span className="ml-1 text-[10px] font-semibold text-[#8b96a8]">
                        요청자 필수
                      </span>
                    ) : null}
                  </span>
                </label>
              );
            })}
          </div>
          {activeMembers.length < 2 ? (
            <p className="mt-2 text-[12px] font-bold text-[#b45309]">
              추천을 시작하려면 공간에 활성 구성원이 2명 이상 필요해요.
            </p>
          ) : null}
        </fieldset>

        <div className="grid gap-5 md:grid-cols-2">
          <fieldset>
            <legend className="text-[12px] font-extrabold text-[#263b59]">
              시청 경로 · 하나 이상
            </legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {PROVIDERS.map((provider) => (
                <label
                  key={provider}
                  className="flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-[#d8e4f2] bg-white px-3 text-[12px] font-bold text-[#263b59]"
                >
                  <input
                    type="checkbox"
                    checked={services.includes(provider)}
                    onChange={(event) =>
                      setServices((current) =>
                        toggleValue(current, provider, event.target.checked),
                      )
                    }
                    className="h-4 w-4 accent-[#2f7eea]"
                  />
                  {provider}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-[12px] font-extrabold text-[#263b59]">
              작품 유형
            </legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {([
                ['MOVIE', '영화'],
                ['TV', '드라마'],
              ] as const).map(([value, label]) => (
                <label
                  key={value}
                  className="flex min-h-11 cursor-pointer items-center gap-2 rounded-2xl border border-[#d8e4f2] bg-white px-3 text-[13px] font-bold text-[#263b59]"
                >
                  <input
                    type="checkbox"
                    checked={contentTypes.includes(value)}
                    onChange={(event) =>
                      setContentTypes((current) =>
                        toggleValue(
                          current,
                          value,
                          event.target.checked,
                        ) as Array<'MOVIE' | 'TV'>,
                      )
                    }
                    className="h-5 w-5 accent-[#2f7eea]"
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <fieldset>
          <legend className="text-[12px] font-extrabold text-[#263b59]">
            러닝타임
          </legend>
          <div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <label>
              <span className="sr-only">최소 러닝타임</span>
              <input
                type="number"
                min="1"
                max="600"
                inputMode="numeric"
                value={runtimeMin}
                onChange={(event) => setRuntimeMin(event.target.value)}
                placeholder="최소 분"
                className="min-h-11 w-full rounded-2xl border border-[#d8e4f2] bg-white px-3 text-[13px] font-bold text-[#172947]"
              />
            </label>
            <span className="text-[12px] font-bold text-[#8b96a8]">~</span>
            <label>
              <span className="sr-only">최대 러닝타임</span>
              <input
                type="number"
                min="1"
                max="600"
                inputMode="numeric"
                value={runtimeMax}
                onChange={(event) => setRuntimeMax(event.target.value)}
                placeholder="최대 분"
                className="min-h-11 w-full rounded-2xl border border-[#d8e4f2] bg-white px-3 text-[13px] font-bold text-[#172947]"
              />
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-[12px] font-extrabold text-[#263b59]">
            오늘의 분위기
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {MOODS.map((mood) => {
              const selected = moodTags.includes(mood);
              return (
                <button
                  key={mood}
                  type="button"
                  aria-pressed={selected}
                  onClick={() =>
                    setMoodTags((current) =>
                      toggleValue(current, mood, !selected),
                    )
                  }
                  className={`min-h-11 rounded-full border px-4 text-[12px] font-extrabold ${
                    selected
                      ? 'border-[#2f7eea] bg-[#2f7eea] text-white'
                      : 'border-[#d8e4f2] bg-white text-[#52677e]'
                  }`}
                >
                  {mood}
                </button>
              );
            })}
          </div>
        </fieldset>

        <label className="block">
          <span className="text-[12px] font-extrabold text-[#263b59]">
            제외 조건
          </span>
          <span className="ml-2 text-[11px] font-semibold text-[#8b96a8]">
            쉼표로 구분
          </span>
          <input
            value={avoidTagsText}
            onChange={(event) => setAvoidTagsText(event.target.value)}
            placeholder="예: 공포, 잔인한, 슬픈"
            className="mt-2 min-h-11 w-full rounded-2xl border border-[#d8e4f2] bg-white px-3 text-[13px] font-bold text-[#172947]"
          />
        </label>

        <div className="grid gap-5 md:grid-cols-2">
          <fieldset>
            <legend className="text-[12px] font-extrabold text-[#263b59]">
              재감상 정책
            </legend>
            <div className="mt-2 space-y-2">
              {([
                ['EXCLUDE', '누군가 이미 본 작품 제외'],
                ['ALLOW', '재감상 후보도 허용'],
              ] as const).map(([value, label]) => (
                <label
                  key={value}
                  className="flex min-h-11 cursor-pointer items-center gap-2 rounded-2xl bg-white px-3 text-[12px] font-bold text-[#263b59]"
                >
                  <input
                    type="radio"
                    name="rewatch-policy"
                    value={value}
                    checked={rewatchPolicy === value}
                    onChange={() => setRewatchPolicy(value)}
                    className="h-5 w-5 accent-[#2f7eea]"
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-[12px] font-extrabold text-[#263b59]">
              합의 규칙
            </legend>
            <div className="mt-2 space-y-2">
              {([
                ['ALL', '전원 동의'],
                ['MINIMUM', '최소 인원 동의'],
              ] as const).map(([value, label]) => (
                <label
                  key={value}
                  className="flex min-h-11 cursor-pointer items-center gap-2 rounded-2xl bg-white px-3 text-[12px] font-bold text-[#263b59]"
                >
                  <input
                    type="radio"
                    name="decision-rule"
                    value={value}
                    checked={decisionRule === value}
                    onChange={() => setDecisionRule(value)}
                    className="h-5 w-5 accent-[#2f7eea]"
                  />
                  {label}
                </label>
              ))}
            </div>
            {decisionRule === 'MINIMUM' ? (
              <label className="mt-2 block">
                <span className="sr-only">최소 동의 인원</span>
                <select
                  value={Math.min(minimumApprovals, participants.length || 1)}
                  onChange={(event) =>
                    setMinimumApprovals(Number(event.target.value))
                  }
                  className="min-h-11 w-full rounded-2xl border border-[#d8e4f2] bg-white px-3 text-[13px] font-bold text-[#172947]"
                >
                  {Array.from(
                    { length: Math.max(1, participants.length) },
                    (_, index) => index + 1,
                  ).map((count) => (
                    <option key={count} value={count}>
                      {count}명 이상
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
          </fieldset>
        </div>

        <div className="rounded-2xl border border-[#cfe0f5] bg-white/80 p-4">
          <p className="text-[12px] font-extrabold text-[#172947]">
            요청 전 확인
          </p>
          <p className="mt-1 text-[12px] font-semibold leading-5 text-[#65758a]">
            {participantNames.join(', ') || '참여자 미선택'} · {region} ·{' '}
            {services.join(', ') || '시청 경로 미선택'} ·{' '}
            {decisionRule === 'ALL'
              ? '전원 동의'
              : `${minimumApprovals}명 이상 동의`}
          </p>
          <p className="mt-1 text-[11px] font-semibold text-[#8b96a8]">
            이 조건은 자동으로 완화되지 않으며, 새 요청을 만들기 전까지 그대로
            유지돼요.
          </p>
        </div>

        {formError ? (
          <p role="alert" className="text-[12px] font-bold text-[#c24156]">
            {formError}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={group.requestStatus === 'loading' || activeMembers.length < 2}
          className="min-h-12 w-full rounded-2xl bg-[#172947] px-5 text-[14px] font-black text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {group.requestStatus === 'loading'
            ? '조건을 확인하고 있어요…'
            : '이 조건으로 함께 고르기'}
        </button>
      </form>

      {group.requestError ? (
        <div
          role="alert"
          className="mt-5 rounded-2xl border border-[#f5c9d1] bg-[#fff5f7] p-4"
        >
          <p className="text-[13px] font-extrabold text-[#9f2942]">
            {group.requestStatus === 'provider-error'
              ? '공급자 확인 실패'
              : '추천 요청 실패'}
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
        <div className="mt-7" aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-[18px] font-black text-[#172947]">
                함께 볼 후보
              </h2>
              <p className="mt-1 text-[11px] font-semibold text-[#8b96a8]">
                {group.session.session.createdAt
                  ? `${new Date(group.session.session.createdAt).toLocaleString('ko-KR')} 요청`
                  : '방금 요청'}
                {' · '}조건과 이유 코드는 이 세션에 고정돼요.
              </p>
            </div>
            {group.session.session.status === 'MATCHED' ? (
              <span className="rounded-full bg-[#dff7eb] px-3 py-1.5 text-[11px] font-extrabold text-[#17714a]">
                최종 합의 완료
              </span>
            ) : group.session.session.status === 'CLOSED' ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#f2f4f7] px-3 py-1.5 text-[11px] font-extrabold text-[#65758a]">
                  세션 만료
                </span>
                <button
                  type="button"
                  onClick={() => void group.retryLastRequest()}
                  className="min-h-11 rounded-full border border-[#d8e4f2] bg-white px-4 text-[11px] font-extrabold text-[#52677e]"
                >
                  같은 조건으로 새 추천
                </button>
              </div>
            ) : null}
          </div>

          {group.session.items.length === 0 ? (
            <div className="mt-3 rounded-2xl border border-[#eed9aa] bg-[#fffaf0] p-4">
              <h3 className="text-[14px] font-black text-[#875c10]">
                현재 조건과 정확히 맞는 후보가 없어요
              </h3>
              <p className="mt-1 text-[12px] font-semibold leading-5 text-[#806b43]">
                필터는 몰래 완화하지 않았어요. 아래 변경은 버튼을 누른 뒤 다시
                요청할 때만 적용돼요.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(runtimeMin || runtimeMax) ? (
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
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8f2ff] text-[14px] font-black text-[#2f7eea]">
                        {item.rank}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <h3 className="text-[16px] font-black text-[#172947]">
                              {item.content.title || '제목 정보 없음'}
                            </h3>
                            <p className="mt-1 text-[11px] font-bold text-[#8b96a8]">
                              {item.content.mediaType === 'TV' ? '드라마' : '영화'}
                              {item.content.runtime
                                ? ` · ${item.content.runtime}분`
                                : ''}
                            </p>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1.5 text-[11px] font-extrabold ${
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
                          <p className="text-[12px] font-extrabold">
                            {availability.title}
                          </p>
                          <p className="mt-1 text-[11px] font-semibold leading-5">
                            {availability.detail}
                          </p>
                          {availability.state === 'EXPIRED' ? (
                            <button
                              type="button"
                              onClick={() => void group.retryLastRequest()}
                              className="mt-2 min-h-11 rounded-full border border-current px-3 text-[11px] font-extrabold"
                            >
                              조건 그대로 다시 확인
                            </button>
                          ) : null}
                        </div>

                        <div className="mt-3">
                          <p className="text-[12px] font-extrabold text-[#263b59]">
                            추천 이유
                          </p>
                          <ul className="mt-2 space-y-2">
                            {item.reasons.map((reason, index) => (
                              <li
                                key={`${reason.reasonCode}-${index}`}
                                className="rounded-xl bg-[#f6f9fd] px-3 py-2 text-[11px] font-semibold leading-5 text-[#52677e]"
                              >
                                <code className="mr-2 rounded bg-[#e6eef8] px-1.5 py-0.5 text-[10px] font-bold text-[#345b89]">
                                  {reason.reasonCode}
                                </code>
                                {recommendationReasonText(reason.reasonCode)}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-4 rounded-2xl border border-[#e1e9f3] p-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-[12px] font-extrabold text-[#263b59]">
                              {consensus.label}
                            </p>
                            <p className="text-[11px] font-bold text-[#65758a]">
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
                              className="block h-full rounded-full bg-[#2f7eea]"
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
                          <p className="mt-2 text-[11px] font-semibold text-[#8b96a8]">
                            개인별 선택과 내부 추천 점수는 공개하지 않고 집계만 보여요.
                          </p>
                        </div>

                        <fieldset className="mt-4" disabled={closed}>
                          <legend className="text-[12px] font-extrabold text-[#263b59]">
                            내 의견
                          </legend>
                          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {FEEDBACK_OPTIONS.map((option) => (
                              <button
                                key={option.kind}
                                type="button"
                                aria-pressed={selectedFeedback === option.kind}
                                disabled={
                                  closed || group.feedbackBusy === item.exposureId
                                }
                                onClick={() =>
                                  void group.submitFeedback(
                                    item.exposureId,
                                    option.kind,
                                  )
                                }
                                className={`min-h-11 rounded-xl px-2 text-[11px] font-extrabold disabled:opacity-50 ${
                                  selectedFeedback === option.kind
                                    ? 'bg-[#172947] text-white'
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
            </div>
          )}
          {group.feedbackError ? (
            <p role="alert" className="mt-3 text-[12px] font-bold text-[#c24156]">
              {group.feedbackError}
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
