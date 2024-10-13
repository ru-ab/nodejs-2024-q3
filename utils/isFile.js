import { lstat } from 'node:fs/promises';

export async function isFile(filePath) {
  const stat = await lstat(filePath);
  return stat.isFile();
}
