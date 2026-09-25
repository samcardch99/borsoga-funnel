// Panel de administración de Borsoga Studio: edita los cuestionarios largos
// (diseño web, identidad de marca), los previsualiza con el motor real de la
// web y los publica. Sin dependencias ni compilación: vercel.json lo sirve tal
// cual desde /admin/. La API está en api/admin.ts.
(function () {
'use strict';

var SERVICIOS = {
  web: { nombre: 'Cuestionario de diseño web', ruta: { es: '/plans/es/cuestionario-web/', en: '/plans/web-brief/' } },
  grafico: { nombre: 'Cuestionario de identidad de marca', ruta: { es: '/plans/es/cuestionario-grafico/', en: '/plans/graphic-brief/' } }
};
var WEB = location.hostname === 'localhost' ? 'http://localhost:4321' : 'https://borsogastudio.com';

var TIPOS = {
  texto: 'Texto corto', area: 'Texto largo', fecha: 'Fecha',
  chips: 'Una opción · botones', cards: 'Una opción · tarjetas',
  chipchecks: 'Varias opciones · botones', checks: 'Varias opciones · tarjetas', tope: 'Varias, con máximo',
  subida: 'Archivos', ejes: 'Ejes de personalidad', contacto: 'Datos de contacto'
};
// Tipos entre los que se puede cambiar una pregunta: misma forma de respuesta.
var FAMILIA = { texto: 'txt', area: 'txt', fecha: 'txt', chips: 'uno', cards: 'uno',
                chipchecks: 'varios', checks: 'varios', tope: 'varios', subida: 'subida', ejes: 'ejes', contacto: 'contacto' };
var NUEVOS = ['texto', 'area', 'fecha', 'chips', 'cards', 'chipchecks', 'checks', 'tope'];
var CON_OPCIONES = { chips: 1, cards: 1, chipchecks: 1, checks: 1, tope: 1 };
var TEXTOS = [
  ['contador', 'Contador de pasos', 'Usa {n} para el paso y {total} para el total.'],
  ['tope', 'Contador de elecciones', 'Usa {n} y {max}.'],
  ['subir', 'Zona de archivos'],
  ['enlace', 'Campo de enlace (junto a los archivos)'],
  ['guardado', 'Aviso al pulsar «Guardar y salir»', null, true],
  ['finalTitulo', 'Pantalla final · título'],
  ['finalP1', 'Pantalla final · primer párrafo', null, true],
  ['finalP2', 'Pantalla final · segundo párrafo', null, true],
  ['finalFirma', 'Pantalla final · firma'],
  ['resumen', 'Título del resumen de respuestas']
];

var S = {
  yo: null, servicio: null, draft: null, rev: 0, publicada: null,
  abierta: null, estado: '', problemas: [], vista: false, vistaLang: 'es', vistaVieja: false,
  timer: null, guardando: null
};

// ------------------------------------------------------------ utilidades
function h(tag, props) {
  var el = document.createElement(tag);
  props = props || {};
  Object.keys(props).forEach(function (k) {
    var v = props[k];
    if (v == null || v === false) return;
    if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'class') el.className = v;
    else if (k === 'value') el.value = v;
    else if (k === 'checked' || k === 'disabled') el[k] = !!v;
    else el.setAttribute(k, v === true ? '' : v);
  });
  for (var i = 2; i < arguments.length; i++) añadir(el, arguments[i]);
  return el;
}
function añadir(el, x) {
  if (x == null || x === false) return;
  if (Array.isArray(x)) return x.forEach(function (y) { añadir(el, y); });
  el.appendChild(typeof x === 'object' ? x : document.createTextNode(String(x)));
}
var copia = function (x) { return JSON.parse(JSON.stringify(x)); };
var igual = function (a, b) { return JSON.stringify(a) === JSON.stringify(b); };
var app = function () { return document.getElementById('app'); };

function aviso(txt, mal) {
  var el = document.getElementById('aviso');
  el.textContent = txt;
  el.className = 'aviso' + (mal ? ' mal' : '');
  el.hidden = false;
  clearTimeout(aviso.t);
  aviso.t = setTimeout(function () { el.hidden = true; }, mal ? 7000 : 3500);
}

function api(op, o) {
  o = o || {};
  var qs = new URLSearchParams(o.q || {}).toString();
  return fetch('/api/admin/' + op + '/' + (qs ? '?' + qs : ''), {
    method: o.method || 'GET',
    credentials: 'same-origin',
    headers: { 'x-borsoga': '1', 'content-type': 'application/json' },
    body: o.body ? JSON.stringify(o.body) : undefined
  }).then(function (r) {
    return r.json().catch(function () { return {}; }).then(function (j) {
      if (r.status === 401) { pantallaLogin(); throw new Error('Sin sesión'); }
      j._status = r.status;
      return j;
    });
  });
}

function fecha(s) {
  if (!s) return '';
  var d = new Date(s);
  return d.toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' +
         d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
}

// Todas las preguntas, en orden, con su paso.
function todas(schema) {
  var out = [];
  (schema || S.draft).pasos.forEach(function (p, i) {
    p.preguntas.forEach(function (q) { out.push({ q: q, paso: i }); });
  });
  return out;
}
function camposPublicados() {
  var set = {};
  if (S.publicada) todas(S.publicada.schema).forEach(function (x) { set[x.q.f] = x.q; });
  return set;
}

// ------------------------------------------------------------ arranque
function inicio() {
  if (location.hostname === 'plans.borsogastudio.com') {
    location.replace('https://admin.borsogastudio.com/admin/' + location.hash);
    return;
  }
  var q = new URLSearchParams(location.search);
  if (q.get('error')) return pantallaLogin(q.get('error'), q.get('email'));
  api('yo').then(function (j) {
    S.yo = j.email;
    cabecera();
    ruta();
  }).catch(function () {});
  window.addEventListener('hashchange', ruta);
  window.addEventListener('beforeunload', function (e) {
    if (S.timer || S.guardando) { e.preventDefault(); e.returnValue = ''; }
  });
  window.addEventListener('message', mensajeVista);
}

function cabecera() {
  var u = document.getElementById('usuario');
  u.innerHTML = '';
  if (!S.yo) return;
  añadir(u, [
    h('span', { class: 'quien' }, S.yo),
    h('button', { type: 'button', onclick: function () {
      api('logout', { method: 'POST' }).then(function () { S.yo = null; cabecera(); pantallaLogin(); });
    } }, 'Salir')
  ]);
}

function pantallaLogin(error, email) {
  S.yo = null;
  cabecera();
  var msg = {
    login: 'No se pudo completar el acceso con Google. Vuelve a intentarlo.',
    config: 'El acceso con Google aún no está configurado en el servidor.',
    noautorizado: 'La cuenta ' + (email || '') + ' no tiene acceso a este panel.'
  }[error];
  app().innerHTML = '';
  añadir(app(), h('div', { class: 'login' },
    h('h1', null, 'Panel de Borsoga'),
    h('p', null, 'Edita los cuestionarios de la web y publícalos.'),
    msg && h('p', { class: 'error' }, msg),
    h('a', { class: 'boton', href: '/api/admin/login/' }, 'Entrar con Google')
  ));
  if (error) history.replaceState(null, '', '/admin/');
}

function ruta() {
  var s = location.hash.replace('#', '');
  if (S.timer) guardarYa();
  if (SERVICIOS[s]) return abrir(s);
  S.servicio = null;
  pantallaInicio();
}

// ------------------------------------------------------------ inicio
function pantallaInicio() {
  app().innerHTML = '<p class="cargando">Cargando…</p>';
  api('forms').then(function (j) {
    app().innerHTML = '';
    añadir(app(), [
      h('h1', null, 'Cuestionarios'),
      h('p', { class: 'sub' }, 'Lo que publiques aquí sale en borsogastudio.com/plans en unos segundos.'),
      h('div', { class: 'tarjetas' }, (j.forms || []).map(function (f) {
        return h('a', { class: 'tarjeta', href: '#' + f.servicio },
          h('h2', null, SERVICIOS[f.servicio].nombre),
          h('div', null, f.cambios
            ? h('span', { class: 'chip cambios' }, 'Cambios sin publicar')
            : h('span', { class: 'chip ok' }, 'Publicado')),
          h('div', { class: 'estado' }, 'Versión publicada: ' + f.publicada + (f.cambiado ? ' · Última edición ' + fecha(f.cambiado) + (f.por ? ' por ' + f.por : '') : '')));
      }))
    ]);
  }).catch(function (e) { if (e.message !== 'Sin sesión') aviso(e.message, true); });
}

// ------------------------------------------------------------ editor
function abrir(s) {
  S.servicio = s;
  S.abierta = null;
  app().innerHTML = '<p class="cargando">Cargando…</p>';
  api('form', { q: { servicio: s } }).then(function (j) {
    if (j.error) throw new Error(j.error);
    S.draft = j.draft;
    S.rev = j.rev;
    S.publicada = j.publicada;
    S.estado = '';
    S.problemas = [];
    pintar();
    comprobar();
  }).catch(function (e) { if (e.message !== 'Sin sesión') aviso(e.message, true); });
}

function hayCambios() { return S.publicada && !igual(S.publicada.schema, S.draft); }

// Cada edición marca el borrador como cambiado; se guarda solo, al segundo.
function cambio(repintar) {
  S.estado = 'Sin guardar…';
  S.vistaVieja = true;
  clearTimeout(S.timer);
  S.timer = setTimeout(guardarYa, 900);
  if (repintar) pintar(); else pintarEstado();
}

function guardarYa() {
  clearTimeout(S.timer);
  S.timer = null;
  if (!S.draft || !S.servicio) return Promise.resolve();
  var servicio = S.servicio, envio = copia(S.draft);
  S.estado = 'Guardando…';
  pintarEstado();
  S.guardando = api('borrador', { method: 'PUT', q: { servicio: servicio }, body: { schema: envio, rev: S.rev } })
    .then(function (j) {
      S.guardando = null;
      if (servicio !== S.servicio) return;
      if (j._status === 409) {
        S.estado = 'Conflicto';
        pintarEstado();
        alert(j.error + '\n\nSe va a cargar la versión guardada; tus últimos cambios de esta pestaña se pierden.');
        return abrir(servicio);
      }
      if (!j.ok) throw new Error(j.error || 'No se pudo guardar.');
      S.rev = j.rev;
      S.estado = S.timer ? 'Sin guardar…' : 'Guardado';
      pintarEstado();
      comprobar();
    })
    .catch(function (e) {
      S.guardando = null;
      if (e.message === 'Sin sesión') return;
      S.estado = 'Error al guardar';
      pintarEstado();
      aviso(e.message, true);
    });
  return S.guardando;
}

function comprobar() {
  if (!S.servicio) return;
  api('comprobar', { method: 'POST', q: { servicio: S.servicio } }).then(function (j) {
    S.problemas = j.errores || [];
    var caja = document.getElementById('problemas');
    if (caja) caja.replaceWith(cajaProblemas());
  }).catch(function () {});
}

function cajaProblemas() {
  if (!S.problemas.length) return h('div', { id: 'problemas', hidden: true });
  return h('div', { id: 'problemas', class: 'problemas' },
    h('strong', null, S.problemas.length === 1 ? 'Hay 1 cosa que corregir antes de publicar:' : 'Hay ' + S.problemas.length + ' cosas que corregir antes de publicar:'),
    h('ul', null, S.problemas.map(function (p) { return h('li', null, p); })));
}

function pintarEstado() {
  var el = document.getElementById('estado');
  if (el) {
    el.textContent = S.estado;
    el.className = 'guardado' + (/Error|Conflicto/.test(S.estado) ? ' mal' : '');
  }
  var pub = document.getElementById('b-publicar');
  if (pub) pub.disabled = !hayCambios();
  var des = document.getElementById('b-descartar');
  if (des) des.disabled = !hayCambios();
  var act = document.getElementById('b-actualizar');
  if (act) act.textContent = S.vistaVieja ? 'Actualizar ●' : 'Actualizar';
}

function pintar() {
  var y = window.scrollY;
  app().innerHTML = '';
  var d = S.draft;
  añadir(app(), [
    h('a', { class: 'volver', href: '#' }, '← Cuestionarios'),
    h('div', { class: 'cabecera' },
      h('div', null,
        h('h1', null, SERVICIOS[S.servicio].nombre),
        h('div', { class: 'estado' }, 'Versión publicada: ' + S.publicada.version + ' · ' + d.pasos.length + ' pasos · ' + todas().length + ' preguntas')),
      h('div', { class: 'acciones' },
        h('span', { id: 'estado', class: 'guardado' }, S.estado),
        h('button', { type: 'button', class: 'boton claro', onclick: function () { S.vista = !S.vista; pintar(); } },
          S.vista ? 'Ocultar vista previa' : 'Vista previa'),
        h('button', { type: 'button', class: 'boton claro', onclick: dialogoHistorial }, 'Historial'),
        h('button', { type: 'button', id: 'b-descartar', class: 'boton claro', disabled: !hayCambios(), onclick: descartar }, 'Descartar cambios'),
        h('button', { type: 'button', id: 'b-publicar', class: 'boton', disabled: !hayCambios(), onclick: dialogoPublicar }, 'Publicar…'))),
    cajaProblemas(),
    h('div', { class: 'rejilla' + (S.vista ? ' con-vista' : '') },
      h('div', null,
        textosGenerales(),
        d.pasos.map(pintarPaso),
        h('button', { type: 'button', class: 'boton claro', onclick: nuevoPaso }, '+ Añadir paso')),
      S.vista && panelVista())
  ]);
  pintarEstado();
  window.scrollTo(0, y);
}

// ------------------------------------------------------------ campos {es, en}
function par(obj, clave, o) {
  o = o || {};
  var val = obj[clave] || {};
  function uno(l) {
    var props = {
      value: val[l] || '', placeholder: o.placeholder ? o.placeholder[l] : (l === 'en' ? 'English' : 'Español'),
      class: l === 'en' && val.es && !val.en ? 'en-falta' : null,
      oninput: function (e) {
        if (!obj[clave]) obj[clave] = { es: '', en: '' };
        obj[clave][l] = e.target.value;
        if (o.opcional && !obj[clave].es && !obj[clave].en) delete obj[clave];
        if (l === 'es' && o.alCambiarEs) o.alCambiarEs(e.target.value);
        e.target.parentNode.parentNode.querySelectorAll('.idioma')[1].firstChild.classList
          .toggle('en-falta', !!(obj[clave] && obj[clave].es && !obj[clave].en));
        cambio(false);
      }
    };
    var campo = o.largo ? h('textarea', Object.assign(props, { rows: 2 }), val[l] || '') : h('input', Object.assign(props, { type: 'text' }));
    return h('div', { class: 'idioma', 'data-l': l.toUpperCase() }, campo);
  }
  return h('div', { class: 'par' }, uno('es'), uno('en'));
}

function campo(etiqueta, contenido, nota) {
  return h('div', { class: 'campo' }, h('label', null, etiqueta), contenido, nota && h('div', { class: 'nota' }, nota));
}

function textosGenerales() {
  return h('details', { class: 'textos-generales' },
    h('summary', null, 'Textos generales del cuestionario'),
    TEXTOS.map(function (t) {
      return campo(t[1], par(S.draft.textos, t[0], { largo: t[3] }), t[2]);
    }));
}

// ------------------------------------------------------------ pasos
function pintarPaso(paso, i) {
  var ultimo = i === S.draft.pasos.length - 1;
  return h('section', { class: 'paso' },
    h('div', { class: 'paso-cab' },
      h('span', { class: 'paso-n' }, 'Paso ' + (i + 1)),
      par(paso, 'titulo'),
      h('div', { class: 'p-herr' },
        h('button', { type: 'button', class: 'icono', title: 'Subir paso', disabled: i === 0, onclick: function () { moverPaso(i, -1); } }, '↑'),
        h('button', { type: 'button', class: 'icono', title: 'Bajar paso', disabled: ultimo, onclick: function () { moverPaso(i, 1); } }, '↓'),
        h('button', { type: 'button', class: 'icono', title: 'Borrar paso', onclick: function () { borrarPaso(i); } }, '✕'))),
    h('div', { class: 'paso-cuerpo' },
      paso.preguntas.map(function (q, j) { return pintarPregunta(q, i, j); }),
      h('div', { style: 'padding:8px 10px' },
        h('button', { type: 'button', class: 'boton claro mini', onclick: function () { nuevaPregunta(i); } }, '+ Añadir pregunta'))));
}

function moverPaso(i, d) {
  var ps = S.draft.pasos, p = ps.splice(i, 1)[0];
  ps.splice(i + d, 0, p);
  cambio(true);
}
function borrarPaso(i) {
  var p = S.draft.pasos[i];
  if (p.preguntas.length) return aviso('Mueve o borra sus preguntas antes de borrar el paso.', true);
  S.draft.pasos.splice(i, 1);
  cambio(true);
}
function nuevoPaso() {
  var ids = S.draft.pasos.map(function (p) { return p.id; }), n = S.draft.pasos.length + 1;
  while (ids.indexOf('p' + n) > -1) n++;
  // Antes del último: el último lleva los datos de contacto.
  S.draft.pasos.splice(Math.max(0, S.draft.pasos.length - 1), 0,
    { id: 'p' + n, titulo: { es: 'Nuevo paso', en: 'New step' }, preguntas: [] });
  cambio(true);
}

// ------------------------------------------------------------ preguntas
function resumenPregunta(q) {
  var bits = [TIPOS[q.tipo] || q.tipo];
  if (q.ops) bits.push(q.ops.length + ' opciones');
  if (q.si && q.si.length) bits.push('condicional');
  return bits;
}

function pintarPregunta(q, i, j) {
  var abierta = S.abierta === q.f;
  var paso = S.draft.pasos[i];
  return h('div', { class: 'pregunta' + (abierta ? ' abierta' : '') },
    h('div', { class: 'p-fila', onclick: function (e) {
      if (e.target.closest('button')) return;
      S.abierta = abierta ? null : q.f;
      pintar();
    } },
      h('div', { class: 'p-texto' },
        h('strong', null, (q.q && q.q.es) || '(sin texto)'),
        h('div', { class: 'p-meta' },
          q.req && h('span', { class: 'req' }, 'Obligatoria ·'),
          resumenPregunta(q).join(' · '),
          (q.q && q.q.es && !q.q.en) && h('span', { class: 'candado' }, '· falta el inglés'))),
      h('div', { class: 'p-herr' },
        h('button', { type: 'button', class: 'icono', title: 'Subir', disabled: j === 0, onclick: function () { moverPregunta(i, j, -1); } }, '↑'),
        h('button', { type: 'button', class: 'icono', title: 'Bajar', disabled: j === paso.preguntas.length - 1, onclick: function () { moverPregunta(i, j, 1); } }, '↓'))),
    abierta && editorPregunta(q, i, j));
}

function moverPregunta(i, j, d) {
  var qs = S.draft.pasos[i].preguntas, q = qs.splice(j, 1)[0];
  qs.splice(j + d, 0, q);
  cambio(true);
}

var PALABRAS_VACIAS = ['el', 'la', 'los', 'las', 'de', 'del', 'que', 'y', 'o', 'a', 'en', 'un', 'una', 'tu', 'su', 'es', 'se', 'por', 'para', 'con', 'al', 'lo'];
function nombreLibre(base) {
  var usados = {};
  todas().forEach(function (x) { usados[x.q.f] = 1; if (x.q.enlace) usados[x.q.enlace] = 1; if (x.q.area) usados[x.q.area] = 1; });
  ['contactName', 'email', 'phone', 'privacy', 'bot', 'plan', 'name', 'service', 'version'].forEach(function (k) { usados[k] = 1; });
  var n = base, i = 2;
  while (usados[n]) n = base + i++;
  return n;
}
function slug(txt) {
  var ws = String(txt || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9 ]/g, ' ')
    .toLowerCase().split(/\s+/).filter(function (w) { return w && PALABRAS_VACIAS.indexOf(w) < 0; }).slice(0, 4);
  var s = ws.map(function (w, i) { return i ? w[0].toUpperCase() + w.slice(1) : w; }).join('');
  return /^[a-z]/.test(s) ? s.slice(0, 32) : 'pregunta';
}

