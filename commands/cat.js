import { createReadStream } from 'node:fs';

export default async function ({ args }) {
  const rs = createReadStream(args[0]);
  rs.setEncoding('utf8');

  await new Promise((resolve, reject) => {
    rs.on('data', (chunk) => process.stdout.write(chunk + '\n'));
    rs.on('end', resolve);
    rs.on('error', reject);
  });
}
