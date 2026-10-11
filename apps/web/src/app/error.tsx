'use client';

import { useEffect } from 'react';

const RELOADED_AT = 'davas-chunk-reload-at';

/** A script of the build this page started with is gone, as after a deploy. */
function isChunkLoadError(error: Error) {
  return (
    error.name === 'ChunkLoadError' ||
    /Loading (CSS )?chunk|Failed to fetch dynamically imported module|Importing a module script failed/i.test(
      error.message,
    )
  );
}

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  // A page left open across a deploy asks for scripts the new build no longer has: load the
  // current build once, instead of showing the error. Once a minute at most, so a real outage
  // still shows the message below.
  useEffect(() => {
    if (!isChunkLoadError(error)) return;
    try {
      const last = Number(sessionStorage.getItem(RELOADED_AT) ?? 0);
      if (Date.now() - last < 60_000) return;
      sessionStorage.setItem(RELOADED_AT, String(Date.now()));
    } catch {
      return;
    }
    window.location.reload();
  }, [error]);

  return (
    <main className="grid min-h-dvh place-items-center bg-[#f6f8fc] p-5">
      <section className="rounded-[24px] bg-white p-8 text-center">
        <h1 className="text-xl font-black text-[#23426f]">화면을 불러오지 못했어요</h1>
        <p className="mt-2 text-sm font-bold text-[#65758a]">
          네트워크 또는 서버 상태를 확인한 뒤 다시 시도해주세요.
        </p>
        <button
          type="button"
          onClick={() => (isChunkLoadError(error) ? window.location.reload() : reset())}
          className="mt-5 min-h-11 rounded-[15px] bg-[#284778] px-5 font-black text-white"
        >
          다시 시도
        </button>
      </section>
    </main>
  );
}
