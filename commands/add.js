import { createWriteStream } from 'node:fs';
import { InvalidInputError } from '../errors/InvalidInputError.js';

export default async function ({ args }) {
  if (!args.length) {
    throw new InvalidInputError();
  }

  const ws = createWriteStream(args[0]);
  ws.write('');
  ws.close();
}
