import { InvalidInputError } from '../errors/InvalidInputError.js';
import { EOL, cpus, homedir, userInfo, arch } from 'node:os';

function getCpusInfo() {
  const cores = cpus();
  let result = `Total count of cpu: ${cores.length}${EOL}`;
  cores.forEach((core, i) => {
    result += `Cpu #${i + 1}, Model: ${core.model}, Clock Rate: ${
      core.speed / 1000
    }GHz${EOL}`;
  });
  return result;
}

export default async function ({ args }) {
  if (!args.length) {
    throw new InvalidInputError();
  }

  const [arg] = args;

  const methods = {
    ['--EOL']: () => JSON.stringify(EOL),
    ['--cpus']: getCpusInfo,
    ['--homedir']: homedir,
    ['--username']: () => userInfo().username,
    ['--architecture']: arch,
  };

  if (!Object.keys(methods).includes(arg)) {
    throw new InvalidInputError();
  }

  console.log(methods[arg]());
}
