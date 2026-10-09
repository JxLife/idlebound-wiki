(function () {
  const root = window.WIKI_ROOT || '.';
  const input = document.getElementById('wiki-search-input');
  const results = document.getElementById('wiki-search-results');
  if (!input || !results) return;

  let index = null;
  fetch(root + '/search-index.json').then(r => r.json()).then(data => { index = data; });

  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function render(matches) {
    if (!matches.length) { results.classList.remove('visible'); results.innerHTML = ''; return; }
    results.innerHTML = matches.slice(0, 12).map(m =>
      `<a class="wiki-search-result" href="${root}/${m.url}">${esc(m.name)}<span class="cat">${esc(m.cat)}</span></a>`
    ).join('');
    results.classList.add('visible');
  }

  // Names that start with the text come first, then a word that starts with it, then anywhere.
  function score(name, q) {
    const n = name.toLowerCase();
    if (n.startsWith(q)) return 0;
    if (n.split(/[\s'()-]+/).some(w => w.startsWith(q))) return 1;
    return n.includes(q) ? 2 : -1;
  }

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!index || !q) { render([]); return; }
    render(index.map(e => ({ e, s: score(e.name, q) })).filter(r => r.s >= 0)
      .sort((a, b) => a.s - b.s || a.e.name.localeCompare(b.e.name)).map(r => r.e));
  });

  input.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const first = results.querySelector('a');
    if (first) location.href = first.href;
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.wiki-search')) render([]);
  });
})();
