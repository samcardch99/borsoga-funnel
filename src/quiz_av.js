/**
 * Configurador de Architectural Visualization — 6 pasos.
 *
 * Portado del artboard 'Cuestionario Architectural Visualization'. Es un
 * cuestionario distinto del de interiorismo, no una variante: otro público
 * (developers, arquitectos, fabricantes) y otra unidad de trabajo.
 *
 * Lo que lo hace difícil es que las escenas se anidan en tres niveles:
 *
 *     escena  →  si es "Interior", se despliega en espacios
 *                             →  si hay "Amenidad", se despliega en amenidades
 *
 * Y encima cada unidad final lleva su propio número de vistas, ajustable a
 * mano. El total de imágenes es la suma de (escenas × vistas) por unidad, no
 * una función del tamaño como en interiorismo.
 *
 * Los textos vienen de i18n/es.js. El inglés existe pero está a medias (254
 * claves siguen en español), así que el selector no se publica todavía.
 */
(function () {
'use strict';

// ---------------------------------------------------------------- constantes
var KEY = 'borsoga.cuestionario.av.v1';
var SUBMIT_KEY = 'borsoga.cuestionario.envios';
var MAX_SUBMITS = 2;
var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
var UNSURE_RE = /^(no s[eé]|no lo s[eé]|no lo s[eé] todav[ií]a|todav[ií]a no lo s[eé]|todav[ií]a no|todav[ií]a nada)$/i;

var TYPES = ['Residencial multifamiliar','Residencial unifamiliar','Comercial','Hospitalidad','Uso mixto','Producto o mobiliario'];
var STAGES = ['Concepto','Diseño desarrollado','En permisos','En construcción','Ya construido'];
var ROLES = ['Developer','Arquitecto o diseñador','Fabricante','Corredor o agencia','Otro'];
var SCENES = ['Fachada','Vista aérea','Exterior a nivel','Interior','Detalle o producto'];
var CONTEXT = ['Sí, el entorno real','Solo el edificio, sin contexto','No lo sé todavía'];
var INTERIOR = ['Sí, tengo el diseño definido','Parcialmente','No, habría que resolverlo'];
var INTERIOR_OPEN = ['Parcialmente','No, habría que resolverlo'];
var PIECE = ['Existe y tengo el modelo','Existe pero solo tengo planos o fotos','Es un diseño nuevo'];
var ROOMS_RES = ['Lobby o acceso','Cocina','Sala','Comedor','Dormitorio','Baño','Home office','Clóset o vestidor','Amenidad','Circulación o común'];
var ROOMS_COM = ['Recepción o lobby','Área de trabajo','Sala de juntas','Piso de venta','Restaurante o comedor','Barra','Baños','Circulación'];
var ROOMS_HOSP = ['Lobby','Habitación tipo','Suite','Restaurante','Bar','Spa o gimnasio','Salón de eventos','Piscina o deck'];
var AMENITIES = ['Gimnasio','Piscina o deck','Coworking','Salón social','Spa','Otra'];
var AMENITY_ROOM = 'Amenidad';
var TYPE_PRODUCT = 'Producto o mobiliario';
var TYPE_MIXED = 'Uso mixto';
var TYPE_COM = 'Comercial';
var TYPE_HOSP = 'Hospitalidad';
var MATERIALS = ['Modelo 3D listo','Planos en CAD','Planos en PDF','Solo bocetos o croquis','Todavía nada'];
var MAT_NONE = 'Todavía nada';
var SPEC = ['Sí, tengo la especificación','Tengo una idea general','Todavía no'];
var USES = ['Preventa y ventas','Presentación a inversionistas o banca','Concurso o licitación','Aprobación de diseño interno','Redes sociales y marketing','Catálogo de producto','Presentación oficial o permisos'];
var TONES = [['Neutro','avq_slot_t1'],['Atmosférico','avq_slot_t2'],['Editorial','avq_slot_t3']];
var EXTRAS = [['Borsoga Immersive','av_x1_d'],['Tour 360','av_x2_d'],['Vistas adicionales','av_x3_d'],['Escenas adicionales','av_x4_d']];
var CROSS = ['Identidad o nombre del desarrollo','Un sitio de preventa','Material para corredores','No, por ahora no'];
var CROSS_NONE = 'No, por ahora no';
var LAUNCH = ['No, sin fecha fija','Sí, pero es flexible','Sí, y es fija'];
var LAUNCH_FIXED = 'Sí, y es fija';
var PORTFOLIO = ['Sí, sin problema','Sí, pero solo después de su lanzamiento','No, está bajo confidencialidad'];
var PLANS = ['Essential','Premium','Borsoga Edition'];
var VIEWS = { 'Essential': 2, 'Premium': 4, 'Borsoga Edition': 4 };
var NO_PLAN_VIEWS = 2;
var MAX_VIEWS = 12;
var STEPS = [['Paso 01 de 06','Tu proyecto'],['Paso 02 de 06','avq_step2'],['Paso 03 de 06','avq_step3'],
             ['Paso 04 de 06','avq_step4'],['Paso 05 de 06','Extras'],['Paso 06 de 06','avq_step6']];
var DISPOSABLE = ['mailinator.com','tempmail.com','guerrillamail.com','10minutemail.com','yopmail.com','trashmail.com'];
var DOMAIN_TYPOS = {'gmial.com':'gmail.com','gmai.com':'gmail.com','gmail.co':'gmail.com','gmail.con':'gmail.com',
 'gmil.com':'gmail.com','gnail.com':'gmail.com','hotmial.com':'hotmail.com','hotmai.com':'hotmail.com',
 'hotmail.co':'hotmail.com','yahooo.com':'yahoo.com','yaho.com':'yahoo.com','yahoo.co':'yahoo.com',
 'outlok.com':'outlook.com','outlook.co':'outlook.com','icoud.com':'icloud.com'};

// ---------------------------------------------------------------- i18n
// El idioma lo fija la página al embeber su bundle (`bundle_i18n()`), así que
// esta misma copia del script sirve para /configurador-av/ y su gemela inglesa.
// La rama `opt` está indexada por la cadena española: el valor que viaja al
// servidor sigue siendo el español canónico y sólo cambia lo que se lee.
var LANG = window.BORSOGA_LANG || 'es';
function t(key, fallback) {
  var d = (window.BORSOGA_I18N || {})[LANG] || {};
  var v = (d.ui && d.ui[key]) || (d.msg && d.msg[key]) || (d.opt && d.opt[key]);
  return v || fallback || key;
}
function fill(s, vars) {
  return String(s).replace(/\{(\w+)\}/g, function (_, k) { return vars[k] != null ? vars[k] : ''; });
}

var emailDomain = function (e) { var p = String(e || '').split('@'); return p.length > 1 ? p[1].trim().toLowerCase() : ''; };
var suggestEmail = function (e) { var f = DOMAIN_TYPOS[emailDomain(e)]; return f ? String(e).split('@')[0] + '@' + f : ''; };
var isDisposable = function (e) { return DISPOSABLE.indexOf(emailDomain(e)) > -1; };
var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
  return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]; }); };
