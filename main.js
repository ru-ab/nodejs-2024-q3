import { homedir } from 'node:os';
import { join } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { getArg } from './utils/getArg.js';
import { isPathExists } from './utils/isPathExists.js';

process.chdir(homedir());

const state = {
  username: getArg('--username') || 'Anonymous',
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
            const commandModule = await import(commandModulePath);
            await commandModule.default({ state, args });
          } else {
            rl.output.write('Invalid input\n');
          }

          rl.output.write(`You are currently in ${process.cwd()}\n`);
        } catch {
          rl.output.write('Operation failed\n');
        } finally {
          rl.prompt();
        }
      }
    }
  }
}
