# Royal Dr Gang Celebrations

Birthdays and wedding anniversaries for friends and family from Royal Dr, Santa Clara. Live at **https://www.royaldrgang.com**.

The site is one self-contained page served by GitHub Pages from the top of this repository. No server and no database.

## Layout

```
index.html, og.png, favicon*, apple-touch-icon.png, icon-512.png, site.webmanifest
                     The built website (what GitHub Pages serves). Don't edit index.html directly.
CNAME                The custom domain for GitHub Pages (www.royaldrgang.com)
.nojekyll            Tells Pages to serve files as-is
dev/src/seed.json    THE DATA: everyone's birthdays, anniversaries, nicknames, families
dev/src/logic.js     Sorting, dates, search, filters, families, import/export, storage
dev/src/index.html   The page: layout, styles, behaviour
dev/test/            Unit tests (Node's built-in runner, no install needed)
dev/build.js         Builds dev/src → index.html at the repo root
dev/make-assets.js   Regenerates the link-preview image and icons (needs `sharp`)
```

## Making a change

Requires Node 18+. Nothing to install.

```bash
cd dev
# 1. edit src/seed.json (data) or src/index.html (design)
# 2. if you changed seed.json, bump "seedVersion" by 1 so saved browsers pick up the change
node --test test/*.test.js   # run the tests
node build.js                # rebuild ../index.html
cd .. && git add -A && git commit -m "Add Suneesha's birthday" && git push
```

GitHub Pages republishes about a minute after the push.

## GitHub Pages and the domain (one-time setup)

1. Repo **Settings → Pages**: under Source choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then Save.
2. The custom domain field should show `www.royaldrgang.com` (it comes from the `CNAME` file). Tick **Enforce HTTPS** once it's available.
3. At your domain registrar, add these DNS records:

   | Type | Name | Value |
   |---|---|---|
   | CNAME | `www` | `msr024.github.io` |
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |

   With the A records, `royaldrgang.com` (without www) redirects to `www.royaldrgang.com`. This is the same setup as the other sites.

## Link preview

When the link is pasted into WhatsApp, iMessage, Facebook or Slack, people see **Royal Dr Gang Celebrations**, a short description, and the saffron "Royal Dr Gang" image (`og.png`, 1200×630). These come from the `og:` and `twitter:` tags in `dev/src/index.html`, and they point at `https://www.royaldrgang.com/`.

- Check it with opengraph.xyz after the site is live.
- WhatsApp caches previews. If it shows an old or blank one, share the link with `?v=2` on the end.

## How the data works

- `dev/src/seed.json` is the shared list everyone sees. It has a `seedVersion` number.
- Edits made on the site's **Manage events** page are saved only in that browser (localStorage). To make an edit permanent for everyone, put it in `seed.json`, bump `seedVersion`, rebuild and push.
- When `seedVersion` changes, a browser with saved edits picks up new and corrected seed records automatically. Records that person edited by hand, and events they deleted, are left alone.
- **Reload latest seed data** adds back any missing bundled events. **Restore original list** discards local edits.
- **Export JSON / Import** move a list between devices. On import, possible duplicates are shown for you to merge, keep both, or skip.

## Data model

```ts
type Birthday    = { id; type: "birthday"; name; month; day; aliases: string[]; community?; relationship?; parents?: [string, string]; verified; note? };
type Anniversary = { id; type: "anniversary"; people: [string, string]; month; day; aliases: string[]; verified; note? };
```

- Months are 1–12. Ages and anniversary counts aren't shown, because years aren't recorded.
- Extra fields (`birthYear`, `photo`, `reminder`, …) are kept through edits, import and export, so they can be added later.
- `community` is one of `telugu`, `tamil`, `tamil-sourashtra`, `malayali` or `muslim`. It sets the language of the greeting on each card. Anniversaries use both partners' languages.
- `parents` links a child to a couple, and the **Families** section on the Manage page is built from it. It also flags missing birthdays and anniversaries.

## Rules the tests protect

- Every seed record loads. November has exactly 3 birthdays and 4 anniversaries, and all 12 monthly totals match the seed.
- Search covers names, every pet name, both partners' nicknames, and loose spellings (Satish → Sateesh, Tara → Thara).
- Duplicate detection never uses loose spelling. Meenaz ≠ Meenu, and Kishore Avengu ≠ Kishore Koneti.
- Imports never silently overwrite anything, and a verified date always beats an unconfirmed one.
