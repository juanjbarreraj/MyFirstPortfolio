/* ============================================================================
   THE ART OF WAR AND PEACE — interactive exhibition
   Self-contained: no external libraries, no network requests.
   ========================================================================== */
(function () {
'use strict';
var D = window.__AWP__, IMG = window.__IMG__;
var RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var byId = {}; D.figures.forEach(function (f, i) { f.i = i; byId[f.id] = f; });
D.throng.forEach(function (w, i) { w.i = i; w.isWork = true; byId[w.id] = w; });
byId[D.faiths.id] = D.faiths;
var mirrorOf = {};
D.pairs.forEach(function (p) {
  mirrorOf[p[0]] = { id: p[1], rel: p[2] };
  mirrorOf[p[1]] = { id: p[0], rel: p[2] };
});

/* ------------------------------------------------------------------ motion */
function reveal(root) {
  var els = (root || document).querySelectorAll('.rv:not(.in)');
  if (RM || !('IntersectionObserver' in window)) {
    [].forEach.call(els, function (e) { e.classList.add('in'); }); return;
  }
  var io = new IntersectionObserver(function (ents) {
    ents.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target, d = parseFloat(el.dataset.d || 0);
      setTimeout(function () { el.classList.add('in'); }, d * 1000);
      io.unobserve(el);
    });
  }, { rootMargin: '0px 0px -9% 0px', threshold: 0.06 });
  [].forEach.call(els, function (e) { io.observe(e); });
}
function stagger(list, step) {
  [].forEach.call(list, function (el, i) { el.dataset.d = (i * (step || 0.045)).toFixed(3); });
}

/* --------------------------------------------------------------- overture  */
function buildTitle() {
  var h = document.getElementById('otitle');
  h.innerHTML = h.textContent.trim().split(/\s+/).map(function (w) {
    return '<span class="w"><i>' + w + '</i></span>';
  }).join(' ');
}

/* ------------------------------------------------------------------ index  */
var gridEl = document.getElementById('grid');
function figCard(f) {
  var b = document.createElement('button');
  b.className = 'card rv rv-fast'; b.type = 'button';
  b.dataset.id = f.id;
  b.setAttribute('aria-label', 'Open ' + f.name);
  b.innerHTML = '<span class="ph"><img src="' + IMG[f.id] + '" alt="Graphite portrait of ' + f.name +
                ' by Lorrie Anne Minicozzi" loading="lazy"></span>' +
                '<span class="nm">' + f.name + '</span><span class="dt">' + f.dates + '</span>';
  b.addEventListener('click', function () { openDetail(f.id, b.querySelector('img')); });
  return b;
}
D.figures.forEach(function (f) { gridEl.appendChild(figCard(f)); });
stagger(gridEl.children, 0.022);

var searchEl = document.getElementById('q'), countEl = document.getElementById('count'),
    noneEl = document.getElementById('none');
function applyFilter() {
  var q = (searchEl.value || '').trim().toLowerCase(), n = 0;
  [].forEach.call(gridEl.children, function (c) {
    var f = byId[c.dataset.id];
    var hit = !q || (f.name + ' ' + f.dates + ' ' + f.teaser).toLowerCase().indexOf(q) >= 0;
    c.classList.toggle('hide', !hit); if (hit) n++;
  });
  countEl.textContent = n === D.figures.length ? D.figures.length + ' figures' : n + ' of ' + D.figures.length;
  noneEl.style.display = n ? 'none' : 'block';
}
searchEl.addEventListener('input', applyFilter);
applyFilter();

