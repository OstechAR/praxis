# Praxis by Oakridge — website

A static site. No build step: upload the folder to GitHub and turn on Pages.

```
index.html          the frame — never needs editing for content
content.js          ALL content: videos, interactive pieces, tools, pages
assets/site.css     the look
assets/site.js      the engine that builds pages from content.js
pieces/             one HTML file per tool or interactive piece
```

## Add or release a video
Edit `content.js`, section `videos`. Copy an existing entry and change it.
To release an upcoming one, set `status: 'published'`, a `date` and the `url`.

## Add an interactive piece
1. Upload its HTML file to `pieces/` (for example `pieces/pa002.html`), exactly as built.
2. In `content.js`, section `interactives`, add:

```js
{
  id: 'pa002',
  title: 'The question it answers?',
  blurb: 'One or two sentences.',
  file: 'pieces/pa002.html',
  status: 'published',        // or 'upcoming' with stage: 'In development'
  date: '2026-11-01',
  poster: { fig: '$3.40', line: 'short caption', cols: 14, groups: [[['g', 6]]] },
},
```

It appears on the Interactive page and, if it is the newest, on the home page.
Its address is `#/interactive/pa002`.

## Update a piece
Replace its file in `pieces/`. Nothing else changes.

## Add a tool or another page
Upload the HTML file to `pieces/`, then add an entry under `tools` (gets a
home-page section if it has a `heading`) or `pages` in `content.js`:

```js
{ id: 'about', label: 'About', file: 'pieces/about.html' },
```

## Posters
`fig` is the big figure, `line` the caption, `groups` the rows of blocks:
`'g'` gold (money), `'b'` blue (information), `'w'` white, `'o'` outline.
`[['g', 6], ['o', 1]]` is six gold blocks then one outline.

## If the site shows "content file didn't load"
The last edit to `content.js` has a typo — usually a missing comma between
entries or an unclosed quote. Undo the edit in GitHub's history and retry.
