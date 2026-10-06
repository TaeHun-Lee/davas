'use client';

import { useState } from 'react';
import { OTT_SERVICES } from '@davas/shared';
import { updateMe } from '../../lib/api/users';

/**
 * Which OTT services this person pays for. It decides what "볼 수 있어요" means on the shared
 * list and which services group recommendations start from.
 */
export function OttSubscriptions({
  initial,
  onSaved,
}: {
  initial: string[];
  onSaved?: (services: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>(initial);
  const [saved, setSaved] = useState<string[]>(initial);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: 'ok' | 'error'; text: string } | null>(null);
  const changed = selected.length !== saved.length || selected.some((key) => !saved.includes(key));

  async function save() {
    setBusy(true);
    setMessage(null);
    try {
      const user = await updateMe({ ottServices: selected });
      setSaved(user.ottServices ?? selected);
      setSelected(user.ottServices ?? selected);
      onSaved?.(user.ottServices ?? selected);
      setMessage({ tone: 'ok', text: '구독 중인 OTT를 저장했어요.' });
    } catch {
      setMessage({ tone: 'error', text: '구독 정보를 저장하지 못했어요. 다시 시도해 주세요.' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="core-card mt-5 p-5" aria-labelledby="ott-subscriptions-title">
      <h2 id="ott-subscriptions-title" className="section-title">
        구독 중인 OTT
      </h2>
      <p className="page-description">
        고른 서비스로 &lsquo;같이 보고 싶어요&rsquo; 목록에서 지금 볼 수 있는 작품을 알려 드리고,
        함께 고르기의 기본 시청 경로로 써요. 공간 사람들에게는 서비스 이름이 아니라 볼 수 있는지만
        보여요.
      </p>
      <div className="composer-chips mt-3" role="group" aria-label="구독 중인 OTT 서비스">
        <div>
          {OTT_SERVICES.map((service) => {
            const on = selected.includes(service.key);
            return (
              <button
                key={service.key}
                type="button"
                aria-pressed={on}
                onClick={() =>
                  setSelected((current) =>
                    on ? current.filter((key) => key !== service.key) : [...current, service.key],
                  )
                }
              >
                {service.label}
              </button>
            );
          })}
        </div>
      </div>
      <button className="commit-button mt-4" disabled={busy || !changed} onClick={save}>
        {busy ? '저장 중…' : '구독 정보 저장'}
      </button>
      {message ? (
        <p
          role={message.tone === 'error' ? 'alert' : 'status'}
          className={message.tone === 'error' ? 'form-error mt-3' : 'page-description mt-3'}
        >
          {message.text}
        </p>
      ) : null}
    </section>
  );
}
