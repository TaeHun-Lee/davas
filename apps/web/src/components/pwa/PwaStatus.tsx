'use client';

import { useEffect, useState } from 'react';

type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<unknown>;
};

const UPDATE_NOTICE_SESSION_KEY = 'davas:pwa-update-notice-shown';

export function resolvePwaUpdateAction(
  isStandalone: boolean,
  noticeWasShown: boolean,
): 'activate' | 'prompt' | 'defer' {
  if (!isStandalone) return 'activate';
  return noticeWasShown ? 'defer' : 'prompt';
}

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

    const standaloneNavigator = navigator as Navigator & { standalone?: boolean };
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || standaloneNavigator.standalone === true;
    let disposed = false;
    let observedRegistration: ServiceWorkerRegistration | null = null;
    let observedWorker: ServiceWorker | null = null;

    const updateNoticeWasShown = () => {
      try {
        return sessionStorage.getItem(UPDATE_NOTICE_SESSION_KEY) === '1';
      } catch {
        return false;
      }
    };
    const markUpdateNoticeShown = () => {
      try {
        sessionStorage.setItem(UPDATE_NOTICE_SESSION_KEY, '1');
      } catch {
        // Storage can be unavailable in privacy-restricted contexts.
      }
    };
    const handleUpdateAvailable = (
      nextRegistration: ServiceWorkerRegistration,
      worker: ServiceWorker | null,
    ) => {
      if (disposed || !worker) return;

      const action = resolvePwaUpdateAction(isStandalone, updateNoticeWasShown());
      if (action === 'activate') {
        worker.postMessage({ type: 'SKIP_WAITING' });
        return;
      }
      if (action === 'defer') return;

      setRegistration(nextRegistration);
      markUpdateNoticeShown();
      setUpdate(true);
    };
    const onWorkerStateChange = () => {
      if (
        observedWorker?.state === 'installed'
        && navigator.serviceWorker.controller
        && observedRegistration
      ) {
        handleUpdateAvailable(observedRegistration, observedWorker);
      }
    };
    const onUpdateFound = () => {
      observedWorker?.removeEventListener('statechange', onWorkerStateChange);
      observedWorker = observedRegistration?.installing ?? null;
      observedWorker?.addEventListener('statechange', onWorkerStateChange);
    };

    if ('serviceWorker' in navigator) {
      void navigator.serviceWorker.register('/sw.js').then((nextRegistration) => {
        if (disposed) return;
        observedRegistration = nextRegistration;
        if (nextRegistration.waiting) {
          handleUpdateAvailable(nextRegistration, nextRegistration.waiting);
        }
        nextRegistration.addEventListener('updatefound', onUpdateFound);
      }).catch(() => undefined);
    }

    return () => {
      disposed = true;
      observedRegistration?.removeEventListener('updatefound', onUpdateFound);
      observedWorker?.removeEventListener('statechange', onWorkerStateChange);
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      window.removeEventListener('beforeinstallprompt', onInstall);
    };
  }, []);

  const activateUpdate = () => {
    const waiting = registration?.waiting;
    if (!waiting) {
      setUpdate(false);
      return;
    }
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      try {
        sessionStorage.removeItem(UPDATE_NOTICE_SESSION_KEY);
      } catch {
        // Storage can be unavailable in privacy-restricted contexts.
      }
      location.reload();
    }, { once: true });
    waiting.postMessage({ type: 'SKIP_WAITING' });
  };

  if (!online) {
    return (
      <aside
        className="fixed inset-x-3 top-3 z-[120] mx-auto max-w-[400px] rounded-[18px] bg-[#fff1f0] p-4 text-center shadow-xl"
        role="status"
      >
        <p className="text-[13px] font-black text-[#9f342f]">
          오프라인입니다. 작성 중인 내용은 화면에 유지되지만 저장되지 않았어요.
        </p>
        <button
          type="button"
          onClick={() => location.reload()}
          className="mt-3 min-h-11 rounded-[14px] bg-[#9f342f] px-4 text-[12px] font-black text-white"
        >
          연결 후 다시 시도
        </button>
      </aside>
    );
  }
  if (update) {
    return (
      <aside
        className="fixed inset-x-3 top-3 z-[120] mx-auto max-w-[400px] rounded-[18px] bg-white p-3 shadow-xl"
        role="status"
      >
        <p className="text-[13px] font-black text-[#284778]">업데이트가 준비됐어요.</p>
        <p className="mt-1 text-[11px] font-semibold leading-4 text-[#64748b]">
          지금 적용하거나 나중에 앱을 다시 열 때 적용할 수 있어요.
        </p>
        <div className="mt-3 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setUpdate(false)}
            className="min-h-10 rounded-[12px] px-3 text-[12px] font-black text-[#64748b]"
          >
            나중에
          </button>
          <button
            type="button"
            onClick={activateUpdate}
            className="min-h-10 rounded-[12px] bg-[#284778] px-4 text-[12px] font-black text-white"
          >
            지금 업데이트
          </button>
        </div>
      </aside>
    );
  }
  if (install) {
    return (
      <button
        type="button"
        onClick={async () => {
          await install.prompt();
          await install.userChoice;
          setInstall(null);
        }}
        className="fixed bottom-28 right-4 z-[65] min-h-11 rounded-full bg-[#284778] px-4 text-[12px] font-black text-white shadow-xl"
      >
        Davas 설치
      </button>
    );
  }
  return null;
}
