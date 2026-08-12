/* CoverToday site search — no dependencies, no framework, lazy-loaded.
 *
 * WHY IT IS BUILT THIS WAY
 * Nothing here runs on a normal page load. Base.astro ships a ~700-byte inline
 * stub that only listens for intent (click the search button, press "/" or
 * Cmd/Ctrl-K, or focus the input on /search). This file and the JSON index are
 * fetched on that first intent and cached for the rest of the session, so the
 * feature costs an idle visitor nothing. verify.mjs step 11 enforces the size
 * budget on every build so it stays that way.
 *
 * MATCHING, IN ORDER OF IMPORTANCE
 *  1. Synonyms (src/data/search-synonyms.js) — "e&o", "workmans comp",
 *     "грузчики" all have to land somewhere. This does most of the work.
 *  2. Fuzzy PREFIX matching — the autocomplete behaviour. A query token is
 *     compared against the same-length prefix of each indexed token, with an
 *     edit-distance tolerance that scales with length. That is what makes
 *     "General Lie" reach "General Liability" and "liebility" reach
 *     "liability" — a plain startsWith() cannot do either.
 *  3. Ranking — field weights, phrase bonus, and a deliberate demotion of the
 *     ~60 generated state/city pages so they cannot crowd out the real
 *     service page unless the query actually names a place.
 */
