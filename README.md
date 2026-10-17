# JSON Formatter

Format, validate, minify, and repair JSON in the browser — split input/output editors, multi-tab documents, Monaco-powered editing.

## Live demo

After GitHub Pages is enabled (see below):

**https://gajay.github.io/js-formatter/**

## Local development

```bash
npm install
npm run dev
```

## GitHub Pages deploy

Pushes to `main` or `feat/studio-layout` run [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml): build with `base: /js-formatter/`, then publish `dist` to the **`gh-pages`** branch.

### Enable Pages (required once)

1. Open **https://github.com/GAjay/js-formatter/settings/pages**
2. Under **Build and deployment → Source**, choose **Deploy from a branch**
3. **Branch:** `gh-pages` · **Folder:** `/ (root)` · **Save**
4. Wait 1–2 minutes, then open **https://gajay.github.io/js-formatter/**

To deploy manually: **Actions → Deploy to GitHub Pages → Run workflow**.

## Scripts

| Command        | Description              |
|----------------|--------------------------|
| `npm run dev`  | Vite dev server          |
| `npm run build`| Production build         |
| `npm run preview` | Preview production build |
| `npm run typecheck` | `tsc --noEmit`      |
| `npm run lint` | ESLint                   |
