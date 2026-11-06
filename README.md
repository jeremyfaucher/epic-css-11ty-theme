# Epic CSS Eleventy starter

This is the starter/blog consumer of the `epic-css` npm library, not the library source or the documentation site. See the [workspace map](../README.md) for shared build/filter behavior, release ownership and hosting uncertainties.

## Install and preview

Run from this directory:

```sh
npm ci
npm start
```

`start` uses npm-run-all to run Eleventy serve and Sass watch together. Follow the printed local URL (normally port 8080). Content lives in `src/index.njk`, `src/about/`, and `src/blog/`; shared page templates are in `src/_includes/`. `.eleventy.js` reads `src` and outputs `_site`. `base.njk` embeds the CSS include after CleanCSS minification.

`package.json` declares `epic-css: ^0.14.0` and Eleventy `^2.0.1`. The local installed library reports `0.14.0`. `src/my-epic-css/index.scss` imports `_custom.scss` first, then the installed library's `src/index.scss`. It does not use the sibling `../epic-css` source automatically.

## Palette ownership

Edit [src/my-epic-css/_custom.scss](src/my-epic-css/_custom.scss). It contains three alternatives:

- Commented teal/indigo light palette: dark text `#1e1e1e`, light background `#f8f8fc`, primary `#00796b`.
- Commented blue/neutral light palette: dark text `#1e1e1e`, background `#f4f6fa`, primary `#0067b8`.
- Active blue/gray dark palette: white text, background `#0f172a`, primary `#4f9eea`.

Comment out all eight assignments of the active palette and uncomment all eight in the desired palette. If multiple assignments are active, the last ordinary Sass assignment wins. If all are commented out, the installed library's defaults apply. These are build-time palettes; there is no browser theme selector.

| Sass variable | Effect in generated CSS |
| --- | --- |
| `$clr-body` | Body/base text and link text; no standalone `.clr-body` utility |
| `$clr-body-bg` | `.clr-body-bg` background, used on the base template body |
| `$clr-primary` | `.clr-primary` text and base link/underline accent states |
| `$clr-primary-light` | `.clr-underline:hover` accent; no standalone `.clr-primary-light` utility |
| `$clr-primary-bg` | `.clr-primary-bg` background |
| `$clr-secondary` | `.clr-secondary` text and code text |
| `$clr-secondary-bg` | `.clr-secondary-bg` background and code/pre backgrounds |
| `$clr-white` | `.clr-white` text |

These classes are explicitly defined by `_colors.scss`; changing a value changes their declarations, not their names or number. Full CSS contains all these utilities; filtered CSS may retain a subset (and may retain extra rules because matching uses substrings). The defaults do not create arbitrary color shades or new class names.

The installed library's color assignments use `!default`, allowing the custom values imported first to survive. **The sibling library source now also uses `!default` color assignments**; its entry point does not import `_custom.scss`. This local fix has not been published or installed into consumers. Test override precedence before upgrading; do not assume identical package versions imply identical local files.

## Small color change and production check

1. Change a palette assignment in `_custom.scss`, for example `$clr-primary`, keeping the rest of that palette consistent.
2. Compile once, then `npm start`. Inspect home, about and blog pages, text/background contrast, links/hover, and code blocks. Palette comments about readability are not contrast measurements.
3. Stop the watchers, then run sequentially:

```sh
npm run build
```

`epic-build` writes full `src/my-epic-css/pre-light.css` and copies it to `src/_includes/style.css`; `epic-light` filters it using source classes and overwrites the include. Eleventy writes `_site`. Preview the resulting pages after filtering too. `build-production` alone does not update CSS; Sass watch can overwrite the filtered include. Re-run `epic-build` to restore full CSS for debugging.

The actual [epicConfig.js](epicConfig.js) uses:

```js
module.exports = {
  projectDir: './src',
  epicThemeDir: './src/my-epic-css',
  projectStyleDir: './src/_includes',
  outputFileName: 'style.css'
};
```

The scanner supports raw `.html`, `.njk`, `.md`, not PHP or evaluated template/JavaScript classes. See the [workspace explanation](../README.md#what-pre-light-actually-does) for matching limitations. Do not run `epic-light` against a missing or stale full build.

A theme-only palette change needs no npm publication. For shared utility changes, update/test the library separately and then update this consumer's dependency and lockfile. No automated release or deployment workflow was found. `netlify.toml` has no build command or publish directory; hosting settings must be checked separately. `src/_data/site.json` still identifies Design 2 SEO and should be reviewed when making a real site from this starter.

## Validation in this checkout

The installed Sass compiled this entry point successfully and resolved the library import. Output included `.clr-primary { color: #4f9eea; }` and `.clr-body-bg { background-color: #0f172a; }`, confirming current overrides. `npm run epic-build` and `npm run epic-light` passed. The original raw Eleventy runs intermittently failed with EPERM while creating temporary nested output directories. The new build runner pre-creates shared output parents sequentially, and fresh filtered builds now pass (15 pages, 12 copied files). Existing generated CSS and user edits were preserved. No publication/deployment was performed.



## Repeatable build and validation

`npm start` now compiles Sass once before launching the watchers. `npm run build` compiles full Sass, runs the installed class filter, and writes Eleventy pages/assets to `_site`. `npm run validate` performs that same filtered build in a fresh `.epic-check-*` directory, checks output files, restores the previous CSS include and pre-light bytes in a finally block, and removes temporary output. Stop watchers first and run one build/validation at a time.

The previous temporary-directory EPERM is resolved in this runner by rendering output paths first and creating shared parents sequentially before Eleventy's concurrent writes. Both the starter (15 pages) and site (6 pages) now pass fresh filtered builds. This supersedes the earlier audit limitation; the legacy raw Eleventy command is unchanged. `build-production` remains Eleventy-only. `npm ci` and browser visual review have not been performed during this change.
