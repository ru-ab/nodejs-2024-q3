export default function ({ args }) {
  if (!args.length) {
    return;
  }

  process.chdir(args[0]);
}
