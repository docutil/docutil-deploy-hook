import fs from "node:fs/promises";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { parseArgs } from "node:util";
import { cd } from "zx";

import { readConfig } from "./config";
import { clone, install } from "./deploy";
import { JOBS } from "./jobs";
import { VERSION } from "./version";

async function runHook(config, siteName, authToken) {
	const siteConfig = config.sites.find((it) => it.id === siteName);
	if (!siteConfig) {
		throw new Error("unknown site");
	}

	const { repo_url, install_dir, auth_token } = siteConfig || {};
	if (authToken !== auth_token) {
		throw new Error("auth failed");
	}

	const dest = await fs.mkdtemp(path.join(os.tmpdir(), "docutil_deploy-"));
	cd(dest);

	await clone(repo_url, ".");
	await install(install_dir);
}

function printVersionAndExit() {
	console.log(VERSION || "no_set");
	process.exit(0);
}

function printHelpAndExit() {
	console.log(`docutil-deploy service, flags:
\t-v, --version: show version
\t-c, --config <config.yml>: set config file, if no parents, it will be './docutil-deploy.config.yml' as default
\t-h, --help: show help`);

	process.exit(0);
}

const { values: cliFlags } = parseArgs({
	args: process.argv,
	strict: true,
  allowPositionals: true,
	options: {
		help: {
			type: "boolean",
			short: "h",
			default: false,
		},
		version: {
			type: "boolean",
			short: "v",
			default: false,
		},
		config: {
			type: "string",
			short: "c",
			default: "docutil-deploy.config.yml",
		},
	},
});

if (cliFlags.version) {
	printVersionAndExit();
}

if (cliFlags.help) {
	printHelpAndExit();
}

const CONFIG = await readConfig(cliFlags.config);

const server = http.createServer(async (req, res) => {
	console.log("[HTTP] handle request");

	const url = new URL(req.url, `http://${req.headers.host}`);

	if (!url.pathname.startsWith("/docutil-deploy")) {
		res.writeHead(404);
		res.end("notfound");
		return;
	}

	const siteName = url.searchParams.get("site");
	const token = url.searchParams.get("token");

	console.log("[HTTP] get url = %s", url);
	console.log(
		"[HTTP] get search parameters: siteName = %s, token = %s",
		siteName,
		token,
	);

	setTimeout(() => {
		const createJob = async () => {
			try {
				console.log("[HANDLER] ==== begin run hook ====");
				await runHook(CONFIG, siteName, token);
			} catch (err) {
				console.warn("[HANDLER] error: %s", err);
			} finally {
				console.log("[HANDLER] ==== run hook completed ====");
			}
		};

		JOBS.add(createJob, siteName);
	}, 0);

	res.end("ok");
});

server.listen(CONFIG.port, CONFIG.host, () => {
	console.log("[HTTP] server start at %s:%d", CONFIG.host, CONFIG.port);
});
