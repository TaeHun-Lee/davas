import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

function source(path: string) {
  return readFileSync(new URL(path, import.meta.url), 'utf8');
}

const profilePageSource = source('./profile/page.tsx');
const profileDashboardSource = source('../components/profile/ProfileDashboard.tsx');
const profileHeaderSource = source('../components/profile/ProfileHeaderCard.tsx');
const profileStatsSource = source('../components/profile/ProfileStatsGrid.tsx');
const profileActivitySource = source('../components/profile/ProfileActivitySection.tsx');
const profileListsSource = source('../components/profile/ProfileListsSection.tsx');
const profileSettingsSource = source('../components/profile/ProfileSettingsSection.tsx');
const profileEditPageSource = source('./profile/edit/page.tsx');
const profileAccountPageSource = source('./profile/account/page.tsx');
const profileNotificationsPageSource = source('./profile/notifications/page.tsx');
const profilePrivacyPageSource = source('./profile/privacy/page.tsx');
const profileSupportPageSource = source('./profile/support/page.tsx');
const profileAboutPageSource = source('./profile/about/page.tsx');
const profileEditScreenSource = source('../components/profile/ProfileEditScreen.tsx');
const profileImagePickerSource = source('../components/profile/ProfileImagePicker.tsx');
const profileAccountScreenSource = source('../components/profile/ProfileAccountScreen.tsx');
const profileNotificationsScreenSource = source('../components/profile/ProfileNotificationsScreen.tsx');
const profilePrivacyScreenSource = source('../components/profile/ProfilePrivacyScreen.tsx');
const profileSupportScreenSource = source('../components/profile/ProfileSupportScreen.tsx');
const profileAboutScreenSource = source('../components/profile/ProfileAboutScreen.tsx');
const usersApiSource = source('../lib/api/users.ts');
const authApiSource = source('../lib/api/auth.ts');
const diaryApiSource = source('../lib/api/diaries.ts');
const placeholderSource = source('../components/layout/PlaceholderPage.tsx');

