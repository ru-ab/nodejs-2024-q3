import { createWriteStream } from 'node:fs';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { InvalidInputError } from '../errors/InvalidInputError.js';

export default async function ({ args }) {
  if (!args.length) {
    throw new InvalidInputError();
  }

  const rs = Readable.from([]);
  const ws = createWriteStream(args[0]);

  await pipeline(rs, ws);
}
