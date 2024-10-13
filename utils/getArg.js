export function getArg(argName) {
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; ++i) {
    if (args[i].startsWith(`${argName}=`)) {
      return args[i].split('=')[1];
    }
  }

  return '';
}
