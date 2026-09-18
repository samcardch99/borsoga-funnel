/**
 * Motor de los dos cuestionarios largos: diseño web y diseño gráfico.
 *
 * Portado de los artboards 'Cuestionario Diseno Web' y 'Cuestionario Diseno
 * Grafico'. A diferencia de los configuradores de interiorismo y AV —donde cada
 * paso tiene widgets propios (steppers de espacios, contador de imágenes)—,
 * estos dos son la misma pieza con otras preguntas: diez y doce pasos de
 * opciones, texto libre, ejes y subidas de archivos. Así que las preguntas son
 * datos (`brief_web.js`, `brief_grafico.js`) y esto las pinta. Duplicar
 * novecientas líneas casi idénticas habría significado que se desincronizaran a
 * la primera corrección.
 *
 * Tres reglas heredadas del resto del sitio:
 *
 *  · El valor que viaja al servidor es siempre el español canónico. `TR()`
 *    traduce solo lo que se lee; `esc()` va en atributos y en `data-val`.
 *  · El idioma lo fija la URL, no un botón: el conmutador EN/ES del artboard
 *    aquí son dos páginas distintas, como en todo el sitio.
 *  · El botón de continuar nunca se deshabilita por respuestas pendientes.
 *    Pulsarlo es lo que revela qué falta.
 */
(function () {
'use strict';

var LANG = window.BORSOGA_LANG || 'es';
var PRIV_URL = LANG === 'es' ? '/politica-de-privacidad/' : '/' + LANG + '/privacy-policy/';
var SUBMIT_KEY = 'borsoga.cuestionario.envios';
var MAX_SUBMITS = 2;
var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

var DOMAIN_TYPOS = {
  'gmial.com':'gmail.com','gmai.com':'gmail.com','gmail.co':'gmail.com','gmail.con':'gmail.com','gmil.com':'gmail.com','gnail.com':'gmail.com',
  'hotmial.com':'hotmail.com','hotmai.com':'hotmail.com','hotmail.co':'hotmail.com',
  'yahooo.com':'yahoo.com','yaho.com':'yahoo.com','outlok.com':'outlook.com','icoud.com':'icloud.com'
};
var suggestEmail = function (e) {
  var p = String(e || '').split('@');
  var fix = p.length > 1 ? DOMAIN_TYPOS[p[1].trim().toLowerCase()] : null;
  return fix ? p[0] + '@' + fix : '';
};

// ---------------------------------------------------------------- i18n
function t(key, fallback) {
  var d = (window.BORSOGA_I18N || {})[LANG] || {};
  var v = (d.ui && d.ui[key]) || (d.msg && d.msg[key]) || (d.opt && d.opt[key]);
  return v || fallback || key;
}
function TR(s) {
  if (LANG === 'es' || !s) return s;
  var d = (window.BORSOGA_I18N || {})[LANG] || {};
  return (d.opt && d.opt[s]) || s;
}
var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
  return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]; }); };
var lbl = function (s) { return esc(TR(s)); };
var fill = function (s, v) { return String(s == null ? '' : s).replace(/\{(\w+)\}/g, function (m, k) {
  return v && v[k] != null ? v[k] : ''; }); };
var lista = function (vs) { return (vs || []).map(TR).join(' · '); };

