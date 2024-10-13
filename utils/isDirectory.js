import { lstat } from 'node:fs/promises';

export async function isDirectory(filePath) {
  const stat = await lstat(filePath);
  return stat.isDirectory();
}
