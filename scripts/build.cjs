// Full Sass -> installed Epic filter -> Eleventy. No publishing or deployment.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const sass = require('sass');
const postcss = require('postcss');
const Eleventy = require('@11ty/eleventy');

async function main() {
  process.chdir(path.resolve(__dirname, '..'));
  const check = process.argv.includes('--check');
  assert.ok(process.argv.slice(2).every(arg => arg === '--check'), 'Use --check or no arguments');
  const config = require('../epicConfig');
  const prelight = path.resolve(config.epicThemeDir, 'pre-light.css');
  const include = path.resolve(config.projectStyleDir, config.outputFileName);
  assert.notEqual(prelight, include, 'Full and filtered CSS paths must differ');
  const saved = new Map([prelight, include].map(file =>
    [file, fs.existsSync(file) ? fs.readFileSync(file) : null]));
  const output = check ? fs.mkdtempSync(path.resolve('.epic-check-')) : path.resolve('_site');
  try {
    const full = sass.compile(path.join(config.epicThemeDir, 'index.scss')).css;
    assert.ok(full.trim(), 'Sass output is empty');
    fs.mkdirSync(path.dirname(prelight), { recursive: true });
    fs.mkdirSync(path.dirname(include), { recursive: true });
    fs.writeFileSync(prelight, full);
    // Run the installed filter in a child so each run reads fresh config/content.
    const filtered = spawnSync(process.execPath, [require.resolve('epic-css/src/epic-light.js')],
      { encoding: 'utf8' });
    if (filtered.error) throw filtered.error;
    assert.equal(filtered.status, 0, filtered.stderr || filtered.stdout);
    const css = fs.readFileSync(include, 'utf8');
    assert.ok(css.trim(), 'Filtered CSS is empty');
    postcss.parse(css);

    // Eleventy 2's passthrough containment check expects relative Windows paths.
    const site = new Eleventy('src', path.relative(process.cwd(), output).replaceAll('\\', '/'), { quietMode: true });
    const pages = await site.toJSON();
    assert.ok(pages.length, 'Eleventy rendered no pages');
    // Eleventy 2 writes siblings concurrently. Pre-create their shared parents
    // serially to avoid Windows EPERM from concurrent recursive mkdir calls.
    for (const page of pages) {
      if (page.outputPath) fs.mkdirSync(path.dirname(page.outputPath), { recursive: true });
    }
    await site.write();
    for (const page of pages) {
      if (page.outputPath) assert.ok(fs.existsSync(page.outputPath), `Missing ${page.outputPath}`);
    }
    console.log(`${check ? 'Validated' : 'Built'} ${pages.length} pages; CSS ${full.length} -> ${css.length} characters.`);
  } finally {
    if (check) {
      for (const [file, bytes] of saved) {
        if (bytes === null) { if (fs.existsSync(file)) fs.unlinkSync(file); }
        else fs.writeFileSync(file, bytes);
      }
      // output is a unique directory created above inside this project.
      fs.rmSync(output, { recursive: true, force: true });
    }
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
