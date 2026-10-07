'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { ActiveSpaceState } from '../../hooks/useActiveSpace';
import type { SpaceView } from '../../lib/api/spaces';
import { DavasLogoLink } from '../core/CoreUi';
import { activeMembers } from './space-ui';

function SpaceFaces({ space, myAccountId }: { space: SpaceView; myAccountId: string }) {
  // The viewer first, in blue, then the others in the order they joined.
  const members = activeMembers(space).sort(
    (left, right) =>
      Number(right.accountId === myAccountId) - Number(left.accountId === myAccountId),
  );
  return (
    <span className="space-faces" aria-hidden="true">
      {members.slice(0, 3).map((member) => (
        <span key={member.accountId} data-me={member.accountId === myAccountId || undefined}>
          {[...(member.nickname?.trim() || '멤')][0]}
        </span>
      ))}
    </span>
  );
}

/**
 * The header's space switcher, as on the C안 boards: who is in the space I am looking at,
 * and a short list of my spaces to change to, with a way to manage them.
 */
export function SpaceSwitcher({
  state,
  onSelect,
}: {
  state: ActiveSpaceState;
  onSelect: (spaceId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  // Until the spaces load, and for someone without one, the header keeps the logo.
  if (state.status !== 'ready' || !state.space) return <DavasLogoLink />;
  const space = state.space;

  return (
    <div className="space-switcher" ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className="space-switcher-button"
        aria-expanded={open}
        aria-controls="space-switcher-panel"
        aria-label={`공간 전환, 지금은 ${space.name}`}
        onClick={() => setOpen((value) => !value)}
      >
        <SpaceFaces space={space} myAccountId={state.myAccountId} />
        <span className="space-switcher-name">
          <strong>{space.name}</strong>
          <span>공간 · {activeMembers(space).length}명</span>
        </span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m7 10 5 5 5-5" />
        </svg>
      </button>
      {open ? (
        <div id="space-switcher-panel" className="space-switcher-panel">
          <ul aria-label="내 공간">
            {state.spaces.map((item) => {
              const current = item.id === space.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    aria-current={current ? 'true' : undefined}
                    onClick={() => {
                      onSelect(item.id);
                      setOpen(false);
                      buttonRef.current?.focus();
                    }}
                  >
                    <SpaceFaces space={item} myAccountId={state.myAccountId} />
                    <span className="space-switcher-item-name">{item.name}</span>
                    <span className="space-switcher-count">{activeMembers(item).length}명</span>
                    {current ? (
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="m5 12 5 5 9-10" />
                      </svg>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
          <Link href="/spaces" className="space-switcher-manage" onClick={() => setOpen(false)}>
            공간 관리 <span aria-hidden="true">›</span>
          </Link>
        </div>
      ) : null}
    </div>
  );
}