function nuevaPregunta(i) {
  var q = { f: nombreLibre('nuevaPregunta'), tipo: 'chips', q: { es: 'Nueva pregunta', en: '' },
            ops: [{ es: 'Opción 1', en: '' }, { es: 'Opción 2', en: '' }] };
  var qs = S.draft.pasos[i].preguntas;
  var fin = qs.length && qs[qs.length - 1].tipo === 'contacto' ? qs.length - 1 : qs.length;
  qs.splice(fin, 0, q);
  S.abierta = q.f;
  cambio(true);
}

// Quién usa el campo `f` en sus condiciones o en su resumen.
function dependientes(f) {
  return todas().filter(function (x) {
    return (x.q.si || []).some(function (c) { return c.f === f; }) || (x.q.junto || []).indexOf(f) > -1;
  }).map(function (x) { return x.q; });
}

function borrarPregunta(i, j) {
  var q = S.draft.pasos[i].preguntas[j];
  var deps = dependientes(q.f).filter(function (d) { return d !== q; });
  var msg = '¿Borrar la pregunta «' + q.q.es + '»?';
  if (deps.length) msg += '\n\nEstas preguntas dependen de ella y dejarán de hacerlo:\n· ' + deps.map(function (d) { return d.q.es; }).join('\n· ');
  if (camposPublicados()[q.f]) msg += '\n\nLas respuestas que ya llegaron la conservan; los envíos nuevos ya no la tendrán.';
  if (!confirm(msg)) return;
  deps.forEach(function (d) {
    if (d.si) { d.si = d.si.filter(function (c) { return c.f !== q.f; }); if (!d.si.length) delete d.si; }
    if (d.junto) { d.junto = d.junto.filter(function (x) { return x !== q.f && x !== q.area && x !== q.enlace; }); if (!d.junto.length) delete d.junto; }
  });
  S.draft.pasos[i].preguntas.splice(j, 1);
  S.abierta = null;
  cambio(true);
}