// ---------------------------------------------------------------- motor
function arranca(spec) {
  var PASOS = spec.pasos;
  var ULTIMO = PASOS.length;
  var S = { step: 1, done: false, a: null, touched: false, sending: false, notice: '', showErrors: false };
  var FILES = {};
  var MISSING = [];

  function blank() { return JSON.parse(JSON.stringify(spec.vacio)); }
  S.a = blank();
  (spec.archivos || []).forEach(function (k) { FILES[k] = []; });

  // La tarjeta de la que salió el lead viaja en la URL (?plan=Brand-Premium).
  // No cambia ninguna pregunta ni se enseña: solo acompaña al lead para que el
  // estudio sepa qué estaba mirando quien escribe. Fuera de la lista, se ignora.
  var PLAN = (function () {
    var p = (new URLSearchParams(location.search).get('plan') || '').trim();
    return (spec.planes || []).indexOf(p) > -1 ? p : '';
  })();

  // ------------------------------------------------------------ estado
  function persist() {
    try { localStorage.setItem(spec.clave, JSON.stringify({ step: S.step, a: S.a, at: Date.now() })); } catch (e) {}
  }
  function setA(patch) {
    S.a = spec.poda ? spec.poda(Object.assign({}, S.a, patch)) : Object.assign({}, S.a, patch);
    S.touched = true;
    persist();
    render();
  }
  function toggleIn(field, value, solo) {
    var cur = S.a[field] || [], on = cur.indexOf(value) > -1, next, o = {};
    if (solo && value === solo) next = on ? [] : [solo];
    else {
      var kept = solo ? cur.filter(function (v) { return v !== solo; }) : cur;
      next = on ? kept.filter(function (v) { return v !== value; }) : kept.concat([value]);
    }
    o[field] = next;
    setA(o);
  }

  // ------------------------------------------------------------ preguntas
  var ops = function (p) { return typeof p.ops === 'function' ? p.ops(S.a) : (p.ops || []); };
  var tope = function (p) { return typeof p.tope === 'function' ? p.tope(S.a) : p.tope; };

  function visibles(n) {
    return PASOS[n - 1].preguntas.filter(function (p) { return !p.si || p.si(S.a); });
  }
  function vacia(p) {
    var a = S.a, v = a[p.f];
    if (p.tipo === 'subida') return (FILES[p.f] || []).length === 0;
    if (p.tipo === 'ejes') return !p.ejes.every(function (_, i) { return a[p.f][i] != null; });
    if (p.tipo === 'contacto') {
      return !String(a[p.nombre] || '').trim() || !EMAIL_RE.test(a[p.correo] || '') ||
             !String(a[p.telefono] || '').trim() || !a[p.privacidad];
    }
    if (Array.isArray(v)) return v.length === 0;
    if (typeof v === 'boolean') return !v;
    return !String(v == null ? '' : v).trim();
  }
  function pendientes() {
    return visibles(S.step).filter(function (p) {
      if (!p.req) return false;
      return typeof p.req === 'function' ? !p.req(S.a, FILES) : vacia(p);
    }).map(function (p) { return p.f; });
  }

  // ------------------------------------------------------------ controles
  function chips(p) {
    var a = S.a, cap = tope(p), cur = a[p.f] || [];
    return '<div class="q-opts">' + ops(p).map(function (v) {
      var on, extra = '';
      if (p.tipo === 'tope') {
        on = cur.indexOf(v) > -1;
        // Al llegar al tope, lo no elegido se apaga en vez de desaparecer: la
        // lista no se mueve bajo el dedo justo cuando se está eligiendo.
        if (!on && cur.length >= cap) extra = ' q-off" disabled="disabled';
        return '<button type="button" class="q-chip' + extra + '" data-cap="' + esc(p.f) +
          '" data-val="' + esc(v) + '" aria-pressed="' + on + '">' + lbl(v) + '</button>';
      }
      if (p.tipo === 'chipchecks') {
        on = cur.indexOf(v) > -1;
        return '<button type="button" class="q-chip q-chip-box" data-check="' + esc(p.f) +
          '" data-val="' + esc(v) + '" data-solo="' + esc(p.solo || '') + '" aria-pressed="' + on +
          '"><span class="q-box"></span><span>' + lbl(v) + '</span></button>';
      }
      on = a[p.f] === v;
      return '<button type="button" class="q-chip" data-set="' + esc(p.f) + '" data-val="' + esc(v) +
        '" aria-pressed="' + on + '">' + lbl(v) + '</button>';
    }).join('') + '</div>';
  }
  function tarjetas(p) {
    var a = S.a, cur = a[p.f] || [];
    // `col`: opciones que son frases largas. El diseño las apila en vez de
    // repartirlas en columnas, porque en dos columnas se leen a trompicones.
    return '<div class="q-grid' + (p.col ? ' q-col' : '') + '">' + ops(p).map(function (v) {
      if (p.tipo === 'checks') {
        return '<button type="button" class="q-card" data-check="' + esc(p.f) + '" data-val="' + esc(v) +
          '" data-solo="' + esc(p.solo || '') + '" aria-pressed="' + (cur.indexOf(v) > -1) +
          '"><span class="q-box"></span><span>' + lbl(v) + '</span></button>';
      }
      return '<button type="button" class="q-card" data-set="' + esc(p.f) + '" data-val="' + esc(v) +
        '" aria-pressed="' + (a[p.f] === v) + '"><span class="q-radio"></span><span>' + lbl(v) + '</span></button>';
    }).join('') + '</div>';
  }
  function campo(p) {
    var tipo = p.tipo === 'fecha' ? 'date' : 'text';
    return '<input class="q-in q-in-corto" type="' + tipo + '" data-field="' + esc(p.f) + '" value="' +
      esc(S.a[p.f]) + '"' + (p.ph ? ' placeholder="' + lbl(p.ph) + '"' : '') +
      ' aria-label="' + lbl(t(p.q)) + '">';
  }
  function area(p) {
    return '<textarea class="q-in q-area" rows="3" data-field="' + esc(p.f) + '" aria-label="' +
      lbl(t(p.q)) + '">' + esc(S.a[p.f]) + '</textarea>';
  }
  function archivos(p) {
    var fs = FILES[p.f] || [];
    return '<label class="q-drop' + (fs.length ? ' has' : '') + '">' +
      '<input type="file" multiple data-files="' + esc(p.f) + '">' +
      '<span class="q-drop-ring" aria-hidden="true"></span>' +
      '<span style="font-size:16px;font-weight:500;line-height:1.35">' + esc(t(spec.subir)) + '</span></label>' +
      fs.map(function (f, i) {
        return '<div class="q-file"><span>' + esc(f.name) + '</span>' +
          '<button type="button" class="q-x" data-rmfile="' + esc(p.f) + '" data-i="' + i + '" aria-label="' +
          esc(t('q_rmfile')) + '">×</button></div>';
      }).join('') +
      (p.enlace ? '<div style="margin-top:16px;max-width:520px">' +
        '<p class="q-hint" style="margin-bottom:8px">' + esc(t(spec.enlace)) + '</p>' +
        '<input class="q-in q-in-corto" type="text" data-field="' + esc(p.enlace) + '" value="' +
        esc(S.a[p.enlace]) + '" aria-label="' + esc(t(spec.enlace)) + '"></div>' : '') +
      // Referencias: subir capturas y escribir enlaces son la misma respuesta,
      // así que el cuadro de texto vive dentro de la pregunta del archivo.
      (p.area ? '<textarea class="q-in q-area" rows="3" data-field="' + esc(p.area) +
        '" aria-label="' + lbl(t(p.q)) + '" style="margin-top:16px">' + esc(S.a[p.area]) + '</textarea>' : '');
  }
  function ejes(p) {
    var a = S.a;
    return '<div class="q-axes">' + p.ejes.map(function (par, i) {
      var izq = t(par[0]), der = t(par[1]);
      return '<div class="q-ax"><span class="q-ax-lado">' + esc(izq) + '</span>' +
        '<div class="q-ax-puntos">' + [1, 2, 3, 4, 5].map(function (n) {
          return '<button type="button" class="q-ax-p" data-ax="' + esc(p.f) + '" data-i="' + i +
            '" data-n="' + n + '" aria-pressed="' + (a[p.f][i] === n) + '" aria-label="' +
            esc(fill(t(p.a11y), { a: izq, b: der, n: n })) + '"><span></span></button>';
        }).join('') + '</div>' +
        '<span class="q-ax-lado q-ax-der">' + esc(der) + '</span></div>';
    }).join('') + '</div>';
  }
  function contacto(p) {
    var a = S.a, sug = suggestEmail(a[p.correo]);
    var uno = function (f, clave, tipo) {
      return '<label class="q-campo"><span class="q-campo-t">' + esc(t(clave)) + '</span>' +
        '<input class="q-in" type="' + (tipo || 'text') + '" data-field="' + esc(f) + '" value="' + esc(a[f]) + '"' +
        (tipo === 'email' ? ' autocomplete="email" inputmode="email" spellcheck="false"' : '') + '></label>';
    };
    return '<div class="q-fields">' + uno(p.nombre, p.lbNombre) +
      uno(p.correo, p.lbCorreo, 'email') + uno(p.telefono, p.lbTelefono, 'tel') + '</div>' +
      (a[p.correo] && !EMAIL_RE.test(a[p.correo]) ? '<p class="q-err">' + esc(t('escribelo_completo_con_arroba_y_dominio')) + '</p>' : '') +
      (sug ? '<p class="q-err">' + esc(fill(t('did_you_mean'), { email: sug })) +
        ' <button type="button" class="q-back" data-fix-email="' + esc(p.correo) +
        '" style="margin-left:8px">' + esc(t('si_corregir')) + '</button></p>' : '') +
      '<div class="q-priv"><button type="button" class="q-priv-box" data-privacy="' + esc(p.privacidad) +
      '" aria-pressed="' + !!a[p.privacidad] + '" aria-label="' + esc(t('he_leido_y_acepto_la')) + '"></button>' +
      '<span>' + esc(t('he_leido_y_acepto_la')) + ' <a href="' + PRIV_URL + '" target="_blank" rel="noopener">' +
      esc(t('politica_de_privacidad')) + '</a></span></div>' +
      '<input type="text" data-field="bot" value="' + esc(a.bot) + '" tabindex="-1" autocomplete="off" ' +
      'aria-hidden="true" class="q-bot">';
  }

  var CUERPO = {
    cards: tarjetas, checks: tarjetas, chips: chips, chipchecks: chips, tope: chips,
    texto: campo, fecha: campo, area: area, subida: archivos, ejes: ejes, contacto: contacto
  };
  var CON_ETIQUETA = { texto: 1, fecha: 1, area: 1, subida: 1 };

  function pregunta(p) {
    var falla = S.showErrors && MISSING.indexOf(p.f) > -1;
    var marca = '';
    if (p.tipo === 'tope') {
      marca = fill(t(spec.contadorTope), { n: (S.a[p.f] || []).length, max: tope(p) });
    } else if (CON_ETIQUETA[p.tipo]) {
      marca = t(p.req ? 'status_required' : 'status_optional');
    }
    return '<div class="q-group' + (falla ? ' q-invalid' : '') + '" data-fields="' + esc(p.f) + '">' +
      '<div class="q-head"><p class="q-q">' + esc(t(p.q)) + '</p>' +
      (marca ? '<span class="q-tag">' + esc(marca) + '</span>' : '') + '</div>' +
      (p.h ? '<p class="q-hint">' + esc(t(p.h)) + '</p>' : '') +
      CUERPO[p.tipo](p) +
      (falla ? '<p class="q-falta">' + esc(t('q_missing')) + '</p>' : '') + '</div>';
  }

  // ------------------------------------------------------------ final
  function finalScreen() {
    var f = spec.final;
    return '<section class="q-fin"><div class="q-fin-caja">' +
      '<h2>' + esc(t(f.titulo)) + '</h2>' +
      '<p class="q-fin-1">' + esc(t(f.p1)) + '</p>' +
      '<p class="q-fin-2">' + esc(t(f.p2)) + '</p>' +
      '<div class="q-fin-firma">' + esc(t(f.firma)) + '</div></div>' +
      '<div class="q-fin-sub">' + esc(t(f.resumen)) + '</div>' +
      '<dl class="q-sum">' + spec.resumen(S.a, { tr: TR, lista: lista, t: t }).map(function (par) {
        return '<div><dt>' + esc(t(par[0])) + '</dt><dd>' + esc(par[1]) + '</dd></div>';
      }).join('') + '</dl></section>';
  }

  // ------------------------------------------------------------ render
  function render() {
    var main = document.getElementById('q-main');
    var nav = document.getElementById('q-nav');
    var seg = document.getElementById('q-seg');

    seg.innerHTML = PASOS.map(function (_, i) {
      return '<i class="' + (S.done || i < S.step ? 'on' : '') + '"></i>';
    }).join('');
    // Dos sitios lo enseñan —cabecera y barra—, uno en cada tamaño de pantalla.
    Array.prototype.forEach.call(document.querySelectorAll('.q-saved'), function (el) {
      el.textContent = S.touched && !S.done ? t('saved') : '';
    });

    if (S.done) {
      nav.hidden = true;
      main.innerHTML = finalScreen();
      window.scrollTo(0, 0);
      return;
    }
    nav.hidden = false;
    MISSING = pendientes();
    var n = S.step;
    main.innerHTML = '<div class="q-paso">' +
      '<p class="q-paso-n">' + esc(fill(t(spec.contador), { n: n < 10 ? '0' + n : n })) + '</p>' +
      '<h1 class="q-paso-t">' + esc(t(PASOS[n - 1].titulo)) + '</h1></div>' +
      visibles(n).map(pregunta).join('');

    document.getElementById('q-back').disabled = n === 1;
    document.getElementById('qb-count').textContent = fill(t(spec.contador), { n: n });
    var next = document.getElementById('q-next');
    next.disabled = S.sending;
    var etiqueta = S.sending ? (S.notice || t('sending'))
                             : (n === ULTIMO ? t('submit') : t('next'));
    next.querySelector('.qb-label').textContent = etiqueta;
    next.setAttribute('aria-label', etiqueta);
    var aviso = document.getElementById('qb-aviso');
    if (S.notice && !S.sending) {
      aviso.textContent = S.notice;
      aviso.hidden = false;
    } else if (S.showErrors && MISSING.length) {
      aviso.textContent = fill(t(MISSING.length === 1 ? 'q_missing_one' : 'q_missing_many'),
                               { n: MISSING.length });
      aviso.hidden = false;
    } else { aviso.hidden = true; }
  }

  function go(n) {
    S.step = n; S.notice = ''; S.showErrors = false;
    persist(); render(); window.scrollTo(0, 0);
  }

  // ------------------------------------------------------------ eventos
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-set],[data-check],[data-cap],[data-ax],[data-privacy],[data-fix-email],[data-rmfile]');
    if (!el) return;
    var o = {};
    if (el.dataset.set !== undefined) {
      // Volver a pulsar lo elegido lo deselecciona: es la única forma de
      // vaciar una respuesta opcional una vez contestada.
      o[el.dataset.set] = S.a[el.dataset.set] === el.dataset.val ? '' : el.dataset.val;
      return setA(o);
    }
    if (el.dataset.check !== undefined) return toggleIn(el.dataset.check, el.dataset.val, el.dataset.solo || '');
    if (el.dataset.cap !== undefined) {
      var f = el.dataset.cap, cur = S.a[f] || [], on = cur.indexOf(el.dataset.val) > -1;
      o[f] = on ? cur.filter(function (v) { return v !== el.dataset.val; }) : cur.concat([el.dataset.val]);
      return setA(o);
    }
    if (el.dataset.ax !== undefined) {
      var ejes = Object.assign({}, S.a[el.dataset.ax]);
      var i = el.dataset.i, n = parseInt(el.dataset.n, 10);
      if (ejes[i] === n) delete ejes[i]; else ejes[i] = n;
      o[el.dataset.ax] = ejes;
      return setA(o);
    }
    if (el.dataset.privacy !== undefined) {
      o[el.dataset.privacy] = !S.a[el.dataset.privacy];
      return setA(o);
    }
    if (el.dataset.fixEmail !== undefined) {
      o[el.dataset.fixEmail] = suggestEmail(S.a[el.dataset.fixEmail]);
      return setA(o);
    }
    if (el.dataset.rmfile !== undefined) {
      FILES[el.dataset.rmfile].splice(parseInt(el.dataset.i, 10), 1);
      return render();
    }
  });
  document.addEventListener('change', function (e) {
    var kind = e.target.dataset && e.target.dataset.files;
    if (kind === undefined) return;
    FILES[kind] = FILES[kind].concat(Array.prototype.slice.call(e.target.files || []));
    S.touched = true;
    render();
  });
  document.addEventListener('input', function (e) {
    var f = e.target.dataset && e.target.dataset.field;
    if (!f) return;
    S.a[f] = e.target.value;
    S.touched = true;
    persist();
    // No se re-renderiza en cada tecla: se perdería el foco y el cursor.
    if (S.showErrors) {
      MISSING = pendientes();
      var aviso = document.getElementById('qb-aviso');
      if (aviso) {
        aviso.hidden = MISSING.length === 0;
        aviso.textContent = fill(t(MISSING.length === 1 ? 'q_missing_one' : 'q_missing_many'),
                                 { n: MISSING.length });
      }
    }
  });
  document.addEventListener('blur', function (e) {
    if (e.target.dataset && e.target.dataset.field && spec.poda) { S.a = spec.poda(S.a); render(); }
  }, true);

  document.getElementById('q-back').addEventListener('click', function () { if (S.step > 1) go(S.step - 1); });
  document.getElementById('q-save').addEventListener('click', function () {
    persist();
    alert(t(spec.guardado));
  });
  document.getElementById('q-next').addEventListener('click', function () {
    if (S.sending) return;
    if (pendientes().length) {
      S.showErrors = true;
      render();
      var el = document.querySelector('.q-invalid');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        var foco = el.querySelector('input, textarea, button');
        if (foco) setTimeout(function () { foco.focus({ preventScroll: true }); }, 350);
      }
      return;
    }
    S.showErrors = false;
    if (S.step < ULTIMO) return go(S.step + 1);
    enviar();
  });

  // ------------------------------------------------------------ envío
  function enviar() {
    var a = S.a, c = spec.contactoCampos;
    if (a.bot) { S.notice = t('no_pudimos_enviar_tu_proyecto_desde'); return render(); }
    var sent = {};
    try { sent = JSON.parse(localStorage.getItem(SUBMIT_KEY) || '{}'); } catch (e) {}
    var k = String(a[c.correo]).trim().toLowerCase();
    if ((sent[k] || 0) >= MAX_SUBMITS) { S.notice = t('already_sent'); return render(); }

    S.sending = true; S.notice = ''; render();

    // Los archivos van directos a Blob: las funciones de Vercel tienen un tope
    // de ~4,5 MB de cuerpo. Aquí solo viajan las URLs resultantes.
    var pending = [];
    (spec.archivos || []).forEach(function (kind) {
      FILES[kind].forEach(function (f) { pending.push({ kind: kind, file: f }); });
    });
    var lote = Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36);
    var subidos = [];
    // Para decir en qué paso falló: el mensaje del SDK de Blob está en inglés
    // técnico y no le sirve al cliente.
    var subiendo = true;

    cargaSubidor(pending.length)
      .then(function () {
        var hechos = 0;
        return pending.reduce(function (chain, item) {
          return chain.then(function () {
            var safe = item.file.name.replace(/[^\w.\-]+/g, '_').slice(-80);
            return window.borsogaUpload(item.file, 'leads/' + lote + '/' + item.kind + '/' + safe,
              function (pct) {
                S.notice = fill(t('q_uploading'), { n: hechos + 1, total: pending.length, pct: pct });
                var n = document.getElementById('q-next');
                if (n) {
                  n.querySelector('.qb-label').textContent = S.notice;
                  n.setAttribute('aria-label', S.notice);
                }
              })
              .then(function (b) {
                hechos++;
                subidos.push({ kind: item.kind, name: item.file.name, url: b.url, size: item.file.size });
              });
          });
        }, Promise.resolve());
      })
      .then(function () {
        subiendo = false;
        return fetch('/api/submit/', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ service: spec.servicio, answers: Object.assign({}, a, { plan: PLAN }),
                                 derived: { picked: PLAN }, files: subidos })
        });
      })
      .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
      .then(function (jr) {
        S.sending = false; S.notice = '';
        if (!jr || !jr.ok) { S.notice = (jr && jr.error) || t('err_send'); return render(); }
        sent[k] = (sent[k] || 0) + 1;
        try { localStorage.setItem(SUBMIT_KEY, JSON.stringify(sent)); localStorage.removeItem(spec.clave); } catch (e) {}
        S.done = true;
        render();
      })
      .catch(function (err) {
        if (window.console) console.error(err);
        S.sending = false;
        S.notice = subiendo && pending.length ? t('err_upload') : t('err_net');
        render();
      });
  }

  // El SDK de Blob pesa ~100 KB: solo se carga si hay archivos que subir.
  var subidorPromise = null;
  function cargaSubidor(hay) {
    if (!hay) return Promise.resolve();
    if (window.borsogaUpload) return Promise.resolve();
    if (subidorPromise) return subidorPromise;
    subidorPromise = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = '/assets/upload.js';
      s.onload = function () { window.borsogaUpload ? resolve() : reject(new Error('el subidor no cargó')); };
      s.onerror = function () { reject(new Error('no se pudo cargar el subidor')); };
      document.head.appendChild(s);
    });
    return subidorPromise;
  }

  // ------------------------------------------------------------ arranque
  try {
    var saved = JSON.parse(localStorage.getItem(spec.clave) || 'null');
    if (saved && saved.a && saved.step > 1) {
      if (confirm(fill(t('q_resume'), { n: saved.step < 10 ? '0' + saved.step : saved.step }))) {
        S.a = Object.assign(blank(), saved.a);
        if (spec.poda) S.a = spec.poda(S.a);
        S.step = Math.min(ULTIMO, Math.max(1, saved.step));
        S.touched = true;
      } else { localStorage.removeItem(spec.clave); }
    }
  } catch (e) {}
  render();
}

window.BORSOGA_BRIEF = arranca;
})();
