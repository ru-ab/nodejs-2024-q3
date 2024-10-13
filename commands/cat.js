import { createReadStream } from 'node:fs';
import { InvalidInputError } from '../errors/InvalidInputError.js';

export default async function ({ args }) {
  if (!args.length) {
    throw new InvalidInputError();
  }

  const rs = createReadStream(args[0]);
  rs.setEncoding('utf8');

  await new Promise((resolve, reject) => {
    rs.on('data', (chunk) => process.stdout.write(chunk + '\n'));
    rs.on('end', resolve);
    rs.on('error', reject);
  });
}
