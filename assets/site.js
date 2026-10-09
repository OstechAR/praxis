/* Praxis by Oakridge — site engine.
   Reads content.js and builds every page from it. Adding content never
   needs a change here: edit content.js and drop files into pieces/. */
(() => {
'use strict';

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const $ = (sel, root = document) => root.querySelector(sel);

/* The Praxis coin: a P with a straight stem and a rounded bowl inside two rings. */
const EMBLEM = '<svg viewBox="-1 -1 2 2" aria-hidden="true"><circle r="1" fill="#D4AF37"/><circle r=".865" fill="none" stroke="#000" stroke-opacity=".38" stroke-width=".035"/><circle r=".785" fill="none" stroke="#000" stroke-opacity=".28" stroke-width=".02"/><path fill="#000" fill-rule="evenodd" d="M-.48 .61H-.245V.165H.095A.375 .38 0 0 0 .095-.595H-.48ZM-.245-.378H.135V-.055H-.245Z"/></svg>';

for (const el of document.querySelectorAll('[data-brand]')) {
  el.innerHTML = EMBLEM + '<b>Praxis</b><span>by Oakridge</span>';
  el.setAttribute('aria-label', 'Praxis by Oakridge, home');
}

/* ---------- Content ---------- */
const C = window.PRAXIS;
if (!C) {
  $('#view').innerHTML = `<div class="wrap notice">
    <h1>The site’s content file didn’t load.</h1>
    <p class="lede">Check the last edit to <code>content.js</code>. The usual cause is a missing comma between entries, or a missing quote mark or bracket.</p>
  </div>`;
  return;
}
const LINKS = C.links || {};
const VIDEOS = C.videos || [];
const PIECES = C.interactives || [];
const TOOLS = C.tools || [];
const EXTRA = C.pages || [];
const FORMATS = { short: 'Short', long: 'Long-form' };

const isLive = (x) => x.status !== 'upcoming';
const newestFirst = (list) => list.filter(isLive).sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
const notYet = (list) => list.filter((x) => !isLive(x));

function formatDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });
}

function blocks(spec) {
  return spec.map(([kind, n]) => Array.from({ length: n }, () => `<i class="blk ${esc(kind)}"></i>`).join('')).join('');
}

function poster(item, wide) {
  const p = item.poster || { fig: '', line: '', cols: 10, groups: [] };
  const cls = ['poster', wide ? 'wide' : '', isLive(item) ? '' : 'pending'].join(' ').trim();
  return `<div class="${cls}" aria-hidden="true"><div class="poster-in">
    <div><div class="fig">${esc(p.fig)}</div><div class="line">${esc(p.line)}</div></div>
    <div class="blockset">${(p.groups || []).map((g) => `<div class="blocks" style="--cols:${Number(p.cols) || 10}">${blocks(g)}</div>`).join('')}</div>
  </div></div>`;
}

function videoCard(v) {
  const wide = v.format === 'long';
  const inner = `${poster(v, wide)}
    <div><h3>${esc(v.title)}</h3>
    <div class="meta"><span>${esc(FORMATS[v.format] || '')}</span><span>${esc(isLive(v) ? formatDate(v.date) : v.stage || 'Coming up')}</span></div></div>`;
  const cls = 'card' + (wide ? ' wide' : '');
  return isLive(v) ? `<a class="${cls}" href="#/library/${esc(v.id)}">${inner}</a>` : `<div class="${cls}">${inner}</div>`;
}

function pieceCard(p) {
  const inner = `${poster(p, true)}
    <div><h3>${esc(p.title)}</h3>
    ${p.blurb ? `<p>${esc(p.blurb)}</p>` : ''}
    ${isLive(p) ? '' : `<div class="meta">${esc(p.stage || 'Coming up')}</div>`}</div>`;
  return isLive(p) ? `<a class="piece" href="#/interactive/${esc(p.id)}">${inner}</a>` : `<div class="piece">${inner}</div>`;
}

