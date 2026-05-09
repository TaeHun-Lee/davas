'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { getMe, type AuthenticatedUser } from '../../lib/api/auth';
import { deleteProfileImage, updateMe, uploadProfileImage } from '../../lib/api/users';
import { AppShell } from '../layout/AppShell';
import { MediaDetailLoadingIndicator } from '../media/MediaDetailLoadingIndicator';
import { ProfileImagePicker } from './ProfileImagePicker';

const genreOptions = ['액션', '드라마', '코미디', '로맨스', 'SF', '스릴러', '판타지', '다큐멘터리'];

export function ProfileEditScreen() {
  const router = useRouter();
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [preferredGenres, setPreferredGenres] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'saving' | 'error'>('loading');

  useEffect(() => {
    getMe()
      .then((me) => {
        setUser(me);
        setNickname(me.nickname ?? '');
        setBio(me.bio ?? '');
        setPreferredGenres(me.preferredGenres ?? []);
        setStatus('ready');
      })
      .catch(() => router.replace('/login'));
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('saving');
    try {
      let nextUser = await updateMe({ nickname, bio, preferredGenres });
      if (selectedFile) {
        nextUser = await uploadProfileImage(selectedFile);
      }
      setUser(nextUser);
      router.replace('/profile');
    } catch {
      setStatus('error');
    }
  }

  async function handleDeleteProfileImage() {
    setStatus('saving');
    try {
      const nextUser = await deleteProfileImage();
      setSelectedFile(null);
      setUser({ ...nextUser, profileImageUrl: null });
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }

  if (!user || status === 'loading') return <MediaDetailLoadingIndicator label="프로필 편집 화면을 불러오는 중" />;

  return (
    <AppShell>
      <form onSubmit={handleSubmit} className="overflow-x-hidden pb-8" data-design="profile-edit-screen">
        <header className="flex h-[48px] items-center justify-between">
          <button type="button" onClick={() => router.back()} className="text-[14px] font-extrabold text-[#6f7c91]">취소</button>
          <h1 className="text-[20px] font-black tracking-[-0.03em] text-[#23426f]">프로필 편집</h1>
          <button type="submit" disabled={status === 'saving'} className="text-[14px] font-extrabold text-[#2f65b8]">저장</button>
        </header>
        <div className="mt-4 rounded-[24px] bg-white p-5 shadow-[0_12px_28px_rgba(31,65,114,0.08)]">
          <ProfileImagePicker imageUrl={user.profileImageUrl} displayName={nickname || user.nickname} onFileSelect={setSelectedFile} />
          {user.profileImageUrl ? (
            <button
              type="button"
              onClick={handleDeleteProfileImage}
              disabled={status === 'saving'}
              className="mx-auto mt-3 block rounded-full bg-[#f3f6fb] px-4 py-2 text-[12px] font-extrabold text-[#d94f4f]"
            >
              프로필 사진 삭제
            </button>
          ) : null}
          <label className="mt-6 block text-[13px] font-black text-[#284778]">닉네임
            <input value={nickname} onChange={(event) => setNickname(event.target.value)} className="mt-2 h-[46px] w-full rounded-[16px] border border-[#dfe6f0] bg-[#f8fafd] px-4 text-[15px] font-bold outline-none" />
          </label>
          <label className="mt-4 block text-[13px] font-black text-[#284778]">소개
            <textarea value={bio} onChange={(event) => setBio(event.target.value)} rows={4} className="mt-2 w-full resize-none rounded-[16px] border border-[#dfe6f0] bg-[#f8fafd] p-4 text-[14px] font-semibold outline-none" />
          </label>
          <div className="mt-4">
            <p className="text-[13px] font-black text-[#284778]">선호 장르</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {genreOptions.map((genre) => {
                const selected = preferredGenres.includes(genre);
                return <button type="button" key={genre} onClick={() => setPreferredGenres((items) => selected ? items.filter((item) => item !== genre) : [...items, genre])} className={`rounded-full px-3 py-2 text-[12px] font-extrabold ${selected ? 'bg-[#2f65b8] text-white' : 'bg-[#eef3fb] text-[#6f7c91]'}`}>{genre}</button>;
              })}
            </div>
          </div>
          {status === 'error' ? <p className="mt-4 text-[13px] font-bold text-[#d94f4f]">저장하지 못했어요. 다시 시도해주세요.</p> : null}
        </div>
      </form>
    </AppShell>
  );
}
