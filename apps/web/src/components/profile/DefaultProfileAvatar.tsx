type DefaultProfileAvatarProps = {
  initial: string;
  className?: string;
};

export function DefaultProfileAvatar({ initial, className = '' }: DefaultProfileAvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={`grid h-full w-full place-items-center bg-[linear-gradient(145deg,#dbe7f8,#f7f0e6)] font-black text-[#2e5c9f] ${className}`}
    >
      {initial.slice(0, 1).toUpperCase()}
    </span>
  );
}
