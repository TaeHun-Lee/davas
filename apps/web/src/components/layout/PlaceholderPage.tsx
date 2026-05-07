import { AppShell } from './AppShell';

type PlaceholderPageProps = {
  title: string;
  description: string;
};

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <AppShell>
      <section className="mt-6 rounded-[24px] bg-white p-8 text-center shadow-[0_12px_28px_rgba(31,65,114,0.08)]">
        <p className="text-sm font-extrabold tracking-[0.3em] text-[#ff5a5a]">DAVAS</p>
        <h1 className="mt-4 text-2xl font-extrabold text-[#1f2a44]">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-[#7a8499]">{description}</p>
        <p className="mt-8 rounded-2xl bg-[#eef4ff] px-5 py-4 text-sm font-bold text-[#216bd8]">임시 페이지</p>
      </section>
    </AppShell>
  );
}
