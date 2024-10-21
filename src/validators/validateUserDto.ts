import { ValidateError } from '../errors/validateError';
import { User } from '../types/user.type';

export function validateUserDto(dto: object) {
  const errors: string[] = [];

  if (!('username' in dto)) {
    errors.push('username field is missing');
  } else if (typeof dto.username !== 'string') {
    errors.push('username must be a string');
  }

  if (!('age' in dto)) {
    errors.push('age field is missing');
  } else if (typeof dto.age !== 'number') {
    errors.push('age must be a number');
  }

  if (!('hobbies' in dto)) {
    errors.push('hobbies field is missing');
  } else if (
    !Array.isArray(dto.hobbies) ||
    !dto.hobbies.every((hobby) => typeof hobby === 'string')
  ) {
    errors.push('hobbies must be an array of strings');
  }

  if (!!errors.length) {
    throw new ValidateError(errors);
  }

  return dto as Omit<User, 'id'>;
}