describe('Davas profile tab design', () => {
  it('routes /profile to a live-data profile dashboard instead of a placeholder', () => {
    assert.match(profilePageSource, /ProfileDashboard/);
    assert.doesNotMatch(profilePageSource, /PlaceholderPage/);
    assert.match(profileDashboardSource, /AppShell/);
    assert.match(profileDashboardSource, /getMe/);
    assert.match(profileDashboardSource, /getDiaryDashboard/);
    assert.match(authApiSource, /\/auth\/me/);
    assert.match(authApiSource, /credentials: 'include'/);
    assert.match(diaryApiSource, /\/diaries\/dashboard/);
  });

  it('matches the supplied profile hero, stat row, activity, list, and settings information architecture without the membership card', () => {
    for (const componentName of [
      'ProfileHeaderCard',
      'ProfileStatsGrid',
      'ProfileActivitySection',
      'ProfileListsSection',
      'ProfileSettingsSection',
    ]) {
      assert.match(profileDashboardSource, new RegExp(`<${componentName}`));
    }
    assert.match(profileDashboardSource, /프로필/);
    assert.match(profileHeaderSource, /data-design="profile-hero-card"/);
    assert.match(profileHeaderSource, /필름메이트/);
    assert.match(profileHeaderSource, /Pro/);
    assert.match(profileHeaderSource, /영화를 기록하고, 기억하고/);
    assert.match(profileDashboardSource, /기록한 영화/);
    assert.match(profileDashboardSource, /작성한 다이어리/);
    assert.match(profileDashboardSource, /받은 좋아요/);
    assert.match(profileDashboardSource, /팔로잉/);
    assert.doesNotMatch(profileDashboardSource, /ProfileMembershipCard|Davas Pro 멤버십|혜택 보기/);
    assert.match(profileActivitySource, /활동/);
    assert.match(profileListsSource, /나의 리스트/);
    assert.match(profileSettingsSource, /설정/);
  });

  it('derives profile numbers from authenticated live dashboard data instead of static mock metrics', () => {
    assert.match(profileDashboardSource, /buildProfileView/);
    assert.match(profileDashboardSource, /dashboard\.summary\.totalCount/);
    assert.match(profileDashboardSource, /dashboard\.recentItems/);
    assert.match(profileHeaderSource, /user\.nickname/);
    assert.match(profileStatsSource, /stats\.recordedMovies/);
    assert.match(profileActivitySource, /activity\.wantToWatch/);
    assert.doesNotMatch(profileDashboardSource, /recordedMovies:\s*48|diaryCount:\s*12|receivedLikes:\s*126|following:\s*32/);
    assert.doesNotMatch(profileListsSource, /인생 영화|다시 보고 싶은 영화|영화 명대사 모음|2024 최고의 영화/);
    assert.doesNotMatch(profileListsSource, /\/images\/mock/);
  });

  it('keeps unavailable social metrics explicit instead of fabricating likes or following counts', () => {
    assert.match(profileDashboardSource, /unavailableLabel: '준비중'/);
    assert.match(profileStatsSource, /stat\.value \?\? stat\.unavailableLabel/);
    assert.match(profileActivitySource, /item\.value \?\? item\.unavailableLabel/);
    assert.doesNotMatch(profileDashboardSource, /receivedLikes:\s*126|following:\s*32/);
  });

  it('uses the mobile visual treatment from the profile reference without horizontal overflow', () => {
    assert.match(profileDashboardSource, /overflow-x-hidden/);
    assert.match(profileDashboardSource, /pb-8/);
    assert.match(profileHeaderSource, /h-\[86px\] w-\[86px\]/);
    assert.match(profileHeaderSource, /rounded-full/);
    assert.doesNotMatch(profileHeaderSource, /data-design="profile-settings-button"|aria-label="프로필 설정"|SettingsIcon/);
    assert.doesNotMatch(profileHeaderSource, /top-\[-48px\]|right-0/);
    assert.match(profileStatsSource, /grid-cols-4/);
    assert.match(profileStatsSource, /divide-x/);
    assert.match(profileActivitySource, /grid-cols-4/);
    assert.match(profileListsSource, /-mx-4 overflow-x-auto px-4/);
    assert.match(profileSettingsSource, /rounded-\[20px\]/);
  });

  it('removes duplicate profile section header actions that only route back to the diary tab', () => {
    assert.doesNotMatch(profileActivitySource, /import Link from 'next\/link'/);
    assert.doesNotMatch(profileActivitySource, /더보기|활동 전체 보기|href="\/diary"/);
    assert.doesNotMatch(profileActivitySource, /<button[^>]*>더보기/);

    assert.doesNotMatch(profileListsSource, /import Link from 'next\/link'/);
    assert.doesNotMatch(profileListsSource, /전체 보기|전체보기|나의 리스트 전체 보기|href="\/diary"/);
    assert.doesNotMatch(profileListsSource, /<button[^>]*>전체 보기/);
  });

  it('limits placeholder pages to unfinished tabs and removes profile from the temporary route contract', () => {
    assert.match(placeholderSource, /임시 페이지/);
    assert.doesNotMatch(profilePageSource, /임시 페이지/);
  });

  it('wires the profile chevron and settings rows to real profile feature routes', () => {
    assert.match(profileHeaderSource, /href="\/profile\/edit"/);
    assert.match(profileHeaderSource, /aria-label="프로필 편집"/);
    assert.match(profileHeaderSource, /profileImageUrl/);
    assert.match(profileHeaderSource, /normalizeProfileImageUrl/);
    assert.match(profileHeaderSource, /<img/);

    for (const href of ['/profile/account', '/profile/notifications', '/profile/privacy', '/profile/support', '/profile/about']) {
      assert.match(profileSettingsSource, new RegExp(`href\\s*[:=]\\s*\\{?['\"]${href}`));
    }
    assert.match(profileSettingsSource, /import Link from 'next\/link'/);
    assert.doesNotMatch(profileSettingsSource, /<button[\s\S]*key=\{item\.label\}/);

    assert.match(profileEditPageSource, /ProfileEditScreen/);
    assert.match(profileAccountPageSource, /ProfileAccountScreen/);
    assert.match(profileNotificationsPageSource, /ProfileNotificationsScreen/);
    assert.match(profilePrivacyPageSource, /ProfilePrivacyScreen/);
    assert.match(profileSupportPageSource, /ProfileSupportScreen/);
    assert.match(profileAboutPageSource, /ProfileAboutScreen/);
  });

  it('implements profile editing, image upload, and concrete settings behavior', () => {
    assert.match(profileEditScreenSource, /updateMe/);
    assert.match(profileEditScreenSource, /uploadProfileImage/);
    assert.match(profileEditScreenSource, /deleteProfileImage/);
    assert.match(profileEditScreenSource, /handleDeleteProfileImage/);
    assert.match(profileEditScreenSource, /프로필 사진 삭제/);
    assert.match(profileEditScreenSource, /setSelectedFile\(null\)/);
    assert.match(profileEditScreenSource, /profileImageUrl: null/);
    assert.match(profileEditScreenSource, /ProfileImagePicker/);
    assert.match(profileImagePickerSource, /normalizeProfileImageUrl/);
    assert.match(profileImagePickerSource, /type="file"/);
    assert.match(profileImagePickerSource, /accept="image\/\*"/);
    assert.match(profileImagePickerSource, /URL\.createObjectURL/);
    assert.match(usersApiSource, /\/users\/me/);
    assert.match(usersApiSource, /\/users\/me\/profile-image/);
    assert.match(usersApiSource, /export async function deleteProfileImage/);
    assert.match(usersApiSource, /method: 'DELETE'/);
    assert.match(usersApiSource, /FormData/);
    assert.match(usersApiSource, /credentials: 'include'/);
    assert.match(authApiSource, /normalizeProfileImageUrl/);
    assert.match(authApiSource, /replace\(\/\\\/api\$\//);

    assert.match(profileAccountScreenSource, /logout/);
    assert.match(profileAccountScreenSource, /router\.replace\('\/login'\)/);
    assert.match(profileNotificationsScreenSource, /localStorage/);
    assert.match(profileNotificationsScreenSource, /davas\.notificationSettings/);
    assert.match(profilePrivacyScreenSource, /localStorage/);
    assert.match(profilePrivacyScreenSource, /davas\.privacySettings/);
    assert.match(profileSupportScreenSource, /mailto:/);
    assert.match(profileAboutScreenSource, /NEXT_PUBLIC_APP_VERSION/);
  });
});
