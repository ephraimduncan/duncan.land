import type {
  EligibilityReason,
  GuestbookPostsResponse,
  SignGuestbookRequest,
  SignGuestbookResponse,
  EligibilityResponse,
  GuestbookPost,
  ApiError
} from '@/types/guestbook';

class GuestbookApiError extends Error {
  constructor(public status: number, public override message: string) {
    super(message);
    this.name = 'GuestbookApiError';
  }
}

function expectRecord(value: unknown, label: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`Invalid ${label}`);
  }

  return value as Record<string, unknown>;
}

function expectString(value: unknown, label: string): string {
  if (typeof value !== 'string') {
    throw new Error(`Invalid ${label}`);
  }

  return value;
}

function expectNullableString(value: unknown, label: string): string | null {
  if (value === null) {
    return null;
  }

  return expectString(value, label);
}

function expectBoolean(value: unknown, label: string): boolean {
  if (typeof value !== 'boolean') {
    throw new Error(`Invalid ${label}`);
  }

  return value;
}

function expectNullableNonNegativeInteger(value: unknown, label: string): number | null {
  if (value === null) {
    return null;
  }

  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
    throw new Error(`Invalid ${label}`);
  }

  return value;
}

function expectArray(value: unknown, label: string): unknown[] {
  if (!Array.isArray(value)) {
    throw new Error(`Invalid ${label}`);
  }

  return value;
}

function parseGuestbookPost(value: unknown): GuestbookPost {
  const post = expectRecord(value, 'guestbook post');

  return {
    id: expectString(post.id, 'guestbook post id'),
    message: expectString(post.message, 'guestbook post message'),
    created_at: expectString(post.created_at, 'guestbook post created_at'),
    signature: expectNullableString(post.signature, 'guestbook post signature'),
    username: expectString(post.username, 'guestbook post username'),
    name: expectNullableString(post.name, 'guestbook post name'),
  };
}

function parseGuestbookPostsResponse(value: unknown): GuestbookPostsResponse {
  const response = expectRecord(value, 'guestbook posts response');

  return {
    posts: expectArray(response.posts, 'guestbook posts').map(parseGuestbookPost),
    nextCursor: expectNullableNonNegativeInteger(response.nextCursor, 'guestbook nextCursor'),
    hasMore: expectBoolean(response.hasMore, 'guestbook hasMore'),
  };
}

function parseSignGuestbookResponse(value: unknown): SignGuestbookResponse {
  const response = expectRecord(value, 'sign guestbook response');

  return {
    post: parseGuestbookPost(response.post),
    message: expectString(response.message, 'sign guestbook message'),
  };
}

function parseEligibilityReason(value: unknown): EligibilityReason {
  if (value === 'ALREADY_SIGNED' || value === 'NOT_AUTHENTICATED') {
    return value;
  }

  throw new Error('Invalid guestbook eligibility reason');
}

function parseEligibilityResponse(value: unknown): EligibilityResponse {
  const response = expectRecord(value, 'guestbook eligibility response');
  const eligible = expectBoolean(response.eligible, 'guestbook eligibility flag');

  if (eligible) {
    return { eligible: true };
  }

  return {
    eligible: false,
    reason: parseEligibilityReason(response.reason),
  };
}

function getApiErrorMessage(data: unknown): string {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return 'An error occurred';
  }

  const { message } = data as ApiError;
  return typeof message === 'string' ? message : 'An error occurred';
}

async function fetchApi<T>(
  endpoint: string,
  parser: (data: unknown) => T,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`/api/guestbook${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    credentials: 'include',
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new GuestbookApiError(response.status, getApiErrorMessage(data));
  }

  return parser(data);
}

export const guestbookApi = {
  async getPosts(cursor: number = 0): Promise<GuestbookPostsResponse> {
    return fetchApi(`?cursor=${cursor}`, parseGuestbookPostsResponse);
  },

  async sign(input: SignGuestbookRequest): Promise<SignGuestbookResponse> {
    return fetchApi('/sign', parseSignGuestbookResponse, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  async checkEligibility(): Promise<EligibilityResponse> {
    return fetchApi('/check-eligibility', parseEligibilityResponse);
  },
};
