// Builds the static copy used for the claude.ai preview Artifact:
//   PREVIEW_EXPORT=1 next build  ->  out/  ->  preview/ (relative paths, Artifact-safe names)
// The Artifact host reserves names starting with "_" and does not serve the site from its root,
// so _next/ becomes nx/ and every root path becomes relative to the page that uses it.
import fs from 'node:fs';
import path from 'node:path';

const src = path.resolve('out');
const dst = path.resolve(process.argv[2] || 'preview');
fs.rmSync(dst, { recursive: true, force: true });
fs.cpSync(src, dst, { recursive: true });
fs.renameSync(path.join(dst, '_next'), path.join(dst, 'nx'));

// The webpack runtime loads chunks from its public path; work it out from the runtime's own URL
const PUBLIC_PATH =
  '(function(){var s=document.querySelector(\'script[src*="nx/static/chunks/webpack-"]\');return s?s.src.replace(/static\\/chunks\\/.*$/,""):"nx/"})()';

const files = [];
(function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const file = path.join(dir, name);
    if (fs.statSync(file).isDirectory()) walk(file);
    else files.push(path.relative(dst, file));
  }
})(dst);

for (const rel of files) {
  const file = path.join(dst, rel);
  const depth = rel.split(path.sep).length - 1;
  const prefix = depth ? '../'.repeat(depth) : './';
  let s;
  if (/\.(html|txt)$/.test(rel)) {
    s = fs.readFileSync(file, 'utf8').replaceAll('__ROOT__/', prefix).replaceAll('/_next/', prefix + 'nx/');
    s = s.replace(/(href|src)="\/icon\.svg/g, `$1="${prefix}icon.svg`);
  } else if (rel.endsWith('.css')) {
    s = fs.readFileSync(file, 'utf8').replaceAll('/_next/static/media/', '../media/');
  } else if (rel.endsWith('.js')) {
    s = fs.readFileSync(file, 'utf8');
    if (/\/webpack-[\w]+\.js$/.test(rel)) s = s.replace('"/_next/"', PUBLIC_PATH);
    // The Artifact host rejects U+FFFD; it only occurs inside string literals here
    s = s.replaceAll('"�"', '"\\ufffd"');
  } else continue;
  fs.writeFileSync(file, s);
}

const publish = files.filter((f) => f !== 'index.html' && !f.startsWith('404') && !f.startsWith('_not-found'));
fs.writeFileSync(path.join(dst, '..', 'preview-files.json'), JSON.stringify(publish, null, 0));
console.log(`preview ready: ${dst} (${publish.length} files besides index.html)`);
