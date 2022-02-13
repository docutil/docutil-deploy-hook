import fs from 'fs-extra';
import YAML from 'js-yaml';

export async function readConfig(path) {
  console.log('[CONFIG] using config file: %s', path);

  const contents = await fs.readFile(path);
  return YAML.load(contents);
}
