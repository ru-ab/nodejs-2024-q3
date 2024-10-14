import { createReadStream, createWriteStream } from 'node:fs';
import { join, parse } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { InvalidInputError } from '../errors/InvalidInputError.js';

export default async function ({ args }) {
  if (args.length < 2) {
    throw new InvalidInputError();
  }

  const [pathToFile, newDirPath] = args;

  const { base: filename } = parse(pathToFile);
  const rs = createReadStream(pathToFile);
  const ws = createWriteStream(join(newDirPath, filename));

  await pipeline(rs, ws);
}
