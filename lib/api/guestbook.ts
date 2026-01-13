import type {
  GuestbookPostsResponse,
  SignGuestbookInput,
  SignGuestbookResponse,
  EligibilityResponse,
  ApiError
} from '@/types/guestbook';

class GuestbookApiError extends Error {
  constructor(
    public status: number,
    public override message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'GuestbookApiError';
  }
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`/api/guestbook${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as ApiError;
    throw new GuestbookApiError(
      response.status,
      error.message || 'An error occurred',
      error
    );
  }

  return data as T;
}

export const guestbookApi = {
  async getPosts(cursor: number = 0): Promise<GuestbookPostsResponse> {
    return fetchApi<GuestbookPostsResponse>(`?cursor=${cursor}`);
  },

  async sign(input: SignGuestbookInput): Promise<SignGuestbookResponse> {
    const { optimisticUser, ...apiInput } = input;
    return fetchApi<SignGuestbookResponse>('/sign', {
      method: 'POST',
      body: JSON.stringify(apiInput),
    });
  },

  async checkEligibility(): Promise<EligibilityResponse> {
    return fetchApi<EligibilityResponse>('/check-eligibility');
  },
};
