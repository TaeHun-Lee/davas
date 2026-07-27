import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as React from 'react';
import { createElement, type ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it } from 'node:test';
import type { RecordCardData } from '@davas/shared';
import { RecordCard } from './CoreRecordCard';

(globalThis as typeof globalThis & { React: typeof React }).React = React;

const item: RecordCardData = {
  id: 'record-1',
  author: {
    id: 'user-1',
    nickname: '작성자-표시-검증',
    profileImageUrl: null,
  },
  media: {
    id: 'media-1',
    title: '내 영화',
    originalTitle: 'My Movie',
    posterUrl: null,
    releaseYear: '2026',
    mediaType: 'MOVIE',
  },
  viewingMethod: 'OTT',
  watchedDate: '2026-07-27',
  rating: 4,
  reviewPreview: '좋았어요.',
  hasSpoiler: false,
  visibility: 'PRIVATE',
  sharedAt: null,
  createdAt: '2026-07-27T00:00:00.000Z',
  isMine: true,
};

function renderCard(variant: 'feed' | 'mine') {
  return renderToStaticMarkup(
    createElement(RecordCard as ComponentType<Record<string, unknown>>, {
      item,
      variant,
      returnTo: variant === 'mine' ? '/me' : '/',
    }),
  );
}

describe('feed and mine record variants', () => {
  it('renders Mine as a whole-card detail link without author or friend-only actions', () => {
    const html = renderCard('mine');

    assert.match(html, /^<a /);
    assert.match(html, /href="\/records\/record-1\?returnTo=%2Fme"/);
    assert.doesNotMatch(html, /작성자-표시-검증/);
    assert.doesNotMatch(html, /나도 기록하기|자세히 보기/);
    assert.match(html, /나만 보기/);
  });

  it('keeps Feed author and explicit friend-record actions', () => {
    const html = renderCard('feed');

    assert.match(html, /^<article /);
    assert.match(html, /작성자-표시-검증/);
    assert.match(html, /자세히 보기/);
    assert.match(html, /나도 기록하기/);
  });

  it('passes the list scope into cards and hides record-again on my detail', () => {
    const list = readFileSync(
      join(process.cwd(), 'src/components/core/RecordListScreens.tsx'),
      'utf8',
    );
    const detail = readFileSync(
      join(process.cwd(), 'src/components/core/RecordDetailScreen.tsx'),
      'utf8',
    );

    assert.match(list, /variant=\{scope === 'mine' \? 'mine' : 'feed'\}/);
    assert.match(detail, /!record\.isMine/);
  });
});
