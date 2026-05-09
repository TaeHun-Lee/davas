import type { CommunityTopic } from './community-types';

type PopularTopicsSectionProps = {
  topics: CommunityTopic[];
  onTopicSelect: (topic: CommunityTopic) => void;
};

export function PopularTopicsSection({ topics, onTopicSelect }: PopularTopicsSectionProps) {
  if (topics.length === 0) return null;

  return (
    <section className="mb-6" aria-labelledby="popular-topics-title">
      <div className="mb-3 flex items-center justify-between">
        <h2 id="popular-topics-title" className="text-[16px] font-extrabold leading-[22px] tracking-[-0.02em] text-[#1f2a44]">
          지금 인기 있는 토픽
        </h2>
      </div>
      <div className="-mx-4 overflow-x-auto px-4 min-[390px]:-mx-5 min-[390px]:px-5">
        <div className="flex w-max gap-2 pb-1">
          {topics.map((topic) => (
            <button
              key={topic.label}
              type="button"
              onClick={() => onTopicSelect(topic)}
              aria-label={`${topic.label} 토픽으로 검색`}
              className="rounded-full border border-[#e2e8f2] bg-white px-4 py-2 text-[12px] font-extrabold text-[#4c5b73] shadow-[0_6px_16px_rgba(31,65,114,0.05)]"
            >
              {topic.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
