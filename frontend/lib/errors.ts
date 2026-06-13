export type ErrorCode =
  | 'NOT_AUTHENTICATED'
  | 'INVALID_TOKEN'
  | 'NOT_INSTALLED'
  | 'USER_NOT_FOUND'
  | 'FETCH_REPOS_FAILED'
  | 'INTERNAL_ERROR'
  | 'MISSING_PARAMS'
  | 'RATE_LIMIT'
  | 'START_ROAST_FAILED'
  | 'NOT_FOUND'
  | 'FORBIDDEN'
  | 'FETCH_ROAST_FAILED'

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  NOT_AUTHENTICATED: 'You are not signed in. Please sign in to continue.',
  INVALID_TOKEN: 'Your session has expired. Please sign in again.',
  NOT_INSTALLED: 'GitHub App is not installed. Connect a repo to get started.',
  USER_NOT_FOUND: 'Account not found. Please sign in again.',
  FETCH_REPOS_FAILED: 'Failed to load your repositories. Try refreshing the page.',
  INTERNAL_ERROR: 'Something went wrong on our end. Try again later.',
  MISSING_PARAMS: 'Oops, some details to carry out this task is missing',
  RATE_LIMIT: 'You\'ve hit the daily rate limit, kindly try again later!',
  START_ROAST_FAILED: 'An error occured, while trying to initialize your roasting session',
  NOT_FOUND: 'Resource not found!',
  FORBIDDEN: 'You are not allowed to carry out this operation',
  FETCH_ROAST_FAILED: 'Failed to load your roasts. Try refreshing the page'
};

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: ErrorCode | string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  get userMessage(): string {
    return ERROR_MESSAGES[this.code as ErrorCode] ?? this.message;
  }
}
