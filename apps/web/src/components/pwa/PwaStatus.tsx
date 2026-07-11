'use client';

import { useEffect, useState } from 'react';

type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<unknown>;
};

export function PwaStatus() {
  const [online, setOnline] = useState(true);
  const [install, setInstall] = useState<InstallEvent | null>(null);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    setOnline(navigator.onLine);
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    const onInstall = (event: Event) => {
      event.preventDefault();
      setInstall(event as InstallEvent);
    };
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    window.addEventListener('beforeinstallprompt', onInstall);

    let disposed = false;
    if ('serviceWorker' in navigator) {
      void navigator.serviceWorker.register('/sw.js').then((nextRegistration) => {
        if (disposed) return;
        setRegistration(nextRegistration);
        if (nextRegistration.waiting) setUpdate(true);
        nextRegistration.addEventListener('updatefound', () => {
          const worker = nextRegistration.installing;
          worker?.addEventListener('statechange', () => {
            if (worker.state === 'installed' && navigator.serviceWorker.controller) setUpdate(true);
          });
        });
      });
    }

    return () => {
      disposed = true;
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      window.removeEventListener('beforeinstallprompt', onInstall);
    };
  }, []);

  const activateUpdate = () => {
    const waiting = registration?.waiting;
    if (!waiting) {
      location.reload();
      return;
    }
    navigator.serviceWorker.addEventListener('controllerchange', () => location.reload(), { once: true });
    waiting.postMessage({ type: 'SKIP_WAITING' });
  };

  if (!online) {
    return <aside className="fixed inset-x-3 top-3 z-[120] mx-auto max-w-[400px] rounded-[18px] bg-[#fff1f0] p-4 text-center shadow-xl" role="status"><p className="text-[13px] font-black text-[#9f342f]">오프라인입니다. 작성 중인 내용은 화면에 유지되지만 저장되지 않았어요.</p><button type="button" onClick={() => location.reload()} className="mt-3 min-h-11 rounded-[14px] bg-[#9f342f] px-4 text-[12px] font-black text-white">연결 후 다시 시도</button></aside>;
  }
  if (update) {
    return <aside className="fixed inset-x-3 top-3 z-[120] mx-auto flex max-w-[400px] items-center gap-3 rounded-[18px] bg-white p-3 shadow-xl" role="status"><p className="flex-1 text-[12px] font-black text-[#284778]">새 버전이 준비됐어요.</p><button type="button" onClick={activateUpdate} className="min-h-11 rounded-[14px] bg-[#284778] px-4 text-[12px] font-black text-white">안전하게 업데이트</button></aside>;
  }
  if (install) {
    return <button type="button" onClick={async () => { await install.prompt(); await install.userChoice; setInstall(null); }} className="fixed bottom-28 right-4 z-[65] min-h-11 rounded-full bg-[#284778] px-4 text-[12px] font-black text-white shadow-xl">Davas 설치</button>;
  }
  return null;
}
