export const WATCH_RATINGS = Array.from(
  { length: 10 },
  (_, index) => (index + 1) / 2,
);

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
  const choices: Array<number | null> = allowEmpty
    ? [null, ...WATCH_RATINGS]
    : WATCH_RATINGS;

  return (
    <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="별점">
      {choices.map((rating) => (
        <label
          key={rating ?? 'none'}
          className="flex min-h-11 cursor-pointer items-center justify-center rounded-xl bg-white text-sm font-bold shadow-sm has-[:checked]:bg-[var(--blue-soft)] has-[:checked]:text-[var(--blue)]"
        >
          <input
            className="sr-only"
            type="radio"
            name={name}
            value={rating ?? ''}
            checked={value === rating}
            onChange={() => onChange(rating)}
          />
          {rating === null ? '안 남김' : `${rating.toFixed(1)}점`}
        </label>
      ))}
    </div>
  );
}