function editorPregunta(q, i, j) {
  var pub = camposPublicados()[q.f];
  var fijas = (pub && pub.ops || []).filter(function (o) { return o.fija; }).length > 0;
  var borrable = q.tipo !== 'contacto' && !fijas;
  var tipos = pub || !NUEVOS.includes(q.tipo)
    ? Object.keys(TIPOS).filter(function (t) { return FAMILIA[t] === FAMILIA[q.tipo]; })
    : NUEVOS;

  var partes = [
    campo('Pregunta', par(q, 'q', { largo: true, alCambiarEs: pub ? null : function (v) {
      // Mientras no esté publicada, el nombre interno sigue al texto: así en
      // la base de datos y en el CRM se lee qué es cada respuesta.
      var viejo = q.f; q.f = ''; q.f = nombreLibre(slug(v));
      if (S.abierta === viejo) S.abierta = q.f;
      renombrarCampo(viejo, q.f);
    } })),
    campo('Ayuda (opcional)', par(q, 'h', { largo: true, opcional: true }), 'Texto pequeño bajo la pregunta.')
  ];

  if (q.tipo !== 'contacto' && q.tipo !== 'ejes') {
    partes.push(h('div', { class: 'linea' },
      h('div', { class: 'campo', style: 'min-width:240px' }, h('label', null, 'Tipo de respuesta'),
        h('select', { disabled: tipos.length < 2, onchange: function (e) { cambiarTipo(q, e.target.value); } },
          tipos.map(function (t) { return h('option', { value: t, selected: t === q.tipo }, TIPOS[t]); }))),
      h('label', { class: 'check' }, h('input', { type: 'checkbox', checked: !!q.req, onchange: function (e) {
        if (e.target.checked) q.req = true; else delete q.req;
        cambio(true);
      } }), 'Obligatoria'),
      q.tipo === 'cards' && h('label', { class: 'check' }, h('input', { type: 'checkbox', checked: !!q.col, onchange: function (e) {
        if (e.target.checked) q.col = true; else delete q.col;
        cambio(false);
      } }), 'Una opción por fila (textos largos)'),
      q.tipo === 'tope' && h('div', { class: 'campo', style: 'width:130px' }, h('label', null, 'Máximo'),
        h('input', { type: 'number', min: 1, max: (q.ops || []).length, value: q.tope || 1, oninput: function (e) {
          q.tope = Math.max(1, parseInt(e.target.value, 10) || 1);
          cambio(false);
        } }))));
  }

  if (q.tipo === 'texto') partes.push(campo('Texto de ejemplo dentro del campo (opcional)', par(q, 'ph', { opcional: true })));
  if (CON_OPCIONES[q.tipo]) partes.push(editorOpciones(q, pub));
  if (q.tipo === 'ejes') partes.push(editorEjes(q));
  if (q.tipo === 'contacto') {
    partes.push(campo('Etiqueta «Nombre»', par(q.campos, 'nombre')));
    partes.push(campo('Etiqueta «Correo»', par(q.campos, 'correo')));
    partes.push(campo('Etiqueta «Teléfono»', par(q.campos, 'telefono')));
    partes.push(h('div', { class: 'nota' }, 'Nombre, correo, teléfono y la casilla de privacidad son siempre obligatorios.'));
  }
  if (q.tipo === 'subida') {
    partes.push(h('div', { class: 'nota' }, q.area
      ? 'Admite archivos y, en el mismo bloque, enlaces escritos. Si es obligatoria, basta con cualquiera de las dos cosas.'
      : q.enlace ? 'Admite archivos y un enlace.' : 'Admite archivos.'));
  }
  if (q.tipo !== 'contacto') partes.push(editorCondiciones(q, i, j));
  if (q.tipo !== 'contacto') {
    partes.push(campo('En el resumen final (opcional)', par(q, 'resumen', { opcional: true,
      placeholder: { es: 'No aparece en el resumen', en: '' } }),
      'El resumen es lo que ve el cliente al terminar. Con etiqueta, esta respuesta aparece ahí.'));
  }

  partes.push(h('div', { class: 'linea' },
    h('div', { class: 'campo', style: 'min-width:220px' }, h('label', null, 'Mover al paso'),
      h('select', { onchange: function (e) {
        var k = parseInt(e.target.value, 10);
        if (k === i) return;
        S.draft.pasos[i].preguntas.splice(j, 1);
        var dest = S.draft.pasos[k].preguntas;
        var fin = dest.length && dest[dest.length - 1].tipo === 'contacto' ? dest.length - 1 : dest.length;
        dest.splice(fin, 0, q);
        cambio(true);
      } }, S.draft.pasos.map(function (p, k) { return h('option', { value: k, selected: k === i }, (k + 1) + '. ' + (p.titulo.es || '')); }))),
    h('div', { class: 'campo' }, h('label', null, 'Nombre interno'),
      h('div', { class: 'nota', style: 'padding-top:8px' }, q.f + (pub ? ' · fijo: ya hay respuestas guardadas con este nombre' : ''))),
    h('div', { style: 'flex:1' }),
    h('button', { type: 'button', class: 'boton peligro mini', disabled: !borrable,
      title: borrable ? '' : 'El servidor usa esta pregunta: no se puede borrar',
      onclick: function () { borrarPregunta(i, j); } }, 'Borrar pregunta')));

  return h('div', { class: 'p-edit' }, partes);
}

