import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { InvalidInputError } from '../errors/InvalidInputError.js';

export default async function ({ args }) {
  if (!args.length) {
    throw new InvalidInputError();
  }

  const [pathToFile] = args;

  const hash = createHash('sha256');
  const input = createReadStream(pathToFile);

  await new Promise((resolve, reject) => {
    input
      .pipe(hash)
      .setEncoding('hex')
      .on('data', (chunk) => process.stdout.write(chunk + '\n'));

    input.on('end', resolve);
    input.on('error', reject);
  });
}
