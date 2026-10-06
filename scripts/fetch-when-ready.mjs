export async function fetchWhenReady(
  url,
  { attempts = 30, requestTimeoutMs = 1_000, retryDelayMs = 200 } = {},
) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await fetch(url, { signal: AbortSignal.timeout(requestTimeoutMs) });
    } catch (error) {
      lastError = error;
      if (attempt + 1 < attempts && retryDelayMs > 0) {
        await new Promise((resolveWait) => setTimeout(resolveWait, retryDelayMs));
      }
    }
  }
  throw lastError ?? new Error(`Could not fetch ${url}.`);
}
