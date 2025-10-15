import type {
  GuestbookPostsResponse,
  SignGuestbookInput,
  SignGuestbookResponse,
  EligibilityResponse,
  ApiError
} from '@/types/guestbook';

/**
 * API Client for guestbook operations
 *
 * Responsibilities:
 * - HTTP requests with error handling
 * - Type-safe request/response
 * - Credential handling
 * - Error normalization
 */

class GuestbookApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'GuestbookApiError';
  }
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `/api/guestbook${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      // Include cookies for auth
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
  } catch (error) {
    if (error instanceof GuestbookApiError) {
      throw error;
    }

    // Network errors
    throw new GuestbookApiError(
      0,
      'Network error. Please check your connection.',
      error
    );
  }
}

export const guestbookApi = {
  /**
   * Fetch paginated posts
   */
  async getPosts(cursor: number = 0): Promise<GuestbookPostsResponse> {
    return fetchApi<GuestbookPostsResponse>(
      `?cursor=${cursor}`
    );
  },

  /**
   * Sign the guestbook
   */
  async sign(input: SignGuestbookInput): Promise<SignGuestbookResponse> {
    // Strip optimisticUser before sending to API (only used client-side)
    const { optimisticUser, ...apiInput } = input;
    return fetchApi<SignGuestbookResponse>('/sign', {
      method: 'POST',
      body: JSON.stringify(apiInput),
    });
  },

  /**
   * Check if user is eligible to sign
   */
  async checkEligibility(): Promise<EligibilityResponse> {
    return fetchApi<EligibilityResponse>('/check-eligibility');
  },
};
