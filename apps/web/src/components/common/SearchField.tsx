import type { ReactNode } from 'react';
import Link from 'next/link';

type SearchIconProps = {
  className?: string;
};

function SearchIcon({ className }: SearchIconProps) {
  return (
    <svg className={className} width="19" height="19" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="8.8" cy="8.8" r="5.7" stroke="currentColor" strokeWidth="2" />
      <path d="m13.3 13.3 3.6 3.6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  ariaLabel?: string;
  className?: string;
  inputClassName?: string;
  leadingIcon?: ReactNode;
  trailing?: ReactNode;
  trailingDivider?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
};

const rootClassName = 'flex h-[52px] items-center rounded-[22px] bg-white px-4 text-[#216bd8] shadow-[0_12px_30px_rgba(31,42,68,0.07)]';
const inputClassName = 'min-w-0 flex-1 bg-transparent px-3 text-[13px] font-semibold leading-[18px] text-[#1f2a44] outline-none placeholder:text-[#9aa6b8] disabled:cursor-not-allowed disabled:opacity-60';

export function SearchField({
  value,
  onChange,
  placeholder,
  ariaLabel,
  className = '',
  inputClassName: customInputClassName = '',
  leadingIcon,
  trailing,
  trailingDivider = false,
  autoFocus = false,
  disabled = false,
}: SearchFieldProps) {
  return (
    <label className={`${rootClassName} ${className}`.trim()}>
      <span className="shrink-0 text-[#216bd8]" aria-hidden="true">
        {leadingIcon ?? <SearchIcon />}
      </span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
        autoFocus={autoFocus}
        disabled={disabled}
        className={`${inputClassName} ${customInputClassName}`.trim()}
      />
      {trailing ? (
        <>
          {trailingDivider ? <span className="mr-3 h-6 w-px bg-[#e5ebf4]" aria-hidden="true" /> : null}
          <span className="shrink-0 text-[#8e9aaf]">{trailing}</span>
        </>
      ) : null}
    </label>
  );
}

export type SearchEntryProps = {
  href: string;
  placeholder: string;
  ariaLabel?: string;
  className?: string;
};

export function SearchEntry({ href, placeholder, ariaLabel, className = '' }: SearchEntryProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel ?? placeholder}
      className={`${rootClassName} text-[13px] font-semibold leading-[18px] text-[#9aa6b8] ${className}`.trim()}
    >
      <span className="shrink-0 text-[#216bd8]" aria-hidden="true">
        <SearchIcon />
      </span>
      <span className="min-w-0 flex-1 px-3">{placeholder}</span>
    </Link>
  );
}
