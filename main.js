import { homedir } from 'node:os';
import { join } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { InvalidInputError } from './errors/InvalidInputError.js';
import { getArg } from './utils/getArg.js';
import { isPathExists } from './utils/isPathExists.js';
import { parseCommandArgs } from './utils/parseCommandArgs.js';
import { pathToFileURL } from 'node:url';

process.chdir(homedir());

const state = {
  username: getArg('--username'),
};

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> ',
});

rl.output.write(`Welcome to the File Manager, ${state.username}!\n`);
rl.output.write(`You are currently in ${process.cwd()}\n`);
rl.prompt();
handleInput();

rl.on('close', () => {
  rl.output.write(
    `Thank you for using File Manager, ${state.username}, goodbye!\n`
  );
});

async function handleInput() {
  for await (const line of rl) {
    switch (line.trim()) {
      case '': {
        rl.prompt();
        break;
      }
      case '.exit': {
        rl.close();
        break;
      }
      default: {
        try {
          const [commandName, ...args] = line.trim().split(' ');

          const commandModulePath = join(
            import.meta.dirname,
            'commands',
            commandName + '.js'
          );

          if (await isPathExists(commandModulePath)) {
            const commandModule = await import(
              pathToFileURL(commandModulePath)
            );
            await commandModule.default({
              args: parseCommandArgs(args.join(' ')),
            });
          } else {
            throw new InvalidInputError();
          }
        } catch (error) {
          if (error instanceof InvalidInputError) {
            rl.output.write('Invalid input\n');
          } else {
            rl.output.write('Operation failed\n');
          }
        } finally {
          rl.output.write(`You are currently in ${process.cwd()}\n`);
          rl.prompt();
        }
      }
    }
  }
}
