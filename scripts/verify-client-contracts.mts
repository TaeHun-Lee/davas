// Sends the requests the web client really builds to the real API controllers, behind the
// same ValidationPipe as production, with every service stubbed. A 400 (a field the API
// does not accept or rejects) or a missing route fails the check. Run after the API build:
// node --import tsx scripts/verify-client-contracts.mts
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = join(import.meta.dirname, '..');
const require = createRequire(join(root, 'scripts', 'verify-client-contracts.ts'));
require('reflect-metadata');
const { Module, ValidationPipe } = require('@nestjs/common');
const { NestFactory } = require('@nestjs/core');

const dist = (path: string) => require(join(root, 'apps/api/dist', path));
const controllers = [
  dist('auth/auth.controller.js').AuthController,
  dist('media/media.controller.js').MediaController,
  dist('diaries/watch-events.controller.js').WatchEventsController,
  dist('diaries/space-watch.controller.js').SpaceWatchController,
  dist('comments/comments.controller.js').CommentsController,
  dist('spaces/spaces.controller.js').SpacesController,
  dist('spaces/space-invites.controller.js').SpaceInvitesController,
  dist('recommendations/space-wishes.controller.js').SpaceWishesController,
  dist('recommendations/group-recommendations.controller.js').GroupRecommendationsController,
  dist('recommendations/recommendations.controller.js').RecommendationsController,
  dist('users/users.controller.js').UsersController,
  dist('notifications/notifications.controller.js').NotificationsController,
];
for (const controller of controllers) assert.ok(controller, 'controller export');

// The pipe must stay the one production uses.
const mainSource = readFileSync(join(root, 'apps/api/src/main.ts'), 'utf8');
assert.match(mainSource, /whitelist: true,\s*forbidNonWhitelisted: true,\s*transform: true/);

// Every constructor dependency (by class or by injection token) gets a stub whose methods
// resolve to an empty object: the check is about what reaches the handler, not its result.
const stub = new Proxy(
  {},
  { get: (_target, key) => (key === 'then' ? undefined : async () => ({})) },
);
const tokens = new Set<unknown>([dist('auth/auth.service.js').AuthService]);
for (const controller of controllers) {
  for (const type of Reflect.getMetadata('design:paramtypes', controller) ?? []) tokens.add(type);
  for (const { param } of Reflect.getMetadata('self:paramtypes', controller) ?? [])
    tokens.add(param);
}
class ContractModule {}
Module({
  controllers,
  providers: [...tokens]
    .filter((token) => token && token !== Object)
    .map((token) => ({ provide: token, useValue: stub })),
})(ContractModule);

const app = await NestFactory.create(ContractModule, { logger: false });
app.setGlobalPrefix('api');
app.use((request: { user?: unknown }, _response: unknown, next: () => void) => {
  request.user = { id: ME };
  next();
});
app.useGlobalPipes(
  new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
);
await app.listen(0, '127.0.0.1');
const { port } = app.getHttpServer().address();
process.env.NEXT_PUBLIC_API_BASE_URL = `http://127.0.0.1:${port}/api`;

type Seen = { label: string; method: string; path: string; status: number; body: string };
const seen: Seen[] = [];
let label = '';
const realFetch = globalThis.fetch;
globalThis.fetch = (async (input: URL | RequestInfo, init: RequestInit = {}) => {
  const response = await realFetch(input, init);
  const url = new URL(String(input));
  seen.push({
    label,
    method: init.method ?? 'GET',
    path: url.pathname + url.search,
    status: response.status,
    body: response.status >= 400 ? (await response.clone().text()).slice(0, 300) : '',
  });
  return response;
}) as typeof fetch;

const ME = '00000000-0000-4000-8000-000000000001';
const PARTNER = '00000000-0000-4000-8000-000000000002';
const SPACE = '00000000-0000-4000-8000-0000000000a1';
const MEDIA = '00000000-0000-4000-8000-0000000000b1';
const EVENT = '00000000-0000-4000-8000-0000000000c1';
const REACTION = '00000000-0000-4000-8000-0000000000d1';
const COMMENT = '00000000-0000-4000-8000-0000000000e1';
const PHOTO = '00000000-0000-4000-8000-0000000000f1';
const SESSION = '00000000-0000-4000-8000-000000000101';
const EXPOSURE = '00000000-0000-4000-8000-000000000102';
const NOTIFICATION = '00000000-0000-4000-8000-000000000103';
const INVITE = '00000000-0000-4000-8000-000000000104';

const web = (path: string) => import(pathToFileURL(join(root, 'apps/web/src', path)).href);
const media = await web('lib/api/media.ts');
const events = await web('lib/api/watch-events.ts');
const memories = await web('lib/api/memories.ts');
const spaces = await web('lib/api/spaces.ts');
const wishes = await web('lib/api/wishes.ts');
const users = await web('lib/api/users.ts');
const recommendations = await web('lib/api/recommendations.ts');
const notifications = await web('lib/api/notifications.ts');
const auth = await web('lib/api/auth.ts');
const groupModel = await web('components/spaces/group-recommendation-model.ts');
const shared = require(join(root, 'packages/shared/dist/index.js'));