function renombrarCampo(viejo, nuevo) {
  if (viejo === nuevo) return;
  todas().forEach(function (x) {
    (x.q.si || []).forEach(function (c) { if (c.f === viejo) c.f = nuevo; });
    if (x.q.junto) x.q.junto = x.q.junto.map(function (f) { return f === viejo ? nuevo : f; });
  });
}

function cambiarTipo(q, t) {
  q.tipo = t;
  if (CON_OPCIONES[t] && !q.ops) q.ops = [{ es: 'Opción 1', en: '' }, { es: 'Opción 2', en: '' }];
  if (!CON_OPCIONES[t]) { delete q.ops; delete q.solo; }
  if (t !== 'tope') delete q.tope; else q.tope = Math.min(3, q.ops.length);
  if (t !== 'cards') delete q.col;
  if (t !== 'texto') delete q.ph;
  if (FAMILIA[t] !== 'varios') delete q.solo;
  cambio(true);
}

// ------------------------------------------------------------ opciones
function editorOpciones(q, pub) {
  var fijasPub = {};
  (pub && pub.ops || []).forEach(function (o) { if (o.fija) fijasPub[o.es] = 1; });
  var multiple = FAMILIA[q.tipo] === 'varios';
  return h('div', { class: 'campo' },
    h('label', null, 'Opciones'),
    h('div', { class: 'opciones' }, q.ops.map(function (o, k) {
      var fija = o.fija || fijasPub[o.es];
      var antes = o.es;
      return h('div', { class: 'opcion' + (fija ? ' fija' : '') },
        h('div', { class: 'idioma', 'data-l': 'ES' }, h('input', { type: 'text', class: 'es', value: o.es, readonly: fija ? true : null,
          title: fija ? 'El servidor usa este texto exacto: se puede traducir, pero no cambiar ni borrar' : null,
          oninput: function (e) { o.es = e.target.value; cambio(false); },
          onchange: function (e) { renombrarOpcion(q, antes, e.target.value); antes = e.target.value; } })),
        h('div', { class: 'idioma', 'data-l': 'EN' }, h('input', { type: 'text', value: o.en || '', placeholder: 'English',
          class: o.es && !o.en ? 'en-falta' : null,
          oninput: function (e) { o.en = e.target.value; e.target.classList.toggle('en-falta', !e.target.value); cambio(false); } })),
        h('div', { class: 'herr' },
          fija && h('span', { class: 'candado', title: 'La usa el servidor' }, '🔒'),
          h('button', { type: 'button', class: 'icono', title: 'Subir', disabled: k === 0, onclick: function () {
            q.ops.splice(k - 1, 0, q.ops.splice(k, 1)[0]); cambio(true); } }, '↑'),
          h('button', { type: 'button', class: 'icono', title: 'Bajar', disabled: k === q.ops.length - 1, onclick: function () {
            q.ops.splice(k + 1, 0, q.ops.splice(k, 1)[0]); cambio(true); } }, '↓'),
          h('button', { type: 'button', class: 'icono', title: fija ? 'La usa el servidor: no se puede quitar' : 'Quitar opción',
            disabled: fija || q.ops.length <= 2, onclick: function () { quitarOpcion(q, k); } }, '✕')));
    })),
    h('div', { class: 'linea' },
      h('button', { type: 'button', class: 'boton claro mini', onclick: function () {
        q.ops.push({ es: 'Nueva opción', en: '' }); cambio(true);
      } }, '+ Añadir opción'),
      multiple && h('label', { class: 'check' }, 'Opción que excluye a las demás:',
        h('select', { style: 'width:auto', onchange: function (e) {
          if (e.target.value) q.solo = e.target.value; else delete q.solo;
          cambio(false);
        } }, h('option', { value: '' }, 'ninguna'),
          q.ops.map(function (o) { return h('option', { value: o.es, selected: q.solo === o.es }, o.es); })))),
    h('div', { class: 'nota' }, 'Las respuestas se guardan con el texto en español. Si renombras una opción, las condiciones que la usan se actualizan solas.'));
}