/* -------------------------------------------------------------- landscape  */
var GLOBE_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><ellipse cx="12" cy="12" rx="3.6" ry="8.5"/><path d="M3.5 12h17"/></svg>';
var worksEl = document.getElementById('works');
D.throng.forEach(function (w) {
  var art = document.createElement('article'); art.className = 'wk rv'; art.id = 'work-' + w.id;
  var ims = [{ k: w.img, a: w.ar, alt: w.name + ', foam sculpture detail by Lorrie Anne Minicozzi' }];
  if (w.ref) ims.push({ k: w.ref.img, a: w.ref.ar, alt: w.caps[1] ? w.caps[1].t.replace(/<[^>]+>/g, '') : w.name });
  var stack = w.layout === 'stack', sum = 0;
  ims.forEach(function (m) { sum += m.a; });
  var maxw = stack ? 760 : Math.min(760, Math.round(440 * sum));
  art.innerHTML =
    '<h3>' + w.name + '</h3>' + (w.subtitle ? '<p class="wsub">' + w.subtitle + '</p>' : '') +
    '<div class="wims' + (stack ? ' stack' : '') + '" style="max-width:' + maxw + 'px">' +
    ims.map(function (m) {
      return '<button class="wim" type="button" data-id="' + w.id + '"' + (stack ? '' : ' style="flex:' + m.a + ' 1 0"') +
        ' aria-label="Read about ' + w.name + '"><img src="' + IMG[m.k] + '" alt="' + m.alt.replace(/"/g, '&quot;') +
        '" loading="lazy" style="aspect-ratio:' + m.a + '"></button>';
    }).join('') + '</div>' +
    '<div class="wcaps">' + w.caps.map(function (c) { return '<p>' + (c.pos ? c.pos + ': ' : '') + c.t + '</p>'; }).join('') + '</div>' +
    '<p class="wex">' + w.excerpt + '</p>' +
    '<div class="wact">' + (w.p ? '<button class="glink" type="button" data-globe="' + w.id + '">' + GLOBE_SVG + 'See it on the globe</button>' : '') +
    '<button class="more lead" type="button" data-id="' + w.id + '"><i></i>Read more</button></div>';
  [].forEach.call(art.querySelectorAll('[data-id]'), function (btn) {
    btn.addEventListener('click', function () { openDetail(w.id, art.querySelector('.wim img')); });
  });
  var g = art.querySelector('[data-globe]');
  if (g) g.addEventListener('click', function () { showOnGlobe(w.id, 0); });
  worksEl.appendChild(art);
});

/* ---------------------------------------------------------------- overlay  */
var ov = document.getElementById('ov'), ghost = document.getElementById('ghost');
var elImg = document.getElementById('ovImg'), elCap = document.getElementById('ovCap'),
    elKy = document.getElementById('ovKy'), elName = document.getElementById('ovName'),
    elDates = document.getElementById('ovDates'), elProse = document.getElementById('ovProse'),
    elMirror = document.getElementById('ovMirror'), elIdx = document.getElementById('ovIdx'),
    elGlobe = document.getElementById('ovGlobe'), EXTRA = D.extra || {},
    elPrev = document.getElementById('ovPrev'), elNext = document.getElementById('ovNext');
var curId = null, lastFocus = null, scrollY = 0;

function seqOf(id) { return byId[id].isWork ? D.throng : D.figures; }

function fillDetail(id) {
  var f = byId[id]; curId = id;
  var seq = seqOf(id), isFaith = id === 'faiths';
  elImg.src = IMG[f.isWork ? f.img : id];
  elImg.alt = (f.isWork ? f.name : 'Graphite portrait of ' + f.name + ' by Lorrie Anne Minicozzi');
  elImg.parentNode.classList.toggle('is-plate', !!f.isWork || isFaith);
  if (f.isWork) elCap.innerHTML = f.caps[0].t; else elCap.textContent = 'Graphite on paper';
  elCap.style.display = isFaith ? 'none' : 'block';
  elName.textContent = f.name;
  elDates.innerHTML = f.isWork ? (f.subtitle ? '<b class="ovsub">' + f.subtitle + '</b>' : '') : f.dates;
  elDates.style.display = elDates.innerHTML ? 'block' : 'none';
  globeLinks(f);
  var refEl = document.getElementById('ovRef');
  if (f.isWork && f.ref) {
    refEl.style.display = 'block';
    refEl.innerHTML = '<img src="' + IMG[f.ref.img] + '" alt="">' +
      '<span class="rcr">' + (f.caps[1] ? f.caps[1].t : '') + '</span>';
  } else { refEl.style.display = 'none'; refEl.innerHTML = ''; }
  elKy.textContent = isFaith ? 'The unifying layer'
      : f.isWork ? 'The Landscape · Work ' + (f.i + 1) + ' of ' + D.throng.length
      : (f.kind === 'icon' ? 'The Figures · An image, not a person' : 'The Figures · Portrait ' + (f.i + 1) + ' of ' + D.figures.length);
  elProse.innerHTML = f.text.map(function (p) { return '<p>' + p + '</p>'; }).join('');

  elMirror.style.display = 'none'; elMirror.innerHTML = '';

  if (isFaith) { elIdx.textContent = ''; elPrev.style.visibility = elNext.style.visibility = 'hidden'; }
  else {
    elPrev.style.visibility = elNext.style.visibility = 'visible';
    elIdx.textContent = (f.i + 1) + ' / ' + seq.length;
  }
  try { history.replaceState(null, '', '#' + id); } catch (e) {}
}


/* back to the globe from a story: close it, bring the globe into view, turn to the spot and make the marker pulse */
function globeLinks(f) {
  var n = 0;
  if (f.isWork) n = f.p ? 1 : 0;
  else if (f.id !== 'faiths') n = (f.p || f.u !== undefined ? 1 : 0) + (EXTRA[f.id] ? EXTRA[f.id].length : 0);
  if (!n || !globe) { elGlobe.innerHTML = ''; return; }
  var h = '<button type="button" data-k="0">' + GLOBE_SVG + 'Show on the globe</button>';
  if (n > 1) h += '<button type="button" class="alt" data-k="1">Show the second portrait</button>';
  elGlobe.innerHTML = h;
  [].forEach.call(elGlobe.querySelectorAll('button'), function (b) {
    b.addEventListener('click', function () { showOnGlobe(f.id, +b.dataset.k); });
  });
}
function showOnGlobe(id, k) {
  var go = function () {
    var st = document.getElementById('stage'), r = st.getBoundingClientRect();
    var top = (window.scrollY || window.pageYOffset || 0) + r.top - Math.max(64, (window.innerHeight - r.height) / 2);
    window.scrollTo({ top: Math.max(0, top), behavior: RM ? 'auto' : 'smooth' });
    setTimeout(function () { if (globe) globe.focus(id, k || 0); }, RM ? 0 : 520);
  };
  if (ov.classList.contains('open')) { closeDetail(); setTimeout(go, RM ? 30 : 430); } else go();
}
function openDetail(id, srcImgEl, k) {
  var wasOpen = ov.classList.contains('open');
  fillDetail(id);
  if (globe && byId[id] && byId[id].u !== undefined) globe.rotateTo(id, k || 0);
  if (wasOpen) { document.querySelector('#ov .sheet').scrollTop = 0; return; }
  lastFocus = document.activeElement;
  scrollY = window.scrollY || window.pageYOffset || 0;
  ov.classList.add('open');
  document.body.classList.add('awp-lock');
  document.body.style.top = (-scrollY) + 'px';
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';
  if (srcImgEl && !RM) flip(srcImgEl);
  requestAnimationFrame(function () { ov.classList.add('in'); });
  setTimeout(function () { document.getElementById('ovClose').focus({ preventScroll: true }); }, 60);
}

/* FLIP: the chosen portrait flies from the grid into the overlay */
function flip(srcEl) {
  var a = srcEl.getBoundingClientRect();
  ghost.querySelector('img').src = srcEl.src;
  ghost.style.display = 'block';
  ghost.style.left = a.left + 'px'; ghost.style.top = a.top + 'px';
  ghost.style.width = a.width + 'px'; ghost.style.height = a.height + 'px';
  ghost.style.transition = 'none'; ghost.style.opacity = '1';
  requestAnimationFrame(function () {
    var b = elImg.getBoundingClientRect();
    if (!b.width) { ghost.style.display = 'none'; return; }
    ghost.style.transition = 'left .62s var(--ease),top .62s var(--ease),width .62s var(--ease),height .62s var(--ease),opacity .22s ease .44s';
    ghost.style.left = b.left + 'px'; ghost.style.top = b.top + 'px';
    ghost.style.width = b.width + 'px'; ghost.style.height = b.height + 'px';
    ghost.style.opacity = '0';
    setTimeout(function () { ghost.style.display = 'none'; }, 700);
  });
}

function closeDetail() {
  if (!ov.classList.contains('open')) return;
  ov.classList.remove('in');
  setTimeout(function () {
    ov.classList.remove('open');
    /* Restoring the scroll must be instant. The page uses scroll-behavior:smooth
       for the nav links, and without this guard the browser animates all the way
       back from the top after the fixed body is released. */
    var root = document.documentElement;
    root.classList.add('no-smooth');
    document.body.classList.remove('awp-lock');
    document.body.style.position = ''; document.body.style.top = ''; document.body.style.width = '';
    window.scrollTo(0, scrollY);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    requestAnimationFrame(function () {
      window.scrollTo(0, scrollY);            /* belt and braces on iOS */
      requestAnimationFrame(function () { root.classList.remove('no-smooth'); });
    });
  }, RM ? 0 : 380);
  try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
}
function step(d) {
  var seq = seqOf(curId), f = byId[curId];
  var n = seq[(f.i + d + seq.length) % seq.length];
  fillDetail(n.id); if (globe) globe.rotateTo(n.id);
  document.querySelector('#ov .sheet').scrollTop = 0;
}
document.getElementById('ovClose').addEventListener('click', closeDetail);
document.querySelector('#ov .scrim').addEventListener('click', closeDetail);
elPrev.addEventListener('click', function () { step(-1); });
elNext.addEventListener('click', function () { step(1); });
document.addEventListener('keydown', function (e) {
  if (!ov.classList.contains('open')) return;
  if (e.key === 'Escape') closeDetail();
  else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
  else if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
  else if (e.key === 'Tab') {
    var f = ov.querySelectorAll('button'), first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});
document.getElementById('faithsOpen').addEventListener('click', function () { openDetail('faiths', null); });

/* ------------------------------------------------------------------- bar   */
var bar = document.getElementById('bar');
var links = [].slice.call(bar.querySelectorAll('nav a'));
var secs = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
window.addEventListener('scroll', function () {
  bar.classList.toggle('show', window.scrollY > window.innerHeight * 0.72);
  var y = window.scrollY + window.innerHeight * 0.34, best = -1;
  secs.forEach(function (s, i) { if (s && s.offsetTop <= y) best = i; });
  links.forEach(function (a, i) { a.classList.toggle('on', i === best); });
}, { passive: true });

/* ==========================================================================
   THE GLOBE  —  WebGL viewer
   ========================================================================== */
var globe = null;
function initGlobe(substrate, portraits) {
  var stage = document.getElementById('stage'), canvas = document.getElementById('gl');
  var gl = (window.__SPLAT__ && canvas.getContext('webgl2', { antialias: false, alpha: true, premultipliedAlpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: false })) ||
           canvas.getContext('webgl', { antialias: true, alpha: true }) ||
           canvas.getContext('experimental-webgl', { antialias: true, alpha: true });
  if (!gl) { document.getElementById('glfallback').style.display = 'grid'; return null; }

  /* ---- maths ---- */
  function nrm(a) { var l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function dot3(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function qI() { return [0, 0, 0, 1]; }
  function qA(ax, an) { var s = Math.sin(an / 2); return [ax[0] * s, ax[1] * s, ax[2] * s, Math.cos(an / 2)]; }
  function qM(a, b) {
    return [a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
            a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
            a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
            a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2]];
  }
  function qN(q) { var l = Math.hypot(q[0], q[1], q[2], q[3]) || 1; return [q[0] / l, q[1] / l, q[2] / l, q[3] / l]; }
  function qRot(q, v) {
    var qv = [q[0], q[1], q[2]], uv = cross(qv, v), uu = cross(qv, uv);
    return [v[0] + 2 * (uv[0] * q[3] + uu[0]), v[1] + 2 * (uv[1] * q[3] + uu[1]), v[2] + 2 * (uv[2] * q[3] + uu[2])];
  }
  function qFrom(a, b) {
    var d = dot3(a, b);
    if (d > 0.99999) return qI();
    if (d < -0.99999) { var ax = cross([1, 0, 0], a); if (Math.hypot(ax[0], ax[1], ax[2]) < 1e-4) ax = cross([0, 1, 0], a); return qA(nrm(ax), Math.PI); }
    var c = cross(a, b); return qN([c[0], c[1], c[2], 1 + d]);
  }
  function qS(a, b, t) {
    var d = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3], bb = b;
    if (d < 0) { d = -d; bb = [-b[0], -b[1], -b[2], -b[3]]; }
    if (d > 0.9995) return qN([a[0] + (bb[0] - a[0]) * t, a[1] + (bb[1] - a[1]) * t, a[2] + (bb[2] - a[2]) * t, a[3] + (bb[3] - a[3]) * t]);
    var th = Math.acos(d), s = Math.sin(th);
    var wa = Math.sin((1 - t) * th) / s, wb = Math.sin(t * th) / s;
    return [a[0] * wa + bb[0] * wb, a[1] * wa + bb[1] * wb, a[2] * wa + bb[2] * wb, a[3] * wa + bb[3] * wb];
  }
  function persp(fy, ar, n, f) { var t = 1 / Math.tan(fy / 2), nf = 1 / (n - f);
    return new Float32Array([t / ar, 0, 0, 0, 0, t, 0, 0, 0, 0, (f + n) * nf, -1, 0, 0, 2 * f * n * nf, 0]); }
  function lookAt(e, c, u) {
    var z = nrm([e[0] - c[0], e[1] - c[1], e[2] - c[2]]), x = nrm(cross(u, z)), y = cross(z, x);
    return new Float32Array([x[0], y[0], z[0], 0, x[1], y[1], z[1], 0, x[2], y[2], z[2], 0,
      -(x[0] * e[0] + x[1] * e[1] + x[2] * e[2]), -(y[0] * e[0] + y[1] * e[1] + y[2] * e[2]),
      -(z[0] * e[0] + z[1] * e[1] + z[2] * e[2]), 1]);
  }
  function m4q(q) {
    var x = q[0], y = q[1], z = q[2], w = q[3], x2 = x + x, y2 = y + y, z2 = z + z;
    var xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2,
        wx = w * x2, wy = w * y2, wz = w * z2;
    return new Float32Array([1 - (yy + zz), xy + wz, xz - wy, 0, xy - wz, 1 - (xx + zz), yz + wx, 0,
      xz + wy, yz - wx, 1 - (xx + yy), 0, 0, 0, 0, 1]);
  }
  function mp(m, v) {
    return [m[0] * v[0] + m[4] * v[1] + m[8] * v[2] + m[12], m[1] * v[0] + m[5] * v[1] + m[9] * v[2] + m[13],
            m[2] * v[0] + m[6] * v[1] + m[10] * v[2] + m[14], m[3] * v[0] + m[7] * v[1] + m[11] * v[2] + m[15]];
  }

  var TH0 = D.theta0, THL = Math.PI - D.theta0;
  function uvPos(u, f, r) {
    var th = TH0 + f * THL, ph = u * Math.PI * 2;
    return [-Math.cos(ph) * Math.sin(th) * r, Math.cos(th) * r, Math.sin(ph) * Math.sin(th) * r];
  }

  /* ---- geometry ---- */
  function sphere(rad, wS, hS, t0, tl) {
    var pos = [], nr = [], uv = [], ix = [];
    for (var iy = 0; iy <= hS; iy++) {
      var v = iy / hS, th = t0 + v * tl, sT = Math.sin(th), cT = Math.cos(th);
      for (var i2 = 0; i2 <= wS; i2++) {
        var u = i2 / wS, ph = u * Math.PI * 2;
        var nx = -Math.cos(ph) * sT, ny = cT, nz = Math.sin(ph) * sT;
        pos.push(nx * rad, ny * rad, nz * rad); nr.push(nx, ny, nz); uv.push(u, v);
      }
    }
    for (iy = 0; iy < hS; iy++) for (i2 = 0; i2 < wS; i2++) {
      var a = iy * (wS + 1) + i2, b = a + wS + 1; ix.push(a, b, a + 1, b, b + 1, a + 1);
    }
    return { pos: new Float32Array(pos), nrm: new Float32Array(nr), uv: new Float32Array(uv), idx: new Uint16Array(ix) };
  }
  function disc(rad, seg, y) {
    var pos = [0, y, 0], nr = [0, 1, 0], uv = [0.5, 0.5], ix = [];
    for (var i = 0; i <= seg; i++) { var a = i / seg * Math.PI * 2;
      pos.push(Math.cos(a) * rad, y, Math.sin(a) * rad); nr.push(0, 1, 0);
      uv.push(0.5 + Math.cos(a) * 0.5, 0.5 + Math.sin(a) * 0.5); }
    for (i = 1; i <= seg; i++) ix.push(0, i, i + 1);
    return { pos: new Float32Array(pos), nrm: new Float32Array(nr), uv: new Float32Array(uv), idx: new Uint16Array(ix) };
  }
  function rng(s) { return function () { s |= 0; s = s + 0x6D2B79F5 | 0; var t = Math.imul(s ^ s >>> 15, 1 | s);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  /* the throng: torn rim + chains of small climbing figures */
  function throngGeo() {
    var rd = rng(18061945), blob = sphere(1, 7, 5, 0, Math.PI);
    var pos = [], nr = [], ix = [], base = 0;
    function add(cx, cy, cz, sx, sy, sz, ry) {
      var c = Math.cos(ry), s = Math.sin(ry);
      for (var i = 0; i < blob.pos.length; i += 3) {
        var x = blob.pos[i] * sx, y = blob.pos[i + 1] * sy, z = blob.pos[i + 2] * sz;
        pos.push(x * c - z * s + cx, y + cy, x * s + z * c + cz);
        var nx = blob.nrm[i] / sx, ny = blob.nrm[i + 1] / sy, nz = blob.nrm[i + 2] / sz;
        var l = Math.hypot(nx, ny, nz) || 1; nx /= l; ny /= l; nz /= l;
        nr.push(nx * c - nz * s, ny, nx * s + nz * c);
      }
      for (i = 0; i < blob.idx.length; i++) ix.push(blob.idx[i] + base);
      base += blob.pos.length / 3;
    }
    var rR = Math.sin(TH0), rY = Math.cos(TH0);
    for (var i = 0; i < 150; i++) {           /* torn plaster rim */
      var a = i / 150 * Math.PI * 2 + (rd() - 0.5) * 0.05;
      var rr = rR * (0.985 + (rd() - 0.5) * 0.055), yy = rY + (rd() - 0.5) * 0.05;
      var s = 0.013 + rd() * 0.027;
      add(Math.cos(a) * rr, yy, Math.sin(a) * rr, s * (0.9 + rd() * 0.9), s * (0.45 + rd() * 0.55), s * (0.9 + rd() * 0.9), rd() * 6.28);
    }
    for (var k = 0; k < 13; k++) {            /* arcs of climbing figures */
      var a1 = k / 13 * Math.PI * 2 + (rd() - 0.5) * 0.22, a2 = a1 + Math.PI * (0.55 + rd() * 0.5);
      var p0 = [Math.cos(a1) * rR, rY, Math.sin(a1) * rR], p3 = [Math.cos(a2) * rR, rY, Math.sin(a2) * rR];
      var ap = 1.36 + rd() * 0.26, mx = (p0[0] + p3[0]) / 2, mz = (p0[2] + p3[2]) / 2;
      var p1 = [p0[0] * 1.34, rY + (ap - rY) * 0.66, p0[2] * 1.34];
      var p2 = [mx * 0.16 + (rd() - 0.5) * 0.16, ap, mz * 0.16 + (rd() - 0.5) * 0.16];
      var N = 23;
      for (var j = 0; j <= N; j++) {
        var t = j / N, it = 1 - t;
        var bx = it * it * it * p0[0] + 3 * it * it * t * p1[0] + 3 * it * t * t * p2[0] + t * t * t * p3[0];
        var by = it * it * it * p0[1] + 3 * it * it * t * p1[1] + 3 * it * t * t * p2[1] + t * t * t * p3[1];
        var bz = it * it * it * p0[2] + 3 * it * it * t * p1[2] + 3 * it * t * t * p2[2] + t * t * t * p3[2];
        var s2 = 0.0072 + rd() * 0.0055;
        var ry = rd() * 6.28;
        add(bx, by, bz, s2 * 0.85, s2 * 2.05, s2 * 0.85, ry);                                  /* torso */
        add(bx + (rd() - .5) * .006, by + s2 * 2.55, bz + (rd() - .5) * .006, s2 * .78, s2 * .78, s2 * .78, 0); /* head */
        var sp = s2 * 1.85;                                                                    /* linked arms */
        add(bx + Math.cos(ry) * sp, by + s2 * 1.5, bz + Math.sin(ry) * sp, s2 * 1.25, s2 * .34, s2 * .34, ry);
      }
    }
    return { pos: new Float32Array(pos), nrm: new Float32Array(nr), uv: new Float32Array(pos.length / 3 * 2), idx: new Uint16Array(ix) };
  }

  /* ---- shaders ---- */
  var VS = ['attribute vec3 aPos;attribute vec3 aNrm;attribute vec2 aUv;',
    'uniform mat4 uP,uV,uM;varying vec3 vN;varying vec2 vUv;varying vec3 vW;',
    'void main(){vec4 w=uM*vec4(aPos,1.0);vW=w.xyz;vN=mat3(uM)*aNrm;vUv=aUv;gl_Position=uP*uV*w;}'].join('\n');
  var FS = ['precision mediump float;uniform sampler2D uT;uniform float uUseT,uInOn;',
    'uniform vec3 uC,uIn,uCam;uniform float uLift;varying vec3 vN;varying vec2 vUv;varying vec3 vW;',
    'void main(){vec3 n=normalize(vN);bool bk=!gl_FrontFacing;if(bk)n=-n;',
    ' vec3 b=uUseT>0.5?texture2D(uT,vUv).rgb:uC;bool inside=bk&&uInOn>0.5;if(inside)b=uIn;b=mix(b,vec3(1.0),uLift);',
    ' vec3 L1=normalize(vec3(2.0,3.2,2.6)),L2=normalize(vec3(-2.6,0.6,-1.8));',
    ' float hemi=inside?(0.70+0.20*(n.y*0.5+0.5)):(0.50+0.32*(n.y*0.5+0.5));',
    ' float d1=max(dot(n,L1),0.0)*0.52,d2=max(dot(n,L2),0.0)*0.16;',
    ' vec3 V=normalize(uCam-vW);float rim=pow(1.0-max(dot(n,V),0.0),3.2)*0.10;',
    ' vec3 c=b*(hemi+d1)+vec3(0.55,0.70,0.82)*d2*b+vec3(rim)*vec3(0.8,0.9,1.0);',
    ' gl_FragColor=vec4(c,1.0);}'].join('\n');
  function sh(t, s) { var o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o);
    if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; }
  var prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(prog); gl.useProgram(prog);
  var L = {
    aPos: gl.getAttribLocation(prog, 'aPos'), aNrm: gl.getAttribLocation(prog, 'aNrm'), aUv: gl.getAttribLocation(prog, 'aUv'),
    uP: gl.getUniformLocation(prog, 'uP'), uV: gl.getUniformLocation(prog, 'uV'), uM: gl.getUniformLocation(prog, 'uM'),
    uT: gl.getUniformLocation(prog, 'uT'), uUseT: gl.getUniformLocation(prog, 'uUseT'),
    uC: gl.getUniformLocation(prog, 'uC'), uIn: gl.getUniformLocation(prog, 'uIn'),
    uInOn: gl.getUniformLocation(prog, 'uInOn'), uCam: gl.getUniformLocation(prog, 'uCam'), uLift: gl.getUniformLocation(prog, 'uLift')
  };
  var EXT32 = (typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext) ? true : gl.getExtension('OES_element_index_uint');
  function mesh(g) {
    var m = { n: g.idx.length, type: (g.idx instanceof Uint32Array) ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT };
    m.v = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, m.v); gl.bufferData(gl.ARRAY_BUFFER, g.pos, gl.STATIC_DRAW);
    m.nb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, m.nb); gl.bufferData(gl.ARRAY_BUFFER, g.nrm, gl.STATIC_DRAW);
    m.u = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, m.u); gl.bufferData(gl.ARRAY_BUFFER, g.uv, gl.STATIC_DRAW);
    m.i = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, m.i); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, g.idx, gl.STATIC_DRAW);
    return m;
  }
  function draw(m) {
    gl.bindBuffer(gl.ARRAY_BUFFER, m.v); gl.enableVertexAttribArray(L.aPos); gl.vertexAttribPointer(L.aPos, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, m.nb); gl.enableVertexAttribArray(L.aNrm); gl.vertexAttribPointer(L.aNrm, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, m.u); gl.enableVertexAttribArray(L.aUv); gl.vertexAttribPointer(L.aUv, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, m.i);
    gl.drawElements(gl.TRIANGLES, m.n, m.type || gl.UNSIGNED_SHORT, 0);
  }
  function texFromCanvas(cv) {
    var t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, cv);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D);
    var an = gl.getExtension('EXT_texture_filter_anisotropic');
    if (an) gl.texParameterf(gl.TEXTURE_2D, an.TEXTURE_MAX_ANISOTROPY_EXT,
      Math.min(8, gl.getParameter(an.MAX_TEXTURE_MAX_ANISOTROPY_EXT)));
    return t;
  }

  /* ---- the painted surface, composited from her drawings ---- */
  function buildSurface() {
    var TW = 2048, TH = 1024;
    var ink = document.createElement('canvas'); ink.width = TW; ink.height = TH;
    var ig = ink.getContext('2d');
    ig.fillStyle = '#fff'; ig.fillRect(0, 0, TW, TH);
    ig.globalCompositeOperation = 'multiply';
    D.figures.forEach(function (f) {
      var im = portraits[f.id]; if (!im) return;
      var fy = D.bandF[f.band];
      var th = TH0 + fy * THL;
      var w = 236 / Math.max(0.36, Math.sin(th));
      var h = w * im.height / im.width;
      var x = f.u * TW - w / 2, y = fy * TH - h / 2;
      [x - TW, x, x + TW].forEach(function (xo) { ig.drawImage(im, xo, y, w, h); });
    });
    ig.globalCompositeOperation = 'source-over';
    ig.globalAlpha = 0.24; ig.fillStyle = '#fff'; ig.fillRect(0, 0, TW, TH); ig.globalAlpha = 1;
    var cv = document.createElement('canvas'); cv.width = TW; cv.height = TH;
    var g = cv.getContext('2d');
    g.drawImage(substrate, 0, 0, TW, TH);
    g.globalCompositeOperation = 'multiply'; g.drawImage(ink, 0, 0);
    g.globalCompositeOperation = 'source-over';
    return cv;
  }
  /* ---- the water within ---- */
  function waterCanvas() {
    var s = 512, cv = document.createElement('canvas'); cv.width = cv.height = s;
    var g = cv.getContext('2d'), rd = rng(7);
    g.fillStyle = '#3f6b96'; g.fillRect(0, 0, s, s);
    var pal = ['#7fb4dd', '#5b93c6', '#a4cae6', '#cfe3f2', '#46769f', '#8fc0e2'];
    for (var i = 0; i < 1100; i++) {
      var x = rd() * s, y = rd() * s, r = 6 + rd() * 12;
      g.fillStyle = pal[(rd() * pal.length) | 0];
      g.globalAlpha = 0.55 + rd() * 0.45;
      g.fillRect(x - r, y - r, r * 1.9, r * 1.9);
    }
    g.globalAlpha = 1;
    return cv;
  }

  var mBowl = mesh(sphere(1, 108, 72, TH0, THL));
  var mWater = mesh(disc(0.545, 60, 0.545));
  var mThrong = mesh(throngGeo());
  var texSurf = texFromCanvas(buildSurface());

  /* ---- the real sculpture ----------------------------------------------
     When a photogrammetry scan is published beside the page
     (window.__MODEL__ = 'scan/model.obj'), it is loaded here and drawn in
     place of everything built above. Texture comes from the OBJ's .mtl.  */
  var SCAN = null, SCAN_PENDING = !!window.__MODEL__;
  if (SCAN_PENDING) { stage.classList.add('scan-pending'); canvas.style.opacity = '0'; canvas.style.transition = 'opacity .9s ease'; }
  function scanArrived() { window.__awpDirty = true; SCAN_PENDING = false; stage.classList.remove('scan-pending'); canvas.style.opacity = '1'; }
  function scanFailed() { SCAN_PENDING = false; stage.classList.remove('scan-pending'); canvas.style.opacity = '1'; }
  function parseOBJ(text) {
    var V = [], T = [], N = [], key = {}, pos = [], uv = [], nrm = [], idx = [], count = 0;
    var lines = text.split('\n');
    function vert(tok) {
      if (key[tok] !== undefined) return key[tok];
      var p = tok.split('/'), vi = parseInt(p[0], 10), ti = p[1] ? parseInt(p[1], 10) : 0, ni = p[2] ? parseInt(p[2], 10) : 0;
      vi = vi < 0 ? V.length / 3 + vi : vi - 1; ti = ti < 0 ? T.length / 2 + ti : ti - 1; ni = ni < 0 ? N.length / 3 + ni : ni - 1;
      pos.push(V[vi * 3], V[vi * 3 + 1], V[vi * 3 + 2]);
      uv.push(ti >= 0 ? T[ti * 2] : 0, ti >= 0 ? T[ti * 2 + 1] : 0);
      nrm.push(ni >= 0 ? N[ni * 3] : 0, ni >= 0 ? N[ni * 3 + 1] : 0, ni >= 0 ? N[ni * 3 + 2] : 0);
      return (key[tok] = count++);
    }
    var mtl = null;
    for (var i = 0; i < lines.length; i++) {
      var l = lines[i]; if (l.length < 3) continue;
      var c0 = l.charCodeAt(0), c1 = l.charCodeAt(1);
      if (c0 === 118 && c1 === 32) { var a = l.slice(2).trim().split(/\s+/); V.push(+a[0], +a[1], +a[2]); }
      else if (c0 === 118 && c1 === 116) { a = l.slice(3).trim().split(/\s+/); T.push(+a[0], +a[1]); }
      else if (c0 === 118 && c1 === 110) { a = l.slice(3).trim().split(/\s+/); N.push(+a[0], +a[1], +a[2]); }
      else if (c0 === 102 && c1 === 32) {
        a = l.slice(2).trim().split(/\s+/);
        var f0 = vert(a[0]), prev = vert(a[1]);
        for (var k = 2; k < a.length; k++) { var cur = vert(a[k]); idx.push(f0, prev, cur); prev = cur; }
      }
      else if (l.indexOf('mtllib') === 0) mtl = l.slice(6).trim();
    }
    /* normals: compute if the file has none */
    if (N.length === 0) {
      for (i = 0; i < idx.length; i += 3) {
        var a0 = idx[i] * 3, b0 = idx[i + 1] * 3, c0_ = idx[i + 2] * 3;
        var ux = pos[b0] - pos[a0], uy = pos[b0 + 1] - pos[a0 + 1], uz = pos[b0 + 2] - pos[a0 + 2];
        var vx = pos[c0_] - pos[a0], vy = pos[c0_ + 1] - pos[a0 + 1], vz = pos[c0_ + 2] - pos[a0 + 2];
        var nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
        [a0, b0, c0_].forEach(function (o) { nrm[o] += nx; nrm[o + 1] += ny; nrm[o + 2] += nz; });
      }
      for (i = 0; i < nrm.length; i += 3) { var ln = Math.hypot(nrm[i], nrm[i + 1], nrm[i + 2]) || 1; nrm[i] /= ln; nrm[i + 1] /= ln; nrm[i + 2] /= ln; }
    }
    /* fit: centre the sculpture and scale its height to the space the built globe used */
    var mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9];
    for (i = 0; i < pos.length; i += 3) for (var d = 0; d < 3; d++) { if (pos[i + d] < mn[d]) mn[d] = pos[i + d]; if (pos[i + d] > mx[d]) mx[d] = pos[i + d]; }
    var fit = (window.__MODEL_FIT__ || {});
    var ext = [mx[0] - mn[0], mx[1] - mn[1], mx[2] - mn[2]];
    var sc = (fit.scale || 2.6) / Math.max(ext[0], ext[1], ext[2]);
    var cx = (mn[0] + mx[0]) / 2 + (fit.dx || 0), cy = (mn[1] + mx[1]) / 2 + (fit.dy || 0), cz = (mn[2] + mx[2]) / 2 + (fit.dz || 0);
    for (i = 0; i < pos.length; i += 3) { pos[i] = (pos[i] - cx) * sc; pos[i + 1] = (pos[i + 1] - cy) * sc; pos[i + 2] = (pos[i + 2] - cz) * sc; }
    var Idx = (count > 65535 && EXT32) ? new Uint32Array(idx) : new Uint16Array(idx);
    return { pos: new Float32Array(pos), nrm: new Float32Array(nrm), uv: new Float32Array(uv), idx: Idx, mtl: mtl, verts: count };
  }
  function texFromImage(img) {
    var t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    var pot = (img.width & (img.width - 1)) === 0 && (img.height & (img.height - 1)) === 0;
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, pot ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    if (pot) gl.generateMipmap(gl.TEXTURE_2D);
    return t;
  }
  /* compact binary written by clean.py: 'AWP1', header length, JSON header,
     then positions (u16, quantised to the header's lo/hi box), normals (i8),
     uvs (u16) and triangle indices (u32). Already centred on the globe with
     radius 1, so no fitting is needed here beyond an optional turn. */
  function parseAWP(buf) {
    var u8 = new Uint8Array(buf), dv = new DataView(buf);
    if (String.fromCharCode(u8[0], u8[1], u8[2], u8[3]) !== 'AWP1') throw new Error('not a scan file');
    var hl = dv.getUint32(4, true), hdr = JSON.parse(new TextDecoder().decode(u8.subarray(8, 8 + hl)));
    var o = 8 + hl, nv = hdr.nv, ni = hdr.ni;
    var P = new Uint16Array(buf.slice(o, o + nv * 6)); o += nv * 6;
    var Nn = new Int8Array(buf.slice(o, o + nv * 3)); o += nv * 3;
    var U = new Uint16Array(buf.slice(o, o + nv * 4)); o += nv * 4;
    var I = new Uint32Array(buf.slice(o, o + ni * 4));
    var fit = (window.__MODEL_FIT__ || {}), sc = fit.scale || 1, ry = fit.rotY || 0, cr = Math.cos(ry), sr = Math.sin(ry);
    var pos = new Float32Array(nv * 3), nrm = new Float32Array(nv * 3), uv = new Float32Array(nv * 2);
    var lo = hdr.lo, hi = hdr.hi;
    for (var i = 0; i < nv; i++) {
      var x = (lo[0] + P[i * 3] / 65535 * (hi[0] - lo[0])) * sc + (fit.dx || 0);
      var y = (lo[1] + P[i * 3 + 1] / 65535 * (hi[1] - lo[1])) * sc + (fit.dy || 0);
      var z = (lo[2] + P[i * 3 + 2] / 65535 * (hi[2] - lo[2])) * sc + (fit.dz || 0);
      pos[i * 3] = x * cr + z * sr; pos[i * 3 + 1] = y; pos[i * 3 + 2] = -x * sr + z * cr;
      var nx = Nn[i * 3] / 127, ny = Nn[i * 3 + 1] / 127, nz = Nn[i * 3 + 2] / 127;
      nrm[i * 3] = nx * cr + nz * sr; nrm[i * 3 + 1] = ny; nrm[i * 3 + 2] = -nx * sr + nz * cr;
      uv[i * 2] = U[i * 2] / 65535; uv[i * 2 + 1] = U[i * 2 + 1] / 65535;
    }
    var Idx = (nv > 65535 && EXT32) ? I : new Uint16Array(I);
    window.__scanGeo = { pos: pos, idx: I };
    return { pos: pos, nrm: nrm, uv: uv, idx: Idx, mtl: null, tex: hdr.tex || null, verts: nv };
  }
  function loadScan(url) {
    var base = url.slice(0, url.lastIndexOf('/') + 1);
    var note = document.getElementById('scanNote');
    if (note) { note.textContent = 'Loading the scanned sculpture…'; note.style.display = 'block'; }
    if (/\.(awp|bin|wasm)(\?|$)/.test(url)) {
      fetch(url).then(function (r) { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); }).then(function (buf) {
        var g = parseAWP(buf), m = mesh(g);
        if (window.__HYBRID__) {  /* triangles of the interior only (below the rim, inside the shell) */
          var YC = (window.__HYB_YCUT__ !== undefined ? window.__HYB_YCUT__ : 0.30), RC = (window.__HYB_RCUT__ !== undefined ? window.__HYB_RCUT__ : 0.93);
          var P = g.pos, I = g.idx, keep = [];
          for (var t = 0; t < I.length; t += 3) {
            var ok = true;
            for (var k = 0; k < 3 && ok; k++) { var vi = I[t + k], px = P[vi * 3], py = P[vi * 3 + 1], pz = P[vi * 3 + 2]; if (py > YC || Math.sqrt(px * px + py * py + pz * pz) > RC) ok = false; }
            if (ok) keep.push(I[t], I[t + 1], I[t + 2]);
          }
          var ib = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(keep), gl.STATIC_DRAW);
          m.inner = { v: m.v, nb: m.nb, u: m.u, i: ib, n: keep.length, type: gl.UNSIGNED_INT };
          console.log('hybrid: interior triangles', keep.length / 3);
        }
        return new Promise(function (res) {
          if (!g.tex) return res(null);
          var im = new Image(); im.crossOrigin = 'anonymous';
          im.onload = function () { res(im); }; im.onerror = function () { res(null); };
          im.src = base + g.tex;
        }).then(function (img) {
          SCAN = { mesh: m, tex: img ? texFromImage(img) : null, verts: g.verts };
          window.__scanReady = true; scanArrived();
          if (note) note.style.display = 'none';
        });
      }).catch(function (e) {
        if (note) { note.textContent = 'The scan could not be loaded — showing the sketch instead.'; setTimeout(function () { note.style.display = 'none'; }, 6000); }
        console.warn('scan load failed', e); scanFailed();
      });
      return;
    }
    fetch(url).then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); }).then(function (txt) {
      var g = parseOBJ(txt);
      var m = mesh(g);
      var texUrl = null;
      var next = g.mtl ? fetch(base + g.mtl).then(function (r) { return r.ok ? r.text() : ''; }) : Promise.resolve('');
      return next.then(function (mtlTxt) {
        var mm = /map_Kd\s+(\S+)/.exec(mtlTxt || '');
        texUrl = mm ? base + mm[1] : (window.__MODEL_TEX__ ? base + window.__MODEL_TEX__ : null);
        return new Promise(function (res) {
          if (!texUrl) return res(null);
          var im = new Image(); im.crossOrigin = 'anonymous';
          im.onload = function () { res(im); }; im.onerror = function () { res(null); };
          im.src = texUrl;
        });
      }).then(function (img) {
        SCAN = { mesh: m, tex: img ? texFromImage(img) : null, verts: g.verts };
        window.__scanReady = true; scanArrived();
        if (note) note.style.display = 'none';
      });
    }).catch(function (e) {
      if (note) { note.textContent = 'The scan could not be loaded — showing the sketch instead.'; setTimeout(function () { note.style.display = 'none'; }, 6000); }
      console.warn('scan load failed', e); scanFailed();
    });
  }
  /* ---- the photoreal sculpture: Gaussian splats ---------------------------
     window.__SPLAT__ points at a packed 'AWS1' file already placed in the
     same frame as the mesh (globe radius 1, y up), so the camera, the home
     view and the 44 hotspots all work unchanged. Needs WebGL2; without it,
     or if the file fails, the page falls back to the scanned mesh.        */
  var SPLAT = null, GL2 = (typeof WebGL2RenderingContext !== 'undefined') && (gl instanceof WebGL2RenderingContext);
  var _f32 = new Float32Array(1), _u32 = new Uint32Array(_f32.buffer);
  function toHalf(v) {
    _f32[0] = v; var x = _u32[0];
    var bits = (x >> 16) & 0x8000, m = (x >> 12) & 0x07ff, e = (x >> 23) & 0xff;
    if (e < 103) return bits;
    if (e > 142) { bits |= 0x7c00; bits |= ((e === 255) ? 0 : 1) && (x & 0x007fffff); return bits; }
    if (e < 113) { m |= 0x0800; bits |= (m >> (114 - e)) + ((m >> (113 - e)) & 1); return bits; }
    bits |= ((e - 112) << 10) | (m >> 1); bits += m & 1; return bits;
  }
  var COV_K = 1e4;   /* covariances are stored x1e4 so small splats survive half floats */
  function parseSplat(buf) {
    var u8 = new Uint8Array(buf), dv = new DataView(buf);
    if (String.fromCharCode(u8[0], u8[1], u8[2], u8[3]) !== 'AWS1') throw new Error('not a splat file');
    var hl = dv.getUint32(4, true), h = JSON.parse(new TextDecoder().decode(u8.subarray(8, 8 + hl)));
    var n = h.n, o = 8 + hl;
    var P = new Uint16Array(buf, o, n * 3); o += n * 6;
    var S = new Uint8Array(buf, o, n * 3); o += n * 3;
    var R = new Uint8Array(buf, o, n * 4); o += n * 4;
    var C = new Uint8Array(buf, o, n * 4);
    var rows = Math.ceil(n / 1024), tex = new Uint32Array(2048 * rows * 4), texF = new Float32Array(tex.buffer);
    var pos = new Float32Array(n * 3), lo = h.lo, hi = h.hi, sl = h.slo, sk = (h.shi - h.slo) / 255;
    var ex = [(hi[0] - lo[0]) / 65535, (hi[1] - lo[1]) / 65535, (hi[2] - lo[2]) / 65535];
    for (var i = 0; i < n; i++) {
      var x = lo[0] + P[i * 3] * ex[0], y = lo[1] + P[i * 3 + 1] * ex[1], z = lo[2] + P[i * 3 + 2] * ex[2];
      pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z;
      var t = i * 8;
      texF[t] = x; texF[t + 1] = y; texF[t + 2] = z;
      var s0 = Math.exp(sl + S[i * 3] * sk), s1 = Math.exp(sl + S[i * 3 + 1] * sk), s2 = Math.exp(sl + S[i * 3 + 2] * sk);
      var qw = R[i * 4] / 127.5 - 1, qx = R[i * 4 + 1] / 127.5 - 1, qy = R[i * 4 + 2] / 127.5 - 1, qz = R[i * 4 + 3] / 127.5 - 1;
      var ql = Math.hypot(qw, qx, qy, qz) || 1; qw /= ql; qx /= ql; qy /= ql; qz /= ql;
      /* M = R * S ; Sigma = M M^T */
      var m00 = (1 - 2 * (qy * qy + qz * qz)) * s0, m01 = (2 * (qx * qy - qw * qz)) * s1, m02 = (2 * (qx * qz + qw * qy)) * s2;
      var m10 = (2 * (qx * qy + qw * qz)) * s0, m11 = (1 - 2 * (qx * qx + qz * qz)) * s1, m12 = (2 * (qy * qz - qw * qx)) * s2;
      var m20 = (2 * (qx * qz - qw * qy)) * s0, m21 = (2 * (qy * qz + qw * qx)) * s1, m22 = (1 - 2 * (qx * qx + qy * qy)) * s2;
      var c00 = (m00 * m00 + m01 * m01 + m02 * m02) * COV_K, c01 = (m00 * m10 + m01 * m11 + m02 * m12) * COV_K;
      var c02 = (m00 * m20 + m01 * m21 + m02 * m22) * COV_K, c11 = (m10 * m10 + m11 * m11 + m12 * m12) * COV_K;
      var c12 = (m10 * m20 + m11 * m21 + m12 * m22) * COV_K, c22 = (m20 * m20 + m21 * m21 + m22 * m22) * COV_K;
      tex[t + 4] = (toHalf(c00) | (toHalf(c01) << 16)) >>> 0;
      tex[t + 5] = (toHalf(c02) | (toHalf(c11) << 16)) >>> 0;
      tex[t + 6] = (toHalf(c12) | (toHalf(c22) << 16)) >>> 0;
      tex[t + 7] = (C[i * 4] | (C[i * 4 + 1] << 8) | (C[i * 4 + 2] << 16) | (C[i * 4 + 3] << 24)) >>> 0;
    }
    return { n: n, rows: rows, tex: tex, pos: pos };
  }
  var SPLAT_VS = ['#version 300 es', 'precision highp float; precision highp int;',
    'uniform highp usampler2D uData; uniform mat4 uP, uMV; uniform vec2 uFocal, uView; uniform float uCovK, uAA, uBias;',
    'in vec2 aPos; in uint aIdx; out vec4 vCol; out vec2 vPos;',
    'void main(){',
    ' ivec2 tc = ivec2(int((aIdx & 1023u) << 1), int(aIdx >> 10));',
    ' uvec4 a = texelFetch(uData, tc, 0);',
    ' vec4 cam = uMV * vec4(uintBitsToFloat(a.xyz), 1.0); vec4 clip = uP * cam;',
    ' float lim = 1.2 * clip.w;',
    ' if (cam.z > -0.02 || clip.x < -lim || clip.x > lim || clip.y < -lim || clip.y > lim) { gl_Position = vec4(0.0, 0.0, 2.0, 1.0); return; }',
    ' uvec4 b = texelFetch(uData, tc + ivec2(1, 0), 0);',
    ' vec2 u1 = unpackHalf2x16(b.x), u2 = unpackHalf2x16(b.y), u3 = unpackHalf2x16(b.z);',
    ' mat3 V = mat3(u1.x, u1.y, u2.x, u1.y, u2.y, u3.x, u2.x, u3.x, u3.y) * uCovK;',
    ' mat3 W = mat3(uMV); mat3 Sv = W * V * transpose(W);',
    ' float z = cam.z;',
    ' mat3 J = mat3(uFocal.x / -z, 0.0, 0.0,  0.0, uFocal.y / -z, 0.0,  uFocal.x * cam.x / (z * z), uFocal.y * cam.y / (z * z), 0.0);',
    ' mat3 C = J * Sv * transpose(J);',
    ' float d0 = C[0][0] * C[1][1] - C[0][1] * C[0][1];',
    ' float a00 = C[0][0] + 0.3, a11 = C[1][1] + 0.3, a01 = C[0][1];',
    ' float kv = uFocal.x / -z; float eps = 0.3 * min(1.0, (kv * kv) * uAA);',
    ' float d1 = (C[0][0] + eps) * (C[1][1] + eps) - a01 * a01;',
    ' float comp = min(1.0, sqrt(max(d0, 0.0) / max(d1, 1e-12))) ;',
    ' float mid = 0.5 * (a00 + a11), rad = length(vec2(0.5 * (a00 - a11), a01));',
    ' float l1 = mid + rad, l2 = mid - rad;',
    ' if (l2 <= 0.0) { gl_Position = vec4(0.0, 0.0, 2.0, 1.0); return; }',
    ' vCol = vec4(float(b.w & 255u), float((b.w >> 8) & 255u), float((b.w >> 16) & 255u), float(b.w >> 24)) / 255.0;',
    ' vCol.a *= comp * smoothstep(0.05, 0.25, -cam.z);',
    ' if (vCol.a < 0.0045) { gl_Position = vec4(0.0, 0.0, 2.0, 1.0); return; }',
    ' float sm = min(3.0, sqrt(2.0 * log(255.0 * vCol.a)));',
    ' vec2 dvv = normalize(vec2(a01, l1 - a00));',
    ' vec2 ax1 = min(sm * sqrt(l1), 1024.0) * dvv, ax2 = min(sm * sqrt(l2), 1024.0) * vec2(dvv.y, -dvv.x);',
    ' vPos = aPos * (sm / 3.0);',
    ' vec2 ndc = clip.xy / clip.w;',
    ' vec4 clipB = uP * vec4(cam.xy, cam.z + uBias, 1.0);',
    ' gl_Position = vec4(ndc + (aPos.x * ax1 + aPos.y * ax2) * 2.0 / uView, clipB.z / clipB.w, 1.0);',
    '}'].join('\n');
  var SPLAT_FS = ['#version 300 es', 'precision highp float;', 'in vec4 vCol; in vec2 vPos; out vec4 o;',
    'void main(){ float r2 = dot(vPos, vPos); if (r2 > 1.0) discard;',
    ' float a = min(0.99, vCol.a * exp(-4.5 * r2)); if (a < 0.004) discard;',
    ' o = vec4(vCol.rgb * a, a); }'].join('\n');
  var SORT_WORKER = [
    'var pos=null,n=0,dist=null,keys=null,counts=new Uint32Array(65536),starts=new Uint32Array(65536);',
    'onmessage=function(e){',
    ' if(e.data.pos){pos=e.data.pos;n=pos.length/3;dist=new Float32Array(n);keys=new Uint16Array(n);return;}',
    ' var m=e.data.m,a=m[2],b=m[6],c=m[10],d=m[14],mn=1e30,mx=-1e30,i;',
    ' for(i=0;i<n;i++){var z=-(a*pos[3*i]+b*pos[3*i+1]+c*pos[3*i+2]+d);dist[i]=z;if(z<mn)mn=z;if(z>mx)mx=z;}',
    ' var k=65535/((mx-mn)||1);counts.fill(0);',
    ' for(i=0;i<n;i++){var q=((dist[i]-mn)*k)|0;keys[i]=q;counts[q]++;}',
    ' starts[0]=0;for(i=1;i<65536;i++)starts[i]=starts[i-1]+counts[i-1];',
    ' var out=(e.data.buf&&e.data.buf.byteLength===n*4)?new Uint32Array(e.data.buf):new Uint32Array(n);for(i=0;i<n;i++)out[starts[keys[i]]++]=i;',
    ' postMessage({idx:out,id:e.data.id},[out.buffer]);',
    '};'].join('\n');
  function m4mul(a, b) {
    var o = new Float32Array(16);
    for (var c = 0; c < 4; c++) for (var r = 0; r < 4; r++)
      o[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3];
    return o;
  }
  function buildSplat(g) {
    function shd(t, s) { var o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o);
      if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; }
    var p = gl.createProgram();
    gl.attachShader(p, shd(gl.VERTEX_SHADER, SPLAT_VS)); gl.attachShader(p, shd(gl.FRAGMENT_SHADER, SPLAT_FS));
    gl.linkProgram(p); if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    var vao = gl.createVertexArray(); gl.bindVertexArray(vao);
    var qb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, qb);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]), gl.STATIC_DRAW);
    var aPos = gl.getAttribLocation(p, 'aPos'); gl.enableVertexAttribArray(aPos); gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    var ib = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, ib);
    var init = new Uint32Array(g.n); for (var i = 0; i < g.n; i++) init[i] = i;
    gl.bufferData(gl.ARRAY_BUFFER, init, gl.DYNAMIC_DRAW);
    var aIdx = gl.getAttribLocation(p, 'aIdx'); gl.enableVertexAttribArray(aIdx);
    gl.vertexAttribIPointer(aIdx, 1, gl.UNSIGNED_INT, 0, 0); gl.vertexAttribDivisor(aIdx, 1);
    gl.bindVertexArray(null);
    var t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32UI, 2048, g.rows, 0, gl.RGBA_INTEGER, gl.UNSIGNED_INT, g.tex);
    var worker = new Worker(URL.createObjectURL(new Blob([SORT_WORKER], { type: 'application/javascript' })));
    worker.postMessage({ pos: g.pos }, [g.pos.buffer]);
    var S = { n: g.n, prog: p, vao: vao, ib: ib, tex: t, worker: worker, busy: false, last: null, sortId: 0,
      L: { uP: gl.getUniformLocation(p, 'uP'), uMV: gl.getUniformLocation(p, 'uMV'), uFocal: gl.getUniformLocation(p, 'uFocal'), uAA: gl.getUniformLocation(p, 'uAA'), uBias: gl.getUniformLocation(p, 'uBias'),
           uView: gl.getUniformLocation(p, 'uView'), uCovK: gl.getUniformLocation(p, 'uCovK'), uData: gl.getUniformLocation(p, 'uData') } };
    worker.onmessage = function (e) {
      gl.bindBuffer(gl.ARRAY_BUFFER, S.ib); gl.bufferSubData(gl.ARRAY_BUFFER, 0, e.data.idx);
      S.spare = e.data.idx.buffer;
      S.busy = false; S.sorted = (S.sorted || 0) + 1; window.__splatSorted = S.sorted; window.__awpDirty = true;
    };
    return S;
  }
  function drawSplat(model) {
    var S = SPLAT, mv = m4mul(view, model); S.drawn = true;
    /* re-sort when the viewing direction has moved */
    var dir = [mv[2], mv[6], mv[10], mv[14]];
    if (!S.busy && (!S.last || Math.abs(dir[0] - S.last[0]) + Math.abs(dir[1] - S.last[1]) + Math.abs(dir[2] - S.last[2]) + Math.abs(dir[3] - S.last[3]) * 0.2 > 0.002)) {
      S.busy = true; S.last = dir; var sp = S.spare; S.spare = null;
      S.worker.postMessage({ m: Array.prototype.slice.call(mv), id: ++S.sortId, buf: sp }, sp ? [sp] : []);
    }
    var HYB = window.__HYBRID__ && SCAN && SCAN.mesh && SCAN.mesh.inner;
    if (HYB) {  /* 1. depth of the scanned interior, so splats hidden inside the solid figures are not drawn */
      gl.useProgram(prog); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, SCAN.tex || texSurf); gl.uniform1i(L.uT, 0); gl.uniform1f(L.uUseT, SCAN.tex ? 1 : 0); gl.uniform1f(L.uInOn, 0);
      gl.colorMask(false, false, false, false); gl.enable(gl.DEPTH_TEST); gl.depthMask(true); gl.depthFunc(gl.LESS);
      draw(SCAN.mesh.inner); gl.colorMask(true, true, true, true);
    }
    gl.useProgram(S.prog);
    if (HYB) { gl.enable(gl.DEPTH_TEST); gl.depthMask(false); gl.depthFunc(gl.LEQUAL); } else gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.ONE_MINUS_DST_ALPHA, gl.ONE, gl.ONE_MINUS_DST_ALPHA, gl.ONE);
    gl.blendEquation(gl.FUNC_ADD);
    var f = (canvas.height / 2) / Math.tan(FOV / 2);
    gl.uniformMatrix4fv(S.L.uP, false, proj); gl.uniformMatrix4fv(S.L.uMV, false, mv);
    gl.uniform2f(S.L.uFocal, f, f); gl.uniform2f(S.L.uView, canvas.width, canvas.height); var kt = (window.__SPLAT_KTRAIN__ || 1800); gl.uniform1f(S.L.uAA, 1.0 / (kt * kt));
    gl.uniform1f(S.L.uCovK, 1 / COV_K); gl.uniform1f(S.L.uBias, HYB ? (window.__HYB_BIAS__ !== undefined ? window.__HYB_BIAS__ : 0.015) : 0.0);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, S.tex); gl.uniform1i(S.L.uData, 0);
    gl.bindVertexArray(S.vao);
    gl.drawArraysInstanced(gl.TRIANGLE_FAN, 0, 4, S.n);
    gl.bindVertexArray(null);
    if (HYB) {  /* 3. the scanned interior underneath the splats (front-to-back compositing) */
      gl.useProgram(prog); gl.depthMask(true); gl.depthFunc(gl.LEQUAL);
      if (SCAN.tex) { gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, SCAN.tex); gl.uniform1i(L.uT, 0); gl.uniform1f(L.uUseT, 1); }
      else { gl.uniform1f(L.uUseT, 0); gl.uniform3f(L.uC, 0.82, 0.80, 0.76); }
      gl.uniform1f(L.uInOn, 0); gl.uniform1f(L.uLift, window.__HYB_LIFT__ !== undefined ? window.__HYB_LIFT__ : 0.18);
      draw(SCAN.mesh.inner); gl.uniform1f(L.uLift, 0.0);
      gl.depthFunc(gl.LESS);
    }
    gl.disable(gl.BLEND); gl.enable(gl.DEPTH_TEST); gl.depthMask(true);
  }
  function loadSplat(url, fallback) {
    if (Array.isArray(url)) {  /* the splat ships in parts; fetch them all (with byte progress) and join them */
      var noteP = document.getElementById('scanNote'), tot = window.__SPLAT_BYTES__ || 0, recv = 0;
      var prog = function () { if (noteP) noteP.textContent = 'Loading the sculpture' + (tot ? ' · ' + Math.min(99, Math.round(recv / tot * 100)) + '%' : '…'); };
      if (noteP) { prog(); noteP.style.display = 'block'; }
      Promise.all(url.map(function (u) {
        return fetch(u).then(function (r) {
          if (!r.ok) throw new Error(r.status);
          if (!r.body || !r.body.getReader) return r.arrayBuffer().then(function (b) { recv += b.byteLength; prog(); return b; });
          var rd = r.body.getReader(), chunks = [], n = 0;
          return (function pump() {
            return rd.read().then(function (x) {
              if (x.done) { var a = new Uint8Array(n), o = 0; chunks.forEach(function (c) { a.set(c, o); o += c.length; }); return a.buffer; }
              chunks.push(x.value); n += x.value.length; recv += x.value.length; prog(); return pump();
            });
          })();
        });
      })).then(function (parts) {
        var n = 0, o = 0; parts.forEach(function (p) { n += p.byteLength; });
        var all = new Uint8Array(n); parts.forEach(function (p) { all.set(new Uint8Array(p), o); o += p.byteLength; });
        SPLAT = buildSplat(parseSplat(all.buffer));
        window.__scanReady = true; window.__splatReady = true; scanArrived();
        if (noteP) noteP.style.display = 'none';
      }).catch(function (e) { console.warn('splat load failed', e); if (fallback) fallback(); else scanFailed(); });
      return;
    }
    var note = document.getElementById('scanNote');
    function say(t) { if (note) { note.textContent = t; note.style.display = 'block'; } }
    say('Loading the sculpture…');
    fetch(url).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      var total = +r.headers.get('content-length') || 0;
      if (!r.body || !total) return r.arrayBuffer();
      var rd = r.body.getReader(), got = 0, parts = [];
      return (function pump() {
        return rd.read().then(function (x) {
          if (x.done) { var all = new Uint8Array(got), o = 0; parts.forEach(function (p) { all.set(p, o); o += p.length; }); return all.buffer; }
          parts.push(x.value); got += x.value.length; say('Loading the sculpture… ' + Math.min(99, Math.round(got / total * 100)) + '%');
          return pump();
        });
      })();
    }).then(function (buf) {
      SPLAT = buildSplat(parseSplat(buf));
      window.__scanReady = true; window.__splatReady = true; scanArrived();
      if (note) note.style.display = 'none';
    }).catch(function (e) {
      console.warn('splat load failed', e);
      if (fallback) fallback(); else scanFailed();
    });
  }

  if (window.__SPLAT__ && GL2 && window.__HYBRID__ && window.__MODEL__) { loadScan(window.__MODEL__); loadSplat(window.__SPLAT__, null); }
  else if (window.__SPLAT__ && GL2) loadSplat(window.__SPLAT__, function () { if (window.__MODEL__) loadScan(window.__MODEL__); else scanFailed(); });
  else if (window.__MODEL__) loadScan(window.__MODEL__);
  var texWater = texFromCanvas(waterCanvas());

  /* ---- state ---- */
  var FITV = (window.__MODEL__ && window.__MODEL_FIT__) || {};
  var HOME_Q = qM(qA([1, 0, 0], FITV.homeX !== undefined ? FITV.homeX : 0.10), qA([0, 1, 0], FITV.homeY !== undefined ? FITV.homeY : -Math.PI / 2));
  var BASE_Z = FITV.camZ || 3.25, q = HOME_Q.slice(), camZ = BASE_Z, HOME_Z = camZ, zMin = window.__SPLAT__ ? 1.55 : 2.15, zMax = Math.max(4.7, camZ + 1.2);
  var CAMY = FITV.camY !== undefined ? FITV.camY : 1.00, CTRY = FITV.ctrY !== undefined ? FITV.ctrY : 0.10, FOV = 44 * Math.PI / 180;
  var eye = [0, CAMY, camZ], ctr = [0, CTRY, 0], proj, view, vw = 1, vh = 1;

  var resScale = Math.min(window.devicePixelRatio || 1, 2), RES_MIN = 0.6;
  function maxScale() { return Math.min(window.devicePixelRatio || 1, 2); }
  function applySize() {
    var w = Math.max(1, Math.round(vw * resScale)), h = Math.max(1, Math.round(vh * resScale));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    gl.viewport(0, 0, canvas.width, canvas.height); window.__awpDirty = true;
  }
  function setRes(sc) { sc = Math.max(RES_MIN, Math.min(maxScale(), sc)); if (Math.abs(sc - resScale) < 0.015) return; resScale = sc; applySize(); }
  function resize() {
    var r = stage.getBoundingClientRect();
    vw = Math.max(1, Math.round(r.width)); vh = Math.max(1, Math.round(r.height));
    /* narrow stages (phones) must back the camera off so the whole sculpture fits */
    var need = (window.__MODEL__ ? 1.30 : 1.18) / (Math.tan(FOV / 2) * (vw / vh)), home = Math.max(BASE_Z, need);
    var atHome = Math.abs(camZ - HOME_Z) < 0.01;
    HOME_Z = home; zMax = Math.max(4.7, HOME_Z + 1.2);
    if (atHome) { camZ = home; if (typeof zoomT !== 'undefined') zoomT = home; }
    ctr[1] = (vw / vh < 0.9) ? CTRY - 0.22 : CTRY;
    resScale = Math.min(resScale, maxScale()); applySize();
    proj = persp(FOV, vw / vh, 0.04, 30);
  }
  resize();
  if (window.ResizeObserver) new ResizeObserver(resize).observe(stage); else window.addEventListener('resize', resize);

  /* ---- hotspots ---- */
  var dotsWrap = document.getElementById('dots');
  var EXTRA = D.extra || {}, spots = [];
  function outP(p) { var n = nrm(p); return [p[0] + n[0] * 0.02, p[1] + n[1] * 0.02, p[2] + n[2] * 0.02]; }
  D.figures.forEach(function (f) {
    spots.push({ f: f, k: 0, p: f.p ? outP(f.p) : uvPos(f.u, D.bandF[f.band], 1.0) });
    (EXTRA[f.id] || []).forEach(function (p, j) { spots.push({ f: f, k: j + 1, p: outP(p) }); });
  });
  D.throng.forEach(function (w) {   /* the artworks sit inside the bowl: seen only when the camera looks in from above */
    if (w.p) spots.push({ f: w, k: 0, p: w.p.slice(), inner: true, n: nrm([-w.p[0] * 0.5, 1, -w.p[2] * 0.5]) });
  });
  var dots = spots.map(function (s) {
    var f = s.f, b = document.createElement('button');
    b.className = 'dot' + (s.inner ? ' work' : ''); b.type = 'button'; b.setAttribute('aria-label', 'Open ' + f.name);
    b.dataset.scan = (f.p || s.inner) ? '1' : '0';
    if (window.__MODEL__ && !f.p && !s.inner) b.style.display = 'none';
    b.innerHTML = '<i></i><span class="lb">' + f.name + '</span>';
    b.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
    b.addEventListener('click', function (e) { e.stopPropagation(); openDetail(f.id, null, s.k); });
    dotsWrap.appendChild(b);
    s.el = b; return s;
  });

  /* ---- interaction: turntable orbit ----
     yaw spins the globe about its own vertical axis, pitch tips it toward / away from the viewer.
     No roll, so the globe never ends up sideways. Pointer input moves targets; the frame loop eases
     toward them, which keeps motion smooth even when input events arrive unevenly. */
  var drag = false, lx = 0, ly = 0, idle = 0, holdDir = null, anim = null;
  var yaw = FITV.homeY !== undefined ? FITV.homeY : -Math.PI / 2, pitch = FITV.homeX !== undefined ? FITV.homeX : 0.10;
  var HOME_YAW = yaw, HOME_PITCH = pitch, yawT = yaw, pitchT = pitch, zoomT = camZ, vYaw = 0, vPitch = 0, lastMove = 0, autoAmt = 0;
  var P_MIN = window.__SPLAT__ ? -0.55 : -1.2, P_MAX = window.__SPLAT__ ? 1.22 : 1.2;
  function clampP(p) { return Math.max(P_MIN, Math.min(P_MAX, p)); }
  function clampZ(z) { return Math.max(zMin, Math.min(zMax, z)); }
  function setQ() { q = qN(qM(qA([1, 0, 0], pitch), qA([0, 1, 0], yaw))); }
  setQ();
  function bump() { idle = performance.now(); window.__awpDirty = true; }
  function eyeAt(z) { return [0, ctr[1] + (CAMY - ctr[1]) * z / HOME_Z, z]; }
  function rotSens() { return 0.0055 * Math.max(0.16, (camZ - 0.95) / (HOME_Z - 0.95)); }
  function nearestYaw(t) { var d = t - yaw; d -= Math.round(d / (2 * Math.PI)) * 2 * Math.PI; return yaw + d; }
  function animateTo(y1, p1, z1, ms) {
    var y0 = yaw, p0 = pitch, z0 = camZ, t0 = performance.now();
    y1 = nearestYaw(y1); p1 = clampP(p1); z1 = (z1 === undefined) ? zoomT : clampZ(z1);
    vYaw = vPitch = 0; holdDir = null;
    if (RM) { yaw = yawT = y1; pitch = pitchT = p1; camZ = zoomT = z1; setQ(); bump(); return; }
    anim = function (n) { var t = Math.min((n - t0) / ms, 1), e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      yaw = yawT = y0 + (y1 - y0) * e; pitch = pitchT = p0 + (p1 - p0) * e; camZ = zoomT = z0 + (z1 - z0) * e; return t < 1; };
    bump();
  }
  function facing(p, z) {   /* yaw and pitch that turn model point p toward the viewer */
    var a = Math.atan2(p[0], p[2]), el = Math.atan2(p[1], Math.hypot(p[0], p[2])), e = eyeAt(z || zoomT);
    return [-a, el - Math.atan2(e[1], e[2])];
  }
  stage.addEventListener('pointerdown', function (e) {
    if (e.target && e.target.closest && e.target.closest('button')) return;
    if (e.button !== undefined && e.button !== 0 && e.pointerType === 'mouse') return;
    drag = true; anim = null; vYaw = vPitch = 0; lx = e.clientX; ly = e.clientY; lastMove = performance.now();
    yawT = yaw; pitchT = pitch;
    stage.classList.add('grabbing');
    if (stage.setPointerCapture) stage.setPointerCapture(e.pointerId);
    pinch.down(e); bump();
  });
  stage.addEventListener('pointermove', function (e) {
    if (pinch.move(e)) { bump(); return; }
    if (!drag || (pinch.pts[e.pointerId] === undefined && e.pointerType !== 'mouse')) return;
    var dx = e.clientX - lx, dy = e.clientY - ly; lx = e.clientX; ly = e.clientY;
    if (!dx && !dy) return;
    var k = rotSens(), now = performance.now(), dt = Math.max(now - lastMove, 4); lastMove = now;
    yawT += dx * k; pitchT = clampP(pitchT + dy * k);
    var w = Math.min(1, dt / 32);
    vYaw += (dx * k / dt - vYaw) * w; vPitch += (dy * k / dt - vPitch) * w;
    bump();
  });
  function endDrag(e) {
    if (drag && performance.now() - lastMove > 80) vYaw = vPitch = 0;
    vYaw = Math.max(-0.006, Math.min(0.006, vYaw)); vPitch = Math.max(-0.004, Math.min(0.004, vPitch));
    pinch.up(e);
    if (!Object.keys(pinch.pts).length) { drag = false; stage.classList.remove('grabbing'); }
    bump();
  }
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);
  stage.addEventListener('pointerleave', function (e) { if (drag && e.pointerType === 'mouse') endDrag(e); });
  var pinch = {
    pts: {}, base: 0, bz: 0,
    down: function (e) { this.pts[e.pointerId] = [e.clientX, e.clientY];
      var k = Object.keys(this.pts);
      if (k.length === 2) { var a = this.pts[k[0]], b = this.pts[k[1]];
        this.base = Math.hypot(a[0] - b[0], a[1] - b[1]); this.bz = zoomT; vYaw = vPitch = 0; } },
    move: function (e) { if (!this.pts[e.pointerId]) return false; this.pts[e.pointerId] = [e.clientX, e.clientY];
      var k = Object.keys(this.pts);
      if (k.length === 2) { var a = this.pts[k[0]], b = this.pts[k[1]], d = Math.hypot(a[0] - b[0], a[1] - b[1]);
        if (this.base > 0) zoomT = clampZ(this.bz * this.base / Math.max(d, 20));
        return true; }
      return false; },
    up: function (e) { if (e && e.pointerId !== undefined) delete this.pts[e.pointerId];
      var k = Object.keys(this.pts); this.base = 0;
      if (k.length === 1) { lx = this.pts[k[0]][0]; ly = this.pts[k[0]][1]; lastMove = performance.now(); vYaw = vPitch = 0; } }
  };
  stage.addEventListener('wheel', function (e) {
    e.preventDefault(); anim = null;
    var d = e.deltaY * (e.deltaMode === 1 ? 33 : e.deltaMode === 2 ? 400 : 1);
    d = Math.max(-150, Math.min(150, d));
    zoomT = clampZ(zoomT * Math.exp(d * 0.0016)); bump();
  }, { passive: false });
  function bindArrow(id, dy, dp) {
    var el = document.getElementById(id), hold = false, t0 = 0;
    el.addEventListener('pointerdown', function (e) { e.stopPropagation(); hold = true; t0 = performance.now(); anim = null; vYaw = vPitch = 0; holdDir = [dy, dp]; bump(); });
    function stop() { if (!hold) return; hold = false; holdDir = null;
      if (performance.now() - t0 < 240) animateTo(yawT + dy * 0.5, pitchT + dp * 0.5, undefined, 430); }
    el.addEventListener('pointerup', stop); el.addEventListener('pointerleave', stop); el.addEventListener('pointercancel', stop);
    el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); animateTo(yawT + dy * 0.5, pitchT + dp * 0.5, undefined, 430); } });
  }
  bindArrow('aL', -1, 0);
  bindArrow('aR', 1, 0);
  bindArrow('aU', 0, -1);
  bindArrow('aD', 0, 1);
  document.getElementById('zIn').addEventListener('click', function () { anim = null; zoomT = clampZ(zoomT * 0.76); bump(); });
  document.getElementById('zOut').addEventListener('click', function () { anim = null; zoomT = clampZ(zoomT * 1.3); bump(); });
  var homeBtn = document.getElementById('zHome');
  homeBtn.addEventListener('click', function () { animateTo(HOME_YAW, HOME_PITCH, HOME_Z, 820); });
  /* debug: model-space point under a stage pixel (used offline to place hotspots on the scan) */
  window.__awpPick = function (px, py) {
    var G = window.__scanGeo; if (!G) return null;
    var e = eyeAt(camZ), zc = nrm([e[0] - ctr[0], e[1] - ctr[1], e[2] - ctr[2]]), xc = nrm(cross([0, 1, 0], zc)), yc = cross(zc, xc);
    var t = Math.tan(FOV / 2), nx = (px / vw) * 2 - 1, ny = 1 - (py / vh) * 2, dx = nx * t * (vw / vh), dy = ny * t;
    var dw = nrm([dx * xc[0] + dy * yc[0] - zc[0], dx * xc[1] + dy * yc[1] - zc[1], dx * xc[2] + dy * yc[2] - zc[2]]);
    var qc = [-q[0], -q[1], -q[2], q[3]], o = qRot(qc, e), d = qRot(qc, dw);
    var P = G.pos, I = G.idx, best = 1e9, hit = null, ntri = I.length / 3;
    for (var i = 0; i < ntri; i++) {
      var a = I[i * 3] * 3, b = I[i * 3 + 1] * 3, c = I[i * 3 + 2] * 3;
      var e1x = P[b] - P[a], e1y = P[b + 1] - P[a + 1], e1z = P[b + 2] - P[a + 2];
      var e2x = P[c] - P[a], e2y = P[c + 1] - P[a + 1], e2z = P[c + 2] - P[a + 2];
      var hx = d[1] * e2z - d[2] * e2y, hy = d[2] * e2x - d[0] * e2z, hz = d[0] * e2y - d[1] * e2x;
      var det = e1x * hx + e1y * hy + e1z * hz; if (det > -1e-9 && det < 1e-9) continue;
      var f = 1 / det, sx = o[0] - P[a], sy = o[1] - P[a + 1], sz = o[2] - P[a + 2];
      var u = f * (sx * hx + sy * hy + sz * hz); if (u < 0 || u > 1) continue;
      var qx = sy * e1z - sz * e1y, qy = sz * e1x - sx * e1z, qz = sx * e1y - sy * e1x;
      var v = f * (d[0] * qx + d[1] * qy + d[2] * qz); if (v < 0 || u + v > 1) continue;
      var tt = f * (e2x * qx + e2y * qy + e2z * qz);
      if (tt > 1e-4 && tt < best) { best = tt; hit = i; }
    }
    if (hit === null) return null;
    return { p: [o[0] + d[0] * best, o[1] + d[1] * best, o[2] + d[2] * best], tri: hit, t: best };
  };
  window.__awpLook = function (p, z) { if (z) camZ = zoomT = clampZ(z); var f = facing(nrm(p), z); yaw = yawT = nearestYaw(f[0]); pitch = pitchT = clampP(f[1]); setQ(); anim = null; vYaw = vPitch = 0; bump(); };
  window.__awpSplat = function () { return SPLAT ? { n: SPLAT.n, sorted: window.__splatSorted || 0, res: resScale } : null; };
  window.__awpState = function () { return { yaw: yaw, pitch: pitch, camZ: camZ, zoomT: zoomT, res: resScale, w: canvas.width, h: canvas.height, vYaw: vYaw }; };
  window.__awpView = function (rx, ry, z) { pitch = pitchT = rx || 0; yaw = yawT = ry || 0; if (z) camZ = zoomT = z; setQ(); anim = null; vYaw = vPitch = 0; bump(); };
  stage.addEventListener('keydown', function (e) {
    var m = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    if (m[e.key]) { e.preventDefault(); animateTo(yawT + m[e.key][0] * 0.34, pitchT + m[e.key][1] * 0.34, undefined, 310); }
    if (e.key === '+' || e.key === '=') { zoomT = clampZ(zoomT * 0.8); bump(); }
    if (e.key === '-') { zoomT = clampZ(zoomT * 1.25); bump(); }
  });

  function rotateTo(id, k) {
    var f = byId[id]; if (!f || f.u === undefined) return;
    var pp = (k && EXTRA[id] && EXTRA[id][k - 1]) || f.p;
    var p = nrm(pp ? pp : uvPos(f.u, D.bandF[f.band], 1)), t = facing(p);
    animateTo(t[0], t[1], undefined, 950);
  }
  var pingT = null;
  function focusOn(id, k) {
    var f = byId[id]; if (!f) return;
    if (f.isWork && f.view) {   /* a view down into the bowl, the way Lorrie looked at it */
      animateTo(f.view[0], f.view[1], f.view[2] * HOME_Z / 3.68, 1300);
    } else {
      var pp = (k && EXTRA[id] && EXTRA[id][k - 1]) || f.p;
      if (!pp && f.u === undefined) return;
      var t = facing(nrm(pp ? pp : uvPos(f.u, D.bandF[f.band], 1)), Math.min(zoomT, HOME_Z * 0.82));
      animateTo(t[0], t[1], Math.min(zoomT, HOME_Z * 0.82), 1200);
    }
    dots.forEach(function (d) { d.el.classList.remove('ping'); });
    var d = dots.filter(function (d) { return d.f.id === id && d.k === (k || 0); })[0];
    clearTimeout(pingT);
    if (d) { setTimeout(function () { d.el.classList.add('ping'); }, 700); pingT = setTimeout(function () { d.el.classList.remove('ping'); }, 5200); }
    idle = performance.now() + 4000;
  }

  var visible = true;
  if ('IntersectionObserver' in window)
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }, { threshold: 0.02 }).observe(stage);

  var lastT = 0, moving = false, stillSince = 0, frameMs = 16.7, resCheck = 0;
  function frame(now) {
    requestAnimationFrame(frame);
    var manual = !!window.__awpManual;
    if (manual) { if (!window.__awpDrawOnce) return; window.__awpDrawOnce = false; window.__awpDirty = true; }
    var dt = lastT ? Math.min(now - lastT, 100) : 16.7; lastT = now;
    var y0 = yaw, p0 = pitch, z0 = camZ;
    if (!manual) {
      if (anim && !anim(now)) anim = null;
      if (!anim) {
        if (holdDir) { yawT += holdDir[0] * 0.0018 * dt; pitchT = clampP(pitchT + holdDir[1] * 0.0018 * dt); idle = now; }
        if (!drag && (vYaw || vPitch)) {
          yawT += vYaw * dt; pitchT = clampP(pitchT + vPitch * dt);
          var fr = Math.exp(-dt / 380); vYaw *= fr; vPitch *= fr;
          if (Math.abs(vYaw) < 3e-6) vYaw = 0; if (Math.abs(vPitch) < 3e-6) vPitch = 0;
          idle = now;
        }
        var auto = !RM && !drag && !holdDir && visible && !ov.classList.contains('open') && now - idle > 5200;
        autoAmt += ((auto ? 1 : 0) - autoAmt) * (1 - Math.exp(-dt / 1200));
        if (autoAmt > 0.002) yawT += 0.000084 * dt * autoAmt;
        else if (!auto) autoAmt = 0;
        var a = 1 - Math.exp(-dt / (drag ? 30 : 55));
        yaw += (yawT - yaw) * a; pitch += (pitchT - pitch) * a;
        camZ += (zoomT - camZ) * (1 - Math.exp(-dt / 85));
        if (Math.abs(yawT - yaw) < 2e-5) yaw = yawT;
        if (Math.abs(pitchT - pitch) < 2e-5) pitch = pitchT;
        if (Math.abs(zoomT - camZ) < 2e-4) camZ = zoomT;
      }
    }
    var changed = yaw !== y0 || pitch !== p0 || camZ !== z0;
    if (changed) setQ();
    if (!visible) return;

    /* always render at the display's full resolution, also while the globe moves */
    if (resScale !== maxScale()) setRes(maxScale());
    if (!changed && !window.__awpDirty && !(SPLAT && !SPLAT.drawn)) return;
    window.__awpDirty = false;

    eye = eyeAt(camZ); view = lookAt(eye, ctr, [0, 1, 0]);
    var model = m4q(q);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); gl.enable(gl.DEPTH_TEST);
    gl.useProgram(prog);
    gl.uniformMatrix4fv(L.uP, false, proj); gl.uniformMatrix4fv(L.uV, false, view);
    gl.uniformMatrix4fv(L.uM, false, model); gl.uniform3fv(L.uCam, eye); gl.uniform1f(L.uLift, 0.0);
    gl.disable(gl.CULL_FACE);
    gl.activeTexture(gl.TEXTURE0);
    if (SPLAT) { drawSplat(model); }
    else if (SCAN_PENDING) { /* nothing yet: the stage shows its note until the scan arrives */ }
    else if (SCAN) {
      if (SCAN.tex) { gl.bindTexture(gl.TEXTURE_2D, SCAN.tex); gl.uniform1i(L.uT, 0); gl.uniform1f(L.uUseT, 1); }
      else { gl.uniform1f(L.uUseT, 0); gl.uniform3f(L.uC, 0.82, 0.80, 0.76); }
      gl.uniform1f(L.uInOn, 0);
      draw(SCAN.mesh);
    } else {
      gl.bindTexture(gl.TEXTURE_2D, texSurf);
      gl.uniform1i(L.uT, 0); gl.uniform1f(L.uUseT, 1);
      gl.uniform3f(L.uIn, 0.93, 0.91, 0.86); gl.uniform1f(L.uInOn, 1);
      draw(mBowl);
      gl.bindTexture(gl.TEXTURE_2D, texWater); gl.uniform1f(L.uInOn, 0); draw(mWater);
      gl.uniform1f(L.uUseT, 0); gl.uniform3f(L.uC, 0.955, 0.943, 0.902); draw(mThrong);
    }

    var qd = Math.abs(q[0] * HOME_Q[0] + q[1] * HOME_Q[1] + q[2] * HOME_Q[2] + q[3] * HOME_Q[3]);
    var moved = qd < 0.99995 || Math.abs(camZ - HOME_Z) > 0.02;
    if (homeBtn.disabled === moved) homeBtn.disabled = !moved;

    var horizon = 1 / Math.hypot(eye[0], eye[1], eye[2]), eyeM = qRot([-q[0], -q[1], -q[2], q[3]], eye);
    for (var i = 0; i < dots.length; i++) {
      var d = dots[i], p = qRot(q, d.p), fa = dot3(nrm(p), nrm(eye));
      var c1 = mp(view, p), c = mp(proj, [c1[0], c1[1], c1[2]]);
      var x = c[0] / c[3], y = c[1] / c[3], vis, fade;
      if (d.inner) {
        var look = dot3(nrm([eyeM[0] - d.p[0], eyeM[1] - d.p[1], eyeM[2] - d.p[2]]), d.n);
        vis = look > 0.5; fade = Math.max(0, Math.min(1, (look - 0.5) / 0.12));
      } else {
        vis = fa > horizon + 0.06; fade = Math.max(0, Math.min(1, (fa - horizon - 0.01) / 0.13));
      }
      var st = d.el.style;
      if (!d.z) { st.left = '0px'; st.top = '0px'; st.willChange = 'transform,opacity'; d.z = 1; }
      st.transform = 'translate3d(' + ((x * 0.5 + 0.5) * vw).toFixed(1) + 'px,' + ((-y * 0.5 + 0.5) * vh).toFixed(1) + 'px,0)';
      st.opacity = vis ? String(0.20 + 0.8 * fade) : '0';
      st.pointerEvents = vis ? 'auto' : 'none';
      d.el.tabIndex = vis ? 0 : -1;
    }
  }
  requestAnimationFrame(frame);
  return { rotateTo: rotateTo, focus: focusOn };
}

