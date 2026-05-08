import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

function source(path: string) {
  return readFileSync(new URL(path, import.meta.url), 'utf8');
}

const diaryNewPageSource = source('./diary/new/page.tsx');
const composeScreenSource = source('../components/diary/DiaryComposeScreen.tsx');
const headerSource = source('../components/diary/DiaryComposeHeader.tsx');
const selectedMediaCardSource = source('../components/diary/SelectedMediaCard.tsx');
const ratingInputSource = source('../components/diary/RatingInputCard.tsx');
const watchedDateSource = source('../components/diary/WatchedDateField.tsx');
const titleFieldSource = source('../components/diary/DiaryTitleField.tsx');
const contentFieldSource = source('../components/diary/DiaryContentField.tsx');
const optionRowSource = source('../components/diary/DiaryOptionRow.tsx');
const photoAttachmentSource = source('../components/diary/DiaryPhotoAttachmentSection.tsx');
const submitBarSource = source('../components/diary/DiarySubmitBar.tsx');
const utilsSource = source('../components/diary/diary-compose-utils.ts');
const mediaApiSource = source('../lib/api/media.ts');
const diariesApiSource = source('../lib/api/diaries.ts');
const mediaDetailModalSource = source('../components/media/MediaDetailModal.tsx');

describe('Davas diary compose screen design', () => {
  it('routes /diary/new to the diary compose screen shell', () => {
    assert.match(diaryNewPageSource, /DiaryComposeScreen/);
    assert.match(diaryNewPageSource, /searchParams/);
    assert.match(diaryNewPageSource, /mediaId=\{mediaId\}/);
    assert.match(composeScreenSource, /export function DiaryComposeScreen/);
    assert.match(composeScreenSource, /DiaryComposeHeader/);
    assert.match(composeScreenSource, /SelectedMediaCard/);
    assert.match(composeScreenSource, /RatingInputCard/);
    assert.match(composeScreenSource, /WatchedDateField/);
    assert.match(composeScreenSource, /DiaryTitleField/);
    assert.match(composeScreenSource, /DiaryContentField/);
    assert.match(composeScreenSource, /DiaryOptionRow/);
    assert.match(composeScreenSource, /DiaryPhotoAttachmentSection/);
    assert.match(composeScreenSource, /DiarySubmitBar/);
  });

  it('loads selected media from mediaId query while keeping mock fallback for standalone preview', () => {
    assert.match(mediaApiSource, /export async function getMediaDetail/);
    assert.match(composeScreenSource, /mediaId\?: string/);
    assert.match(composeScreenSource, /getMediaDetail\(mediaId\)/);
    assert.match(composeScreenSource, /useEffect/);
    assert.match(composeScreenSource, /setSelectedMedia\(mapMediaDetailToDiaryMedia\(detail\)\)/);
    assert.match(composeScreenSource, /const \[selectedMedia, setSelectedMedia\] = useState<DiaryComposeMedia>\(mockDiaryMedia\)/);
    assert.match(composeScreenSource, /작품 정보를 불러오고 있어요/);
    assert.match(composeScreenSource, /작품 정보를 불러오지 못했어요/);
    assert.match(utilsSource, /export function mapMediaDetailToDiaryMedia/);
    assert.match(utilsSource, /MediaDetail/);
    assert.match(utilsSource, /genres\.slice\(0, 2\)\.join\(' · '\)/);
    assert.match(utilsSource, /releaseDate\?\.slice\(0, 4\)/);
  });

  it('matches the supplied diary compose header and selected media card', () => {
    assert.match(headerSource, /리뷰 다이어리 작성/);
    assert.match(headerSource, /임시저장/);
    assert.match(headerSource, /aria-label="뒤로 가기"/);
    assert.match(selectedMediaCardSource, /선택한 작품/);
    assert.match(selectedMediaCardSource, /인셉션/);
    assert.match(selectedMediaCardSource, /Inception/);
    assert.match(selectedMediaCardSource, /SF · 스릴러 · 2010/);
    assert.match(selectedMediaCardSource, /posterUrl/);
  });

  it('supports 0.1-step rating with pointer drag and default zero rating', () => {
    assert.match(composeScreenSource, /useState\(0\)/);
    assert.match(ratingInputSource, /나의 별점/);
    assert.match(ratingInputSource, /step=\{0\.1\}/);
    assert.match(ratingInputSource, /onPointerDown/);
    assert.match(ratingInputSource, /onPointerMove/);
    assert.match(ratingInputSource, /setPointerCapture/);
    assert.match(utilsSource, /export function clampRating/);
    assert.match(utilsSource, /export function ratingFromPointer/);
    assert.match(utilsSource, /Math\.round\([^)]*10\) \/ 10/);
    assert.match(ratingInputSource, /clampedValue\.toFixed\(1\)/);
  });

  it('renders date, title, content, options, photo attachment, and submit CTA', () => {
    assert.match(watchedDateSource, /관람 날짜/);
    assert.match(watchedDateSource, /type="date"/);
    assert.match(watchedDateSource, /CalendarIcon/);
    assert.match(titleFieldSource, /다이어리 제목/);
    assert.match(titleFieldSource, /placeholder=\{fallbackTitle\}/);
    assert.match(contentFieldSource, /감상 기록/);
    assert.match(contentFieldSource, /maxLength=\{3000\}/);
    assert.match(contentFieldSource, /3000/);
    assert.match(optionRowSource, /스포일러 포함/);
    assert.match(optionRowSource, /공개/);
    assert.match(optionRowSource, /태그 추가/);
    assert.match(photoAttachmentSource, /사진 첨부/);
    assert.match(photoAttachmentSource, /감상 순간을 사진으로 함께 남겨보세요/);
    assert.match(photoAttachmentSource, /JPG, PNG/);
    assert.match(submitBarSource, /작성 완료/);
  });

  it('wraps diary option controls to keep spoiler switch within its pill on mobile', () => {
    assert.match(optionRowSource, /grid-cols-2/);
    assert.match(optionRowSource, /col-span-2/);
    assert.match(optionRowSource, /min-w-0/);
    assert.match(optionRowSource, /whitespace-nowrap/);
    assert.match(optionRowSource, /shrink-0/);
    assert.match(optionRowSource, /overflow-hidden/);
    assert.match(optionRowSource, /translate-x-\[14px\]/);
  });

  it('keeps optional content and falls back empty diary title to the movie title', () => {
    assert.match(composeScreenSource, /const effectiveTitle = title\.trim\(\) \|\| selectedMedia\.title/);
    assert.match(utilsSource, /content\.length <= 3000/);
    assert.doesNotMatch(composeScreenSource, /content\.trim\(\)\.length > 0/);
    assert.match(composeScreenSource, /containsSpoiler/);
    assert.match(composeScreenSource, /visibility/);
    assert.match(composeScreenSource, /tags/);
  });

  it('centralizes submit validation while allowing zero rating and optional content', () => {
    assert.match(utilsSource, /export function isValidDateInput/);
    assert.match(utilsSource, /export function validateDiaryCompose/);
    assert.match(utilsSource, /rating >= 0/);
    assert.match(utilsSource, /rating <= 5/);
    assert.match(utilsSource, /content\.length <= 3000/);
    assert.match(utilsSource, /effectiveTitle\.trim\(\)\.length > 0/);
    assert.match(utilsSource, /isValidDateInput\(watchedDate\)/);
    assert.match(composeScreenSource, /validateDiaryCompose\(\{/);
    assert.doesNotMatch(composeScreenSource, /rating > 0/);
    assert.match(composeScreenSource, /mediaStatus !== 'loading'/);
    assert.match(composeScreenSource, /mediaStatus !== 'error'/);
  });

  it('submits the validated diary draft through the diaries API and redirects after creation', () => {
    assert.match(diariesApiSource, /export type CreateDiaryPayload/);
    assert.match(diariesApiSource, /export async function createDiary/);
    assert.match(diariesApiSource, /fetch\(`\$\{getApiBaseUrl\(\)\}\/diaries`/);
    assert.match(diariesApiSource, /method: 'POST'/);
    assert.match(diariesApiSource, /credentials: 'include'/);
    assert.match(diariesApiSource, /JSON\.stringify\(payload\)/);
    assert.match(composeScreenSource, /import \{ createDiary/);
    assert.match(composeScreenSource, /useRouter/);
    assert.match(composeScreenSource, /const \[isSubmitting, setIsSubmitting\] = useState\(false\)/);
    assert.match(composeScreenSource, /const \[submitError, setSubmitError\]/);
    assert.match(composeScreenSource, /await createDiary\(\{/);
    assert.match(composeScreenSource, /mediaId: selectedMedia\.id/);
    assert.match(composeScreenSource, /hasSpoiler: containsSpoiler/);
    assert.match(composeScreenSource, /content: content\.trim\(\)/);
    assert.match(composeScreenSource, /router\.push\('\/diary'\)/);
    assert.match(composeScreenSource, /다이어리를 저장하지 못했어요/);
    assert.match(composeScreenSource, /!isSubmitting/);
  });

  it('links the media detail modal diary CTA to the compose route with the selected media id', () => {
    assert.match(mediaDetailModalSource, /useRouter/);
    assert.match(mediaDetailModalSource, /router\.push\(`\/diary\/new\?mediaId=\$\{encodeURIComponent\(media\.id\)\}`\)/);
    assert.match(mediaDetailModalSource, /리뷰·다이어리 작성/);
    assert.doesNotMatch(mediaDetailModalSource, /href=\{`\/diary\/new\?mediaId=\$\{media\.id\}`\}/);
  });
});
