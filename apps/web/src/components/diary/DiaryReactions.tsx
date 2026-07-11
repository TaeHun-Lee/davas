'use client';

import { useEffect, useMemo, useState } from 'react';
import { addDiaryReaction, getDiaryReactions, removeDiaryReaction, type DiaryReaction, type ReactionEmoji } from '../../lib/api/reactions';

const options: Array<{ emoji: ReactionEmoji; icon: string; label: string }> = [
  { emoji: 'HEART', icon: '❤️', label: '좋아요' },
  { emoji: 'CLAP', icon: '👏', label: '공감해요' },
  { emoji: 'SMILE', icon: '😊', label: '즐거워요' },
  { emoji: 'TEAR', icon: '🥲', label: '뭉클해요' },
];

export function DiaryReactions({ diaryId }: { diaryId: string }) {
  const [items, setItems] = useState<DiaryReaction[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [pending, setPending] = useState<ReactionEmoji | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  useEffect(() => { let active = true; setStatus('loading'); getDiaryReactions(diaryId).then((value) => { if (active) { setItems(value.items); setStatus('ready'); } }).catch(() => { if (active) setStatus('error'); }); return () => { active = false; }; }, [diaryId, retryKey]);
  const groups = useMemo(() => new Map(options.map(({ emoji }) => [emoji, { count: items.filter((item) => item.emoji === emoji).length, mine: items.some((item) => item.emoji === emoji && item.isMine) }])), [items]);
  async function toggle(emoji: ReactionEmoji) { if (pending) return; setPending(emoji); const mine = groups.get(emoji)?.mine; try { if (mine) { await removeDiaryReaction(diaryId, emoji); setItems((current) => current.filter((item) => !(item.emoji === emoji && item.isMine))); } else { const added = await addDiaryReaction(diaryId, emoji); setItems((current) => [...current, { ...added, isMine: true }]); } } catch { setStatus('error'); } finally { setPending(null); } }
  return <section className="mt-5 rounded-[24px] bg-white p-4 shadow-[0_12px_30px_rgba(31,42,68,0.07)]" aria-labelledby="reaction-title"><div className="flex items-center justify-between"><h2 id="reaction-title" className="text-[15px] font-black text-[#23426f]">반응</h2>{status === 'error' ? <button type="button" onClick={() => setRetryKey((value) => value + 1)} className="min-h-11 px-2 text-[12px] font-black text-[#b93832]">다시 시도</button> : null}</div><div className="mt-3 grid grid-cols-4 gap-2">{options.map(({ emoji, icon, label }) => { const group = groups.get(emoji); return <button key={emoji} type="button" disabled={status !== 'ready' || pending !== null} aria-pressed={group?.mine ?? false} aria-label={`${label} ${group?.count ?? 0}개`} onClick={() => toggle(emoji)} className={`min-h-11 rounded-[14px] border text-[15px] font-black ${group?.mine ? 'border-[#ff8b85] bg-[#fff0ee] text-[#a93530]' : 'border-[#dce5f0] bg-[#f7f9fc] text-[#52677e]'}`}>{icon} <span className="text-[11px]">{group?.count ?? 0}</span></button>; })}</div></section>;
}