/* ==========================================================================
   BOOT — decode every inlined image, then compose the sculpture
   ========================================================================== */
(function boot() {
  buildTitle();
  var ids = Object.keys(IMG);
  var total = ids.length, done = 0, store = {};
  var barI = document.querySelector('#boot .bar i');
  function tick() {
    done++;
    if (barI) barI.style.width = Math.round(done / total * 100) + '%';
    if (done >= total) finish();
  }
  ids.forEach(function (k) {
    var im = new Image();
    im.onload = function () { store[k] = im; tick(); };
    im.onerror = function () { tick(); };
    im.src = IMG[k];
  });
  var safety = setTimeout(function () { if (done < total) { done = total; finish(); } }, 12000);

  var finished = false;
  function finish() {
    if (finished) return; finished = true; clearTimeout(safety);
    try { globe = initGlobe(store.__substrate, store); } catch (e) {
      var fb = document.getElementById('glfallback'); if (fb) fb.style.display = 'grid';
    }
    document.getElementById('boot').classList.add('done');
    var t = document.getElementById('otitle');
    setTimeout(function () {
      t.classList.add('in');
      document.querySelector('.o-div').classList.add('in');
      reveal();
    }, 120);
    var h = location.hash.replace('#', '');
    if (h && byId[h]) setTimeout(function () { openDetail(h, null); }, 900);
  }
})();
})();

