import { rm } from 'node:fs/promises';
import cp from './cp.js';

export default async function (params) {
  await cp(params);

  const [pathToFile] = params.args;

  await rm(pathToFile);
}
