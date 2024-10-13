import { InvalidInputError } from '../errors/InvalidInputError.js';

export default function ({ args }) {
  if (!args.length) {
    throw new InvalidInputError();
  }

  process.chdir(args[0]);
}
