import { rm } from 'node:fs/promises';
import { InvalidInputError } from '../errors/InvalidInputError.js';

export default async function ({ args }) {
  if (!args.length) {
    throw new InvalidInputError();
  }

  const [pathToFile] = args;

  await rm(pathToFile);
}
