export interface GuestbookPost {
  id: string;
  message: string;
  created_at: Date;
  signature: string | null;
  username: string;
  name: string | null;
}

export interface GuestbookPostsResponse {
  posts: GuestbookPost[];
  nextCursor: number | null;
  hasMore: boolean;
}

export interface SignGuestbookInput {
  message: string;
  signature: string;
  optimisticUser?: {
    username: string;
    name: string | null;
  };
}

export interface SignGuestbookResponse {
  post: GuestbookPost;
  message: string;
}

export interface EligibilityResponse {
  eligible: boolean;
  reason?: string;
}

export interface ApiError {
  error: string;
  message: string;
}
