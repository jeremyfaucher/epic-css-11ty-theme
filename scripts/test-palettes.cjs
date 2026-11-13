const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const sass = require('sass');
const postcss = require('postcss');
const CleanCSS = require('clean-css');
const Eleventy = require('@11ty/eleventy');

const root = path.resolve(__dirname, '..');
const loadPaths = [path.join(root, 'src/my-epic-css')];
const compile = name => sass.compileString(`$palette-name: "${name}"; @import "index";`, { loadPaths, logger: sass.Logger.silent }).css;
function declarations(css, selector) {
  const values = {};
  postcss.parse(css).walkRules(selector, rule => rule.walkDecls(d => { values[d.prop] = d.value; }));
  return values;
}
function luminance(hex) {
  const channels = hex.slice(1).match(/../g).map(c => parseInt(c, 16) / 255)
    .map(c => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4);
  return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
}
async function main() {
  process.chdir(root);
  const custom = path.join(root, 'src/my-epic-css/_custom.scss');
  const original = fs.readFileSync(custom, 'utf8');
  const roles = ['body', 'body-bg', 'primary', 'primary-light', 'primary-bg', 'secondary', 'secondary-bg', 'white'];
  assert.throws(() => compile('Unknown'), /Unknown palette.*Choose Harbor, Dusk or Neon/);
  let count = 0;
  for (const [name, background] of [['Harbor', '#0f172a'], ['Dusk', '#201f2b'], ['Neon', '#000000']]) {
    const css = compile(name);
    assert(!css.includes('data-theme'), name + ': no runtime mode CSS');
    const values = declarations(css, ':root');
    for (const role of roles) assert.match(values[`--clr-${role}`], /^#[a-f0-9]{6}$/i);
    assert.equal(values['--clr-body-bg'], background);
    assert.equal(values['--clr-white'], '#ffffff');
    assert.equal(declarations(css, '.container')['max-width'], '1060px');
    assert.match(declarations(css, 'body').color, /^var\(--clr-body,/);
    assert.match(declarations(css, '.clr-primary').color, /^var\(--clr-primary,/);
    for (const text of ['body', 'primary', 'primary-light', 'secondary']) {
      for (const surface of ['body-bg', 'primary-bg', 'secondary-bg']) {
        const pair = [luminance(values[`--clr-${text}`]), luminance(values[`--clr-${surface}`])].sort((a, b) => a - b);
        assert((pair[1] + .05) / (pair[0] + .05) >= 4.5, `${name}: ${text} on ${surface}`);
      }
    }
    const minified = new CleanCSS({}).minify(css);
    assert.equal(minified.errors.length, 0);
    const temporary = fs.mkdtempSync(path.join(root, '.palette-check-'));
    try {
      // Test the compiled stylesheet in real template builds without editing the
      // active CSS/selector or racing the user's ongoing Sass sync listener.
      const site = new Eleventy('src', path.relative(root, temporary).replaceAll('\\', '/'), {
        quietMode: true,
        config(config) {
          config.addTransform('palette-test-css', function(content) {
            if (this.outputPath?.endsWith('.html')) return content.replace(/<style>[\s\S]*?<\/style>/, `<style>${minified.styles}</style>`);
            return content;
          });
        }
      });
      const pages = await site.toJSON();
      assert.equal(pages.length, 15);
      for (const page of pages) if (page.outputPath) fs.mkdirSync(path.dirname(page.outputPath), { recursive: true });
      // Pre-create passthrough directories too: concurrent recursive mkdir calls
      // in Eleventy 2 can otherwise race on Windows.
      function prepareDirectories(source, target) {
        if (!fs.existsSync(source)) return;
        fs.mkdirSync(target, { recursive: true });
        for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
          if (entry.isDirectory()) prepareDirectories(path.join(source, entry.name), path.join(target, entry.name));
        }
      }
      for (const folder of ['assets', '.well-known']) prepareDirectories(path.join(root, 'src', folder), path.join(temporary, folder));
      await site.write();
      for (const page of pages) {
        if (!page.outputPath) continue;
        const content = fs.readFileSync(page.outputPath, 'utf8');
        assert(!/<html[^>]+data-theme|data-theme-toggle|localStorage|epic-css-theme/.test(content), name + ': no runtime theme UI/script');
        if (content.includes('<style>')) assert(content.includes(`<style>${minified.styles}</style>`), name + ': compiled palette embedded');
      }
      count += pages.length;
    } finally {
      assert.equal(path.dirname(path.resolve(temporary)), root);
      assert(path.basename(temporary).startsWith('.palette-check-'));
      fs.rmSync(temporary, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
    }
  }
  assert.equal(fs.readFileSync(custom, 'utf8'), original, 'Tests preserve the active selection');
  console.log(`Static palettes: Harbor/Dusk/Neon; ${count} rendered outputs; 36 semantic contrast pairs >=4.5; 1060px container, fixed white, Sass error and no runtime mode/UI checks passed.`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
