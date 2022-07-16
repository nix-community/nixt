import fs from 'fs';


export function dirFiles(path: string, recurse = false) {
  // if path doesn't exist return empty array
  if (!fs.existsSync(path)) {
    return [];
  }

  const stats = fs.statSync(path);

  // if path is filename, return it as a single-element array
  if (stats.isFile()) {
    return [path];
  }

  // if path is a directory, return all files in it
  if (stats.isDirectory()) {
    const read =
      fs.readdirSync(path)
        .map(file => `${path}/${file}`);

    let files = read
      .filter(file => fs.statSync(file).isFile());

    const dirs = read
      .filter(file => fs.statSync(file).isDirectory());

    if (recurse && dirs.length > 0) {
      const newFiles = dirs.map(dir => dirFiles(dir, true)).flat();
      files = files.concat(newFiles);
    }

    return files;
  }

  return [];
}