/* ---------- Pages ---------- */
function renderHome() {
  const videos = [...newestFirst(VIDEOS), ...notYet(VIDEOS).filter((v) => v.format === 'short').slice(0, 1)];
  const piece = newestFirst(PIECES)[0];
  const tool = TOOLS[0];
  const interest = Array.from({ length: 25 }, (_, i) => `<i class="blk g" style="--i:${i}"></i>`).join('');
  return `
  <div class="wrap">
    <section class="hero">
      <div>
        <h1>Start with<br>a question.</h1>
        <p class="lede">Follow where it leads. Praxis makes short, visual explanations of how money actually works, and free tools to run the numbers yourself.</p>
        <div class="actions">
          <a class="btn primary" href="#/library">Browse the library</a>
          ${tool ? `<a class="btn" href="#/${esc(tool.id)}">Open the ${esc(tool.label.toLowerCase())}</a>` : ''}
        </div>
      </div>
      <div class="stage">
        <p class="q">Why is 8% interest high?</p>
        <div class="stack" role="img" aria-label="Borrow $100,000 at 8% and pay back about $125,182.">
          <div class="interest">${interest}</div>
          <div class="borrowed">${blocks([['b', 100]])}</div>
        </div>
        <div class="legend">
          <div><i class="dot b"></i>Borrowed<b>$100,000</b></div>
          <div><i class="dot g"></i>Interest<b>$25,182</b></div>
        </div>
        <p class="cap">Interest only for a year, then paid off over four. Each block is $1,000.</p>
      </div>
    </section>

    ${videos.length ? `<section class="section">
      <div class="section-head">
        <h2>Latest videos</h2>
        <a class="text-link" href="#/library">See all videos</a>
      </div>
      <div class="shelf">${videos.map(videoCard).join('')}</div>
    </section>` : ''}

    ${piece ? `<section class="section">
      <div class="split">
        <div>
          <h2>${esc(piece.title)}</h2>
          ${piece.blurb ? `<p class="lede">${esc(piece.blurb)}</p>` : ''}
          <div class="actions">
            <a class="btn primary" href="#/interactive/${esc(piece.id)}">Start the interactive piece</a>
            ${PIECES.length > 1 ? '<a class="btn" href="#/interactive">See all interactive pieces</a>' : ''}
          </div>
        </div>
        <a href="#/interactive/${esc(piece.id)}" tabindex="-1" aria-hidden="true">${poster(piece, true)}</a>
      </div>
    </section>` : ''}

    ${TOOLS.filter((t) => t.heading).map((t) => `<section class="section">
      <div class="split">
        <div>
          <h2>${esc(t.heading)}</h2>
          ${t.blurb ? `<p class="lede">${esc(t.blurb)}</p>` : ''}
          <div class="actions"><a class="btn primary" href="#/${esc(t.id)}">Open the ${esc(t.label.toLowerCase())}</a></div>
        </div>
        ${t.features ? `<ul class="calc-list">${t.features.map(([n, d]) => `<li><b>${esc(n)}</b><span>${esc(d)}</span></li>`).join('')}</ul>` : ''}
      </div>
    </section>`).join('')}
  </div>`;
}

const libraryState = { filter: 'all' };

function renderLibrary() {
  const f = libraryState.filter;
  const match = (v) => f === 'all' || v.format === f;
  const out = newestFirst(VIDEOS).filter(match);
  const next = notYet(VIDEOS).filter(match);
  const used = Object.keys(FORMATS).filter((k) => VIDEOS.some((v) => v.format === k));
  const chips = [['all', 'All'], ...used.map((k) => [k, k === 'short' ? 'Shorts' : FORMATS[k]])]
    .map(([k, label]) => `<button type="button" data-filter="${k}" aria-pressed="${k === f}">${label}</button>`).join('');
  return `
  <div class="wrap">
    <header class="page-head">
      <h1>Library</h1>
      <p class="lede">Every Praxis video, newest first. Each one starts with a single question.</p>
      ${used.length > 1 ? `<div class="filters" role="group" aria-label="Show">${chips}</div>` : ''}
    </header>
    <section class="group">
      <h2>Out now</h2>
      ${out.length ? `<div class="shelf">${out.map(videoCard).join('')}</div>` : '<p class="empty">Nothing published here yet.</p>'}
    </section>
    ${next.length ? `<section class="group"><h2>Coming up</h2><div class="shelf">${next.map(videoCard).join('')}</div></section>` : ''}
  </div>`;
}