function renombrarOpcion(q, viejo, nuevo) {
  if (!viejo || viejo === nuevo) return;
  todas().forEach(function (x) {
    (x.q.si || []).forEach(function (c) {
      if (c.f !== q.f) return;
      if (c.v === viejo) c.v = nuevo;
      if (Array.isArray(c.v)) c.v = c.v.map(function (v) { return v === viejo ? nuevo : v; });
    });
  });
  if (q.solo === viejo) q.solo = nuevo;
  cambio(true);
}

function quitarOpcion(q, k) {
  var v = q.ops[k].es;
  var usan = todas().filter(function (x) {
    return (x.q.si || []).some(function (c) { return c.f === q.f && (c.v === v || (Array.isArray(c.v) && c.v.indexOf(v) > -1)); });
  });
  if (usan.length && !confirm('Estas preguntas se muestran según la opción «' + v + '»:\n· ' +
      usan.map(function (x) { return x.q.q.es; }).join('\n· ') + '\n\n¿Quitarla igualmente? Sus condiciones se ajustarán.')) return;
  usan.forEach(function (x) {
    x.q.si = x.q.si.map(function (c) {
      if (c.f !== q.f) return c;
      if (c.v === v) return null;
      if (Array.isArray(c.v)) { c.v = c.v.filter(function (y) { return y !== v; }); return c.v.length ? c : null; }
      return c;
    }).filter(Boolean);
    if (!x.q.si.length) delete x.q.si;
  });
  if (q.solo === v) delete q.solo;
  q.ops.splice(k, 1);
  if (q.tope && q.tope > q.ops.length) q.tope = q.ops.length;
  cambio(true);
}