function TR(s) {
  if (LANG === 'es' || !s) return s;
  var d = (window.BORSOGA_I18N || {})[LANG] || {};
  return (d.opt && d.opt[s]) || s;
}
var lbl = function (s) { return esc(TR(s)); };   // sólo para texto que se ve

// ---------------------------------------------------------------- estado
function blank() {
  return {
    projectType:'', stage:'', role:'', email:'',
    scenes:[], counts:{},                 // escena → cuántas de ese tipo
    rooms:[], roomCounts:{},              // espacios interiores → cuántos
    amenities:[], amenityCounts:{},       // amenidades → cuántas
    viewCounts:{}, viewOpen:{},           // vistas por unidad (null = las del plan)
    context:'', interiorDesign:'', piece:'',
    material:'', link:'', spec:'', refs:'',
    uses:[], tone:'', extras:[], cross:[],
    name:'', company:'', phone:'', signer:'A título personal',
    entName:'', entState:'', entSigner:'', entRole:'',
    city:'', country:'', launch:'', launchDate:'',
    portfolio:'', privacy:false, bot:''
  };
}
var S = { step:1, done:false, a:blank(), touched:false, sending:false, notice:'', result:null, showErrors:false };
var FILES = [];
var MISSING = [];

var PICKED = (function () {
  var p = new URLSearchParams(location.search).get('plan') || '';
  return PLANS.indexOf(p) > -1 ? p : '';
})();

// ---------------------------------------------------------------- ramas
function branchOf(a) {
  var has = function (v) { return a.scenes.indexOf(v) > -1; };
  return {
    asksContext: has('Fachada') || has('Vista aérea'),
    asksRooms: has('Interior'),
    asksAmenities: has('Interior') && (a.rooms || []).indexOf(AMENITY_ROOM) > -1,
    asksInterior: has('Interior') && (a.rooms || []).length > 0,
    asksPiece: has('Detalle o producto'),
    hasMaterial: !!a.material && a.material !== MAT_NONE
  };
}
/** La lista de espacios interiores depende de la tipología del proyecto. */
function roomsOf(a) {
  if (a.projectType === TYPE_COM) return ROOMS_COM;
  if (a.projectType === TYPE_HOSP) return ROOMS_HOSP;
  return ROOMS_RES;
}
function prune(input) {
  var a = Object.assign({}, input);
  var b = branchOf(a);
  // Escenas: solo cuentan las elegidas.
  var c = {};
  a.scenes.forEach(function (s) { c[s] = Math.min(20, Math.max(1, (a.counts || {})[s] || 1)); });
  a.counts = c;
  // Espacios interiores: solo si hay escena Interior, y solo de su tipología.
  var permitidos = b.asksRooms ? roomsOf(a) : [];
  a.rooms = (a.rooms || []).filter(function (r) { return permitidos.indexOf(r) > -1; });
  var rc = {};
  a.rooms.forEach(function (r) { rc[r] = Math.min(20, Math.max(1, (a.roomCounts || {})[r] || 1)); });
  a.roomCounts = rc;
  // Amenidades: solo si se eligió el espacio "Amenidad".
  if (!b.asksAmenities) { a.amenities = []; a.amenityCounts = {}; }
  else {
    a.amenities = (a.amenities || []).filter(function (v) { return AMENITIES.indexOf(v) > -1; });
    var ac = {};
    a.amenities.forEach(function (v) { ac[v] = Math.min(20, Math.max(1, (a.amenityCounts || {})[v] || 1)); });
    a.amenityCounts = ac;
  }
  if (!b.asksContext) a.context = '';
  if (!b.asksInterior) a.interiorDesign = '';
  if (!b.asksPiece) a.piece = '';
  if (!b.hasMaterial) { FILES = []; a.link = ''; }
  if (a.launch !== LAUNCH_FIXED) a.launchDate = '';
  if (a.signer !== 'Como empresa') { a.entName = a.entState = a.entSigner = a.entRole = ''; }
  // Vistas huérfanas: si la unidad ya no existe, su contador tampoco.
  var claves = unitsOf(a).map(function (u) { return u.key; });
  var vc = {};
  Object.keys(a.viewCounts || {}).forEach(function (k) { if (claves.indexOf(k) > -1) vc[k] = a.viewCounts[k]; });
  a.viewCounts = vc;
  return a;
}

// ---------------------------------------------------------------- unidades
/**
 * Aplana los tres niveles en una lista de unidades cotizables.
 * Cada una lleva su clave estable (para el contador de vistas), su etiqueta y
 * cuántas escenas aporta.
 */
