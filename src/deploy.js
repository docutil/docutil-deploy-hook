import { $ } from 'zx';

export async function clone(repoUrl, dest) {
  const cloned = await $`git clone ${repoUrl} --depth=1 ${dest}`.exitCode;

  if (cloned !== 0) {
    throw new Error('clone repo failed');
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
  await cleanDotFiles('.');
  await emptyDir(installPath);
  await $`cp -af * ${installPath}`;
}
