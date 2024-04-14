import fs from "node:fs/promises";
import YAML from "yaml";

export async function readConfig(path) {
	console.log("[CONFIG] using config file: %s", path);
	const doc = await fs.readFile(path, "utf-8");
	return YAML.parse(doc);
}
