/**
 * Parse Supabase auth tokens from a deep link URL.
 * Supports hash fragment: edubridge://auth/callback#access_token=...&refresh_token=...
 */
export function parseAuthTokensFromUrl(url: string | null): { access_token: string; refresh_token: string } | null {
  if (!url || !url.includes('access_token=')) return null;
  try {
    const hashIndex = url.indexOf('#');
    const queryIndex = url.indexOf('?');
    const fragment = hashIndex >= 0 ? url.slice(hashIndex + 1) : queryIndex >= 0 ? url.slice(queryIndex + 1) : '';
    if (!fragment) return null;
    const params = new URLSearchParams(fragment);
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');
    if (access_token && refresh_token) return { access_token, refresh_token };
    return null;
  } catch {
    return null;
  }
}

export function isAuthCallbackUrl(url: string | null): boolean {
  if (!url) return false;
  return url.startsWith('edubridge://auth/callback') || url.startsWith('edubridge://');
}
