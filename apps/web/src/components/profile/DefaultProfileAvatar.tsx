type DefaultProfileAvatarProps = {
  className?: string;
};

export function DefaultProfileAvatar({ className = 'h-full w-full' }: DefaultProfileAvatarProps) {
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="default-profile-avatar-bg" x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#fbe2d6" />
          <stop offset="1" stopColor="#f6aaa8" />
        </linearGradient>
      </defs>
      <rect width="80" height="80" fill="url(#default-profile-avatar-bg)" />
      <circle cx="40" cy="37" r="16" fill="#f3c0a4" />
      <path d="M18 78c4.3-17.5 16.5-24.4 22-24.4s18.2 6.9 22.6 24.4" fill="#2E6DD8" />
      <path d="M21 41c1-17.8 12.6-29.2 27-26.4 10.8 2.1 18.4 14.2 12.4 33.1-5.4-11.4-8.2-18-21.8-19.2-7.8.9-12.2 5.1-17.6 12.5Z" fill="#27334A" />
      <path d="M31.5 43.8c4.3 5 13.2 5.1 17.2 0" stroke="#9D5A52" strokeWidth="2" strokeLinecap="round" />
      <circle cx="34.4" cy="35.8" r="2" fill="#26334A" />
      <circle cx="47.2" cy="35.8" r="2" fill="#26334A" />
    </svg>
  );
}
