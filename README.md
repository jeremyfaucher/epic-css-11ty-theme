# Epic CSS Eleventy starter

For new demo content and copy reviews, follow the [demo-copy workflow](DEMO-COPY.md).

This is the starter/blog consumer of the `epic-css` npm library, not the library source or the documentation site. See the [workspace map](../README.md) for shared build/filter behavior, release ownership and hosting uncertainties.

**Changelog:** see the [Epic CSS changelog](https://epiccss.com/docs/changelog/) for the `epic-css` release history.

## Unreleased theme changes

- Added static Harbor (default), Dusk and Neon Sass palette choices; theme version remains 1.0.1.

## Theme 1.0.1 changes

This theme update centralizes category collections, introductions, breadcrumbs and
landing-page metadata in shared data. Blog and category listings now have a
responsive category sidebar. Demo copy explains theme behavior and basic design
principles; [DEMO-COPY.md](DEMO-COPY.md) documents how to write and check future copy.
The theme version is separate from the `epic-css` dependency version. This note
describes the local changes; it does not indicate a published release.

## Categories and content

Edit [src/_data/categories.json](src/_data/categories.json). Each object key is the
category identifier used by page front matter and post directory data. A record
has this shape:

```json
{
  "graphic-design": {
    "name": "Graphic Design",
    "url": "/blog/graphic-design/",
    "collection": "graphicDesignPosts",
    "intro": {
      "heading": "Latest Graphic Design Posts",
      "description": "Explain what readers will find in this category."
    },
    "seo": {
      "title": "Graphic Design Blog - 11ty Theme",
      "description": "Summarize the category for the page metadata."
    }
  }
}
```

`name` and `url` supply category links and post breadcrumbs. `collection` selects
an Eleventy tag collection; the shared listing renders it in reverse order.
`intro` supplies the heading and paragraph, and `seo` supplies the landing page's
title and meta description. Optional `intro.showHeading: false` keeps a heading
hidden when needed; optional `intro.headingClass`
overrides the default heading classes. The `blog` record represents `/blog/`, uses
the combined `blog` collection, and is excluded from the sidebar category list.
If no category record is selected, the listing falls back to that combined collection.

To add a category:

1. Add a record with its own key, URL and collection name.
2. Create a directory under `src/blog/`. Its matching directory data file (for
   example `src/blog/graphic-design/graphic-design.json`) assigns `layout: "post.njk"`,
   `category: "graphic-design"` and `tags: ["graphicDesignPosts", "blog"]` to posts.
   Keep any desired author defaults there. Existing `tag` values remain available
   for other presentation logic.
3. Add `index.njk` in that directory, following this landing-page pattern:

   ```njk
   ---
   layout: base.njk
   category: graphic-design
   tags: blogPages
   eleventyExcludeFromCollections: true
   permalink: "{{ categories[category].url }}"
   ---
   {% include 'category.njk' %}
   ```

4. Add posts with their own `title`, `date` and `description` front matter. The
   category directory supplies collection membership and the breadcrumb key.
   Current post cards and latest-post links still use directory `categoryName` and
   `categorySlug` (for example `"Graphic Design"` and `"graphic-design/"`); keep
   those values in sync with the category record when adding or renaming one.
5. Build and check the category listing, blog index, sidebar and a post. The shared
   templates need no new category-specific branches. Categories appear in sidebar
   data order; posts retain reverse collection order.

The shared includes are `category.njk`, `category-intro.njk`, `breadcrumb-cat.njk`,
`breadcrumb-post.njk`, `sidebar.njk` and `title-and-meta.njk`. Category SEO applies
only when the current URL matches the record's landing URL. Posts inherit a
category but retain their own title and description. Home and About retain their
explicit metadata branches. Site identity stays in `src/_data/site.json`.

## Blog listing layout

`/blog/` and the category landing pages share the same layout. Breadcrumbs,
headings and the introduction sit above both columns. Only the intro paragraph
has inline `max-width: 776px;`; its `mb-40` spacing separates it from the grid.

The grid uses `grid grid-sidebar-right-268 gap-40 items-start`. Below 1040px it
stacks the sidebar after the post list; at 1040px and wider it uses
`minmax(0, 1fr) 268px`. The main post grid keeps its adaptive `grid-col-3`,
`gap-32`, `p-0` and `m-0` classes. The reusable sidebar reads category names and
URLs from data and marks the current category link with `aria-current="page"`.
Post detail layouts are separate. The theme sets `$container-width: 1060px` in
`src/my-epic-css/_custom.scss`, before importing the shared library; the workshop
and library container defaults are unchanged.

## Demo copy checks

Follow [DEMO-COPY.md](DEMO-COPY.md) for topic selection, factual checks, tone and
length. Run `npm run check:copy`, then `npm run build-production`, then
`npm run check:copy -- --output`. The checker scans source content and generated
HTML for common Latin and English filler. Read and preview the result too: the
phrase check cannot assess factual accuracy, layout fit or accessibility.

## Install and preview

Run from this directory:

```sh
npm ci
npm start
```

This checkout currently has a dependency mismatch: `package.json` requests
`epic-css: ^0.14.3`, while the lockfile root requests `^0.14.0`. The theme 1.0.1
version update leaves dependency versions unchanged. Reconcile the dependency
manifest and lockfile in a separate dependency update before relying on a fresh
`npm ci`; the checks for this update used the existing installed dependencies.

`start` uses npm-run-all to run Eleventy serve and Sass watch together. Follow the printed local URL (normally port 8080). Content lives in `src/index.njk`, `src/about/`, and `src/blog/`; shared page templates are in `src/_includes/`. `.eleventy.js` reads `src` and outputs `_site`. `base.njk` embeds the CSS include after CleanCSS minification.

`package.json` declares `epic-css: ^0.14.3` and Eleventy `^2.0.1`. The local installed library reports `0.14.1`. `src/my-epic-css/index.scss` imports `_custom.scss` first, then the installed library's `src/index.scss`. It does not use the sibling `../epic-css` source automatically.

## Commands quick reference

Run these commands from `epic-css-11ty-theme`, where this project's `package.json` lives.

**For everyday editing, use `npm start`.** Leave that terminal running, open the local URL it prints, and save changes under `src`. Eleventy rebuilds the pages as you edit. If a change does not appear, check the terminal for errors, refresh the browser, and confirm you edited the template or heading used on that page. `_site` contains generated output that subsequent builds can overwrite. Local changes do not update a deployed website.

| Command | What it does | When to use it |
| --- | --- | --- |
| `npm start` (also `npm run start`) | Automatically runs `prestart`, then starts both `watch:*` scripts in parallel. | Everyday local development: preview pages while editing HTML, templates, Markdown, or Sass. Stop with Ctrl+C. |
| `npm run prestart` | Compiles `src/my-epic-css/index.scss` into `src/_includes/style.css` once. npm also runs this automatically before `start`; a failure prevents the watchers from starting. | Compile full CSS once without launching a server. |
| `npm run watch:start` | Runs `eleventy --serve`: watches source files, rebuilds pages, and serves the local preview. | Run only the page watcher/server. It does not compile Sass. |
| `npm run watch:sass` | Watches Sass and recompiles `src/_includes/style.css` when it changes. | Run only the Sass watcher. It does not serve or generate pages. |
| `npm run build-production` | Runs Eleventy once, generating `_site` and copying configured assets using the existing CSS include. | Build pages separately after preparing CSS. It does not compile Sass or filter CSS. |
| `npm run epic-build` | Compiles full Sass into `src/my-epic-css/pre-light.css` and copies it to `src/_includes/style.css`. | Prepare full CSS before filtering, or restore full CSS for debugging. |
| `npm run epic-light` | Filters the existing `pre-light.css` using classes found in source files and writes the CSS include. | Run the CSS filtering step by itself, after compiling fresh full CSS. It does not compile Sass or generate pages. |

Stop development watchers before preparing production output: the Sass watcher writes full CSS and can overwrite the filtered include. Use `npm start` while editing. For separate production steps, stop the watchers, run `npm run epic-build`, then `npm run epic-light`, then `npm run build-production`. When Netlify uses `npm run build-production`, the CSS include must already be prepared and committed or generated in an earlier deployment step.

## Palette ownership

Edit [src/my-epic-css/_custom.scss](src/my-epic-css/_custom.scss). Select one
static palette near the top, then rebuild:

```scss
$palette-name: "Harbor" !default; // Or "Dusk" or "Neon"
```

Harbor (default blue), Dusk (charcoal/lavender) and Neon (black/coral/teal) use the
corresponding workshop dark colors as single-palette choices. The theme has no
runtime light/dark toggle, saved-preference script or theme attribute switching.
Its `$color-modes` setting stays empty. The optional paired-mode demonstration
belongs to the workshop; it is not imported here.

Layout settings come first (`$container-width: 1060px`), followed by the selector,
three preset records and straightforward `$clr-*` assignments. White remains
white. The theme entry imports custom settings before the installed library's
central `!default` fallbacks, so those defaults do not replace your chosen values.
Unknown palette names fail compilation with the available choices.

Run `npm run prestart` to rebuild the CSS include and `npm run build-production`
to render pages, or use `npm start` for development. The workspace sync watcher
also recompiles after local Sass edits but never copies the workshop's custom
file over this one. Presets here are site-owned: customize/copy them manually.
`npm run test:palettes` compiles and builds all three in temporary output without
changing the active selector or interrupting that watcher.

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

Palette overrides depend on the installed library honoring Sass defaults. Check the installed package and compiled CSS when updating the dependency; an existing local build is not verification of a clean package installation.

## Small color change and production check

1. Select a named preset in `_custom.scss`, or edit the role values inside that preset, keeping the palette consistent.
2. Compile once, then `npm start`. Inspect home, about and blog pages, text/background contrast, links/hover, and code blocks. Palette comments about readability are not contrast measurements.
3. Stop the watchers, then run sequentially:

```sh
npm run epic-build
npm run epic-light
npm run build-production
```

`epic-build` writes full `src/my-epic-css/pre-light.css` and copies it to `src/_includes/style.css`; `epic-light` filters it using source classes and overwrites the include. `build-production` runs Eleventy using that existing CSS. Preview the resulting pages after filtering too. Sass watch can overwrite the filtered include. Re-run `epic-build` to restore full CSS for debugging. Netlify can use `npm run build-production` when CSS is prepared separately.

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

## Site-first propagation

Develop and verify shared behavior/documentation on the Epic CSS site first, deploy it and run its production verification, then release the reviewed npm code/docs update. Only after that release should this starter's dependency and lockfile be updated to it and its filtered build validated. Follow the site's [release guide](https://github.com/jeremyfaucher/epic-css-site/blob/main/RELEASING.md). Do not silently replace an npm dependency with a local tarball in this repository; use disposable copies for candidate testing.

For the next dependency update, reconcile the manifest and lockfile, install the reviewed published package, then run the full CSS compile/filter and Eleventy checks above. Keep that work separate from the theme version update; do not substitute a local tarball for published-package verification.

## Publishing ownership

The assistant prepares, checks, commits and pushes reviewed changes to `jeremyfaucher/epic-css`. The user creates/publishes the GitHub release; `.github/workflows/npm-publish.yml` runs tests on Node 22 and publishes to npm with OIDC trusted publishing. The trusted publisher must match owner `jeremyfaucher`, repository `epic-css`, workflow `npm-publish.yml`, and permit **Allow npm publish**. Staging-only permission previously caused E403. Do not create another release just to update this starter.

Theme version changes do not authorize a library release, tag, deployment or registry change. Follow the owning project's release process when publication is explicitly requested.