function unitsOf(a) {
  var out = [];
  a.scenes.forEach(function (s) {
    if (s !== 'Interior') {
      out.push({ key: 'e:' + s, label: s, scenes: (a.counts || {})[s] || 1 });
      return;
    }
    // Interior se despliega en sus espacios.
    (a.rooms || []).forEach(function (r) {
      if (r === AMENITY_ROOM) {
        // Y "Amenidad" se despliega a su vez en amenidades concretas.
        (a.amenities || []).forEach(function (v) {
          out.push({ key: 'a:' + v, label: v, scenes: (a.amenityCounts || {})[v] || 1 });
        });
        return;
      }
      out.push({ key: 'r:' + r, label: r, scenes: (a.roomCounts || {})[r] || 1 });
    });
  });
  return out;
}
function planViews() { var p = PICKED; return p ? (VIEWS[p] || NO_PLAN_VIEWS) : NO_PLAN_VIEWS; }
function viewsOf(key) {
  var v = (S.a.viewCounts || {})[key];
  return v == null ? planViews() : Math.min(MAX_VIEWS, Math.max(1, v));
}
function sceneTotal() { return unitsOf(S.a).reduce(function (n, u) { return n + u.scenes; }, 0); }
function imageTotal() { return unitsOf(S.a).reduce(function (n, u) { return n + u.scenes * viewsOf(u.key); }, 0); }
function sceneSummary() {
  return unitsOf(S.a).map(function (u) { return u.scenes + '× ' + u.label; }).join(' · ');
}

function unsureCount() {
  var vals = [];
  Object.keys(S.a).forEach(function (k) {
    var v = S.a[k];
    if (typeof v === 'string') vals.push(v);
    else if (Array.isArray(v)) v.forEach(function (x) { if (typeof x === 'string') vals.push(x); });
  });
  return vals.filter(function (v) { return UNSURE_RE.test(v.trim()); }).length;
}
function daysUntil(d) {
  if (!d) return null;
  var ms = new Date(d + 'T00:00:00').getTime() - Date.now();
  return isNaN(ms) ? null : Math.round(ms / 86400000);
}
function recommendPlan() {
  var a = S.a;
  if (a.tone === 'Editorial' || a.extras.length >= 2 || sceneTotal() > 6) return 'Borsoga Edition';
  if (a.tone === 'Atmosférico' || a.uses.indexOf('Preventa y ventas') > -1 ||
      a.uses.indexOf('Redes sociales y marketing') > -1) return 'Premium';
  return 'Essential';
}
function route() {
  var a = S.a, plan = PICKED || recommendPlan(), days = daysUntil(a.launchDate);
  if (plan === 'Borsoga Edition') return ['call','Vamos a hablar', t('route_edition','Borsoga Edition se cotiza en una llamada. Tenemos todo lo que nos contaste, así que la conversación empieza donde la dejaste.')];
  if (a.material === MAT_NONE) return ['call','Vamos a hablar', t('avq_route_nomat')];
  if (sceneTotal() > 6) return ['call','Vamos a hablar', fill(t('avq_route_scenes'), { n: sceneTotal() })];
  if (a.launch === LAUNCH_FIXED && days !== null && days < 28) return ['call','Vamos a hablar', t('avq_route_rush')];
  if (a.projectType === TYPE_MIXED) return ['call','Vamos a hablar', t('avq_route_mixed')];
  if (unsureCount() >= 4) return ['range','Te enviamos un rango', t('route_unsure','Quedaron varias cosas por definir, así que en vez de un número te mandamos un rango y lo cerramos contigo en una llamada.')];
  return ['mail','Recibimos tu proyecto', t('avq_mail_body')];
}

// ---------------------------------------------------------------- validación
function missing() {
  var a = S.a, b = branchOf(a), m = [];
  var need = function (cond, f) { if (cond) m.push(f); };
  switch (S.step) {
    case 1:
      need(!a.projectType, 'projectType');
      need(!!a.projectType && !a.stage, 'stage');
      need(!!a.stage && !a.role, 'role');
      need(!!a.role && !EMAIL_RE.test(a.email || ''), 'email');
      break;
    case 2:
      need(a.scenes.length === 0, 'scenes');
      need(b.asksContext && !a.context, 'context');
      need(b.asksRooms && a.rooms.length === 0, 'rooms');
      need(b.asksAmenities && a.amenities.length === 0, 'amenities');
      need(b.asksInterior && !a.interiorDesign, 'interiorDesign');
      need(b.asksPiece && !a.piece, 'piece');
      break;
    case 3:
      need(!a.material, 'material');
      need(b.hasMaterial && FILES.length === 0 && !String(a.link || '').trim(), 'files');
      need(!!a.material && !a.spec, 'spec');
      break;
    case 4:
      need(a.uses.length === 0, 'uses');
      need(!a.tone, 'tone');
      break;
    case 5: break;
    case 6:
      need(!a.name, 'name');
      need(!EMAIL_RE.test(a.email || ''), 'email');
      need(!a.phone, 'phone');
      if (a.signer === 'Como empresa') {
        need(!a.entName, 'entName'); need(!a.entState, 'entState');
        need(!a.entSigner, 'entSigner'); need(!a.entRole, 'entRole');
      }
      need(!a.city, 'city'); need(!a.country, 'country');
      need(!a.launch, 'launch');
      need(a.launch === LAUNCH_FIXED && !a.launchDate, 'launchDate');
      need(!a.portfolio, 'portfolio');
      need(!a.privacy, 'privacy');
      break;
  }
  return m;
}
function canContinue() { return missing().length === 0; }

