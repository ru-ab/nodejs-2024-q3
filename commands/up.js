import { join } from 'node:path';

export default function ({ state }) {
  state.cwd = join(state.cwd, '..');
}
