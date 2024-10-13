import { readdir } from 'node:fs/promises';

function sort(table) {
  const sortedTable = [...table];
  sortedTable.sort((a, b) => (a.Name.localeCompare(b.Name) ? 1 : -1));
  return sortedTable;
}

export default async function () {
  const files = await readdir(process.cwd(), { withFileTypes: true });

  const folderTable = [];
  const fileTable = [];

  files.forEach((file) => {
    if (file.isDirectory()) {
      folderTable.push({
        Name: file.name,
        Type: 'directory',
      });
    } else {
      fileTable.push({
        Name: file.name,
        Type: 'file',
      });
    }
  });

  console.table([...sort(folderTable), ...sort(fileTable)]);
}