// ------------------------------------------------------------ ejes
function editorEjes(q) {
  return h('div', { class: 'campo' },
    h('label', null, 'Ejes (de un extremo al otro, de 1 a 5)'),
    q.ejes.map(function (e, k) {
      return h('div', { class: 'linea', style: 'align-items:stretch' },
        h('div', { style: 'flex:1' }, par(e, 'a')),
        h('span', { class: 'nota', style: 'align-self:center' }, '↔'),
        h('div', { style: 'flex:1' }, par(e, 'b')),
        h('button', { type: 'button', class: 'icono', title: 'Quitar eje', disabled: q.ejes.length <= 1,
          onclick: function () { q.ejes.splice(k, 1); cambio(true); } }, '✕'));
    }),
    h('div', null, h('button', { type: 'button', class: 'boton claro mini', onclick: function () {
      q.ejes.push({ a: { es: '', en: '' }, b: { es: '', en: '' } }); cambio(true);
    } }, '+ Añadir eje')),
    campo('Texto para lectores de pantalla', par(q, 'a11y'), 'Usa {a}, {b} y {n}.'));
}

// ------------------------------------------------------------ condiciones
var OPERADORES = {
  uno: [['eq', 'es'], ['ne', 'no es'], ['in', 'es una de'], ['filled', 'tiene respuesta']],
  varios: [['has', 'incluye alguna de'], ['filled', 'tiene alguna respuesta']],
  txt: [['filled', 'tiene respuesta']]
};

function editorCondiciones(q, i, j) {
  // Solo se puede depender de preguntas anteriores.
  var antes = [];
  S.draft.pasos.some(function (p, k) {
    return p.preguntas.some(function (x, m) {
      if (k === i && m === j) return true;
      if (OPERADORES[FAMILIA[x.tipo]]) antes.push(x);
      return false;
    });
  });
  var buscar = function (f) { return antes.filter(function (x) { return x.f === f; })[0]; };
  var conds = q.si || [];

  function fila(c, k) {
    var ref = buscar(c.f);
    var fam = ref ? FAMILIA[ref.tipo] : 'txt';
    var ops = OPERADORES[fam] || OPERADORES.txt;
    var valor = null;
    if (ref && ref.ops && (c.op === 'eq' || c.op === 'ne')) {
      valor = h('select', { onchange: function (e) { c.v = e.target.value; cambio(false); } },
        ref.ops.map(function (o) { return h('option', { value: o.es, selected: c.v === o.es }, o.es); }));
    } else if (ref && ref.ops && (c.op === 'in' || c.op === 'has')) {
      var vs = Array.isArray(c.v) ? c.v : [];
      valor = h('div', { class: 'valores' }, ref.ops.map(function (o) {
        return h('label', { class: 'check' }, h('input', { type: 'checkbox', checked: vs.indexOf(o.es) > -1, onchange: function (e) {
          var cur = Array.isArray(c.v) ? c.v : [];
          c.v = e.target.checked ? cur.concat([o.es]) : cur.filter(function (x) { return x !== o.es; });
          cambio(false);
        } }), o.es);
      }));
    } else {
      valor = h('span');
    }
    return h('div', { class: 'cond' },
      h('select', { onchange: function (e) {
        c.f = e.target.value;
        var r = buscar(c.f), f2 = r ? FAMILIA[r.tipo] : 'txt';
        c.op = OPERADORES[f2][0][0];
        c.v = c.op === 'eq' || c.op === 'ne' ? (r.ops ? r.ops[0].es : '') : c.op === 'filled' ? undefined : [];
        if (c.v === undefined) delete c.v;
        cambio(true);
      } },
        !ref && h('option', { value: c.f, selected: true }, '⚠ ' + c.f + ' (ya no es una pregunta anterior)'),
        antes.map(function (x) { return h('option', { value: x.f, selected: x.f === c.f }, x.q.es); })),
      h('select', { onchange: function (e) {
        var viejoOp = c.op; c.op = e.target.value;
        var r = buscar(c.f);
        if (c.op === 'filled') delete c.v;
        else if ((c.op === 'eq' || c.op === 'ne') && !(viejoOp === 'eq' || viejoOp === 'ne')) c.v = r && r.ops ? (Array.isArray(c.v) && c.v[0]) || r.ops[0].es : '';
        else if ((c.op === 'in' || c.op === 'has') && !Array.isArray(c.v)) c.v = c.v ? [c.v] : [];
        cambio(true);
      } }, ops.map(function (o) { return h('option', { value: o[0], selected: c.op === o[0] }, o[1]); })),
      valor,
      h('button', { type: 'button', class: 'icono', title: 'Quitar condición', onclick: function () {
        q.si.splice(k, 1);
        if (!q.si.length) delete q.si;
        cambio(true);
      } }, '✕'));
  }

  return h('div', { class: 'campo' },
    h('label', null, 'Cuándo se muestra'),
    conds.length
      ? h('div', { class: 'condiciones' },
          h('div', { class: 'nota' }, 'Solo si se cumple' + (conds.length > 1 ? 'n todas estas condiciones:' : ' esto:')),
          conds.map(fila))
      : h('div', { class: 'nota' }, 'Siempre.'),
    h('div', null, h('button', { type: 'button', class: 'boton claro mini', disabled: !antes.length, onclick: function () {
      var r = antes[antes.length - 1];
      var fam = FAMILIA[r.tipo];
      var c = { f: r.f, op: OPERADORES[fam][0][0] };
      if (c.op === 'eq') c.v = r.ops[0].es;
      if (c.op === 'has') c.v = [r.ops[0].es];
      q.si = (q.si || []).concat([c]);
      cambio(true);
    } }, '+ Añadir condición')),
    conds.length ? h('div', { class: 'nota' }, 'Si deja de mostrarse, su respuesta se borra: el estudio solo recibe lo que el cliente pudo ver.') : null);
}

