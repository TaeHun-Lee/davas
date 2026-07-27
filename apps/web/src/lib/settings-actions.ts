export type CompleteLogoutOptions = {
  requestLogout: () => Promise<unknown>;
  purgeDrafts: () => void;
  navigateToLogin: () => void;
};

export async function completeLogout({
  requestLogout,
  purgeDrafts,
  navigateToLogin,
}: CompleteLogoutOptions): Promise<void> {
  try {
    await requestLogout();
  } catch {
    // The request is best-effort. A network failure cannot clear the server's
    // HttpOnly cookie, but the browser UI must still become unauthenticated.
  } finally {
    try {
      purgeDrafts();
    } finally {
      navigateToLogin();
    }
  }
}
