import fs from 'node:fs/promises';

export async function readConfig(path) {
  console.log('[CONFIG] using config file: %s', path);
  const doc = await fs.readFile(path, 'utf-8');
  return JSON.parse(doc);
}
