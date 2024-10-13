import { rm } from 'node:fs/promises';
import { InvalidInputError } from '../errors/InvalidInputError.js';
import { isFile } from '../utils/isFile.js';
import { isPathExists } from '../utils/isPathExists.js';

export default async function ({ args }) {
  if (!args.length) {
    throw new InvalidInputError();
  }

  const [pathToFile] = args;

  if (!(await isPathExists(pathToFile)) || !(await isFile(pathToFile))) {
    throw new InvalidInputError();
  }

  await rm(pathToFile);
}
