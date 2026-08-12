const ADMIN_API_BASE = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:3001/api/v1/admin';

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

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.error?.message || json.message || `Admin API Error ${res.status}`);
  }

  return json.data;
}
