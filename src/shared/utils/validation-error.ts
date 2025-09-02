export class ValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super('Validation failed');
    this.name = 'ValidationError';
  }
}
