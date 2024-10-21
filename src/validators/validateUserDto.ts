import { ValidateError } from '../errors/validateError';
import { User } from '../types/user.type';

export function validateUserDto(dto: object) {
  const errors: string[] = [];

  if (!('username' in dto)) {
    errors.push('username field is missing');
  } else if (typeof dto.username !== 'string') {
    errors.push('username must be a string');
  } else if (dto.username.length < 1) {
    errors.push('username length must be more than 1');
  }

  if (!('age' in dto)) {
    errors.push('age field is missing');
  } else if (typeof dto.age !== 'number') {
    errors.push('age must be a number');
  } else if (dto.age < 0) {
    errors.push('age cannot be a negative number');
  }

  if (!('hobbies' in dto)) {
    errors.push('hobbies field is missing');
  } else if (
    !Array.isArray(dto.hobbies) ||
    !dto.hobbies.every((hobby) => typeof hobby === 'string' && hobby.length > 0)
  ) {
    errors.push('hobbies must be an array of strings');
  }

  if (!!errors.length) {
    throw new ValidateError(errors);
  }

  return dto as Omit<User, 'id'>;
}