// ------------------------------------------------------------ vista previa
function urlVista() {
  return WEB + SERVICIOS[S.servicio].ruta[S.vistaLang] + '?vista=1';
}
function panelVista() {
  S.vistaVieja = false;
  return h('aside', { class: 'vista' },
    h('div', { class: 'vista-cab' },
      h('strong', null, 'Vista previa del borrador'),
      h('div', { class: 'linea', style: 'gap:8px' },
        h('div', { class: 'seg' }, ['es', 'en'].map(function (l) {
          return h('button', { type: 'button', 'aria-pressed': S.vistaLang === l ? 'true' : 'false', onclick: function () {
            S.vistaLang = l; pintar();
          } }, l.toUpperCase());
        })),
        h('button', { type: 'button', id: 'b-actualizar', class: 'boton claro mini', onclick: recargarVista }, 'Actualizar'))),
    h('iframe', { id: 'vista', src: urlVista(), title: 'Vista previa' }));
}
function recargarVista() {
  var f = document.getElementById('vista');
  if (!f) return;
  S.vistaVieja = false;
  pintarEstado();
  f.src = urlVista() + '&t=' + Date.now();
}
function mensajeVista(e) {
  var f = document.getElementById('vista');
  if (!f || e.source !== f.contentWindow || e.origin !== WEB) return;
  if (e.data && e.data.tipo === 'borsoga-lista') {
    f.contentWindow.postMessage({ tipo: 'borsoga-esquema', schema: S.draft }, WEB);
  }
}

// ------------------------------------------------------------ diálogos
function modal(contenido) {
  var fondo = h('div', { class: 'fondo-modal', onclick: function (e) { if (e.target === fondo) cerrar(); } },
    h('div', { class: 'modal', role: 'dialog', 'aria-modal': 'true' }, contenido));
  function cerrar() { fondo.remove(); document.removeEventListener('keydown', esc); }
  function esc(e) { if (e.key === 'Escape') cerrar(); }
  document.addEventListener('keydown', esc);
  document.body.appendChild(fondo);
  return { cerrar: cerrar, caja: fondo.firstChild };
}

// Lo que cambió entre la versión publicada y el borrador, en palabras.
function diferencias(a, b) {
  var out = [];
  var ta = a.textos || {}, tb = b.textos || {};
  TEXTOS.forEach(function (t) { if (!igual(ta[t[0]], tb[t[0]])) out.push('Texto general: ' + t[1].toLowerCase()); });
  var pa = {}, pb = {};
  a.pasos.forEach(function (p, i) { pa[p.id] = { p: p, i: i }; });
  b.pasos.forEach(function (p, i) { pb[p.id] = { p: p, i: i }; });
  b.pasos.forEach(function (p, i) {
    if (!pa[p.id]) out.push('Paso nuevo: «' + p.titulo.es + '»');
    else if (!igual(pa[p.id].p.titulo, p.titulo)) out.push('Paso ' + (i + 1) + ': título cambiado');
  });
  a.pasos.forEach(function (p) { if (!pb[p.id]) out.push('Paso borrado: «' + p.titulo.es + '»'); });
  if (!igual(a.pasos.map(function (p) { return p.id; }).filter(function (id) { return pb[id]; }),
             b.pasos.map(function (p) { return p.id; }).filter(function (id) { return pa[id]; }))) out.push('Pasos reordenados');

  var qa = {}, qb = {};
  todas(a).forEach(function (x) { qa[x.q.f] = x; });
  todas(b).forEach(function (x) { qb[x.q.f] = x; });
  todas(b).forEach(function (x) {
    var q = x.q, v = qa[q.f];
    if (!v) return out.push('Pregunta nueva: «' + q.q.es + '»');
    var c = [];
    if (!igual(v.q.q, q.q)) c.push('texto');
    if (!igual(v.q.h, q.h)) c.push('ayuda');
    if (v.q.tipo !== q.tipo) c.push('tipo');
    if (!!v.q.req !== !!q.req) c.push(q.req ? 'ahora obligatoria' : 'ya no obligatoria');
    if (!igual(v.q.si, q.si)) c.push('cuándo se muestra');
    if (!igual(v.q.resumen, q.resumen)) c.push('resumen');
    if (!igual(v.q.ops, q.ops)) {
      var ea = (v.q.ops || []).map(function (o) { return o.es; }), eb = (q.ops || []).map(function (o) { return o.es; });
      var mas = eb.filter(function (o) { return ea.indexOf(o) < 0; }), menos = ea.filter(function (o) { return eb.indexOf(o) < 0; });
      if (mas.length) c.push('opciones nuevas: ' + mas.join(', '));
      if (menos.length) c.push('opciones quitadas: ' + menos.join(', '));
      if (!mas.length && !menos.length) c.push(igual(ea, eb) ? 'traducción de opciones' : 'orden de opciones');
    }
    if (!igual(v.q.ejes, q.ejes) || !igual(v.q.campos, q.campos) || !igual(v.q.ph, q.ph) || v.q.tope !== q.tope ||
        !!v.q.col !== !!q.col || v.q.solo !== q.solo) c.push('otros ajustes');
    if (v.paso !== x.paso) c.push('movida al paso ' + (x.paso + 1));
    if (c.length) out.push('«' + q.q.es + '»: ' + c.join('; '));
  });
  todas(a).forEach(function (x) { if (!qb[x.q.f]) out.push('Pregunta borrada: «' + x.q.q.es + '»'); });
  return out;
}

