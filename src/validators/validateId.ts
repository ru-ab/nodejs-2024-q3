import { validate as uuidValidate } from 'uuid';
import { ValidateError } from '../errors/validateError';

export function validateId(id: string) {
  if (!uuidValidate(id)) {
    throw new ValidateError(['id must be a valid UUID string']);
  }

  return id;
}
