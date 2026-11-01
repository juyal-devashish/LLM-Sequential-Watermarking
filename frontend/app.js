(() => {
  const $ = id => document.getElementById(id);
  const budget = 80, threshold = 7;
  const cases = {
    strong: { seed: 873, probability: .72 },
    weak: { seed: 752, probability: .57 },
    null: { seed: 421, probability: .5 }
  };
  let scenario = 'strong', values = [], current = 0, timer = null;
  function makeValues() {
    let seed = cases[scenario].seed, value = 0;
    values = [0];
    for (let i = 0; i < budget; i++) {
      seed = (1664525 * seed + 1013904223) >>> 0;
      value += seed / 4294967296 < cases[scenario].probability ? 1 : -1;
      values.push(value);
    }
  }
  function render() {
    const points = values.slice(0, current + 1).map((v, i) => `${i * 9.5},${Math.max(10, Math.min(190, 190 - v * 19.2857))}`);
    $('trace').setAttribute('points', points.join(' '));
    const [x, y] = points.at(-1).split(','); $('cursor').setAttribute('cx', x); $('cursor').setAttribute('cy', y);
    $('counter').innerHTML = `${current} <small>/ ${budget}</small>`;
    $('status').textContent = current === 0 ? 'Ready to begin' : values[current] >= threshold ? 'Illustrative threshold reached' : current === budget ? 'Comparison budget reached' : 'Gathering comparisons';
  }
  function pause() { clearInterval(timer); timer = null; $('play').innerHTML = 'Play <span>▶</span>'; }
  function step() { if (current >= budget || values[current] >= threshold) { pause(); return; } current++; render(); if (current >= budget || values[current] >= threshold) pause(); }
  document.querySelectorAll('[data-case]').forEach(button => button.addEventListener('click', () => {
    pause(); scenario = button.dataset.case; current = 0; makeValues(); render();
    document.querySelectorAll('[data-case]').forEach(b => { const on = b === button; b.classList.toggle('selected', on); b.setAttribute('aria-pressed', String(on)); });
  }));
  $('step').addEventListener('click', step);
  $('reset').addEventListener('click', () => { pause(); current = 0; render(); });
  $('play').addEventListener('click', () => { if (timer) { pause(); return; } if (current >= budget || values[current] >= threshold) { current = 0; render(); } $('play').innerHTML = 'Pause <span>Ⅱ</span>'; timer = setInterval(step, 140); });
  $('figure').addEventListener('change', e => { const src = `assets/${e.target.value}`; $('figure-image').src = src; $('figure-image').alt = `Historical figure: ${e.target.selectedOptions[0].textContent}`; $('figure-link').href = src; });
  $('theme').addEventListener('click', () => { document.documentElement.classList.toggle('dark'); $('theme').setAttribute('aria-label', document.documentElement.classList.contains('dark') ? 'Switch to light mode' : 'Switch to dark mode'); });
  makeValues(); render();
})();
