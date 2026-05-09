type SettingItem = {
  label: string;
  icon: 'user' | 'bell' | 'shield' | 'help' | 'info';
  suffix?: string;
};

const settings: SettingItem[] = [
  { label: '계정 관리', icon: 'user' },
  { label: '알림 설정', icon: 'bell' },
  { label: '개인정보 및 보안', icon: 'shield' },
  { label: '고객센터', icon: 'help' },
  { label: '앱 정보', icon: 'info', suffix: '버전 1.2.0' },
];

function SettingIcon({ icon }: { icon: SettingItem['icon'] }) {
  const common = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': true };
  switch (icon) {
    case 'user':
      return <svg {...common}><circle cx="12" cy="8" r="3.4" stroke="#7f90aa" strokeWidth="1.8" /><path d="M5.5 20c.9-4.2 3.3-6.3 6.5-6.3s5.6 2.1 6.5 6.3" stroke="#7f90aa" strokeWidth="1.8" strokeLinecap="round" /></svg>;
    case 'bell':
      return <svg {...common}><path d="M6.5 10.5A5.5 5.5 0 0 1 12 5a5.5 5.5 0 0 1 5.5 5.5v3.8l1.5 2.3H5l1.5-2.3v-3.8Z" stroke="#7f90aa" strokeWidth="1.8" strokeLinejoin="round" /><path d="M9.8 19a2.3 2.3 0 0 0 4.4 0" stroke="#7f90aa" strokeWidth="1.8" strokeLinecap="round" /></svg>;
    case 'shield':
      return <svg {...common}><path d="M12 3.8 18.5 6v5.2c0 4.2-2.5 7.1-6.5 9-4-1.9-6.5-4.8-6.5-9V6L12 3.8Z" stroke="#7f90aa" strokeWidth="1.8" strokeLinejoin="round" /><path d="m9.3 12 1.8 1.8 3.8-4" stroke="#7f90aa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
    case 'help':
      return <svg {...common}><circle cx="12" cy="12" r="8.3" stroke="#7f90aa" strokeWidth="1.8" /><path d="M9.6 9.5a2.5 2.5 0 0 1 4.8.9c0 1.9-2.4 2-2.4 3.5" stroke="#7f90aa" strokeWidth="1.8" strokeLinecap="round" /><path d="M12 17h.01" stroke="#7f90aa" strokeWidth="2.5" strokeLinecap="round" /></svg>;
    case 'info':
      return <svg {...common}><circle cx="12" cy="12" r="8.3" stroke="#7f90aa" strokeWidth="1.8" /><path d="M12 10.5V16" stroke="#7f90aa" strokeWidth="1.8" strokeLinecap="round" /><path d="M12 7.8h.01" stroke="#7f90aa" strokeWidth="2.5" strokeLinecap="round" /></svg>;
  }
}

function ChevronIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m9 5 7 7-7 7" stroke="#a2adbd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ProfileSettingsSection() {
  return (
    <section className="mt-5" data-design="profile-settings-section">
      <h2 className="mb-3 text-[17px] font-black tracking-[-0.03em] text-[#284778]">설정</h2>
      <div className="card-surface overflow-hidden rounded-[20px] bg-white shadow-[0_12px_28px_rgba(31,65,114,0.08)]">
        {settings.map((item, index) => (
          <button
            type="button"
            key={item.label}
            className={`flex h-[48px] w-full items-center gap-3 px-4 text-left ${index > 0 ? 'border-t border-[#edf1f6]' : ''}`}
          >
            <SettingIcon icon={item.icon} />
            <span className="flex-1 text-[13px] font-bold text-[#6f7c91]">{item.label}</span>
            {item.suffix ? <span className="text-[12px] font-bold text-[#8a96a9]">{item.suffix}</span> : <ChevronIcon />}
          </button>
        ))}
      </div>
    </section>
  );
}
