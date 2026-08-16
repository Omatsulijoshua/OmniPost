import { useAuthStore } from './auth-store';

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://omnipost-api.onrender.com/api/v1';
  const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const { tokens, activeWorkspace } = useAuthStore.getState();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (tokens?.accessToken) {
    headers['Authorization'] = `Bearer ${tokens.accessToken}`;
  }

  if (activeWorkspace?.id) {
    headers['x-workspace-id'] = activeWorkspace.id;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({ success: true, data: null }));

    if (!response.ok || data.success === false) {
      throw new Error(data.error?.message || data.message || `API request failed with status ${response.status}`);
    }

    return data.data !== undefined ? data.data : data;
  } catch (err: any) {
    console.warn(`[OmniPost API Fetch] Notice on ${endpoint}: ${err.message}`);
    throw err;
  }
}
