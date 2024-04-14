import { $ } from 'bun';

export async function clone(repoUrl, dest) {
  try {
    await $`pwd`
    await $`git clone ${repoUrl} --depth=1 ${dest}`;
  } catch (err) {
    throw new Error(`clone repo failed: ${err}`);
  }
}

function cleanDotFiles(dir) {
  return $`find ${dir} -name '.*' -and -not -name '.' -print -exec rm -rf {} +`;
}

async function emptyDir(path) {
  const _path = `${path || ''}`;
  if (!_path) {
    throw new Error('emptyDir failed, require a path');
  }

  if (_path === '/') {
    throw new Error('emptyDir failed, not allowed');
  }

  await $`rm -rf ${path}`;
  await $`mkdir -p ${path}`;
}

export async function install(installPath) {
  await $`pwd`
  await cleanDotFiles('.');
  await emptyDir(installPath);
  await $`cp -af * ${installPath}`;
}
