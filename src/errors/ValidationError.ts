import { AppError } from './AppError';

export class ValidationError extends AppError {
  public readonly errors: any[];

  constructor(errors: any[]) {
    super('Validation Error', 400, true);
    this.errors = errors;
  }
}