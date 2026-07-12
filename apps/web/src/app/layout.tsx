import type { Metadata } from 'next';
import './globals.css';
import { PwaStatus } from '../components/pwa/PwaStatus';

export const metadata: Metadata = {
  title: 'Davas',
  description: '친한 사람들과 영화·드라마 기록과 리뷰를 나누는 공간',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}<PwaStatus /></body>
    </html>
  );
}
