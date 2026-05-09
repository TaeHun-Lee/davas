'use client';

import { useEffect, useState } from 'react';
import { normalizeProfileImageUrl } from '../../lib/api/auth';
import { createDiaryComment, deleteDiaryComment, getDiaryComments, updateDiaryComment } from '../../lib/api/community';
import type { CommunityComment } from './community-types';

type CommunityCommentsSectionProps = {
  diaryId: string;
};

type CommentsStatus = 'loading' | 'ready' | 'error';

function CommentAvatar({ nickname, imageUrl }: { nickname: string; imageUrl: string | null }) {
  const profileImageUrl = normalizeProfileImageUrl(imageUrl);
  if (profileImageUrl) {
    return <img src={profileImageUrl} alt="" className="h-8 w-8 rounded-full object-cover" />;
  }
  return <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eaf1ff] text-[11px] font-black text-[#216bd8]">{nickname.slice(0, 1)}</span>;
}

export function CommunityCommentsSection({ diaryId }: CommunityCommentsSectionProps) {
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [status, setStatus] = useState<CommentsStatus>('loading');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let mounted = true;
    setStatus('loading');
    getDiaryComments(diaryId)
      .then((response) => {
        if (!mounted) return;
        setComments(response.items);
        setStatus('ready');
      })
      .catch(() => {
        if (!mounted) return;
        setStatus('error');
      });
    return () => {
      mounted = false;
    };
  }, [diaryId]);

  async function handleCreate() {
    if (!content.trim()) return;
    setErrorMessage('');
    try {
      const nextComment = await createDiaryComment(diaryId, content);
      setComments((current) => [...current, nextComment]);
      setContent('');
    } catch {
      setErrorMessage('로그인 후 댓글을 작성할 수 있어요.');
    }
  }

  async function handleUpdate(commentId: string) {
    if (!editingContent.trim()) return;
    setErrorMessage('');
    try {
      const nextComment = await updateDiaryComment(commentId, editingContent);
      setComments((current) => current.map((comment) => (comment.id === commentId ? nextComment : comment)));
      setEditingId(null);
      setEditingContent('');
    } catch {
      setErrorMessage('댓글을 수정하지 못했어요.');
    }
  }

  async function handleDelete(commentId: string) {
    setErrorMessage('');
    try {
      await deleteDiaryComment(commentId);
      setComments((current) => current.filter((comment) => comment.id !== commentId));
    } catch {
      setErrorMessage('댓글을 삭제하지 못했어요.');
    }
  }

  return (
    <section className="mt-5 rounded-[30px] bg-white p-5 shadow-[0_16px_36px_rgba(31,42,68,0.08)]" aria-label="댓글">
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] font-black text-[#1f2a44]">댓글</h2>
        <span className="text-[12px] font-extrabold text-[#8a95a8]">{comments.length}</span>
      </div>
      <div className="mt-4 flex gap-2">
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="댓글을 작성해보세요"
          className="min-h-[76px] flex-1 resize-none rounded-[20px] bg-[#f6f8fc] px-4 py-3 text-[13px] font-semibold text-[#34415a] outline-none placeholder:text-[#a8b1c1]"
        />
        <button type="button" onClick={handleCreate} className="self-end rounded-full bg-[#216bd8] px-4 py-3 text-[12px] font-black text-white">
          등록
        </button>
      </div>
      {errorMessage ? <p className="mt-2 text-[12px] font-bold text-[#e85b6a]">{errorMessage}</p> : null}
      {status === 'loading' ? <div className="mt-4 h-16 rounded-[20px] bg-[#f6f8fc]" aria-label="댓글을 불러오는 중" /> : null}
      {status === 'error' ? <p className="mt-4 text-[12px] font-bold text-[#e85b6a]">댓글을 불러오지 못했어요.</p> : null}
      {status === 'ready' && comments.length === 0 ? <p className="mt-4 text-[12px] font-bold text-[#8a95a8]">아직 댓글이 없어요.</p> : null}
      <div className="mt-4 space-y-4">
        {comments.map((comment) => (
          <article key={comment.id} className="rounded-[22px] bg-[#f9fbff] p-4">
            <div className="flex items-center gap-2">
              <CommentAvatar nickname={comment.author.nickname} imageUrl={comment.author.profileImageUrl} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-black text-[#1f2a44]">{comment.author.nickname}</p>
                <p className="text-[10px] font-bold text-[#9aa5b7]">{new Date(comment.createdAt).toLocaleDateString('ko-KR')}</p>
              </div>
              {comment.isMine ? (
                <div className="flex gap-2 text-[11px] font-black text-[#216bd8]">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(comment.id);
                      setEditingContent(comment.content);
                    }}
                  >
                    수정
                  </button>
                  <button type="button" onClick={() => handleDelete(comment.id)}>
                    삭제
                  </button>
                </div>
              ) : null}
            </div>
            {editingId === comment.id ? (
              <div className="mt-3">
                <textarea
                  value={editingContent}
                  onChange={(event) => setEditingContent(event.target.value)}
                  className="min-h-[72px] w-full resize-none rounded-[18px] bg-white px-3 py-2 text-[13px] font-semibold text-[#34415a] outline-none"
                />
                <div className="mt-2 flex justify-end gap-2 text-[11px] font-black">
                  <button type="button" onClick={() => setEditingId(null)} className="rounded-full bg-[#edf2f8] px-3 py-2 text-[#66758c]">취소</button>
                  <button type="button" onClick={() => handleUpdate(comment.id)} className="rounded-full bg-[#216bd8] px-3 py-2 text-white">저장</button>
                </div>
              </div>
            ) : (
              <p className="mt-3 whitespace-pre-wrap text-[13px] font-semibold leading-[20px] text-[#4b5870]">{comment.content}</p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
