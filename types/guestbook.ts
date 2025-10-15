/**
 * Type definitions for guestbook domain
 * Separated from implementation for reusability across layers
 */

export interface GuestbookPost {
  id: string;
  message: string;
  created_at: number;
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
  // Optional: only used for optimistic updates, not sent to API
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
