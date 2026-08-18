'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  acceptFriend,
  cancelFriend,
  createFriendInvite,
  getFriends,
  rejectFriend,
  removeFriend,
  requestFriend,
  searchFriends,
  type FriendRow,
  type FriendsResponse,
  type FriendUser,
} from '../../lib/api/friends';
import {
  CoreAppShell,
  EmptyState,
  SearchField,
  SearchIcon,
} from '../core/CoreUi';

const empty: FriendsResponse = { friends: [], received: [], sent: [] };

export function FriendsScreen() {
  const [data, setData] = useState(empty);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(
    'loading',
  );
  const [q, setQ] = useState('');
  const [results, setResults] = useState<FriendUser[]>([]);
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState('');
  const [removeTarget, setRemoveTarget] = useState<FriendRow | null>(null);
  const receivedRef = useRef<HTMLElement>(null);

  const load = async () => {
    setStatus('loading');
    try {
      setData(await getFriends());
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const act = async (id: string, action: () => Promise<unknown>) => {
    if (busy) return;
    setBusy(id);
    setMessage('');
    try {
      await action();
      await load();
      if (q.trim().length >= 2) {
        setResults((await searchFriends(q)).items);
      }
    } catch {
      setMessage('요청을 처리하지 못했어요. 다시 시도해 주세요.');
    } finally {
      setBusy('');
    }
  };

  const search = async () => {
    if (q.trim().length < 2) {
      setMessage('두 글자 이상 입력해 주세요.');
      return;
    }
    setBusy('search');
    setMessage('');
    try {
      setResults((await searchFriends(q)).items);
    } catch {
      setMessage('친구를 찾지 못했어요.');
    } finally {
      setBusy('');
    }
  };

  const invite = async () => {
    setBusy('invite');
    try {
      const created = await createFriendInvite();
      const url = `${location.origin}/friends/invite/${created.token}`;
      const canShare = 'share' in navigator;
      if (canShare) {
        await navigator.share({
          title: 'Davas 친구 초대',
          text: '영화·드라마 기록을 함께 나눠요.',
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
      }
      setMessage(
        canShare ? '초대 링크를 공유했어요.' : '초대 링크를 복사했어요.',
      );
    } catch {
      setMessage('초대 링크를 만들지 못했어요.');
    } finally {
      setBusy('');
    }
  };

  const person = (user: FriendUser, action: ReactNode) => (
    <li
      key={user.id}
      className="core-card flex min-h-16 items-center gap-3 px-4 py-3"
    >
      <span className="avatar-small">{user.nickname.slice(0, 1)}</span>
      <strong className="min-w-0 flex-1 truncate text-sm text-[var(--heading)]">
        {user.nickname}
      </strong>
      {action}
    </li>
  );

  return (
    <CoreAppShell>
      <h1 className="page-title">친구</h1>
      <p className="page-description">
        친구가 공유한 기록을 찾고, 초대와 요청을 관리해요.
      </p>

      <Link
        href="/search?scope=friends"
        className="friend-record-search"
        aria-label="친구 기록 검색 열기"
      >
        <span className="friend-record-search-icon">
          <SearchIcon />
        </span>
        <span className="friend-record-search-copy">
          <strong>친구 기록 검색</strong>
          <small>작품 제목이나 친구 이름으로 찾아보세요.</small>
        </span>
        <span className="friend-record-search-arrow" aria-hidden="true">
          ›
        </span>
      </Link>

      <button
        type="button"
        className="wide-cta mt-4"
        disabled={busy === 'invite'}
        onClick={invite}
      >
        <span>＋ 친구 초대하기</span>
        <span aria-hidden="true">›</span>
      </button>

      {message ? (
        <p className="form-error mt-3" role="status">
          {message}
        </p>
      ) : null}

      {status === 'loading' ? (
        <div className="skeleton-card mt-6" />
      ) : status === 'error' ? (
        <div className="mt-6">
          <EmptyState
            title="친구 정보를 불러오지 못했어요"
            description="연결을 확인하고 다시 시도해 주세요. 기록 검색은 위 버튼에서 이용할 수 있어요."
            action={
              <button className="secondary-button" onClick={load}>
                다시 시도
              </button>
            }
          />
        </div>
      ) : (
        <div className="mt-7 space-y-7">
          {data.received.length ? (
            <section ref={receivedRef} tabIndex={-1}>
              <h2 className="section-title mb-3">받은 요청</h2>
              <ul className="space-y-2">
                {data.received.map((row) =>
                  person(
                    row.user,
                    <div className="flex gap-1">
                      <button
                        className="primary-button !min-h-11 !px-3"
                        disabled={busy === row.id}
                        onClick={() =>
                          act(row.id, () => acceptFriend(row.id))
                        }
                      >
                        수락
                      </button>
                      <button
                        className="secondary-button !min-h-11 !px-3"
                        disabled={busy === row.id}
                        onClick={() =>
                          act(row.id, () => rejectFriend(row.id))
                        }
                      >
                        거절
                      </button>
                    </div>,
                  ),
                )}
              </ul>
            </section>
          ) : null}

          <section>
            <h2 className="section-title mb-3">사람 찾기</h2>
            <SearchField
              value={q}
              onChange={setQ}
              label="친구 찾기"
              placeholder="닉네임 또는 정확한 이메일"
              onSubmit={search}
            />
            {results.length ? (
              <ul className="mt-3 space-y-2">
                {results.map((user) =>
                  person(
                    user,
                    user.relationship === 'FRIEND' ? (
                      <span className="text-xs font-bold text-[var(--muted)]">
                        이미 친구
                      </span>
                    ) : user.relationship === 'SENT' ? (
                      <span className="text-xs font-bold text-[var(--muted)]">
                        요청 보냄
                      </span>
                    ) : user.relationship === 'RECEIVED' ? (
                      <button
                        className="secondary-button !min-h-11 !px-3"
                        onClick={() => {
                          receivedRef.current?.scrollIntoView({
                            behavior: 'smooth',
                          });
                          receivedRef.current?.focus();
                        }}
                      >
                        받은 요청 보기
                      </button>
                    ) : (
                      <button
                        className="secondary-button !min-h-11 !px-3"
                        disabled={busy === user.id}
                        onClick={() =>
                          act(user.id, () => requestFriend(user.id))
                        }
                      >
                        친구 요청 보내기
                      </button>
                    ),
                  ),
                )}
              </ul>
            ) : null}
          </section>

          <section>
            <h2 className="section-title mb-3">친구 목록</h2>
            {data.friends.length ? (
              <ul className="space-y-2">
                {data.friends.map((row) =>
                  person(
                    row.user,
                    <button
                      className="danger-button !min-h-11 !px-3"
                      onClick={() => setRemoveTarget(row)}
                    >
                      친구 삭제
                    </button>,
                  ),
                )}
              </ul>
            ) : (
              <EmptyState
                title="아직 연결된 친구가 없어요"
                description="친구를 초대하면 서로의 영화·드라마 기록을 볼 수 있어요."
                action={
                  <button className="secondary-button" onClick={invite}>
                    친구 초대하기
                  </button>
                }
              />
            )}
          </section>

          {data.sent.length ? (
            <section>
              <h2 className="section-title mb-3">보낸 요청</h2>
              <ul className="space-y-2">
                {data.sent.map((row) =>
                  person(
                    row.user,
                    <button
                      className="secondary-button !min-h-11 !px-3"
                      disabled={busy === row.id}
                      onClick={() =>
                        act(row.id, () => cancelFriend(row.id))
                      }
                    >
                      취소
                    </button>,
                  ),
                )}
              </ul>
            </section>
          ) : null}
        </div>
      )}

      {removeTarget ? (
        <section role="dialog" aria-modal="true" className="core-card mt-4 p-5">
          <h2 className="section-title">
            {removeTarget.user.nickname}님을 친구에서 삭제할까요?
          </h2>
          <p className="page-description">
            서로의 친구 공개 기록을 더 이상 볼 수 없어요.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              autoFocus
              className="secondary-button"
              onClick={() => setRemoveTarget(null)}
            >
              취소
            </button>
            <button
              className="danger-button"
              onClick={() =>
                act(removeTarget.id, () => removeFriend(removeTarget.id)).then(
                  () => setRemoveTarget(null),
                )
              }
            >
              친구 삭제
            </button>
          </div>
        </section>
      ) : null}
    </CoreAppShell>
  );
}
