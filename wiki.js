(function () {
  const root  = window.WIKI_ROOT || '.';
  const input = document.getElementById('wiki-search-input');
  const results = document.getElementById('wiki-search-results');
  if (!input || !results) return;

  let index = null;
  fetch(root + '/search-index.json').then(r => r.json()).then(data => { index = data; });

  function render(matches) {
    if (!matches.length) { results.classList.remove('visible'); results.innerHTML = ''; return; }
    results.innerHTML = matches.slice(0, 12).map(m =>
      `<a class="wiki-search-result" href="${root}/${m.url}">${m.name}<span class="cat">${m.cat}</span></a>`
    ).join('');
    results.classList.add('visible');
  }

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!index || !q) { render([]); return; }
    render(index.filter(e => e.name.toLowerCase().includes(q)));
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.wiki-search')) render([]);
  });
})();
