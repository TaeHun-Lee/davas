import type { PersonSearchResult } from '../../lib/api/media';
import type { PeopleSearchStatus } from '../../hooks/usePeopleSearch';

function PersonProfileImage({ person }: { person: PersonSearchResult }) {
  if (person.profileUrl) {
    return <img src={person.profileUrl} alt={`${person.name} 프로필`} className="h-[58px] w-[58px] shrink-0 rounded-[18px] object-cover shadow-[0_8px_18px_rgba(21,38,69,0.12)]" />;
  }

  return (
    <div className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-[18px] bg-gradient-to-br from-[#eaf2ff] to-[#ffdede] text-[20px] font-black text-[#216bd8] shadow-[0_8px_18px_rgba(21,38,69,0.1)]">
      {person.name.slice(0, 1)}
    </div>
  );
}

function KnownForText({ person }: { person: PersonSearchResult }) {
  const knownFor = person.knownFor.map((work) => work.title).filter(Boolean).slice(0, 3);

  if (knownFor.length === 0) {
    return <span className="mt-1.5 block text-[11px] font-semibold leading-[16px] text-[#97a2b3]">대표 출연작 정보가 아직 없어요.</span>;
  }

  return <span className="mt-1.5 block line-clamp-1 text-[11px] font-semibold leading-[16px] text-[#788395]">knownFor · {knownFor.join(', ')}</span>;
}

export function PersonSearchResults({
  items,
  status,
  query,
  selectedPersonId,
  onSelect,
}: {
  items: PersonSearchResult[];
  status: PeopleSearchStatus;
  query: string;
  selectedPersonId?: string | null;
  onSelect: (person: PersonSearchResult) => void;
}) {
  if (query.trim().length < 2) {
    return null;
  }

  return (
    <section className="mt-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[16px] font-extrabold leading-[22px] tracking-[-0.02em] text-[#1f2a44]">인물 검색 결과</h2>
        <span className="text-[11px] font-bold text-[#9aa6b8]">이름으로 작품 찾기</span>
      </div>
      {status === 'searching' ? <div className="card-surface mt-3 rounded-[18px] p-4 text-[13px] font-bold text-[#8b96a8]">인물을 검색 중이에요...</div> : null}
      {status === 'empty' ? <div className="card-surface mt-3 rounded-[18px] p-4 text-[13px] font-bold text-[#8b96a8]">일치하는 인물이 없어요</div> : null}
      {status === 'error' ? <div className="card-surface mt-3 rounded-[18px] p-4 text-[13px] font-bold text-[#ef4444]">인물 검색을 불러오지 못했어요.</div> : null}
      {status === 'results' ? (
        <div className="mt-3 space-y-3">
          {items.map((person) => {
            const isSelected = selectedPersonId === person.id;
            return (
              <button
                key={person.id}
                type="button"
                aria-label={`${person.name} 작품 보기`}
                onClick={() => onSelect(person)}
                className={`card-surface flex w-full items-center gap-3 rounded-[18px] p-3 text-left transition active:scale-[0.99] ${
                  isSelected ? 'ring-2 ring-[#2f7eea]' : ''
                }`}
              >
                <PersonProfileImage person={person} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-extrabold leading-[20px] text-[#1f2a44]">{person.name}</span>
                  <span className="mt-1 block text-[11px] font-bold text-[#8b96a8]">{person.knownForDepartment ?? 'Acting'}</span>
                  <KnownForText person={person} />
                </span>
                <span className="shrink-0 rounded-full bg-[#edf5ff] px-3 py-2 text-[11px] font-extrabold text-[#216bd8]">작품 보기</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
