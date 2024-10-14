export function parseCommandArgs(input) {
  if (!input) {
    return [];
  }

  const regex = /("([^"\\]|\\.)*"|'([^'\\]|\\.)*'|(?:\\\s|[^\s])+)/g;

  return input
    .match(regex)
    .map((arg) => arg.replace(/\\\s/g, ' ').replace(/^["']|["']$/g, ''));
}
