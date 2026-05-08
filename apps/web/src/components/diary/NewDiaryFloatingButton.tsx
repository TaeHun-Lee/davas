import Link from 'next/link';

export function NewDiaryFloatingButton() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[92px] z-40 mx-auto w-full max-w-[430px] px-5">
      <Link
        href="/diary/new"
        aria-label="새 다이어리 작성"
        className="pointer-events-auto ml-auto flex h-12 w-fit items-center gap-2 rounded-full bg-[#216bd8] px-5 text-[14px] font-extrabold text-white shadow-[0_16px_30px_rgba(33,107,216,0.28)]"
      >
        <span aria-hidden="true" className="text-[18px]">＋</span>
        새 다이어리
      </Link>
    </div>
  );
}
