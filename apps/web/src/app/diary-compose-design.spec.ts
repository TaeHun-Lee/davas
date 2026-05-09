import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

function source(path: string) {
  return readFileSync(new URL(path, import.meta.url), 'utf8');
}

const diaryNewPageSource = source('./diary/new/page.tsx');
const diaryEditPagePath = new URL('./diary/[id]/edit/page.tsx', import.meta.url);
const diaryEditPageSource = existsSync(diaryEditPagePath) ? readFileSync(diaryEditPagePath, 'utf8') : '';
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
const mediaDetailLoadingIndicatorSource = source('../components/media/MediaDetailLoadingIndicator.tsx');

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

  it('preserves returnTo from the detail modal and uses it for the compose back action', () => {
    assert.match(diaryNewPageSource, /returnTo\?: string \| string\[\]/);
    assert.match(diaryNewPageSource, /const returnTo = Array\.isArray\(params\?\.returnTo\) \? params\.returnTo\[0\] : params\?\.returnTo/);
    assert.match(diaryNewPageSource, /returnTo=\{returnTo\}/);
    assert.match(composeScreenSource, /returnTo\?: string/);
    assert.match(composeScreenSource, /function handleBack\(\)/);
    assert.match(composeScreenSource, /if \(returnTo\) router\.push\(returnTo\)/);
    assert.match(composeScreenSource, /router\.back\(\)/);
    assert.match(composeScreenSource, /<DiaryComposeHeader onBack=\{handleBack\}/);
  });

  it('uses a mobile panel shell and a safe sticky submit bar without horizontal overflow', () => {
    assert.match(composeScreenSource, /data-design="diary-compose-shell"/);
    assert.match(composeScreenSource, /max-w-\[430px\]/);
    assert.match(composeScreenSource, /overflow-x-hidden/);
    assert.match(composeScreenSource, /min-h-dvh/);
    assert.match(submitBarSource, /safe-area-inset-bottom/);
    assert.match(submitBarSource, /max-w-\[430px\]/);
    assert.match(submitBarSource, /left-1\/2/);
    assert.doesNotMatch(submitBarSource, /-mx-5/);
  });

  it('loads selected media from mediaId query while keeping mock fallback for standalone preview', () => {
    assert.match(mediaApiSource, /export async function getMediaDetail/);
    assert.match(composeScreenSource, /mediaId\?: string/);
    assert.match(composeScreenSource, /getMediaDetail\(mediaId\)/);
    assert.match(composeScreenSource, /useEffect/);
    assert.match(composeScreenSource, /setSelectedMedia\(mapMediaDetailToDiaryMedia\(detail\)\)/);
    assert.match(composeScreenSource, /const initialSelectedMedia = mediaId \|\| diaryId \? null : mockDiaryMedia/);
    assert.match(composeScreenSource, /useState<DiaryComposeMedia \| null>\(initialSelectedMedia\)/);
    assert.match(composeScreenSource, /MediaDetailLoadingIndicator/);
    assert.doesNotMatch(composeScreenSource, /작품 정보를 불러오고 있어요/);
    assert.match(composeScreenSource, /작품 정보를 불러오지 못했어요/);
    assert.match(utilsSource, /export function mapMediaDetailToDiaryMedia/);
    assert.match(utilsSource, /MediaDetail/);
    assert.match(utilsSource, /genres\.slice\(0, 3\)/);
    assert.match(utilsSource, /releaseDate\?\.slice\(0, 4\)/);
  });

  it('shows only a text-free media placeholder while a mediaId detail is loading', () => {
    assert.match(selectedMediaCardSource, /isLoading\?: boolean/);
    assert.match(selectedMediaCardSource, /data-design="selected-media-placeholder"/);
    assert.match(selectedMediaCardSource, /aria-label="선택한 작품을 불러오는 중"/);
    assert.match(mediaDetailLoadingIndicatorSource, /animate-spin/);
    assert.match(composeScreenSource, /mediaStatus === 'loading' && Boolean\(mediaId \|\| diaryId\) \? <MediaDetailLoadingIndicator \/> : null/);
    assert.doesNotMatch(composeScreenSource, /const mediaCard = selectedMedia \? selectedMedia : mockDiaryMedia/);
    assert.match(composeScreenSource, /<SelectedMediaCard media=\{selectedMedia\} isLoading=\{mediaStatus === 'loading' && Boolean\(mediaId \|\| diaryId\)\}/);
    assert.match(selectedMediaCardSource, /media: DiaryComposeMedia \| null/);
    assert.match(composeScreenSource, /fallbackTitle=\{selectedMedia\?\.title \?\? ''\}/);
    assert.doesNotMatch(selectedMediaCardSource, /<span className="text-\[15px\][^>]*>인셉션<\/span>/);
  });

  it('matches the supplied diary compose header and selected media card', () => {
    assert.match(headerSource, /리뷰 다이어리 작성/);
    assert.match(headerSource, /임시저장/);
    assert.match(headerSource, /aria-label="뒤로 가기"/);
    assert.match(selectedMediaCardSource, /인셉션/);
    assert.match(selectedMediaCardSource, /Inception/);
    assert.match(selectedMediaCardSource, /2010 · 148분/);
    assert.match(selectedMediaCardSource, /posterUrl/);
  });

  it('moves selected media genres into pill tags while keeping meta to year and runtime', () => {
    assert.match(selectedMediaCardSource, /genres: string\[\]/);
    assert.match(selectedMediaCardSource, /media\.genres\.map/);
    assert.match(selectedMediaCardSource, /rounded-full bg-\[\#eef5ff\]/);
    assert.doesNotMatch(selectedMediaCardSource, /<h[1-6][^>]*>선택한 작품/);
    assert.doesNotMatch(selectedMediaCardSource, /meta: 'SF · 스릴러 · 2010'/);
    assert.match(utilsSource, /const year = releaseDate\?\.slice\(0, 4\) \?\? '연도 미상'/);
    assert.match(utilsSource, /const runtimeText = media\.runtime \? `\$\{media\.runtime\}분` : '러닝타임 준비 중'/);
    assert.match(utilsSource, /meta: `\$\{year\} · \$\{runtimeText\}`/);
    assert.match(utilsSource, /genres: genres\.slice\(0, 3\)/);
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

  it('opens my diary edit link in compose edit mode and saves through PATCH', () => {
    assert.match(diaryEditPageSource, /DiaryComposeScreen/);
    assert.match(diaryEditPageSource, /params\?: Promise<\{ id: string \}>/);
    assert.match(diaryEditPageSource, /mode="edit"/);
    assert.match(diaryEditPageSource, /diaryId=\{id\}/);
    assert.match(diariesApiSource, /export async function getDiary/);
    assert.match(diariesApiSource, /export async function updateDiary/);
    assert.match(diariesApiSource, /fetch\(`\$\{getApiBaseUrl\(\)\}\/diaries\/\$\{encodeURIComponent\(id\)\}`/);
    assert.match(diariesApiSource, /method: 'PATCH'/);
    assert.match(composeScreenSource, /mode\?: 'create' \| 'edit'/);
    assert.match(composeScreenSource, /diaryId\?: string/);
    assert.match(composeScreenSource, /getDiary\(diaryId\)/);
    assert.match(composeScreenSource, /setTitle\(diary\.title\)/);
    assert.match(composeScreenSource, /setContent\(diary\.content\)/);
    assert.match(composeScreenSource, /setRating\(diary\.rating\)/);
    assert.match(composeScreenSource, /await updateDiary\(diaryId, payload\)/);
    assert.match(submitBarSource, /수정 완료/);
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
    assert.match(composeScreenSource, /const effectiveTitle = title\.trim\(\) \|\| selectedMedia\?\.title \|\| ''/);
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
    assert.match(composeScreenSource, /await createDiary\(payload\)/);
    assert.match(composeScreenSource, /mediaId: selectedMedia\.id/);
    assert.match(composeScreenSource, /hasSpoiler: containsSpoiler/);
    assert.match(composeScreenSource, /content: content\.trim\(\)/);
    assert.match(composeScreenSource, /router\.push\('\/diary'\)/);
    assert.match(composeScreenSource, /다이어리를 저장하지 못했어요/);
    assert.match(composeScreenSource, /!isSubmitting/);
  });

  it('links the media detail modal diary CTA to the compose route with the selected media id and returnTo', () => {
    assert.match(mediaDetailModalSource, /useRouter/);
    assert.match(mediaDetailModalSource, /returnTo\?: string/);
    assert.match(mediaDetailModalSource, /const diaryUrl = `\/diary\/new\?mediaId=\$\{encodeURIComponent\(media\.id\)\}&returnTo=\$\{encodeURIComponent/);
    assert.match(mediaDetailModalSource, /router\.push\(diaryUrl\)/);
    assert.match(mediaDetailModalSource, /리뷰·다이어리 작성/);
    assert.doesNotMatch(mediaDetailModalSource, /href=\{`\/diary\/new\?mediaId=\$\{media\.id\}`\}/);
  });
});
