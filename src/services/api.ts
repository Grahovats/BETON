const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export const apiRequest = async <T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> => {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers ?? {}),
      },
    });
  } catch {
    throw new ApiError(
      `Cannot reach API at ${API_BASE_URL}. Start backend server and try again.`,
      0,
    );
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(payload.error ?? 'Request failed', response.status);
  }

  return payload as T;
};
