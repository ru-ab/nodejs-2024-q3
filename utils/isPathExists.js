import { access, constants } from 'node:fs/promises';

export async function isPathExists(targetPath) {
  try {
    await access(targetPath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}
