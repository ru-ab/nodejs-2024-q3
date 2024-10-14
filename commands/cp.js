import { createReadStream, createWriteStream } from 'node:fs';
import { join, parse } from 'node:path';
import { InvalidInputError } from '../errors/InvalidInputError.js';

export default async function ({ args }) {
  if (args.length < 2) {
    throw new InvalidInputError();
  }

  const [pathToFile, newDirPath] = args;

  const { base: filename } = parse(pathToFile);
  const rs = createReadStream(pathToFile);
  const ws = createWriteStream(join(newDirPath, filename));

  await new Promise((resolve, reject) => {
    rs.on('data', (chunk) => ws.write(chunk));
    rs.on('end', resolve);
    rs.on('error', reject);
    ws.on('error', reject);
  });
}
