export const WATCH_RATINGS = Array.from(
  { length: 10 },
  (_, index) => (index + 1) / 2,
);

function RatingStar({ fillPercent }: { fillPercent: number }) {
  return (
    <span className="watch-rating-star" aria-hidden="true">
      <span>★</span>
      <span
        className="watch-rating-star-fill"
        style={{ width: `${fillPercent}%` }}
      >
        ★
      </span>
    </span>
  );
}

export function WatchRatingControl({
  value,
  onChange,
  allowEmpty = true,
  name = 'watch-rating',
}: {
  value: number | null;
  onChange: (value: number | null) => void;
  allowEmpty?: boolean;
  name?: string;
}) {
  const sliderValue = value ?? (allowEmpty ? 0 : 0.5);

  const updateValue = (nextValue: number) => {
    onChange(allowEmpty && nextValue === 0 ? null : nextValue);
  };

  return (
    <div className="watch-rating-control">
      <div className="watch-rating-summary">
        <div className="watch-rating-stars" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, index) => (
            <RatingStar
              key={index}
              fillPercent={Math.min(
                100,
                Math.max(0, (sliderValue - index) * 100),
              )}
            />
          ))}
        </div>
        <output className="watch-rating-value" htmlFor={name}>
          {value === null ? '미선택' : `${value.toFixed(1)}점`}
        </output>
      </div>
      <input
        className="watch-rating-range"
        type="range"
        id={name}
        name={name}
        min={allowEmpty ? 0 : 0.5}
        max={5}
        step={0.5}
        value={sliderValue}
        aria-label="별점 슬라이더"
        aria-valuetext={
          value === null ? '별점 안 남김' : `5점 만점에 ${value.toFixed(1)}점`
        }
        onChange={(event) => updateValue(Number(event.target.value))}
      />
      <div className="watch-rating-help">
        <span>좌우로 밀어 0.5점 단위로 선택</span>
        {allowEmpty && value !== null ? (
          <button type="button" onClick={() => onChange(null)}>
            별점 지우기
          </button>
        ) : null}
      </div>
    </div>
  );
}
