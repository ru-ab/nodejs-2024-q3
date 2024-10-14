import { createReadStream, createWriteStream } from 'node:fs';
import { createBrotliCompress } from 'node:zlib';
import { InvalidInputError } from '../errors/InvalidInputError.js';
import { pipeline } from 'node:stream/promises';
import { isPathExists } from '../utils/isPathExists.js';

export default async function ({ args }) {
  if (args.length < 2) {
    throw new InvalidInputError();
  }

  const [pathToFile, pathToDestination] = args;

  if (!(await isPathExists(pathToFile))) {
    throw new Error();
  }

  const source = createReadStream(pathToFile);
  const destination = createWriteStream(pathToDestination);
  const compress = createBrotliCompress();

  await pipeline(source, compress, destination);
}
