// Static export for the claude.ai preview. API routes (the admin's server) cannot be exported,
// so app/api is set aside for the build and put back afterwards.
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const API = 'app/api';
const ASIDE = '.api-preview-aside';
fs.renameSync(API, ASIDE);
try {
  execSync('next build', { stdio: 'inherit', env: { ...process.env, PREVIEW_EXPORT: '1' } });
} finally {
  fs.renameSync(ASIDE, API);
}
