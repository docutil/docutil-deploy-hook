import path from 'path';
import { $ } from 'zx';

export async function clone(repoUrl, dest) {
  const cloned = await $`git clone ${repoUrl} --depth=1 ${dest}`.exitCode;

  if (cloned !== 0) {
    throw new Error('clone repo failed');
  }
}

async function cleanDotFiles(dir) {
  await $`test -d .git && rm -rf .git`;

  const fileList = await $`find ${dir} -type f`;
  const removes = fileList.stdout
    .split('\n')
    .map(it => `${it || ''}`.trim())
    .map(it => {
      return {
        basename: path.basename(it),
        path: it,
      };
    })
    .filter(it => it.basename.startsWith('.'))
    .map(it => $`rm ${it.path}`);

  return Promise.all(removes);
}

async function emptyDir(path) {
  const _path = `${path || ''}`;
  if (!_path) {
    throw new Error('emptyDir failed, require a path');
  }

  if (_path === '/') {
    throw new Error('emptyDir failed, not allowed');
  }

  return $`rm -rf ${path}`;
}

export async function install(installPath) {
  await cleanDotFiles('.');
  await emptyDir(`${installPath}/*`);
  await $`cp -af * ${installPath}`;
}
