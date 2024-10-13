import { homedir } from 'node:os';
import { join } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { getArg } from './utils/getArg.js';
import { isPathExists } from './utils/isPathExists.js';

const state = {
  cwd: homedir(),
  username: getArg('--username') || 'Anonymous',
};

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> ',
});

rl.output.write(`Welcome to the File Manager, ${state.username}!\n`);
rl.output.write(`You are currently in ${state.cwd}\n`);
rl.prompt();
handleInput();

rl.on('close', () => {
  rl.output.write(
    `Thank you for using File Manager, ${state.username}, goodbye!\n`
  );
});

async function handleInput() {
  for await (const line of rl) {
    switch (line) {
      case '.exit': {
        return rl.close();
      }
      default: {
        try {
          const commandModulePath = join(
            import.meta.dirname,
            'commands',
            line + '.js'
          );

          if (await isPathExists(commandModulePath)) {
            const commandModule = await import(commandModulePath);
            await commandModule.default({ state });
            rl.prompt();
          } else {
            rl.output.write('Invalid input\n');
            rl.prompt();
          }
        } catch {
          rl.output.write('Operation failed');
        }
      }
    }
  }
}