// A search result as the search screen and home recommendations hand it over.
const searchResult = {
  externalProvider: 'TMDB',
  externalId: '838209',
  mediaType: 'MOVIE',
  title: '파묘',
  originalTitle: '파묘',
  overview: '미국 LA, 거액의 의뢰를 받은 무당 화림과 봉길은…',
  posterUrl: 'https://image.tmdb.org/t/p/w500/a.jpg',
  backdropUrl: null,
  releaseDate: '2024-02-22',
  genreIds: [9648, 27],
  country: 'KR',
};
// The composer's payload (RecordComposer save()), for a theater and a streaming viewing.
const theaterRecord = {
  mediaId: MEDIA,
  watchedDate: '2026-10-05',
  source: {
    kind: 'THEATER',
    providerName: null,
    placeText: 'CGV 용산아이파크몰',
    theaterFormat: 'IMAX',
    seatText: 'H열 12, 13',
    episodeWatched: null,
    episodeTotal: null,
    completed: false,
  },
  spaceIds: [SPACE],
  participantAccountIds: [PARTNER],
  rating: 4.5,
  headline: '결말이 오래 남아요',
  review: null,
  hasSpoiler: false,
  isBlind: true,
  memoryNote: '팝콘 반반',
  photoIds: [PHOTO],
};
const streamingRecord = {
  ...theaterRecord,
  source: {
    kind: 'OTT',
    providerName: '넷플릭스',
    placeText: null,
    theaterFormat: null,
    seatText: null,
    episodeWatched: 8,
    episodeTotal: 16,
    completed: false,
  },
  participantAccountIds: [],
  rating: null,
  headline: null,
  isBlind: false,
  memoryNote: null,
  photoIds: [],
};
const { participantAccountIds: _companions, ...recordChanges } = theaterRecord;

