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

This checkout's installed 0.14.0 copy has local `!default` edits; a fresh published 0.14.0 copy loses consumer overrides. Version 0.14.1 fixes this and has now been published through GitHub Actions. The configured Microsoft registry currently returns E404/ETARGET for 0.14.1 even with a fresh metadata cache, so this starter's real manifest/lockfile update and published-package build check are still pending. Do not substitute the earlier local candidate for verification of the released artifact.

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

A theme-only palette change needs no npm publication. For shared utility changes, update/test the library separately and then update this consumer's dependency and lockfile. The npm library now publishes through its GitHub release workflow. `netlify.toml` has no build command or publish directory; hosting settings must be checked separately. `src/_data/site.json` still identifies Design 2 SEO and should be reviewed when making a real site from this starter.

## Validation in this checkout

The installed Sass compiled this entry point successfully and resolved the library import. Output included `.clr-primary { color: #4f9eea; }` and `.clr-body-bg { background-color: #0f172a; }`, confirming current overrides. `npm run epic-build` and `npm run epic-light` passed. The original raw Eleventy runs intermittently failed with EPERM while creating temporary nested output directories. The new build runner pre-creates shared output parents sequentially, and fresh filtered builds now pass (15 pages, 12 copied files). Existing generated CSS and user edits were preserved. No publication/deployment was performed.



## Repeatable build and validation

`npm start` now compiles Sass once before launching the watchers. `npm run build` compiles full Sass, runs the installed class filter, and writes Eleventy pages/assets to `_site`. `npm run validate` performs that same filtered build in a fresh `.epic-check-*` directory, checks output files, restores the previous CSS include and pre-light bytes in a finally block, and removes temporary output. Stop watchers first and run one build/validation at a time.

The previous temporary-directory EPERM is resolved in this runner by rendering output paths first and creating shared parents sequentially before Eleventy's concurrent writes. Both the starter (15 pages) and site (6 pages) now pass fresh filtered builds. This supersedes the earlier audit limitation; the legacy raw Eleventy command is unchanged. `build-production` remains Eleventy-only. `npm ci` and browser visual review have not been performed during this change.

## Site-first propagation

Develop and verify shared behavior/documentation on the Epic CSS site first, deploy it and run its production verification, then release the reviewed npm code/docs update. Only after that release should this starter's dependency and lockfile be updated to it and its filtered build validated. Follow the site's [release guide](https://github.com/jeremyfaucher/epic-css-site/blob/main/RELEASING.md). Do not silently replace an npm dependency with a local tarball in this repository; use disposable copies for candidate testing.

The earlier local packed candidate passed the 15-page build and preserved the blue palette, but that is not verification of the newly published artifact. Once the approved registry exposes 0.14.1, run `npm install epic-css@0.14.1 --save-exact`, verify the installed package version and palette regression, then `npm run validate`, preview, and commit/push only the reviewed manifest/lockfile changes. The failed install attempt left both files unchanged.

## Publishing ownership

The assistant prepares, checks, commits and pushes reviewed changes to `jeremyfaucher/epic-css`. The user creates/publishes the GitHub release; `.github/workflows/npm-publish.yml` runs tests on Node 22 and publishes to npm with OIDC trusted publishing. The trusted publisher must match owner `jeremyfaucher`, repository `epic-css`, workflow `npm-publish.yml`, and permit **Allow npm publish**. Staging-only permission previously caused E403. Do not create another release just to update this starter.

The next action is approved-registry propagation of the already published 0.14.1 package, not another npm release or local CLI login. If this registry continues returning E404/ETARGET, ask its administrators to refresh/approve `epic-css@0.14.1`; do not switch to the organization-blocked direct npm endpoint.
