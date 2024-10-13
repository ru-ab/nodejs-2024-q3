import { rename } from 'node:fs/promises';
import { InvalidInputError } from '../errors/InvalidInputError.js';

export default async function ({ args }) {
  if (args.length < 2) {
    throw new InvalidInputError();
  }

  const [pathToFile, newName] = args;

  await rename(pathToFile, newName);
}
