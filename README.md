# Jurina's Homepage

Just a small corner of the internet where I share a little about myself, my interests, and the music I enjoy.

Thanks for stopping by :D

## Development

Everything is TypeScript. `npm run build` turns it into a static site in `dist/`, and GitHub Actions
builds and publishes that to GitHub Pages on every push to `main`.

```bash
npm install
npm run dev     # rebuild dist/ whenever src/ changes
npm run build   # one-off build
npm run check   # type-check everything
```

To look at the build locally, serve `dist/` with any static server, e.g. `python -m http.server -d dist`.

### Where things live

```
public/            copied into dist/ as-is: images, fonts, CNAME, .well-known
src/
  shared/          translations (English and Japanese), used by both pages and scripts
  site/            the HTML
    config.ts      page list, nav order, external links, project URLs
    layout.ts      <head>, header, phone menu and footer around every page
    components/    header, mobile menu, footer, language switch, icons
    pages/         home/ (one file per section), projects/, contact.ts
  styles/          the CSS, one module per area; index.ts sets the order
  client/          browser scripts, bundled into js/main.js and js/home.js
    features/      theme, language, clocks, music rail, lightbox, menu…
    photos/        hanging polaroid and Heisei photo wall
    globe/         the dotted globe on the flight card
  build/           build script and the html/css template helpers
```

Page text is written once, in `src/shared/translations.ts`. Templates use `text("key")` to bake
in the English copy and mark it for the language switch, so adding a string means adding the same
key to both `en` and `ja` (the type check fails if Japanese is missing one).
