import fs from 'fs-extra';
import http from 'http';
import os from 'os';
import path from 'path';
import { cd } from 'zx';
import { getConfig } from './config';
import { clone, install } from './deploy';

async function runHook(CONFIG, siteName, authToken) {
  const siteConfig = CONFIG.sites.find(it => it.id === siteName);
  if (!siteConfig) {
    throw new Error('unknown site');
  }

  const { repo_url, install_dir, auth_token } = siteConfig || {};
  if (authToken !== auth_token) {
    throw new Error('auth failed');
  }

  const dest = await fs.mkdtemp(path.join(os.tmpdir(), 'docutil_deploy-'));
  cd(dest);

  await clone(repo_url, '.');
  await install(install_dir);
}

!(async () => {
  const CONFIG = await getConfig();
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (!url.pathname.startsWith('/docutil-deploy')) {
      res.writeHead(404);
      res.end('notfound');
      return;
    }

    const siteName = url.searchParams.get('site');
    const token = url.searchParams.get('token');

    console.log(`[REQ] url = %s`, url);
    console.log(`[REQ] siteName = %s, token = %s`, siteName, token);

    setTimeout(async () => {
      try {
        console.log(`==== begin run hook ====`);
        await runHook(CONFIG, siteName, token);
      } catch (err) {
        console.warn(err);
      } finally {
        console.log('==== run hook completed ====');
      }
    }, 0);

    res.end('ok');
  });

  server.listen(CONFIG.port, () => {
    console.log(`service start at :${CONFIG.port}`);
  });
})();
