import assert from 'node:assert/strict'; import { readFileSync } from 'node:fs'; import { join } from 'node:path'; import { describe,it } from 'node:test'; import { todayIsoDate } from '../components/diary/diary-compose-utils'; const src=(p:string)=>readFileSync(join(process.cwd(),'src',p),'utf8');
describe('Davas diary compose',()=>{const compose=src('components/diary/DiaryComposeScreen.tsx');it('never fabricates media and blocks submit until a real media detail is ready',()=>{assert.doesNotMatch(compose,/mockDiaryMedia|mock-inception/);assert.match(compose,/Boolean\(selectedMedia\).*mediaStatus === 'ready'/);assert.match(compose,/\/explore\?intent=record/)});it('defaults to PRIVATE and supports FRIENDS and SELECTED',()=>{assert.match(compose,/useState<'PRIVATE' \| 'FRIENDS' \| 'SELECTED'>\('PRIVATE'\)/);const options=src('components/diary/DiaryOptionRow.tsx');assert.match(options,/나만 보기/);assert.match(options,/친구 공개/);assert.match(options,/선택한 친구/)});it('uses Korean local date and keyboard-operable rating without duplicate range controls',()=>{assert.match(src('components/diary/diary-compose-utils.ts'),/Asia\/Seoul/);const rating=src('components/diary/RatingInputCard.tsx');assert.match(rating,/onKeyDown/);assert.doesNotMatch(rating,/type="range"/)});it('stores optional companion, place, mood, and memory data',()=>{assert.match(compose,/TogetherMomentSection/);assert.match(compose,/selectedUserIds/);const together=src('components/diary/TogetherMomentSection.tsx');assert.match(together,/userId/);assert.match(together,/추억 메모/)})});

describe('Korean watched-date default', () => {
  it('uses the new Korean date just after midnight', () => {
    assert.equal(todayIsoDate(new Date('2026-07-11T15:05:00.000Z')), '2026-07-12');
  });

  it('keeps the Korean date through the early-morning 9am boundary', () => {
    assert.equal(todayIsoDate(new Date('2026-07-11T23:59:59.000Z')), '2026-07-12');
    assert.equal(todayIsoDate(new Date('2026-07-12T00:00:00.000Z')), '2026-07-12');
  });
});
