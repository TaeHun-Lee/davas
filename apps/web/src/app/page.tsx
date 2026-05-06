import { DAVAS_APP_NAME } from '@davas/shared';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-10">
      <section className="rounded-[2rem] bg-davas-background p-8 shadow-neu">
        <p className="text-sm font-semibold tracking-[0.35em] text-davas-accent">CINEMATIC DIARY</p>
        <h1 className="mt-4 text-5xl font-bold text-davas-text">{DAVAS_APP_NAME}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-davas-muted">
          영화와 드라마를 검색하고, 감상 리뷰와 다이어리를 기록하는 뉴모피즘 스타일의 모던한 공간입니다.
        </p>
        <div className="mt-8 rounded-3xl bg-davas-background px-5 py-4 shadow-neu-inset text-davas-muted">
          검색 → 작품 선택 → 상세 모달 → 리뷰 작성 흐름을 먼저 구현합니다.
        </div>
      </section>
    </main>
  );
}
