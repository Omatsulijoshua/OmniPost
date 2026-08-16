const ADMIN_API_BASE =
  process.env.NEXT_PUBLIC_ADMIN_API_URL || 'https://omnipost-api.onrender.com/api/v1/admin';

export async function adminApiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('omnipost_admin_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${ADMIN_API_BASE}${endpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const json = await res.json().catch(() => ({ success: true, data: null }));

    if (!res.ok || json.success === false) {
      throw new Error(json.error?.message || json.message || `Admin API error: ${res.status}`);
    }

    return json.data ?? json;
  } catch (err: any) {
    console.warn(`[OmniPost Admin API] Notice on ${endpoint}: ${err.message || 'API fallback mode active'}`);
    throw err;
  }
}