// ---------------------------------------------------------------- persistencia
function persist() {
  try { localStorage.setItem(KEY, JSON.stringify({ step: S.step, a: S.a, at: Date.now() })); } catch (e) {}
}
function setA(patch) {
  S.a = prune(Object.assign({}, S.a, patch));
  S.touched = true; persist(); render();
}
function toggleIn(field, value, exclusivos) {
  var cur = S.a[field] || [], on = cur.indexOf(value) > -1, next;
  if ((exclusivos || []).indexOf(value) > -1) next = on ? [] : [value];
  else {
    var kept = cur.filter(function (v) { return (exclusivos || []).indexOf(v) < 0; });
    next = on ? kept.filter(function (v) { return v !== value; }) : kept.concat([value]);
  }
  var o = {}; o[field] = next; setA(o);
}

// ---------------------------------------------------------------- helpers UI
function group(title, hint, body, fields) {
  var f = fields ? (Array.isArray(fields) ? fields : [fields]) : [];
  var falta = S.showErrors && f.some(function (x) { return MISSING.indexOf(x) > -1; });
  return '<div class="q-group' + (falta ? ' q-invalid' : '') + '"' +
    (f.length ? ' data-fields="' + f.join(',') + '"' : '') + '>' +
    '<p class="q-q">' + lbl(title) + '</p>' +
    (hint ? '<p class="q-hint">' + TR(hint) + '</p>' : '') + body +
    (falta ? '<p class="q-falta">' + t('q_missing') + '</p>' : '') + '</div>';
}
function chips(field, values) {
  return '<div class="q-opts">' + values.map(function (v) {
    return '<button type="button" class="q-chip" data-set="' + esc(field) + '" data-val="' + esc(v) +
      '" aria-pressed="' + (S.a[field] === v) + '">' + lbl(v) + '</button>';
  }).join('') + '</div>';
}
function cards(field, values) {
  return '<div class="q-grid">' + values.map(function (v) {
    return '<button type="button" class="q-card" data-set="' + esc(field) + '" data-val="' + esc(v) +
      '" aria-pressed="' + (S.a[field] === v) + '"><span class="q-radio"></span><span>' + lbl(v) + '</span></button>';
  }).join('') + '</div>';
}
function checks(field, values, exclusivos, notas) {
  var cur = S.a[field] || [];
  return '<div class="q-grid">' + values.map(function (v) {
    var on = cur.indexOf(v) > -1;
    var nota = (notas || {})[v];
    return '<button type="button" class="q-card" data-check="' + esc(field) + '" data-val="' + esc(v) +
      '" data-excl="' + ((exclusivos || []).indexOf(v) > -1) + '" aria-pressed="' + on +
      '" style="align-items:flex-start"><span class="q-box"' + (nota ? ' style="margin-top:3px"' : '') + '></span>' +
      '<span><span style="display:block">' + lbl(v) + '</span>' +
      (nota ? '<span style="display:block;font-size:14px;line-height:1.5;opacity:.72;margin-top:4px">' + lbl(nota) + '</span>' : '') +
      '</span></button>';
  }).join('') + '</div>';
}
/** Lista con stepper de cantidad. `field` guarda la selección, `countField` las cantidades. */
function counted(field, countField, values) {
  var cur = S.a[field] || [], counts = S.a[countField] || {};
  return '<div class="q-grid">' + values.map(function (v) {
    var on = cur.indexOf(v) > -1, n = counts[v] || 1;
    return '<div class="q-space" data-count-toggle="' + esc(field) + '|' + esc(countField) + '" data-val="' + esc(v) +
      '" aria-pressed="' + on + '">' +
      '<span style="display:flex;align-items:center;gap:12px"><span class="q-radio"></span><span>' + lbl(v) + '</span></span>' +
      (on ? '<span style="display:flex;align-items:center;gap:10px" data-stop="1">' +
        '<button type="button" class="q-step" data-n="' + esc(countField) + '|' + esc(v) + '" data-d="-1"' + (n <= 1 ? ' disabled' : '') + '>−</button>' +
        '<span style="font-size:15px;min-width:14px;text-align:center">' + n + '</span>' +
        '<button type="button" class="q-step" data-n="' + esc(countField) + '|' + esc(v) + '" data-d="1"' + (n >= 20 ? ' disabled' : '') + '>+</button></span>' : '') +
      '</div>';
  }).join('') + '</div>';
}
function field(name, ph, type) {
  return '<input class="q-in" type="' + (type || 'text') + '" data-field="' + name + '" placeholder="' +
    lbl(ph) + '" value="' + esc(S.a[name]) + '"' +
    (type === 'email' ? ' autocomplete="email" inputmode="email" spellcheck="false"' : '') + '>';
}

// ---------------------------------------------------------------- pasos
function step1() {
  var a = S.a, h = '';
  h += group(t('avq_s1_type'), '', cards('projectType', TYPES), 'projectType');
  if (a.projectType) h += group(t('avq_s1_stage'), '', chips('stage', STAGES), 'stage');
  if (a.stage) h += group(t('avq_s1_role'), '', chips('role', ROLES), 'role');
  if (a.role) {
    var sug = suggestEmail(a.email);
    h += group('¿A dónde te guardamos el avance?',
      'Lo guardamos en este navegador para que puedas volver donde quedaste. Te lo pedimos también para poder contactarte.',
      '<div style="max-width:420px">' + field('email', 'tu@correo.com', 'email') +
      (a.email && !EMAIL_RE.test(a.email) ? '<p class="q-err">' + esc(t('srv_email_bad', 'Escríbelo completo, con arroba y dominio: nombre@correo.com')) + '</p>' : '') +
      (sug ? '<p class="q-err">¿Quisiste decir <strong>' + esc(sug) + '</strong>? <button type="button" class="q-back" data-fix-email="1" style="margin-left:8px">Sí, corregir</button></p>' : '') +
      '</div>', 'email');
  }
  return h;
}

