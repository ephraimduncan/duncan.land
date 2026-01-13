import type {
  GuestbookPostsResponse,
  GuestbookPost,
  SignGuestbookInput,
  SignGuestbookResponse,
  EligibilityResponse,
  ApiError
} from '@/types/guestbook';

// Raw post type from API (dates are ISO strings from JSON serialization)
type RawGuestbookPost = Omit<GuestbookPost, 'created_at'> & {
  created_at: string;
};

function transformPost(post: RawGuestbookPost): GuestbookPost {
  return {
    ...post,
    created_at: new Date(post.created_at),
  };
}

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

type RawGuestbookPostsResponse = Omit<GuestbookPostsResponse, 'posts'> & {
  posts: RawGuestbookPost[];
};

type RawSignGuestbookResponse = Omit<SignGuestbookResponse, 'post'> & {
  post: RawGuestbookPost;
};

export const guestbookApi = {
  async getPosts(cursor: number = 0): Promise<GuestbookPostsResponse> {
    const data = await fetchApi<RawGuestbookPostsResponse>(`?cursor=${cursor}`);
    return {
      ...data,
      posts: data.posts.map(transformPost),
    };
  },

  async sign(input: SignGuestbookInput): Promise<SignGuestbookResponse> {
    const { optimisticUser, ...apiInput } = input;
    const response = await fetchApi<RawSignGuestbookResponse>('/sign', {
      method: 'POST',
      body: JSON.stringify(apiInput),
    });
    return {
      ...response,
      post: transformPost(response.post),
    };
  },

  async checkEligibility(): Promise<EligibilityResponse> {
    return fetchApi<EligibilityResponse>('/check-eligibility');
  },
};
