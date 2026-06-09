export type ErrorCode =
  | 'NOT_AUTHENTICATED'
  | 'INVALID_TOKEN'
  | 'NOT_INSTALLED'
  | 'USER_NOT_FOUND'
  | 'FETCH_REPOS_FAILED'
  | 'INTERNAL_ERROR';

export class AppError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: ErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}
