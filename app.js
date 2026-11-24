(function () {
  'use strict';
  var loc = d3Format();
  function d3Format() {
    var nf1 = new Intl.NumberFormat('pt-BR', {minimumFractionDigits: 1, maximumFractionDigits: 1});
    var nf0 = new Intl.NumberFormat('pt-BR', {maximumFractionDigits: 0});
    return {f1: function (v) { return nf1.format(v); }, f0: function (v) { return nf0.format(v); }};
  }
  var LIM = {quente: 60, fria: 10};
  var D = {};

  function get(u) { return fetch(u).then(function (r) { if (!r.ok) throw new Error(u); return r.json(); }); }

  Promise.all([get('data/temperaturas.json'), get('data/briefing.json'), get('data/amostras.json'), get('data/plano.json'), get('data/fatos.json')])
    .then(function (r) {
      D.temps = r[0]; D.brief = r[1]; D.amostras = r[2]; D.plano = r[3]; D.fatos = r[4];
      D.kpis = kpis(); D.placar = placar();
      renderAll();
      var t; window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(renderCharts, 120); });
    })
    .catch(function () {
      document.querySelectorAll('[data-draw]').forEach(function (el) { if (!el.children.length) el.textContent = '—'; });
    });

  function kpis() {
    var q = [], f = [];
    D.temps.forEach(function (t) { (t.tipo === 'quente' ? q : f).push(+t.mesa1, +t.mesa2); });
    var qa = q.filter(function (v) { return v < LIM.quente; }).length;
    var fa = f.filter(function (v) { return v > LIM.fria; }).length;
    var col = D.amostras.filter(function (a) { return a.coletada === 'Sim'; }).length;
    return {
      quentes_total: q.length, quentes_abaixo: qa, quentes_pct: q.length ? qa / q.length * 100 : 0,
      frias_total: f.length, frias_acima: fa, frias_pct: f.length ? fa / f.length * 100 : 0,
      amostras_total: D.amostras.length, amostras_coletadas: col, amostras_pct: D.amostras.length ? col / D.amostras.length * 100 : 0
    };
  }

  function placar() {
    var keys = {'Cumprido': 'cumprido', 'Parcial': 'parcial', 'Não cumprido': 'nao_cumprido', 'Não verificado': 'nao_verificado'};
    function mk(name, rows) {
      var o = {lider: name, total: rows.length, cumprido: 0, parcial: 0, nao_cumprido: 0, nao_verificado: 0};
      rows.forEach(function (x) { o[keys[x.situacao]]++; });
      return o;
    }
    var names = [];
    D.brief.forEach(function (x) { if (names.indexOf(x.lider) < 0) names.push(x.lider); });
    return [mk('Total', D.brief)].concat(names.map(function (n) { return mk(n, D.brief.filter(function (x) { return x.lider === n; })); }));
  }

  function renderAll() {
    each('kpi', function (el) {
      var v = D.kpis[el.dataset.field];
      el.textContent = v == null ? '—' : (el.dataset.fmt === 'pct' ? loc.f1(v) + '%' : loc.f0(v));
    });
    each('fato', function (el) {
      var r = D.fatos.filter(function (x) { return x.chave === el.dataset.k; })[0];
      el.textContent = r ? String(+r.valor).replace('.', ',') : '—';
    });
    each('lim', function (el) { el.textContent = LIM[el.dataset.k] + ' °C'; });
    leaders(); amostras(); plano(); renderCharts();
  }

  function each(name, fn) { document.querySelectorAll('[data-draw="' + name + '"]').forEach(fn); }
  function h(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  function leaders() {
    each('leaders', function (el) {
      el.textContent = '';
      var cats = [['cumprido', 'Cumprido', 'ok'], ['parcial', 'Parcial', 'warn'], ['nao_cumprido', 'Não cumprido', 'bad'], ['nao_verificado', 'Não verificado', 'nv']];
      D.placar.forEach(function (d) {
        var row = h('div', 'dp-row' + (d.lider === 'Total' ? ' dp-total' : ''));
        row.appendChild(h('span', '', d.lider));
        var bar = h('div', 'dp-bar');
        bar.setAttribute('role', 'img');
        bar.setAttribute('aria-label', d.lider + ': ' + cats.map(function (c) { return d[c[0]] + ' ' + c[1].toLowerCase(); }).join(', '));
        cats.forEach(function (c) {
          if (!d[c[0]]) return;
          var s = h('span', 'dp-seg ' + c[2], d[c[0]]);
          s.style.flex = d[c[0]] + ' 0 0';
          s.title = c[1];
          bar.appendChild(s);
        });
        row.appendChild(bar);
        el.appendChild(row);
      });
    });
  }

  function amostras() {
    each('amostras', function (el) {
      el.textContent = '';
      D.amostras.forEach(function (d) {
        var ok = d.coletada === 'Sim';
        var c = h('div', 'dp-chip' + (ok ? ' s' : ''));
        c.appendChild(h('b', '', ok ? '🧪' : '➖'));
        c.appendChild(h('span', '', d.prep));
        var s = h('div', '', ok ? 'amostra coletada' : 'sem amostra');
        s.style.fontSize = '11px'; s.style.color = 'var(--color-fg-muted)';
        c.appendChild(s);
        el.appendChild(c);
      });
    });
  }

  var ICONS = ['🌡️', '🧊', '🧪', '🗓️', '🔁', '🧹', '📦', '📝'];
  function plano() {
    each('plano', function (el) {
      el.textContent = '';
      D.plano.forEach(function (d, i) {
        var c = h('div', 'dp-card dp-pl ' + d.prioridade);
        var top = h('div', 'top');
        top.appendChild(h('span', 'no', String(d.n).padStart(2, '0')));
        top.appendChild(h('span', 'dp-pri ' + d.prioridade, d.prioridade));
        c.appendChild(top);
        c.appendChild(h('div', 'ic', ICONS[i % ICONS.length]));
        c.appendChild(h('div', 'sol', d.acao));
        c.appendChild(h('div', 'pb', '👤 ' + d.resp));
        el.appendChild(c);
      });
    });
  }

  var NS = 'http://www.w3.org/2000/svg';
  function s(tag, attrs, text) {
    var e = document.createElementNS(NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (text != null) e.textContent = text;
    return e;
  }

  function tempChart(el, tipo, max, lim, isOk) {
    el.textContent = '';
    var rows = D.temps.filter(function (r) { return r.tipo === tipo; });
    var W = Math.max(260, el.clientWidth), m = {l: 112, r: 52, t: 22, b: 4}, bh = 14, gp = 3, rh = bh * 2 + gp + 12;
    var H = m.t + rows.length * rh + m.b;
    var x = function (v) { return m.l + (W - m.r - m.l) * v / max; };
    var svg = s('svg', {width: W, height: H, role: 'img', 'aria-label': 'Barras de temperatura por preparação e mesa, com linha de referência em ' + lim + ' °C'});
    var tip = h('div', 'dp-tip');
    rows.forEach(function (r, i) {
      var y0 = m.t + i * rh;
      svg.appendChild(s('text', {x: m.l - 8, y: y0 + bh + 3, 'text-anchor': 'end'}, r.prep));
      [['mesa1', 'M1', 0], ['mesa2', 'M2', 1]].forEach(function (k) {
        var v = +r[k[0]], y = y0 + k[2] * (bh + gp);
        var rect = s('rect', {x: m.l, y: y, width: Math.max(2, x(v) - m.l), height: bh, rx: 3});
        rect.style.fill = isOk(v) ? 'var(--color-ok)' : 'var(--color-bad)';
        rect.addEventListener('mousemove', function (ev) {
          var b = el.getBoundingClientRect();
          tip.style.display = 'block';
          tip.textContent = r.prep + ' · ' + k[1] + ': ' + loc.f1(v) + ' °C';
          tip.style.left = Math.min(ev.clientX - b.left + 10, Math.max(0, W - 190)) + 'px';
          tip.style.top = (ev.clientY - b.top + 12) + 'px';
        });
        rect.addEventListener('mouseleave', function () { tip.style.display = 'none'; });
        svg.appendChild(rect);
        svg.appendChild(s('text', {'class': 'w', x: m.l + 4, y: y + bh - 3}, k[1]));
        svg.appendChild(s('text', {'class': 'v', x: x(v) + 4, y: y + bh - 3}, loc.f1(v)));
      });
    });
    var ln = s('line', {x1: x(lim), x2: x(lim), y1: 14, y2: H - m.b, 'stroke-dasharray': '4 3', 'stroke-width': 1.5});
    ln.style.stroke = 'var(--cds-chart-reference)';
    svg.appendChild(ln);
    svg.appendChild(s('text', {x: x(lim), y: 10, 'text-anchor': 'middle'}, lim + ' °C'));
    el.appendChild(svg);
    el.appendChild(tip);
  }

  function renderCharts() {
    each('chart-quentes', function (el) { tempChart(el, 'quente', 70, LIM.quente, function (v) { return v >= LIM.quente; }); });
    each('chart-frias', function (el) { tempChart(el, 'fria', 20, LIM.fria, function (v) { return v <= LIM.fria; }); });
  }
})();
