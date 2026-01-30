import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const packageJsonPath = path.join(projectRoot, 'package.json');
const buildMetaPath = path.join(projectRoot, 'src', 'config', 'buildMeta.ts');

const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
const version = pkg.version || '0.0.0';
const lastUpdated = new Date().toISOString().split('T')[0];

const file = fs.readFileSync(buildMetaPath, 'utf-8');

const updated = file
  .replace(/export const APP_VERSION = '.*?';/, `export const APP_VERSION = '${version}';`)
  .replace(/export const LAST_UPDATED = '.*?';/, `export const LAST_UPDATED = '${lastUpdated}';`);

if (updated !== file) {
  fs.writeFileSync(buildMetaPath, updated, 'utf-8');
}