function step2() {
  var a = S.a, b = branchOf(a), h = '';
  h += group(t('avq_s2_q'), t('q_scene_def') + ' ' + t('avq_s2_def2', 'Una vista es una cámara dentro de esa escena.'),
    counted('scenes', 'counts', SCENES), 'scenes');
  if (b.asksContext) h += group(t('avq_s2_context'), '', chips('context', CONTEXT), 'context');
  if (b.asksRooms) h += group(t('avq_s2_rooms_q'), '', counted('rooms', 'roomCounts', roomsOf(a)), 'rooms');
  if (b.asksAmenities) h += group(t('avq_s2_amen'), '', counted('amenities', 'amenityCounts', AMENITIES), 'amenities');
  if (b.asksInterior) h += group(t('avq_s2_interior_q'), '', chips('interiorDesign', INTERIOR) +
    (INTERIOR_OPEN.indexOf(a.interiorDesign) > -1
      ? '<div class="q-note">' + esc(t('avq_s2_int_notice', 'Resolver el interior es trabajo de diseño, no de visualización. Podemos hacerlo nosotros y se cotiza aparte, o trabajamos con el diseño que nos entregues.')) + '</div>' : ''),
    'interiorDesign');
  if (b.asksPiece) h += group(t('avq_s2_piece_q'), '', chips('piece', PIECE), 'piece');

  // Panel de vistas: solo tiene sentido cuando ya hay unidades.
  var units = unitsOf(a);
  if (units.length) {
    h += '<div class="q-group"><p class="q-q">' + lbl('Vistas por escena') + '</p>' +
      '<p class="q-hint">' + esc(fill(t('q_views_hint'), { n: planViews(),
        plan: PICKED ? fill(t('q_views_plan'), { plan: PICKED }) : '' })) + '</p>' +
      '<div class="q-grid">' + units.map(function (u) {
        var v = viewsOf(u.key);
        return '<div class="q-space" style="cursor:default">' +
          '<span><span style="display:block">' + esc(u.label) + '</span>' +
          '<span style="display:block;font-size:13px;color:rgba(0,0,0,.5);margin-top:2px">' + u.scenes + ' escena' + (u.scenes > 1 ? 's' : '') + '</span></span>' +
          '<span style="display:flex;align-items:center;gap:10px">' +
          '<button type="button" class="q-step" data-v="' + esc(u.key) + '" data-d="-1"' + (v <= 1 ? ' disabled' : '') + '>−</button>' +
          '<span style="font-size:15px;min-width:26px;text-align:center">' + v + '</span>' +
          '<button type="button" class="q-step" data-v="' + esc(u.key) + '" data-d="1"' + (v >= MAX_VIEWS ? ' disabled' : '') + '>+</button></span></div>';
      }).join('') + '</div>' +
      '<div class="q-note" style="display:flex;align-items:baseline;gap:12px">' +
      '<strong style="font-size:26px;font-weight:600">' + imageTotal() + '</strong>' +
      '<span>' + esc(fill(t('q_images_total'), { n: sceneTotal() })) + '</span></div></div>';
  }
  return h;
}

function step3() {
  var a = S.a, b = branchOf(a), h = '';
  h += group(t('avq_s3_q'), '', cards('material', MATERIALS), 'material');
  if (a.material === MAT_NONE) {
    h += '<div class="q-note warn">' + esc(t('avq_s3_none')) + '</div>';
  } else if (b.hasMaterial) {
    var titulo = a.material === 'Modelo 3D listo' ? t('avq_s3_model_t', 'Súbenos el modelo o pega el enlace de descarga')
      : a.material === 'Solo bocetos o croquis' ? t('avq_s3_sketch_t', 'Súbenos lo que tengas')
      : t('avq_s3_cad_t', 'Súbenos plantas, alzados y secciones');
    h += group(titulo, 'Los modelos 3D suelen ser grandes: si no cabe, pega un enlace de descarga.',
      '<label class="q-drop' + (FILES.length ? ' has' : '') + '">' +
      '<input type="file" multiple data-files="1">' +
      '<span style="flex:1"><span style="display:block;font-size:16px;font-weight:500">' + lbl('Elegir archivos') + '</span>' +
      '<span style="display:block;font-size:14px;color:rgba(0,0,0,.55);margin-top:4px">' + lbl('Modelos, planos, PDF o imágenes.') + '</span></span>' +
      '<span style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:rgba(0,0,0,.5)">' +
      (FILES.length ? FILES.length + ' ' + t(FILES.length === 1 ? 'q_files_1' : 'q_files_n') : lbl('Elegir')) + '</span></label>' +
      FILES.map(function (f, i) {
        return '<span class="q-file"><span>' + esc(f.name) + '</span>' +
          '<button type="button" class="q-back" data-rmfile="' + i + '" style="font-size:10px">Quitar</button></span>';
      }).join('') +
      '<div style="margin-top:14px">' + field('link', t('avq_s3_link_ph')) +
      (String(a.link || '').trim() ? '<p class="q-hint" style="margin-top:8px">' + esc(t('avq_link_added', 'Enlace añadido')) + '</p>' : '') +
      '</div>', 'files');
  }
  if (a.material) h += group(t('avq_s3_spec'), '', chips('spec', SPEC), 'spec');
  return h;
}

function step4() {
  var a = S.a, h = '';
  h += group(t('avq_s4_use'), t('avq_s4_use_h', 'Define resolución, formato y qué piezas entregamos. Marca todo lo que aplique.'),
    checks('uses', USES), 'uses');
  h += group(t('avq_s4_tone'), t('avq_s4_tone_h', 'Tres proyectos nuestros. Señala el que se parece a lo que buscas.'),
    '<div class="q-grid">' + TONES.map(function (o) {
      return '<button type="button" class="q-lvl" data-set="tone" data-val="' + esc(o[0]) + '" aria-pressed="' + (a.tone === o[0]) + '">' +
        '<span class="q-slot">' + esc(t(o[1], 'Proyecto real · ' + o[0].toLowerCase())) + '</span>' +
        '<span style="padding:16px 18px"><span style="display:block;font-size:19px;font-weight:600">' + lbl(o[0]) + '</span></span></button>';
    }).join('') + '</div>', 'tone');
  return h;
}