function renderVideo(v) {
  const watch = v.url ? `<a class="btn primary" href="${esc(v.url)}" target="_blank" rel="noopener">Watch the video</a>` : '';
  const tool = v.tool ? `<a class="btn${watch ? '' : ' primary'}" href="#/${esc(v.tool.page)}">${esc(v.tool.label)}</a>` : '';
  return `
  <div class="wrap">
    <a class="back" href="#/library"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>Library</a>
    <article class="video">
      ${poster(v, false)}
      <div>
        <h1>${esc(v.title)}</h1>
        <p class="when">${esc(FORMATS[v.format] || 'Video')}, published ${formatDate(v.date)}</p>
        ${v.summary ? `<p class="summary">${esc(v.summary)}</p>` : ''}
        ${v.takeaway ? `<p class="takeaway">${esc(v.takeaway)}</p>` : ''}
        ${watch || tool ? `<div class="actions">${watch}${tool}</div>` : ''}
        ${v.numbers ? `<dl class="numbers">${v.numbers.map(([k, val]) => `<div><dt>${esc(k)}</dt><dd>${esc(val)}</dd></div>`).join('')}</dl>` : ''}
        ${v.fine ? `<p class="fine">${esc(v.fine)}</p>` : ''}
        ${v.source ? `<p class="fine">Source: <a href="${esc(v.source.url)}" target="_blank" rel="noopener">${esc(v.source.label)}</a></p>` : ''}
      </div>
    </article>
  </div>`;
}

function renderInteractive() {
  const out = newestFirst(PIECES);
  const next = notYet(PIECES);
  return `
  <div class="wrap">
    <header class="page-head">
      <h1>Interactive</h1>
      <p class="lede">Explanations you move through yourself, at your own speed.</p>
    </header>
    <section class="group">
      ${out.length ? `<div class="pieces">${out.map(pieceCard).join('')}</div>` : '<p class="empty">Nothing published here yet.</p>'}
    </section>
    ${next.length ? `<section class="group"><h2>Coming up</h2><div class="pieces">${next.map(pieceCard).join('')}</div></section>` : ''}
  </div>`;
}

function renderMissing() {
  return `
  <div class="wrap">
    <header class="page-head">
      <h1>Page not found</h1>
      <p class="lede">There’s nothing at this address. It may have moved, or the link may be mistyped.</p>
      <div class="actions" style="margin-top:28px"><a class="btn primary" href="#/">Go to the home page</a><a class="btn" href="#/library">Browse the library</a></div>
    </header>
  </div>`;
}

/* ---------- Embedded pieces: each is its own file, shown under the site bar ---------- */
const embedHosts = {};

function mountEmbed(item) {
  let host = embedHosts[item.file];
  if (host) return host;
  host = document.createElement('div');
  host.className = 'embed';
  $('#embeds').appendChild(host);
  embedHosts[item.file] = host;

  const frame = document.createElement('iframe');
  frame.title = item.title || item.label || '';
  frame.addEventListener('load', () => {
    if (!item.hideInside) return;
    try {
      const style = frame.contentDocument.createElement('style');
      style.textContent = item.hideInside + '{display:none!important}';
      frame.contentDocument.head.appendChild(style);
    } catch (e) { /* the piece is on another address: leave it as it is */ }
  });
  frame.src = item.file;
  host.appendChild(frame);

  // On the live site, say so plainly if the file was never uploaded.
  if (/^https?:$/.test(location.protocol) && window.fetch) {
    fetch(item.file, { method: 'HEAD' }).then((r) => {
      if (r.status !== 404) return;
      host.innerHTML = `<div class="fallback wrap">
        <h1>This page’s file is missing.</h1>
        <p class="lede">The site expected <code>${esc(item.file)}</code>. Upload it, or correct the file name in content.js.</p>
      </div>`;
    }).catch(() => {});
  }
  return host;
}