function dialogoPublicar() {
  var m = modal(h('p', { class: 'cargando' }, 'Comprobando el borrador…'));
  (S.timer ? guardarYa() : S.guardando || Promise.resolve()).then(function () {
    return api('comprobar', { method: 'POST', q: { servicio: S.servicio } });
  }).then(function (j) {
    var caja = m.caja;
    caja.innerHTML = '';
    var errores = j.errores || [];
    if (errores.length) {
      añadir(caja, [
        h('h2', null, 'Todavía no se puede publicar'),
        h('ul', { class: 'cambios-lista' }, errores.map(function (e) { return h('li', null, e); })),
        h('div', { class: 'pie' }, h('button', { type: 'button', class: 'boton', onclick: m.cerrar }, 'Entendido'))
      ]);
      return;
    }
    var difs = diferencias(S.publicada.schema, S.draft);
    var faltaEn = todas().filter(function (x) { return x.q.q.es && !x.q.q.en; }).length;
    var nota = h('textarea', { rows: 2, placeholder: 'Qué cambia y por qué (opcional, queda en el historial)' });
    var boton = h('button', { type: 'button', class: 'boton', onclick: function () {
      boton.disabled = true;
      boton.textContent = 'Publicando…';
      api('publicar', { method: 'POST', q: { servicio: S.servicio }, body: { rev: S.rev, nota: nota.value } }).then(function (r) {
        if (!r.ok) {
          boton.disabled = false; boton.textContent = 'Publicar';
          return aviso(r.error + (r.errores ? ': ' + r.errores.join(' · ') : ''), true);
        }
        publicado(m, r);
      }).catch(function (e) { boton.disabled = false; boton.textContent = 'Publicar'; aviso(e.message, true); });
    } }, 'Publicar');
    añadir(caja, [
      h('h2', null, 'Publicar la versión ' + (S.publicada.version + 1)),
      h('p', null, 'Estos cambios saldrán en la web en unos segundos:'),
      h('ul', { class: 'cambios-lista' }, difs.map(function (d) { return h('li', null, d); })),
      faltaEn ? h('p', { class: 'candado' }, faltaEn + (faltaEn === 1 ? ' pregunta no tiene' : ' preguntas no tienen') + ' texto en inglés: en la página inglesa saldrán en español.') : null,
      h('div', { class: 'campo', style: 'margin-top:16px' }, h('label', null, 'Nota'), nota),
      h('div', { class: 'pie' }, h('button', { type: 'button', class: 'boton claro', onclick: m.cerrar }, 'Cancelar'), boton)
    ]);
  }).catch(function (e) { m.cerrar(); aviso(e.message, true); });
}

function publicado(m, r) {
  m.caja.innerHTML = '';
  añadir(m.caja, [
    h('h2', null, 'Versión ' + r.version + ' publicada'),
    h('p', null, 'Ya está en la web: quien abra el cuestionario a partir de ahora ve esta versión.'),
    h('p', { class: 'nota' }, 'Quien lo tuviera abierto sigue con la anterior hasta que recargue; sus envíos se validan contra la versión que rellenó.'),
    h('div', { class: 'pie' },
      h('a', { class: 'boton claro', href: WEB + SERVICIOS[S.servicio].ruta.es, target: '_blank', rel: 'noopener' }, 'Abrir en la web'),
      h('button', { type: 'button', class: 'boton', onclick: m.cerrar }, 'Cerrar'))
  ]);
  abrir(S.servicio);
}

function dialogoHistorial() {
  var m = modal(h('p', { class: 'cargando' }, 'Cargando historial…'));
  api('versiones', { q: { servicio: S.servicio } }).then(function (j) {
    m.caja.innerHTML = '';
    añadir(m.caja, [
      h('h2', null, 'Historial de versiones'),
      h('p', { class: 'nota' }, 'Restaurar copia la versión al borrador. No se publica hasta que pulses Publicar.'),
      h('div', { class: 'versiones' }, (j.versiones || []).map(function (v) {
        var actual = v.version === S.publicada.version;
        return h('div', { class: 'version' },
          h('div', null, h('strong', null, 'Versión ' + v.version + (actual ? ' · publicada' : '')),
            h('small', null, fecha(v.published_at) + (v.published_by ? ' · ' + v.published_by : '')),
            v.note && h('small', null, v.note)),
          h('button', { type: 'button', class: 'boton claro mini', onclick: function () { restaurar(v.version, m); } },
            actual ? 'Volver a esta' : 'Restaurar'));
      })),
      h('div', { class: 'pie' }, h('button', { type: 'button', class: 'boton', onclick: m.cerrar }, 'Cerrar'))
    ]);
  }).catch(function (e) { m.cerrar(); aviso(e.message, true); });
}

function restaurar(v, m) {
  if (hayCambios() && !confirm('El borrador actual tiene cambios sin publicar que se perderán. ¿Seguir?')) return;
  (S.timer ? guardarYa() : Promise.resolve()).then(function () {
    return api('restaurar', { method: 'POST', q: { servicio: S.servicio, version: v }, body: { rev: S.rev } });
  }).then(function (j) {
    if (!j.ok) return aviso(j.error, true);
    if (m) m.cerrar();
    S.draft = j.draft;
    S.rev = j.rev;
    S.estado = 'Guardado';
    S.abierta = null;
    S.vistaVieja = true;
    pintar();
    comprobar();
    aviso('Versión ' + v + ' copiada al borrador.');
  }).catch(function (e) { aviso(e.message, true); });
}

function descartar() {
  if (!confirm('¿Descartar todos los cambios sin publicar y volver a la versión ' + S.publicada.version + '?')) return;
  clearTimeout(S.timer);
  S.timer = null;
  api('restaurar', { method: 'POST', q: { servicio: S.servicio, version: S.publicada.version }, body: { rev: S.rev } })
    .then(function (j) {
      if (!j.ok) return aviso(j.error, true);
      S.draft = j.draft; S.rev = j.rev; S.estado = 'Guardado'; S.abierta = null; S.vistaVieja = true;
      pintar(); comprobar();
    }).catch(function (e) { aviso(e.message, true); });
}

inicio();
})();