function step5() {
  var a = S.a, h = '';
  h += group('Extras', 'Se cotizan aparte. Lo que no marques aquí queda fuera del proyecto.',
    checks('extras', EXTRAS.map(function (e) { return e[0]; }), [],
      EXTRAS.reduce(function (o, e) { o[e[0]] = t(e[1], ''); return o; }, {})));
  h += group(t('avq_s5_cross', '¿Vas a necesitar algo más alrededor del proyecto?'), '',
    checks('cross', CROSS, [CROSS_NONE]));
  return h;
}

function step6() {
  var a = S.a, h = '';
  h += group('Tus datos', '', '<div class="q-fields">' + field('name', 'Nombre completo') +
    field('email', 'Correo', 'email') + field('phone', 'Teléfono', 'tel') +
    field('company', t('avq_s6_company', 'Empresa')) + '</div>', ['name', 'email', 'phone']);
  h += group('¿Firmas a título personal o como empresa?', '', chips('signer', ['A título personal', 'Como empresa']) +
    (a.signer === 'Como empresa' ? '<div class="q-fields" style="margin-top:12px">' + field('entName', 'Nombre legal de la empresa') +
      field('entState', 'Estado o país de registro') + field('entSigner', 'Quién firma') + field('entRole', 'Su cargo') + '</div>' : ''),
    ['entName', 'entState', 'entSigner', 'entRole']);
  h += group(t('avq_s6_loc', 'Ubicación del proyecto'), t('avq_s6_loc_h', 'Ciudad y país. Nos sirve para husos horarios y contexto, no para cobertura.'),
    '<div class="q-fields">' + field('city', 'Ciudad') + field('country', t('avq_country', 'País')) + '</div>', ['city', 'country']);
  h += group(t('avq_s6_launch'), '', chips('launch', LAUNCH) +
    (a.launch === LAUNCH_FIXED ? '<div style="margin-top:12px;max-width:260px">' + field('launchDate', '', 'date') +
      (daysUntil(a.launchDate) !== null && daysUntil(a.launchDate) < 28
        ? '<p class="q-err">Menos de cuatro semanas: lo confirmamos en una llamada.</p>' : '') + '</div>' : ''),
    ['launch', 'launchDate']);
  h += group(t('avq_s6_portfolio'), '', chips('portfolio', PORTFOLIO), 'portfolio');
  h += '<div class="q-group' + (S.showErrors && MISSING.indexOf('privacy') > -1 ? ' q-invalid' : '') + '" data-fields="privacy">' +
    '<button type="button" class="q-card" data-privacy="1" aria-pressed="' + a.privacy + '">' +
    '<span class="q-box"></span><span>He leído y acepto la <a href="/politica-de-privacidad/" target="_blank" style="border-bottom:1px solid">política de privacidad</a></span></button>' +
    '<input type="text" data-field="bot" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px" value="' + esc(a.bot) + '">' +
    (S.notice ? '<p class="q-err">' + esc(S.notice) + '</p>' : '') +
    (S.showErrors && MISSING.indexOf('privacy') > -1 ? '<p class="q-falta">Falta responder esto</p>' : '') +
    '<p class="q-hint" style="margin-top:16px">Esto no es un contrato ni una cotización. Es la información con la que preparamos tu propuesta.</p></div>';
  return h;
}

function summary() {
  var a = S.a, b = branchOf(a), r = [];
  var add = function (l, v) { if (v) r.push([l, v]); };
  add('Plan', PICKED || ('Recomendado · ' + recommendPlan()));
  add('Tipo de proyecto', a.projectType);
  add('Etapa', a.stage);
  add(t('avq_sum_role', 'Quién escribe'), a.role);
  add('Escenas', sceneSummary());
  add(t('avq_sum_images', 'Imágenes estimadas'), imageTotal());
  if (b.asksContext) add('Contexto urbano', a.context);
  if (b.asksInterior) add(t('avq_sum_interior', 'Diseño interior'), a.interiorDesign);
  if (INTERIOR_OPEN.indexOf(a.interiorDesign) > -1)
    add('Marcado', t('avq_flag_interior', 'Oportunidad de interior design: el interior no está resuelto.'));
  if (b.asksPiece) add('La pieza', a.piece);
  add('Material', a.material + (FILES.length ? ' · ' + FILES.length + ' archivo(s)' : '') + (a.link ? ' · enlace' : ''));
  add('Especificación', a.spec);
  add(t('avq_sum_use', 'Uso de las imágenes'), a.uses.join(', '));
  add('Tono', a.tone);
  add('Extras', a.extras.length ? a.extras.join(', ') : 'Ninguno');
  add('Alrededor del proyecto', a.cross.filter(function (v) { return v !== CROSS_NONE; }).join(', '));
  add(t('avq_sum_location', 'Ubicación'), [a.city, a.country].filter(Boolean).join(', '));
  add('Lanzamiento', a.launch === LAUNCH_FIXED ? a.launchDate : a.launch);
  add('Portafolio', a.portfolio);
  if (unsureCount() >= 4) add('Marcado', 'Varias respuestas sin definir. Va a rango y a llamada.');
  return r;
}

