export class ApiClientError extends Error {
  public code?: string;
  public details?: Record<string, string[]>;

  constructor({ message, code, details }: { message: string; code?: string; details?: Record<string, string[]> }) {
    super(message);
    this.name = 'ApiClientError';
    this.code = code;
    this.details = details;
  }
}

export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('rental_mitra_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiClientError({
      message: json?.message || 'Terjadi kesalahan pada server',
      code: json?.code || `HTTP_${res.status}`,
      details: json?.details || json?.errors,
    });
  }

  return (json?.data !== undefined ? json.data : json) as T;
}
