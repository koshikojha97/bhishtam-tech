/** Throw from controllers/services to send a specific status; anything else becomes a 500. */
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
  }
}
