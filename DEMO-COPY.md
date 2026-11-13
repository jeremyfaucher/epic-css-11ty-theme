# Writing theme demo copy

Use this workflow for new content and copy changes. It adapts the sibling site's
`DEMO-COPY.md` conventions to this Eleventy starter. Demo text should quietly
explain something useful while leaving the layout easy to inspect.

1. Choose one topic. Start with verified theme behavior: shared category records,
   Eleventy content and directory data, lists, introductions, breadcrumbs,
   landing-page SEO, or responsive layouts. When those topics become repetitive,
   use scale, proximity, alignment, repetition, contrast, harmony, rhythm or tension.
2. Check the implementation before making a claim. Read the relevant template,
   data, CSS or build command. Describe performance, accessibility, best practices
   and scalability through specific mechanisms or as aims, rather than guarantees.
   Do not invent measurements, compliance, release details or history. Sample post
   dates are content fixtures, not evidence of a feature's release date. Verify any
   external standards against current primary sources before citing them.
3. Write dry, modest, plain educational copy. Give the reader one practical idea.
   Avoid filler, fictional biographies, sales language, keyword stuffing and
   unsupported promises. This is a demo, not a coordinated marketing campaign.
4. Match the semantic role and approximate length of the original. A heading
   names the topic; a paragraph explains it; a meta description summarizes it.
   Keep enough variation to exercise wrapping without changing classes or layout.
   Describe the actual image in alt text; keep decorative image alts empty.
5. Edit the shared owner. Category copy belongs in
   `src/_data/categories.json` (`intro.heading`, `intro.description`, `seo.title`,
   `seo.description`). Post titles and descriptions belong in each post's front
   matter, with article text below it. Home and About copy lives in their page
   files; their metadata lives in `src/_includes/title-and-meta.njk`. Site identity
   stays in `src/_data/site.json`. Preserve routes, dates, assets, template syntax
   and code examples unless changing them is part of the task.
6. Run the checks from this directory:

   ```sh
   npm run check:copy
   npm run build-production
   npm run check:copy -- --output
   git diff --check
   ```

   The copy check scans source content and optionally generated HTML for common
   Latin and English filler fragments. It is a guard against recurrence, not a
   substitute for reading the copy. Extend its phrase list when a new filler
   source is found. Do not exempt a whole page to silence a failure; review any
   literal wording required by a code example individually.
7. Preview home, About, blog, each category and representative posts at narrow and
   wide widths. Check heading wraps, paragraph lengths, card summaries, image
   descriptions, sidebar links, breadcrumbs and metadata. Confirm URL paths and
   post order remain stable. A successful build does not establish visual quality,
   speed or accessibility conformance.

Placeholder asset filenames are retained intentionally. They identify existing
demo images and should not be renamed as part of a copy-only change.
