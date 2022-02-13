import fs from 'fs-extra';
import http from 'http';
import parseFlags from 'minimist';
import os from 'os';
import path from 'path';
import { cd } from 'zx';
import { readConfig } from './config';
import { clone, install } from './deploy';
import { JOBS } from './jobs';
import { VERSION } from './version';

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

function printVersionAndExit() {
  console.log(VERSION || 'no_set');
  process.exit(0);
}

function printHelpAndExit() {
  console.log(`docutil-deploy service, flags:
  -v, --version: show version
  -c, --config <config.yml>: set config file, if no parents, it will be './docutil-deploy.config.yml' as default`);

  process.exit(0);
}

!(async () => {
  const argv = parseFlags(process.argv.slice(2));

  if (argv.version || argv.v) {
    printVersionAndExit();
  }

  if (argv.help || argv.h) {
    printHelpAndExit();
  }

  const configFile = argv.config || argv.c || 'docutil-deploy.config.yml';
  const CONFIG = await readConfig(configFile);

  const server = http.createServer(async (req, res) => {
    console.log('[HTTP] handle request');

    const url = new URL(req.url, `http://${req.headers.host}`);

    if (!url.pathname.startsWith('/docutil-deploy')) {
      res.writeHead(404);
      res.end('notfound');
      return;
    }

    const siteName = url.searchParams.get('site');
    const token = url.searchParams.get('token');

    console.log(`[HTTP] get url = %s`, url);
    console.log(`[HTTP] get search parameters: siteName = %s, token = %s`, siteName, token);

    setTimeout(() => {
      JOBS.add(async () => {
        try {
          console.log(`[HANDLER] ==== begin run hook ====`);
          await runHook(CONFIG, siteName, token);
        } catch (err) {
          console.warn('[HANDLER] error: %s', err);
        } finally {
          console.log('[HANDLER] ==== run hook completed ====');
        }
      });
    }, 0);

    res.end('ok');
  });

  server.listen(CONFIG.port, CONFIG.host, () => {
    console.log('[HTTP] server start at %s:%d', CONFIG.host, CONFIG.port);
  });
})();