function doneScreen() {
  var rt = S.result || route();
  var plan = PICKED || recommendPlan();
  var h = '<div style="max-width:62ch">' +
    '<p style="font-size:11px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:rgba(0,0,0,.45);margin:0 0 18px">Listo</p>' +
    '<h1 style="margin:0;font-size:clamp(32px,5vw,54px);font-weight:600;letter-spacing:-.03em;line-height:1.02">' + esc(rt[1]) + '</h1>';
  if (rt[0] === 'mail') h += '<p style="display:flex;align-items:baseline;gap:14px;margin:26px 0 0">' +
    '<strong style="font-size:34px;font-weight:600;letter-spacing:-.03em">48</strong>' +
    '<span style="font-size:16px;color:rgba(0,0,0,.7)">Te escribimos en persona en menos de 48 horas</span></p>';
  h += '<p style="margin:22px 0 0;font-size:17px;line-height:1.6;color:rgba(0,0,0,.72)">' + esc(rt[2]) + '</p>' +
    '<div class="q-note" style="margin-top:26px"><strong style="display:block;margin-bottom:6px">Tu plan</strong>' +
    (PICKED ? 'Elegiste <strong>' + esc(PICKED) + '</strong>. Preparamos el estimado con esa base.'
            : 'Por lo que nos contaste, el plan que te sirve es <strong>' + esc(plan) + '</strong>.') + '</div></div>' +
    '<dl class="q-sum">' + summary().map(function (p) {
      return '<div><dt>' + esc(p[0]) + '</dt><dd>' + esc(p[1]) + '</dd></div>';
    }).join('') + '</dl>';
  return h;
}

// ---------------------------------------------------------------- render
function render() {
  var main = document.getElementById('q-main');
  var nav = document.getElementById('q-nav');
  document.getElementById('q-seg').innerHTML = [1,2,3,4,5,6].map(function (i) {
    return '<i class="' + (S.done || i <= S.step ? 'on' : '') + '"></i>';
  }).join('');

  var plan = PICKED || recommendPlan();
  var idx = plan === 'Essential' ? 1 : plan === 'Premium' ? 2 : 3;
  document.getElementById('q-plan').textContent =
    PICKED ? 'Plan 0' + idx + ' · ' + PICKED : (S.touched ? t('q_plan_sug') + ' · ' + plan : t('q_plan_none'));
  document.getElementById('q-ring').style.cssText =
    'width:15px;height:15px;border:1.5px ' + (S.touched || PICKED ? 'solid' : 'dashed') + ' ' +
    (S.touched || PICKED ? '#000' : 'rgba(0,0,0,.45)') + ';border-radius:50%;flex:none;display:block' +
    ((S.touched || PICKED) && idx > 1 ? ';box-shadow:inset 0 0 0 1.5px #fff, inset 0 0 0 3px #000' : '') +
    ((S.touched || PICKED) && idx > 2 ? ', inset 0 0 0 4.5px #fff, inset 0 0 0 6px #000' : '');
  document.getElementById('q-saved').textContent = S.touched && !S.done ? 'Guardado' : '';

  if (S.done) { nav.hidden = true; main.innerHTML = doneScreen(); window.scrollTo(0, 0); return; }
  nav.hidden = false;
  MISSING = missing();
  var fn = [step1, step2, step3, step4, step5, step6][S.step - 1];
  main.innerHTML = '<div style="margin-bottom:clamp(28px,4vw,44px)">' +
    '<p style="font-size:11px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:rgba(0,0,0,.45);margin:0 0 12px">' + STEPS[S.step-1][0] + '</p>' +
    '<h1 style="margin:0;font-size:clamp(28px,4.4vw,44px);font-weight:600;letter-spacing:-.03em;line-height:1.05">' +
    esc(t(STEPS[S.step-1][1], STEPS[S.step-1][1])) + '</h1></div>' + fn();

  document.getElementById('q-back').disabled = S.step === 1;
  document.getElementById('q-count').textContent = 'Paso ' + S.step + ' de 6';
  var next = document.getElementById('q-next');
  next.disabled = S.sending;
  next.textContent = S.sending ? (S.notice || 'Enviando…') : (S.step === 6 ? 'Enviar mi proyecto' : 'Continuar');
  var aviso = document.getElementById('q-aviso');
  if (S.showErrors && MISSING.length) {
    aviso.textContent = MISSING.length === 1 ? 'Falta 1 respuesta' : 'Faltan ' + MISSING.length + ' respuestas';
    aviso.hidden = false;
  } else aviso.hidden = true;
}
function go(n) { S.step = n; S.notice = ''; S.showErrors = false; persist(); render(); window.scrollTo(0, 0); }

// ---------------------------------------------------------------- eventos
document.addEventListener('click', function (e) {
  var t2 = e.target.closest('[data-set],[data-check],[data-count-toggle],[data-n],[data-v],[data-privacy],[data-fix-email],[data-rmfile]');
  if (!t2) return;
  var d = t2.dataset;
  if (d.n !== undefined) {                      // stepper de cantidad
    e.stopPropagation();
    var p = d.n.split('|'), campo = p[0], val = p[1];
    var o = {}; o[campo] = Object.assign({}, S.a[campo]);
    o[campo][val] = Math.min(20, Math.max(1, (o[campo][val] || 1) + parseInt(d.d, 10)));
    return setA(o);
  }
  if (d.v !== undefined) {                      // stepper de vistas
    e.stopPropagation();
    var vc = Object.assign({}, S.a.viewCounts);
    vc[d.v] = Math.min(MAX_VIEWS, Math.max(1, viewsOf(d.v) + parseInt(d.d, 10)));
    return setA({ viewCounts: vc });
  }
  if (d.countToggle !== undefined) {            // elegir/quitar una unidad
    var q = d.countToggle.split('|'), lista = q[0], cnt = q[1], v = d.val;
    var cur = S.a[lista] || [], on = cur.indexOf(v) > -1;
    var counts = Object.assign({}, S.a[cnt]);
    if (on) delete counts[v]; else counts[v] = counts[v] || 1;
    var patch = {};
    patch[lista] = on ? cur.filter(function (x) { return x !== v; }) : cur.concat([v]);
    patch[cnt] = counts;
    return setA(patch);
  }
  if (d.set !== undefined) { var o2 = {}; o2[d.set] = d.val; return setA(o2); }
  if (d.check !== undefined) return toggleIn(d.check, d.val, d.excl === 'true' ? [d.val] : (d.check === 'cross' ? [CROSS_NONE] : []));
  if (d.privacy !== undefined) return setA({ privacy: !S.a.privacy });
  if (d.fixEmail !== undefined) return setA({ email: suggestEmail(S.a.email) });
  if (d.rmfile !== undefined) { FILES.splice(parseInt(d.rmfile, 10), 1); return render(); }
});
document.addEventListener('change', function (e) {
  if (e.target.dataset && e.target.dataset.files !== undefined) {
    FILES = FILES.concat(Array.prototype.slice.call(e.target.files || []));
    S.touched = true; render();
  }
});
document.addEventListener('input', function (e) {
  var f = e.target.dataset && e.target.dataset.field;
  if (!f) return;
  S.a[f] = e.target.value; S.touched = true; persist();
  if (S.showErrors) {
    MISSING = missing();
    var av = document.getElementById('q-aviso');
    if (av) {
      av.hidden = MISSING.length === 0;
      av.textContent = MISSING.length === 1 ? 'Falta 1 respuesta' : 'Faltan ' + MISSING.length + ' respuestas';
    }
  }
});
document.addEventListener('blur', function (e) {
  if (e.target.dataset && e.target.dataset.field) { S.a = prune(S.a); render(); }
}, true);

