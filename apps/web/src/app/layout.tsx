import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Davas',
  description: 'Movie and drama review diary',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
