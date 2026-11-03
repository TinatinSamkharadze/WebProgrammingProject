const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const ASSET_DIRS = ['css', 'js', 'images'];

const htmlFiles = fs.readdirSync(ROOT).filter((f) => f.endsWith('.html'));

function existsExactCase(relativePath) {
    let current = ROOT;
    for (const part of relativePath.split('/').filter((p) => p && p !== '.')) {
        if (!fs.existsSync(current) || !fs.statSync(current).isDirectory()) return false;
        if (!fs.readdirSync(current).includes(part)) return false;
        current = path.join(current, part);
    }
    return true;
}

function findBrokenReferences(htmlFile) {
    const html = fs.readFileSync(path.join(ROOT, htmlFile), 'utf8');
    const refs = [...html.matchAll(/(?:src|href)\s*=\s*"([^"]+)"/g)].map((m) => m[1]);

    return refs
        .filter((ref) => !/^(https?:|mailto:|tel:|#|\/\/)/.test(ref) && !ref.includes('${'))
        .map((ref) => ref.split(/[?#]/)[0])
        .filter((ref) => ref && !existsExactCase(ref));
}

const broken = htmlFiles.flatMap((file) =>
    findBrokenReferences(file).map((ref) => `${file} -> ${ref}`)
);

if (broken.length > 0) {
    console.error('Build failed: missing local files referenced in HTML:');
    broken.forEach((b) => console.error(`  - ${b}`));
    process.exit(1);
}

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST);

htmlFiles.forEach((file) => fs.copyFileSync(path.join(ROOT, file), path.join(DIST, file)));
ASSET_DIRS.forEach((dir) => fs.cpSync(path.join(ROOT, dir), path.join(DIST, dir), { recursive: true }));

console.log(`Build succeeded: ${htmlFiles.length} pages and ${ASSET_DIRS.join(', ')} copied to dist/`);