document.getElementById('q-back').addEventListener('click', function () { if (S.step > 1) go(S.step - 1); });
document.getElementById('q-next').addEventListener('click', function () {
  if (S.sending) return;
  if (!canContinue()) {
    S.showErrors = true; render();
    var el = document.querySelector('.q-invalid');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      var foco = el.querySelector('input, button');
      if (foco) setTimeout(function () { foco.focus({ preventScroll: true }); }, 350);
    }
    return;
  }
  S.showErrors = false;
  if (S.step < 6) return go(S.step + 1);
  submit();
});
document.getElementById('q-save').addEventListener('click', function () {
  persist();
  alert('Tus respuestas quedan guardadas en este navegador. Vuelve cuando quieras desde el mismo dispositivo.');
});

// ---------------------------------------------------------------- envío
var uploaderPromise = null;
function loadUploader() {
  if (!FILES.length) return Promise.resolve();
  if (window.borsogaUpload) return Promise.resolve();
  if (uploaderPromise) return uploaderPromise;
  uploaderPromise = new Promise(function (res, rej) {
    var s = document.createElement('script');
    s.src = '/assets/upload.js';
    s.onload = function () { window.borsogaUpload ? res() : rej(new Error('el subidor no cargó')); };
    s.onerror = function () { rej(new Error('no se pudo cargar el subidor')); };
    document.head.appendChild(s);
  });
  return uploaderPromise;
}
function submit() {
  var a = S.a;
  if (a.bot) { S.notice = 'No pudimos enviar tu proyecto desde este correo. Escríbenos y lo resolvemos contigo.'; return render(); }
  if (isDisposable(a.email)) { S.notice = 'Necesitamos un correo donde podamos enviarte la propuesta.'; return render(); }
  var sent = {};
  try { sent = JSON.parse(localStorage.getItem(SUBMIT_KEY) || '{}'); } catch (e) {}
  var k = 'av:' + String(a.email).trim().toLowerCase();
  if ((sent[k] || 0) >= MAX_SUBMITS) { S.notice = 'Ya recibimos tu proyecto. Si necesitas cambiar algo, escríbenos.'; return render(); }

  S.sending = true; S.notice = ''; render();
  var lote = Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36);
  var subidos = [];

  loadUploader()
    .then(function () {
      var hechos = 0;
      return FILES.reduce(function (chain, f) {
        return chain.then(function () {
          var safe = f.name.replace(/[^\w.\-]+/g, '_').slice(-80);
          return window.borsogaUpload(f, 'leads/' + lote + '/planFiles/' + safe, function (pct) {
            S.notice = 'Subiendo ' + (hechos + 1) + ' de ' + FILES.length + ' · ' + pct + '%';
            var n = document.getElementById('q-next');
            if (n) n.textContent = S.notice;
          }).then(function (b) {
            hechos++;
            subidos.push({ kind: 'planFiles', name: f.name, url: b.url, size: f.size });
          });
        });
      }, Promise.resolve());
    })
    .then(function () {
      return fetch('/api/submit/', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          service: 'av',
          answers: a,
          derived: {
            sceneTotal: sceneTotal(), imageTotal: imageTotal(), sceneSummary: sceneSummary(),
            picked: PICKED, recommend: recommendPlan(), route: route()[0],
            unsure: unsureCount(), daysToLaunch: daysUntil(a.launchDate)
          },
          files: subidos
        })
      });
    })
    .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
    .then(function (jr) {
      S.sending = false; S.notice = '';
      if (!jr || !jr.ok) { S.notice = (jr && jr.error) || 'No pudimos enviarlo. Inténtalo otra vez o escríbenos.'; return render(); }
      sent[k] = (sent[k] || 0) + 1;
      try { localStorage.setItem(SUBMIT_KEY, JSON.stringify(sent)); localStorage.removeItem(KEY); } catch (e) {}
      S.result = jr.route || route();
      S.done = true; render();
    })
    .catch(function (err) {
      S.sending = false;
      S.notice = (err && err.message) ? 'No pudimos subir tus archivos: ' + err.message
                                      : 'No pudimos enviarlo. Revisa tu conexión e inténtalo otra vez.';
      render();
    });
}

// ---------------------------------------------------------------- arranque
try {
  var saved = JSON.parse(localStorage.getItem(KEY) || 'null');
  if (saved && saved.a && saved.step > 1) {
    if (confirm(fill(t('q_resume'), { n: '0' + saved.step }))) {
      S.a = prune(Object.assign(blank(), saved.a));
      S.step = Math.min(6, Math.max(1, saved.step));
      S.touched = true;
    } else localStorage.removeItem(KEY);
  }
} catch (e) {}
render();
})();