(function () {
  'use strict';
  if (window.CTSearch) return;

  var CFG = {
    limit: 8,           // results in the overlay
    limitPage: 40,      // results on /search
    minScore: 5,
    stateCap: 2,        // max generated state/city rows unless a place is named
    debounce: 110,      // input -> re-rank
    analyticsIdle: 900, // ms of no typing before a query is reported
  };

  var T = {
    en: {
      placeholder: 'Search coverage, guides, tools…',
      label: 'Search the site',
      popular: 'Popular',
      results: 'Results',
      none: 'Nothing matched',
      noneBody: 'Try a shorter word, or the name of the coverage — “general liability”, “SR-22”, “movers”.',
      talk: 'Talk to a licensed agent',
      quote: 'Get a free quote',
      all: 'See all results',
      close: 'Close search',
      hint: 'to select',
      esc: 'to close',
      count: function (n) { return n + (n === 1 ? ' result' : ' results'); },
    },
    ru: {
      placeholder: 'Поиск: страховки, статьи, инструменты…',
      label: 'Поиск по сайту',
      popular: 'Популярное',
      results: 'Результаты',
      none: 'Ничего не найдено',
      noneBody: 'Попробуйте короче или название страховки — «SR-22», «грузоперевозки», «маникюр».',
      talk: 'Поговорить с агентом',
      quote: 'Получить расчёт',
      all: 'Показать все результаты',
      close: 'Закрыть поиск',
      hint: 'выбрать',
      esc: 'закрыть',
      count: function (n) {
        var d = n % 10, h = n % 100;
        var w = (d === 1 && h !== 11) ? ' результат' : (d >= 2 && d <= 4 && (h < 12 || h > 14)) ? ' результата' : ' результатов';
        return n + w;
      },
    },
  };

  var lang = (document.documentElement.lang || 'en').slice(0, 2);
  if (lang !== 'ru') lang = 'en';
  var t = T[lang];
  var INDEX_URL = '/search-index-' + lang + '.json';
  var CACHE_KEY = 'ct-search-' + lang + '-v1';

  /* ---------- text normalisation ---------- */

  // Fold case, strip accents, unify ё/е (Russian keyboards are inconsistent
  // about it and nobody means anything by the difference), and reduce every
  // separator to a single space. Cyrillic is kept — \w would eat it.
  function norm(s) {
    return String(s == null ? '' : s)
      .toLowerCase()
      // NFD + strip combining marks does the Russian folding for free:
      // ё -> е and й -> и, which is exactly the tolerance we want.
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9Ѐ-ӿ]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  function toks(s) { var n = norm(s); return n ? n.split(' ') : []; }

  // Words that carry no intent. Dropped from the QUERY only (never from the
  // index) so that "how much does it cost" is judged on how/much/cost and is
  // not punished for the two words that were never going to match anything.
  var STOP = {
    the: 1, a: 1, an: 1, of: 1, for: 1, to: 1, in: 1, on: 1, at: 1, is: 1, are: 1,
    do: 1, does: 1, did: 1, it: 1, my: 1, me: 1, i: 1, we: 1, you: 1, your: 1,
    and: 1, or: 1, with: 1, that: 1, this: 1, be: 1, can: 1,
    и: 1, в: 1, во: 1, на: 1, с: 1, со: 1, у: 1, о: 1, об: 1, к: 1, по: 1, за: 1,
    для: 1, от: 1, до: 1, же: 1, ли: 1, я: 1, мне: 1, мой: 1, моя: 1, это: 1, как: 1,
  };
  function queryToks(s) {
    var all = toks(s);
    var kept = all.filter(function (w) { return !STOP[w]; });
    return kept.length ? kept : all;  // an all-stopword query still searches
  }

  // Bounded Levenshtein: bails out as soon as the whole row exceeds `max`,
  // so a long non-match costs almost nothing.
  function lev(a, b, max) {
    var al = a.length, bl = b.length;
    if (Math.abs(al - bl) > max) return max + 1;
    var prev = new Array(bl + 1), cur = new Array(bl + 1), i, j;
    for (j = 0; j <= bl; j++) prev[j] = j;
    for (i = 1; i <= al; i++) {
      cur[0] = i;
      var best = cur[0];
      for (j = 1; j <= bl; j++) {
        var cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1;
        cur[j] = Math.min(cur[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
        if (cur[j] < best) best = cur[j];
      }
      if (best > max) return max + 1;
      var tmp = prev; prev = cur; cur = tmp;
    }
    return prev[bl];
  }

  // How many characters we forgive in a token of this length. Short tokens get
  // no slack (at 2 chars everything is within 1 edit of everything), longer
  // ones get more because that is where real typing errors live.
  function tolerance(n) { return n <= 2 ? 0 : n <= 4 ? 1 : 2; }

  // Score one query token against one field's tokens. The prefix comparison —
  // not whole-token comparison — is what gives us autocomplete on a partial
  // word while still tolerating a misspelling inside it.
  function matchToken(q, fieldToks) {
    var best = 0, tol = tolerance(q.length), i;
    for (i = 0; i < fieldToks.length; i++) {
      var ft = fieldToks[i];
      if (ft === q) return 1;
      if (ft.length >= q.length && ft.lastIndexOf(q, 0) === 0) { if (best < 0.92) best = 0.92; continue; }
      if (!tol) continue;
      // Fuzzy matches must agree on the first letter. People mistype the
      // middle of a word, essentially never the start — and without this gate
      // a 2-edit budget lets "mining" reach "filing", which is how fuzzy
      // search earns its reputation for returning garbage.
      if (ft.charCodeAt(0) !== q.charCodeAt(0)) continue;
      var pre = ft.slice(0, q.length);
      if (pre.length + tol < q.length) continue;
      var d = lev(q, pre, tol);
      if (d <= tol) { var s = 0.78 - 0.13 * d; if (s > best) best = s; }
    }
    return best;
  }

  /* ---------- index ---------- */

  var data = null, loading = null, geoTerms = null;

  function prepare(json) {
    var e = json.entries, i;
    for (i = 0; i < e.length; i++) {
      var x = e[i];
      x._t = toks(x.t);
      x._k = toks(x.k);
      x._d = toks(x.d);
      x._c = toks(x.c);
      x._nt = norm(x.t);
      x._nk = norm(x.k);
    }
    // Every place name in the index, taken from the entries' own `p` field
    // (set by search-entries.js). Deriving it from the URL slug instead would
    // miss every Russian spelling — "техас" is not in "/texas/...".
    geoTerms = Object.create(null);
    for (i = 0; i < e.length; i++) {
      if (!e[i].p) continue;
      toks(e[i].p).forEach(function (w) { if (w.length > 1) geoTerms[w] = 1; });
    }
    data = json;
    return json;
  }

  function load() {
    if (data) return Promise.resolve(data);
    if (loading) return loading;
    try {
      var hit = sessionStorage.getItem(CACHE_KEY);
      if (hit) return Promise.resolve(prepare(JSON.parse(hit)));
    } catch (e) {}
    loading = fetch(INDEX_URL, { credentials: 'same-origin' })
      .then(function (r) { if (!r.ok) throw new Error('index ' + r.status); return r.text(); })
      .then(function (txt) {
        try { sessionStorage.setItem(CACHE_KEY, txt); } catch (e) {}
        return prepare(JSON.parse(txt));
      })
      .catch(function (err) { loading = null; throw err; });
    return loading;
  }

  /* ---------- ranking ---------- */

  var TYPE_W = { service: 1, tool: 0.95, page: 0.9, guide: 0.86, state: 0.5 };

  function search(qRaw, limit) {
    if (!data) return [];
    var q = norm(qRaw), qt = queryToks(qRaw);
    if (!q || !qt.length) return [];

    var isGeo = false, i;
    for (i = 0; i < qt.length; i++) if (geoTerms[qt[i]]) { isGeo = true; break; }

    var out = [];
    for (i = 0; i < data.entries.length; i++) {
      var x = data.entries[i], score = 0, matched = 0, j;

      for (j = 0; j < qt.length; j++) {
        var tk = qt[j];
        var s = matchToken(tk, x._t) * 10;
        var k = matchToken(tk, x._k) * 7; if (k > s) s = k;
        var c = matchToken(tk, x._c) * 3; if (c > s) s = c;
        var d = matchToken(tk, x._d) * 2; if (d > s) s = d;
        if (s > 0) { matched++; score += s; }
      }
      if (!matched) continue;

      // A query where only half the words landed is a much weaker answer than
      // one where they all did, even if the raw sum looks similar. Below half
      // it is usually an accident — one incidental word in an unrelated page —
      // so it gets cut hard rather than merely scaled.
      var cover = matched / qt.length;
      score *= 0.3 + 0.7 * cover;
      if (cover < 0.5) score *= 0.45;

      // Phrase bonus, scaled by how much of the title the query accounts for.
      // Without that scaling a 90-character article headline that happens to
      // contain "workers compensation" outranks the actual Workers' Comp
      // product page, because the long title has more room to contain things.
      // The curve is deliberately steep. On the RU site "general liability"
      // was landing on the ARTICLE about general liability instead of the
      // product page, purely because the article's 90-character headline
      // happens to open with those two words. A phrase that accounts for a
      // fifth of a headline is weak evidence; one that IS the title is strong.
      var fit = 0.2 + 0.8 * Math.min(1, q.length / Math.max(q.length, x._nt.length));
      if (x._nt === q) score += 100;
      else if (x._nt.lastIndexOf(q, 0) === 0) score += 48 * fit;
      else if (x._nt.indexOf(q) !== -1) score += 30 * fit;
      else if (x._nk.indexOf(q) !== -1) score += 22;

      score *= TYPE_W[x.y] || 0.8;
      if (x.y === 'state' && isGeo) score *= 2.7;
      if (x.h) score *= 1.15;   // home market (CA) wins ties between location pages

      if (score >= CFG.minScore) out.push({ e: x, s: score });
    }

    out.sort(function (a, b) { return b.s - a.s || a.e.t.length - b.e.t.length; });

    // Keep the generated location pages from swamping a generic query. If the
    // visitor named a place we leave them alone; if they did not, three is
    // plenty and the real service page should lead.
    if (!isGeo) {
      var n = 0, kept = [];
      for (i = 0; i < out.length; i++) {
        if (out[i].e.y === 'state') { if (n >= CFG.stateCap) continue; n++; }
        kept.push(out[i]);
      }
      out = kept;
    }
    return out.slice(0, limit || CFG.limit);
  }

  function popular() {
    if (!data) return [];
    var want = data.popular || [], out = [], i, j;
    for (i = 0; i < want.length; i++) {
      for (j = 0; j < data.entries.length; j++) {
        var e = data.entries[j];
        if (e.y === 'service' && e.u.split('/').pop() === want[i]) { out.push({ e: e, s: 0 }); break; }
      }
    }
    return out;
  }

  /* ---------- rendering ---------- */

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // Underline the part of the title the visitor actually typed, so a fuzzy hit
  // visibly explains itself instead of looking like a random result.
  function mark(text, qRaw) {
    var safe = esc(text);
    var qs = norm(qRaw).split(' ').filter(function (w) { return w.length > 1; });
    if (!qs.length) return safe;
    try {
      var re = new RegExp('(' + qs.map(function (w) {
        return w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }).join('|') + ')', 'gi');
      return safe.replace(re, '<mark>$1</mark>');
    } catch (e) { return safe; }
  }

  function rowHtml(r, q, idx, id) {
    var e = r.e;
    return '<a class="cts-row" role="option" id="' + id + '-o' + idx + '" aria-selected="false" href="' + esc(e.u) + '" data-i="' + idx + '">' +
      '<span class="cts-row-main"><span class="cts-row-t">' + mark(e.t, q) + '</span>' +
      (e.d ? '<span class="cts-row-d">' + esc(e.d) + '</span>' : '') + '</span>' +
      '<span class="cts-badge">' + esc(e.c) + '</span></a>';
  }

  function dl(obj) {
    try { window.dataLayer = window.dataLayer || []; window.dataLayer.push(obj); } catch (e) {}
  }

  /* ---------- the shared controller for a box + its result list ---------- */

  function Controller(opts) {
    var input = opts.input, listEl = opts.list, id = opts.id;
    var limit = opts.limit || CFG.limit;
    var results = [], cursor = -1, lastQ = '', tDebounce = 0, tIdle = 0, reported = '';

    function setActive(i) {
      var rows = listEl.querySelectorAll('.cts-row');
      if (!rows.length) return;
      if (i < 0) i = rows.length - 1;
      if (i >= rows.length) i = 0;
      cursor = i;
      for (var k = 0; k < rows.length; k++) {
        var on = k === i;
        rows[k].classList.toggle('is-active', on);
        rows[k].setAttribute('aria-selected', on ? 'true' : 'false');
      }
      input.setAttribute('aria-activedescendant', rows[i].id);
      rows[i].scrollIntoView({ block: 'nearest' });
    }

    function render(q) {
      var html = '', head = '';
      if (!q) {
        results = popular();
        head = t.popular;
      } else {
        results = search(q, limit);
        head = results.length ? t.count(results.length) : '';
      }
      if (!results.length && q) {
        var quoteHref = lang === 'en' ? '/quote' : '/ru/quote';
        listEl.innerHTML = '<div class="cts-empty"><strong>' + esc(t.none) + ' “' + esc(q) + '”</strong>' +
          '<p>' + esc(t.noneBody) + '</p><div class="cts-empty-cta">' +
          '<a class="btn btn-call" href="tel:+13102995555">📞 ' + esc(t.talk) + '</a>' +
          '<a class="btn btn-text" href="' + quoteHref + '">' + esc(t.quote) + '</a></div></div>';
        input.setAttribute('aria-expanded', 'true');
        cursor = -1;
        return;
      }
      for (var i = 0; i < results.length; i++) html += rowHtml(results[i], q, i, id);
      listEl.innerHTML = (head ? '<div class="cts-head">' + esc(head) + '</div>' : '') + html;
      input.setAttribute('aria-expanded', results.length ? 'true' : 'false');
      cursor = -1;
      if (results.length && opts.autoActive !== false) setActive(0);
    }

    // Analytics fires on a settle, not on every keystroke: one event per real
    // query instead of eight partial ones. `search` is GA4's built-in name so
    // it lands in Site Search reporting; the zero-result event is the one
    // worth actually reading — it is a list of pages we have not written.
    function report(q) {
      if (!q || q.length < 2 || q === reported) return;
      reported = q;
      dl({
        event: 'search', search_term: q, search_results: results.length,
        search_lang: lang, search_surface: opts.surface, page_path: location.pathname,
      });
      if (!results.length) {
        dl({ event: 'search_no_results', search_term: q, search_lang: lang, search_surface: opts.surface, page_path: location.pathname });
      }
    }

    function onInput() {
      var q = input.value.trim();
      clearTimeout(tDebounce); clearTimeout(tIdle);
      tDebounce = setTimeout(function () {
        lastQ = q;
        render(q);
        tIdle = setTimeout(function () { report(q); }, CFG.analyticsIdle);
      }, CFG.debounce);
    }

    function go(i) {
      var r = results[i];
      if (!r) return false;
      dl({
        event: 'search_select', search_term: lastQ, search_result_url: r.e.u,
        search_result_title: r.e.t, search_result_type: r.e.y, search_result_position: i + 1,
        search_lang: lang, search_surface: opts.surface,
      });
      location.href = r.e.u;
      return true;
    }

    input.addEventListener('input', onInput);
    input.addEventListener('keydown', function (ev) {
      if (ev.key === 'ArrowDown') { ev.preventDefault(); setActive(cursor + 1); }
      else if (ev.key === 'ArrowUp') { ev.preventDefault(); setActive(cursor - 1); }
      else if (ev.key === 'Enter') {
        clearTimeout(tIdle); report(input.value.trim());
        if (cursor >= 0 && go(cursor)) { ev.preventDefault(); return; }
        if (results.length && go(0)) { ev.preventDefault(); return; }
        if (opts.onSubmit) { ev.preventDefault(); opts.onSubmit(input.value.trim()); }
      } else if (ev.key === 'Escape' && opts.onEscape) { ev.preventDefault(); opts.onEscape(); }
    });
    listEl.addEventListener('click', function (ev) {
      var a = ev.target.closest && ev.target.closest('.cts-row');
      if (!a) return;
      ev.preventDefault();
      go(parseInt(a.getAttribute('data-i'), 10));
    });

    return { render: render, setValue: function (v) { input.value = v; }, input: input };
  }

  /* ---------- overlay ---------- */

  var overlay = null, ctl = null, lastFocus = null;

  function build() {
    overlay = document.createElement('div');
    overlay.className = 'cts-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', t.label);
    overlay.innerHTML =
      '<div class="cts-backdrop" data-close="1"></div>' +
      '<div class="cts-panel">' +
        '<div class="cts-bar">' +
          '<svg class="cts-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 21l-4.3-4.3M11 19a8 8 0 110-16 8 8 0 010 16z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
          '<input id="cts-input" class="cts-input" type="search" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" ' +
            'role="combobox" aria-expanded="false" aria-controls="cts-list" aria-autocomplete="list" ' +
            'placeholder="' + esc(t.placeholder) + '" aria-label="' + esc(t.label) + '" />' +
          '<button class="cts-close" type="button" data-close="1" aria-label="' + esc(t.close) + '">✕</button>' +
        '</div>' +
        '<div id="cts-list" class="cts-list" role="listbox" aria-label="' + esc(t.results) + '"></div>' +
        '<div class="cts-foot"><span><kbd>↑</kbd><kbd>↓</kbd> ' + esc(t.hint) + '</span><span><kbd>Esc</kbd> ' + esc(t.esc) + '</span></div>' +
      '</div>';
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function (ev) {
      if (ev.target.getAttribute && ev.target.getAttribute('data-close')) close();
    });

    ctl = Controller({
      input: overlay.querySelector('#cts-input'),
      list: overlay.querySelector('#cts-list'),
      id: 'cts', surface: 'overlay', limit: CFG.limit,
      onEscape: close,
      onSubmit: function (q) {
        if (!q) return;
        location.href = (lang === 'en' ? '/search' : '/ru/search') + '?q=' + encodeURIComponent(q);
      },
    });
  }

  function open(how) {
    lastFocus = document.activeElement;
    load().then(function () {
      if (!overlay) build();
      overlay.classList.add('is-open');
      document.documentElement.classList.add('cts-lock');
      ctl.render('');
      ctl.input.focus();
      dl({ event: 'search_open', search_trigger: how || 'click', search_lang: lang, page_path: location.pathname });
    }).catch(function () {
      // Index unreachable — never trap the visitor in a dead overlay.
      location.href = lang === 'en' ? '/search' : '/ru/search';
    });
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove('is-open');
    document.documentElement.classList.remove('cts-lock');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  // Keep focus inside the dialog while it is open.
  document.addEventListener('keydown', function (ev) {
    if (!overlay || !overlay.classList.contains('is-open')) return;
    if (ev.key === 'Escape') { close(); return; }
    if (ev.key !== 'Tab') return;
    var f = overlay.querySelectorAll('input,button,a[href]');
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
    else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
  });

  /* ---------- the /search page ---------- */

  function mountPage(el) {
    load().then(function () {
      var pc = Controller({
        input: el.querySelector('#cts-page-input'),
        list: el.querySelector('#cts-page-list'),
        id: 'ctsp', surface: 'page', limit: CFG.limitPage, autoActive: false,
      });
      var q = new URLSearchParams(location.search).get('q') || '';
      pc.setValue(q);
      pc.render(q.trim());
      if (!q) pc.input.focus();
    }).catch(function () {
      el.querySelector('#cts-page-list').innerHTML = '<div class="cts-empty"><strong>' + esc(t.none) + '</strong></div>';
    });
  }

  window.CTSearch = { open: open, close: close, mountPage: mountPage, load: load, _search: search };

  var pageEl = document.getElementById('cts-page');
  if (pageEl) mountPage(pageEl);
  if (window.__ctsPending) { window.__ctsPending = false; open(window.__ctsHow || 'click'); }
})();
