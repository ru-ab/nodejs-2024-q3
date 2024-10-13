import { createReadStream, createWriteStream } from 'node:fs';
import { join, parse } from 'node:path';
import { InvalidInputError } from '../errors/InvalidInputError.js';
import { isDirectory } from '../utils/isDirectory.js';
import { isFile } from '../utils/isFile.js';
import { isPathExists } from '../utils/isPathExists.js';

export default async function ({ args }) {
  if (args.length < 2) {
    throw new InvalidInputError();
  }

  const [pathToFile, newDirPath] = args;

  if (!(await isPathExists(pathToFile)) || !(await isPathExists(newDirPath))) {
    throw new InvalidInputError();
  }

  if (!(await isFile(pathToFile))) {
    throw new InvalidInputError();
  }

  if (!(await isDirectory(newDirPath))) {
    throw new InvalidInputError();
  }

  const { base: filename } = parse(pathToFile);

  const rs = createReadStream(pathToFile);
  const ws = createWriteStream(join(newDirPath, filename));

  await new Promise((resolve, reject) => {
    rs.on('data', (chunk) => ws.write(chunk));
    rs.on('end', resolve);
    rs.on('error', reject);
  });
}