/* ---------- Router ---------- */
function resolve(path) {
  const [first = '', second] = path.split('/');
  if (!first) return { nav: '', title: '', html: renderHome };
  if (first === 'library') {
    if (!second) return { nav: 'library', title: 'Library', html: renderLibrary };
    const v = VIDEOS.find((x) => x.id === second && isLive(x));
    if (v) return { nav: 'library', title: v.title, html: () => renderVideo(v) };
  }
  if (first === 'interactive' && PIECES.length) {
    if (!second) return { nav: 'interactive', title: 'Interactive', html: renderInteractive };
    const p = PIECES.find((x) => x.id === second && isLive(x));
    if (p) return { nav: 'interactive', title: p.title, embed: p };
  }
  const page = !second && [...TOOLS, ...EXTRA].find((x) => x.id === first);
  if (page) return { nav: page.id, title: page.title || page.label, embed: page };
  return { nav: '', title: 'Page not found', html: renderMissing };
}

const state = { path: '' };

function readHash() {
  try { return decodeURIComponent((location.hash || '').replace(/^#\/?/, '')).replace(/\/+$/, ''); } catch (e) { return ''; }
}

function navigate(path, push = true) {
  state.path = path;
  if (push) {
    try { history.pushState(null, '', '#/' + path); } catch (e) { /* address bar unavailable: the page still changes */ }
  }
  render(true);
}

function render(moved) {
  const page = resolve(state.path);
  const view = $('#view');
  const isEmbed = Boolean(page.embed);

  document.documentElement.classList.toggle('embed-mode', isEmbed);
  view.hidden = isEmbed;
  $('#foot').hidden = isEmbed;
  $('#embeds').hidden = !isEmbed;
  for (const host of Object.values(embedHosts)) host.hidden = true;

  if (isEmbed) mountEmbed(page.embed).hidden = false;
  else view.innerHTML = page.html();

  for (const a of document.querySelectorAll('#site-nav a')) {
    if (a.dataset.page === page.nav) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  }
  document.title = page.title ? page.title + ' | Praxis by Oakridge' : 'Praxis by Oakridge';
  if (moved) {
    window.scrollTo(0, 0);
    if (!isEmbed) view.focus({ preventScroll: true });
  }
}

document.addEventListener('click', (e) => {
  const filter = e.target.closest('[data-filter]');
  if (filter) { libraryState.filter = filter.dataset.filter; render(false); return; }
  const a = e.target.closest('a[href^="#/"]');
  if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
  e.preventDefault();
  navigate(a.getAttribute('href').replace(/^#\/?/, '').replace(/\/+$/, ''));
});
const onAddressChange = () => { const p = readHash(); if (p !== state.path) navigate(p, false); };
window.addEventListener('popstate', onAddressChange);
window.addEventListener('hashchange', onAddressChange);

/* ---------- Menus ---------- */
const menu = [
  { id: 'library', label: 'Library' },
  ...TOOLS.map((t) => ({ id: t.id, label: t.label })),
  ...(PIECES.length ? [{ id: 'interactive', label: 'Interactive' }] : []),
  ...EXTRA.map((p) => ({ id: p.id, label: p.label })),
];
$('#site-nav').innerHTML = menu.map((m) => `<a href="#/${esc(m.id)}" data-page="${esc(m.id)}">${esc(m.label)}</a>`).join('');
$('#foot-nav').innerHTML = menu.map((m) => `<a href="#/${esc(m.id)}">${esc(m.label)}</a>`).join('')
  + (LINKS.youtube ? `<a href="${esc(LINKS.youtube)}" target="_blank" rel="noopener">YouTube</a>` : '');

state.path = readHash();
render(false);
})();
