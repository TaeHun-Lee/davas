'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { SpaceReactionComparison } from '@davas/shared';
import type { MediaAvailability } from '../../lib/api/media';
import { ourReactions, watchableGroups, type ReactionPerson } from './media-together-model';

const card =
  'rounded-[20px] bg-white p-4 shadow-[0_10px_24px_rgba(31,65,114,0.07)] ring-1 ring-[#edf2f8]';
const title = 'text-[15px] font-black leading-[20px] tracking-[-0.025em] text-[#1f4e82]';
const quiet = 'mt-2 text-[12px] font-semibold leading-[19px] text-[#5f6b7a]';

function PersonRow({ person, returnTo }: { person: ReactionPerson; returnTo: string }) {
  const [spoilerOpen, setSpoilerOpen] = useState(false);
  const text = person.headline || person.review;
  const hidden = person.hasSpoiler && !spoilerOpen && !person.isMe;
  return (
    <li className="rounded-[16px] bg-[#f6f9fd] px-3 py-2.5">
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-black text-white ${person.isMe ? 'bg-[#216bd8]' : 'bg-[#2f5450]'}`}
        >
          {person.name.slice(0, 1)}
        </span>
        <b className="min-w-0 flex-1 truncate text-[13px] font-extrabold text-[#1f2a44]">
          {person.name}
          {person.watchCount > 1 ? (
            <span className="ml-1 text-[11px] font-bold text-[#6e7889]">
              · {person.watchCount}번 봤어요
            </span>
          ) : null}
        </b>
        <span className="shrink-0 text-[13px] font-black text-[#1f2a44]">
          {person.locked ? (
            <span aria-label="별점 가려짐">★ ?.?</span>
          ) : person.rating !== null ? (
            <>
              <span aria-hidden="true" className="text-[#f2a516]">
                ★
              </span>{' '}
              {person.rating.toFixed(1)}
            </>
          ) : (
            <span className="text-[11px] font-bold text-[#6e7889]">별점 없음</span>
          )}
        </span>
      </div>
      {person.locked ? (
        <p className="mt-1.5 text-[12px] font-semibold leading-[18px] text-[#56667b]">
          블라인드 리뷰예요. 기록에서 열리는 조건을 확인해 주세요.
        </p>
      ) : hidden ? (
        <button
          type="button"
          onClick={() => setSpoilerOpen(true)}
          className="mt-1.5 min-h-11 w-full rounded-xl border border-dashed border-[#c9d6e6] bg-white text-[12px] font-extrabold text-[#1f2a44]"
        >
          스포일러가 있어요 · 눌러서 보기
        </button>
      ) : text ? (
        <p className="mt-1.5 line-clamp-2 text-[12px] font-semibold leading-[18px] text-[#3c4a5e]">
          {text}
        </p>
      ) : null}
      <Link
        href={`/records/${encodeURIComponent(person.latestRecordId)}?returnTo=${encodeURIComponent(returnTo)}`}
        className="mt-1 inline-flex min-h-11 items-center text-[12px] font-extrabold text-[#1c5ab5]"
      >
        기록 보기 ›
      </Link>
    </li>
  );
}

/** How the people in my space rated this title, in place of the old friends' records. */
export function OurReactionsCard({
  status,
  spaceName,
  comparison,
  myAccountId,
  returnTo,
}: {
  status: 'loading' | 'ready' | 'error';
  spaceName: string;
  comparison: SpaceReactionComparison | null;
  myAccountId: string;
  returnTo: string;
}) {
  const summary = comparison ? ourReactions(comparison, myAccountId) : null;
  return (
    <section className={card} aria-labelledby="our-reactions-title">
      <div className="flex items-baseline justify-between gap-3">
        <h3 id="our-reactions-title" className={title}>
          우리 반응
        </h3>
        {summary?.average != null ? (
          <span className="text-[12px] font-extrabold text-[#1f2a44]">
            우리 평균 <span className="text-[#f2a516]">★</span> {summary.average.toFixed(1)}
          </span>
        ) : null}
      </div>
      {status === 'loading' ? (
        <p className={quiet}>{spaceName ? `${spaceName}의 반응을 불러오는 중…` : '불러오는 중…'}</p>
      ) : status === 'error' ? (
        <p className={quiet}>우리 반응을 불러오지 못했어요.</p>
      ) : !summary || summary.people.length === 0 ? (
        <p className={quiet}>
          아직 {spaceName}에 이 작품 기록이 없어요. 함께 봤다면 기록을 남겨 보세요.
        </p>
      ) : (
        <>
          <p className={quiet}>
            {spaceName}에 공유된 기록 {summary.recordCount}개의 별점과 한줄평이에요.
          </p>
          <ul className="mt-3 space-y-2">
            {summary.people.map((person) => (
              <PersonRow key={person.accountId} person={person} returnTo={returnTo} />
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

/**
 * Where the title can be watched in Korea now, grouped by how (정액제·무료·대여·구매), with the
 * services I subscribe to marked. The data is TMDB's, from JustWatch, which asks to be credited.
 */
export function WatchableNowCard({
  status,
  availability,
  myServices,
}: {
  status: 'loading' | 'ready' | 'error';
  availability: MediaAvailability | null;
  myServices: string[];
}) {
  const { groups, onMine } = watchableGroups(availability, myServices);
  const checkedAt = availability?.observedAt
    ? new Intl.DateTimeFormat('ko-KR', {
        timeZone: 'Asia/Seoul',
        month: 'long',
        day: 'numeric',
      }).format(new Date(availability.observedAt))
    : null;

  return (
    <section className={card} aria-labelledby="watchable-now-title">
      <h3 id="watchable-now-title" className={title}>
        지금 볼 수 있는 곳
      </h3>
      {status === 'loading' ? (
        <p className={quiet}>볼 수 있는 곳을 확인하는 중…</p>
      ) : status === 'error' ||
        !availability ||
        availability.state === 'PROVIDER_FAILURE' ||
        availability.state === 'UNMAPPED' ||
        availability.state === 'UNKNOWN' ? (
        <p className={quiet}>볼 수 있는 곳을 확인하지 못했어요. 잠시 후 다시 열어 주세요.</p>
      ) : groups.length === 0 ? (
        <p className={quiet}>지금 한국에서 볼 수 있는 곳을 찾지 못했어요.</p>
      ) : (
        <>
          {onMine.length ? (
            <p className="mt-2 rounded-[14px] bg-[#eaf1ff] px-3 py-2 text-[12px] font-extrabold text-[#1c5ab5]">
              구독 중인 {onMine.join(', ')}에서 바로 볼 수 있어요
            </p>
          ) : null}
          <dl className="mt-3 space-y-2">
            {groups.map((group) => (
              <div key={group.label} className="flex gap-3">
                <dt className="w-12 shrink-0 pt-1 text-[11px] font-extrabold text-[#2f4d73]">
                  {group.label}
                </dt>
                <dd className="flex min-w-0 flex-wrap gap-1.5">
                  {group.providers.map((provider) => (
                    <span
                      key={provider.name}
                      className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold ${provider.subscribed ? 'bg-[#216bd8] text-white' : 'bg-[#f1f5fb] text-[#3c4a5e]'}`}
                    >
                      {provider.name}
                      {provider.subscribed ? ' · 구독 중' : ''}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </>
      )}
      <p className="mt-3 text-[11px] font-semibold leading-[16px] text-[#6e7889]">
        TMDB(JustWatch 제공){checkedAt ? ` · ${checkedAt} 확인` : ''}. 서비스 사정에 따라 실제와
        다를 수 있어요.
      </p>
    </section>
  );
}
