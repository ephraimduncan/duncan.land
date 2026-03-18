export interface GuestbookPost {
  id: string;
  message: string;
  created_at: Date;
  signature: string | null;
  username: string;
  name: string | null;
}

export interface GuestbookOptimisticUser {
  username: string;
  name: string | null;
}

export interface GuestbookPostsResponse {
  posts: GuestbookPost[];
  nextCursor: number | null;
  hasMore: boolean;
}

export interface SignGuestbookRequest {
  message: string;
  signature: string | null;
}

export interface SignGuestbookInput extends SignGuestbookRequest {
  optimisticUser?: GuestbookOptimisticUser;
}

export interface SignGuestbookResponse {
  post: GuestbookPost;
  message: string;
}

export type EligibilityReason = 'ALREADY_SIGNED' | 'NOT_AUTHENTICATED';

export type EligibilityResponse =
  | { eligible: true }
  | { eligible: false; reason: EligibilityReason };

export interface UploadSignatureRequest {
  signature: string;
}

export interface UploadSignatureResponse {
  url: string;
}

export type ApiErrorCode =
  | 'ALREADY_SIGNED'
  | 'INVALID_CURSOR'
  | 'INVALID_INPUT'
  | 'INTERNAL_ERROR'
  | 'UNAUTHORIZED'
  | 'UPLOAD_FAILED';

export interface ApiError<Code extends ApiErrorCode = ApiErrorCode> {
  error: Code;
  message: string;
}
