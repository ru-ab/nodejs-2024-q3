export class ValidateError extends Error {
  constructor(messages: string[]) {
    super(messages.join(', '));
  }
}
