import YAML from 'js-yaml';
import fs from 'fs-extra';

export async function getConfig() {
  const contents = await fs.readFile('./site.config.yml');
  return YAML.load(contents);
}