const calls: Array<[string, () => Promise<unknown>]> = [
  ['search titles', () => media.searchMedia({ query: '파묘' })],
  ['choose a title to record', () => media.selectMedia(searchResult)],
  ['open a title', () => media.getMediaDetail(MEDIA)],
  ['where to watch a title', () => media.getMediaAvailability(MEDIA)],
  ['look up where to watch again', () => media.refreshMediaAvailability(MEDIA)],
  ['save a theater record', () => events.createWatchEvent(theaterRecord)],
  ['save a streaming record', () => events.createWatchEvent(streamingRecord)],
  ['edit a record', () => events.updateWatchEvent(EVENT, recordChanges)],
  ['open a record', () => events.getWatchEvent(EVENT)],
  [
    'search my records',
    () => events.searchWatchEvents({ scope: 'mine', q: '팝콘', mediaType: 'MOVIE', limit: 20 }),
  ],
  [
    "search the space's records",
    () =>
      events.searchWatchEvents({
        scope: 'space',
        spaceId: SPACE,
        sourceKind: 'OTT',
        cursor: '20',
      }),
  ],
  ['delete a record', () => events.deleteWatchEvent(EVENT)],
  ['answer a companion request', () => events.respondToWatchParticipation(EVENT, 'CONFIRMED')],
  [
    'save my review',
    () =>
      events.saveWatchReaction(EVENT, {
        rating: 4,
        headline: '좋았다',
        review: '다시 볼래',
        hasSpoiler: true,
        isBlind: true,
      }),
  ],
  ['add my photos to a record', () => events.setWatchEventPhotos(EVENT, [PHOTO])],
  ['like a review', () => events.setReviewLike(EVENT, REACTION, true)],
  ['unlike a review', () => events.setReviewLike(EVENT, REACTION, false)],
  ['list comments', () => events.listWatchComments(EVENT)],
  ['post a comment', () => events.createWatchComment(EVENT, '다음엔 4DX로 보자')],
  ['delete a comment', () => events.deleteWatchComment(COMMENT)],
  ['space timeline', () => events.getSpaceTimeline(SPACE, { limit: 5 })],
  [
    'space timeline, next page',
    () => events.getSpaceTimeline(SPACE, { cursor: 'eyJ4IjoxfQ', limit: 20 }),
  ],
  ['waiting confirmations', () => events.getPendingConfirmations(SPACE)],
  ['compare reactions', () => events.compareSpaceReactions(SPACE, MEDIA)],
  ['memories', () => memories.getSpaceMemories(SPACE, 2026)],
  ['calendar', () => memories.getSpaceCalendar(SPACE, '2026-10')],
  ['series progress', () => memories.getWatchProgress(MEDIA)],
  ['list spaces', () => spaces.listSpaces()],
  ['open a space', () => spaces.getSpace(SPACE)],
  ['create a space', () => spaces.createSpace('우리 둘', 2)],
  ['create an invite', () => spaces.createSpaceInvite(SPACE, 72)],
  ['cancel an invite', () => spaces.cancelSpaceInvite(SPACE, INVITE)],
  ['inspect an invite', () => spaces.inspectSpaceInvite('demo-token')],
  ['accept an invite', () => spaces.acceptSpaceInvite('demo-token')],
  ['transfer ownership', () => spaces.transferSpaceOwnership(SPACE, PARTNER)],
  ['leave a space', () => spaces.leaveSpace(SPACE)],
  ['close a space', () => spaces.closeSpace(SPACE)],
  ['rename a space', () => spaces.renameSpace(SPACE, '우리 영화관')],
  ['decline an invite', () => spaces.declineSpaceInvite('demo-token')],
  ['wish list', () => wishes.listWishes(SPACE)],
  ['quick pick', () => wishes.pickWish(SPACE, { mood: 'LIGHT', exclude: [MEDIA] })],
  ['wish status', () => wishes.getWishStatus(SPACE, MEDIA)],
  ['add a wish', () => wishes.setWish(SPACE, MEDIA, true)],
  ['remove a wish', () => wishes.setWish(SPACE, MEDIA, false)],
  ['save subscriptions', () => users.updateMe({ ottServices: ['netflix', 'apple', 'prime'] })],
  [
    'save profile',
    () => users.updateMe({ nickname: '지우', bio: null, preferredGenres: ['드라마'] }),
  ],
  ['trending', () => recommendations.getTrendingRecommendations({ limit: 20 })],
  ['genre presets', () => recommendations.getGenreRecommendationPresets()],
  ['genre picks', () => recommendations.getGenreRecommendations('romance', { limit: 4 })],
  ['random genre picks', () => recommendations.getRandomGenreRecommendations({ seed: 'seed-1' })],
  ['today pick', () => recommendations.getTodayRecommendation({ limit: 3 })],
  [
    'start group choosing',
    () =>
      recommendations.createGroupRecommendationSession(
        groupModel.buildGroupRecommendationRequest({
          spaceId: SPACE,
          participantAccountIds: [ME, PARTNER],
          region: 'KR',
          services: shared.ottProviderNames(['netflix', 'tving']),
          contentTypes: ['MOVIE', 'TV'],
          runtimeMin: '',
          runtimeMax: '150',
          moodTags: ['가벼운', '긴장감'],
          avoidTagsText: '공포',
          rewatchPolicy: 'EXCLUDE',
          decisionRule: 'ALL',
          minimumApprovals: 2,
        }),
      ),
  ],
  ['open group choosing', () => recommendations.getGroupRecommendationSession(SESSION)],
  ["a space's group choosing", () => recommendations.listGroupRecommendationSessions(SPACE)],
  [
    'react to a candidate',
    () => recommendations.submitGroupRecommendationFeedback(EXPOSURE, { kind: 'INTERESTED' }),
  ],
  ['notifications', () => notifications.listNotifications()],
  ['unread count', () => notifications.getUnreadNotificationCount()],
  ['read one', () => notifications.markNotificationRead(NOTIFICATION)],
  ['read all', () => notifications.markAllNotificationsRead()],
  ['notification settings', () => notifications.listNotificationPreferences()],
  ['turn a notification off', () => notifications.setNotificationPreference('SOCIAL', false)],
  ['log in', () => auth.login('jiwoo@example.com', 'password123')],
  ['change password', () => auth.changePassword('password123', 'new-password-1')],
  ['make a recovery code', () => auth.createRecoveryCode('password123')],
  [
    'reset a forgotten password',
    () =>
      auth.resetPassword({
        email: 'jiwoo@example.com',
        recoveryCode: 'ABCD-EFGH-JKMN',
        newPassword: 'new-password-1',
      }),
  ],
  [
    'bring a deleted account back',
    () => users.cancelAccountDeletion('jiwoo@example.com', 'password123'),
  ],
  ['export my data', () => users.exportMyData()],
];

try {
  for (const [name, call] of calls) {
    label = name;
    // A stubbed result may not satisfy the client's own parsing; only HTTP outcomes count.
    await call().catch(() => undefined);
  }
} finally {
  await app.close();
  globalThis.fetch = realFetch;
}

const failures = seen.filter(
  (request) =>
    request.status === 400 ||
    request.status === 405 ||
    (request.status === 404 && /Cannot (GET|POST|PATCH|PUT|DELETE)/.test(request.body)),
);
const unexercised = calls
  .map(([name]) => name)
  .filter((name) => !seen.some((s) => s.label === name));
for (const failure of failures) {
  console.error(
    `FAIL ${failure.label}: ${failure.method} ${failure.path} -> ${failure.status} ${failure.body}`,
  );
}
for (const name of unexercised) console.error(`FAIL ${name}: the client sent no request`);
if (failures.length || unexercised.length) process.exit(1);
console.log(`Client contract passed: ${seen.length} web requests accepted by the API validation.`);
