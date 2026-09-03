(function () {
'use strict';

// ---------------------------------------------------------------- constantes
// Copiadas del artboard sin traducir, para poder compararlas línea a línea.
var KEY = 'borsoga.cuestionario.interior.v4';
var SUBMIT_KEY = 'borsoga.cuestionario.envios';
var MAX_SUBMITS = 2;
var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
var PURPOSE_LIVE = 'Para vivir yo';
var PURPOSE_INVEST = 'Para vender o rentar';
var PURPOSE_COM = 'Es un espacio comercial';
var RES = ['Cocina','Baño','Dormitorio','Sala','Comedor','Home office','Clóset','Lavandería','Entrada'];
var HOUSE_EXTRA = ['Patio o jardín','Garaje','Área de piscina'];
var CONDO_EXTRA = ['Balcón o terraza'];
var COM = ['Recepción o lobby','Área de trabajo','Sala de juntas','Área de clientes','Comedor o cocina de staff','Baños','Salón o comedor','Barra','Vitrina y fachada interior'];
var WET = ['Cocina','Baño','Lavandería','Baños','Comedor o cocina de staff','Barra'];
var KITCHENS = ['Cocina','Lavandería','Comedor o cocina de staff'];
var OUTDOOR = ['Patio o jardín','Balcón o terraza'];
var STRUCT_WALLS = 'Se mueven o se quitan paredes';
var STRUCT_FACADE = 'Cambios en la fachada del edificio o la casa';
var STRUCT_NONE = 'Ninguno de los dos';
var STRUCT_UNSURE = 'No lo sé todavía';
var STRUCT = [STRUCT_WALLS, STRUCT_FACADE, STRUCT_NONE, STRUCT_UNSURE];
var MW_NONE = 'En ninguno, compramos todo hecho';
var MW_UNSURE = 'Todavía no lo sé';
var APPL_DECIDED = 'Sí, ya sé cuáles van';
var APPL_HELP = 'Quiero que ustedes me ayuden a elegirlos';
var BUDGETS = ['Menos de $25,000','$25,000 a $75,000','$75,000 a $150,000','$150,000 a $400,000','Más de $400,000','Todavía no lo tengo definido'];
var CLARITY = ['Ya tengo referencias y decisiones tomadas','Tengo una idea general','Cuento con ustedes para definirlo'];
var OWNER_REP = 'No, soy el representante autorizado';
var DEADLINE_FIXED = 'Sí, y es fija';
var PORTFOLIO = ['Sí, sin problema','Sí, pero sin decir dónde está','Prefiero que no'];
var DECIDERS = ['Yo solo','Mi pareja y yo','Un grupo o un comité'];
var UNSURE_RE = /^(no s[eé]|no lo s[eé]|no lo s[eé] todav[ií]a|todav[ií]a no lo s[eé])$/i;
var LAUNDRY = ['Lavandería'];
var BAR = ['Barra'];
var LAUNDRY_LAYOUT = ['Apiladas','Lado a lado','No lo sé'];
var KEEP_YES = 'Sí, en algunos espacios';
var KEEP = [KEEP_YES,'No, empezamos de cero','Todavía no lo sé'];
var PIECES_DECIDED = 'Sí, tengo piezas decididas';
var PIECES_REFS = 'Tengo referencias, pero nada decidido';
var PIECES_PROPOSE = 'Quiero que ustedes las propongan';
var PIECES = [PIECES_DECIDED, PIECES_REFS, 'No, todavía no', PIECES_PROPOSE];
var PRO_REFERRAL = 'Me gustaría que me recomienden uno';
var TIMING_EXPLORING = 'Estoy explorando';
var SHOWCASE_NONE = 'No, por ahora no';
var SHOWCASE_SELL = ['Imágenes para el listing','Tour 360 para tus compradores','Brochure o material impreso','Una página del proyecto'];
var SHOWCASE_COM  = ['Imágenes para redes y publicidad','Tour 360 del local','Identidad o rótulos del negocio','Una página del negocio'];
var SHOWCASE_LIVE = ['Fotos profesionales del terminado','Video del proyecto'];
// Miami-Dade define la cobertura real: fuera del condado el proyecto va a
// llamada aunque siga estando en Florida.
var MIAMI_DADE = ['miami','miami beach','miami gardens','miami lakes','miami shores','miami springs',
 'north miami','north miami beach','south miami','west miami','coral gables','hialeah','hialeah gardens',
 'doral','aventura','key biscayne','homestead','florida city','kendall','pinecrest','palmetto bay',
 'cutler bay','sunny isles beach','bal harbour','bay harbor islands','surfside','coconut grove','brickell',
 'opa-locka','opa locka','sweetwater','virginia gardens','medley','golden beach','indian creek','el portal',
 'biscayne park','north bay village'];
var plainCity = function (s) {
  return String(s || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};
var isMiamiDade = function (c) { return MIAMI_DADE.indexOf(plainCity(c)) > -1; };
var IMGS = [3, 5, 8];
var SIZE_OPTIONS = [
  ['Compacto','Espacios chicos, sin grandes cambios de distribución'],
  ['Estándar','El tamaño típico de un apartamento o una casa'],
  ['Amplio','Espacios grandes, áreas abiertas o dobles alturas']
];
var STEPS = [
  ['Paso 01 de 06','Tu proyecto'],
  ['Paso 02 de 06','Tus espacios y su tamaño'],
  ['Paso 03 de 06','Tu espacio en detalle'],
  ['Paso 04 de 06','Nivel de acabado'],
  ['Paso 05 de 06','Extras'],
  ['Paso 06 de 06','Tus datos']
];
var PLURAL = {
  'Cocina':'cocinas','Baño':'baños','Dormitorio':'dormitorios','Sala':'salas','Comedor':'comedores',
  'Home office':'home offices','Clóset':'clósets','Lavandería':'lavanderías','Entrada':'entradas',
  'Patio o jardín':'patios o jardines','Garaje':'garajes','Área de piscina':'áreas de piscina',
  'Balcón o terraza':'balcones o terrazas','Recepción o lobby':'recepciones o lobbies',
  'Área de trabajo':'áreas de trabajo','Sala de juntas':'salas de juntas','Área de clientes':'áreas de clientes',
  'Comedor o cocina de staff':'comedores o cocinas de staff','Baños':'baños',
  'Salón o comedor':'salones o comedores','Barra':'barras','Vitrina y fachada interior':'vitrinas y fachadas interiores'
};
var DOMAIN_TYPOS = {
  'gmial.com':'gmail.com','gmai.com':'gmail.com','gmail.co':'gmail.com','gmail.con':'gmail.com','gmil.com':'gmail.com','gnail.com':'gmail.com',
  'hotmial.com':'hotmail.com','hotmai.com':'hotmail.com','hotmail.co':'hotmail.com','hotmil.com':'hotmail.com',
  'yahooo.com':'yahoo.com','yaho.com':'yahoo.com','yahoo.co':'yahoo.com','yahho.com':'yahoo.com',
  'outlok.com':'outlook.com','outlook.co':'outlook.com','outloo.com':'outlook.com',
  'icoud.com':'icloud.com','iclod.com':'icloud.com','icloud.co':'icloud.com'
};
var DISPOSABLE = ['mailinator.com','guerrillamail.com','guerrillamail.net','sharklasers.com','10minutemail.com','10minutemail.net','temp-mail.org','tempmail.com','tempmail.net','throwawaymail.com','yopmail.com','trashmail.com','getnada.com','dispostable.com','maildrop.cc','fakeinbox.com','mailnesia.com','tempr.email','moakt.com','mohmal.com','discard.email'];

var emailDomain = function (e) { var p = String(e || '').split('@'); return p.length > 1 ? p[1].trim().toLowerCase() : ''; };
var suggestEmail = function (e) { var f = DOMAIN_TYPOS[emailDomain(e)]; return f ? String(e).split('@')[0] + '@' + f : ''; };
var isDisposable = function (e) { return DISPOSABLE.indexOf(emailDomain(e)) > -1; };
var isFlorida = function (s) { return ['florida','fl','fl.'].indexOf(String(s || '').trim().toLowerCase()) > -1; };
var low = function (s) { return s.charAt(0).toLowerCase() + s.slice(1); };
// ---------------------------------------------------------------- i18n
// El idioma lo fija la página al embeber su bundle. La rama `opt` está indexada
// por la cadena española, así que **el valor que viaja al servidor sigue siendo
// el español canónico** y sólo cambia lo que se lee: `esc()` para atributos y
// data-val, `lbl()` para todo lo visible. Mezclar las dos rompería las reglas
// de api/submit.ts, que comparan contra los valores en español.
var LANG = window.BORSOGA_LANG || 'es';
var PRIV_URL = LANG === 'es' ? '/politica-de-privacidad/' : '/' + LANG + '/privacy-policy/';
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
var lbl = function (s) { return esc(TR(s)); };   // sólo para texto que se ve

// ---------------------------------------------------------------- estado
function blank() {
  return {
    projectType:'', dealType:'', ownership:'', commercialType:'', commercialOther:'', occupancy:'',
    propertyType:'', workType:'', stage:'', year:'', structure:[],
    spaces:[], counts:{}, millwork:[], keepFurniture:'', keepSpaces:[], pieces:'', piecesLink:'',
    plumbing:'', appliances:'', laundry:'', laundryLayout:'', barEquip:'', pool:'',
    hoa:'', facade:'', health:'',
    noMaterial:false, size:-1, sqft:'', budget:'', finish:'', clarity:'', extras:[], showcase:[],
    name:'', email:'', phone:'', signer:'A título personal',
    entName:'', entState:'', entSigner:'', entRole:'',
    isOwner:'', ownerName:'', ownerEmail:'', decider:'',
    street:'', city:'', state:'Florida', zip:'',
    timing:'', exploring:'', deadline:'', deadlineDate:'', deadlineWhy:'', pro:'',
    portfolio:'', privacy:false, bot:'', lang:'es'
  };
}
var PLANS = ['Essential', 'Premium', 'Borsoga Edition'];
// El plan llega en la URL desde la tarjeta que se pulsó en /interior-design/.
// Equivale al prop `plan` del artboard: contexto, no asignación.
var PICKED = (function () {
  var p = new URLSearchParams(location.search).get('plan') || '';
  return PLANS.indexOf(p) > -1 ? p : '';
})();
var S = { step: 1, done: false, a: blank(), touched: false, sending: false, notice: '', result: null, showErrors: false };
// Los archivos no van en localStorage: se guardan aparte y se suben al enviar.
var FILES = { photos: [], planFiles: [], applianceFiles: [] };

// ---------------------------------------------------------------- ramas
// Pura: se calcula igual desde el render y desde prune(), para que nunca
// queden respuestas huérfanas afectando al resumen.
function branchOf(a) {
  var isCom = a.projectType === PURPOSE_COM;
  var isInvest = a.projectType === PURPOSE_INVEST;
  var inPurchase = isInvest && a.ownership === 'Estoy en proceso de compra';
  var noAccess = inPurchase || (isCom && a.occupancy === 'Todavía no lo tengo');
  var isCondo = a.propertyType === 'Condominio' || a.propertyType === 'Penthouse';
  var isHouse = a.propertyType === 'Casa';
  var isNew = a.workType === 'Obra nueva';
  var isRemodel = !!a.workType && !isNew;
  var spaces = a.spaces || [];
  var has = function (list) { return list.some(function (v) { return spaces.indexOf(v) > -1; }); };
  return {
    isCom: isCom, isInvest: isInvest, inPurchase: inPurchase, noAccess: noAccess,
    isCondo: isCondo, isHouse: isHouse, isNew: isNew, isRemodel: isRemodel,
    asksProperty: !!a.projectType && !isCom,
    asksHoa: isCondo || isHouse,
    asksStructure: isRemodel,
    asksHealth: isCom && a.commercialType === 'Restaurante o bar',
    asksPlumbing: has(WET),
    asksAppliances: has(KITCHENS),
    asksLaundry: has(LAUNDRY),
    asksBar: has(BAR),
    asksPool: has(OUTDOOR) && spaces.indexOf('Área de piscina') === -1,
    asksMillwork: spaces.length > 0,
    needsPlans: isNew || noAccess
  };
}
function spaceListOf(a) {
  var b = branchOf(a);
  if (b.isCom) return COM;
  if (b.isHouse) return RES.concat(HOUSE_EXTRA);
  if (b.isCondo) return RES.concat(CONDO_EXTRA);
  return RES;
}
// Una respuesta que ya no aplica no existe: se borra para que no siga
// afectando el conteo de imágenes, el resumen ni el enrutamiento.
function prune(input) {
  var a = Object.assign({}, input);
  var allowed = spaceListOf(a);
  a.spaces = (a.spaces || []).filter(function (v) { return allowed.indexOf(v) > -1; });
  var counts = {};
  a.spaces.forEach(function (s) { counts[s] = Math.min(10, Math.max(1, (a.counts || {})[s] || 1)); });
  a.counts = counts;
  var b = branchOf(a);
  var mwAllowed = a.spaces.concat([MW_NONE, MW_UNSURE]);
  a.millwork = (a.millwork || []).filter(function (v) { return mwAllowed.indexOf(v) > -1; });
  var drop = {
    dealType: b.isInvest, ownership: b.isInvest,
    commercialType: b.isCom, occupancy: b.isCom,
    commercialOther: b.isCom && a.commercialType === 'Otro',
    propertyType: b.asksProperty, stage: b.isNew, year: b.isRemodel,
    plumbing: b.asksPlumbing, appliances: b.asksAppliances, pool: b.asksPool,
    hoa: b.asksHoa, health: b.asksHealth
  };
  Object.keys(drop).forEach(function (k) { if (!drop[k]) a[k] = ''; });
  if (!b.asksStructure) a.structure = [];
  if (a.appliances !== APPL_DECIDED) FILES.applianceFiles = [];
  if (!b.asksLaundry) { a.laundry = ''; a.laundryLayout = ''; }
  if (!b.asksBar) a.barEquip = '';
  if (a.keepFurniture !== KEEP_YES) a.keepSpaces = [];
  else a.keepSpaces = (a.keepSpaces || []).filter(function (v) { return a.spaces.indexOf(v) > -1; });
  if (a.pieces !== PIECES_DECIDED && a.pieces !== PIECES_REFS) a.piecesLink = '';
  if (a.timing !== TIMING_EXPLORING) a.exploring = '';
  if (a.isOwner !== OWNER_REP) { a.ownerName = ''; a.ownerEmail = ''; }
  if (a.deadline !== DEADLINE_FIXED) { a.deadlineDate = ''; a.deadlineWhy = ''; }
  return a;
}

// ---------------------------------------------------------------- derivados
function unitTotal() {
  return S.a.spaces.reduce(function (t, s) { return t + (S.a.counts[s] || 1); }, 0);
}
// El primero de cada tipo lleva la cantidad completa; los repetidos, la mitad.
function imageTotal() {
  var a = S.a;
  if (a.size < 0) return 0;
  var full = IMGS[a.size], half = Math.ceil(full / 2);
  return a.spaces.reduce(function (t, s) { return t + full + ((a.counts[s] || 1) - 1) * half; }, 0);
}
function spaceSummary() {
  return S.a.spaces.map(function (s) {
    var n = S.a.counts[s] || 1;
    return n + ' ' + (n > 1 ? (PLURAL[s] || low(s) + 's') : low(s));
  }).join(' · ');
}
function structuralFlag() {
  var a = S.a;
  return branchOf(a).asksStructure &&
    (a.structure.indexOf(STRUCT_WALLS) > -1 || a.structure.indexOf(STRUCT_FACADE) > -1);
}
// Cuenta las respuestas sin definir. Cuatro o más y el proyecto va a rango.
function unsureCount() {
  var vals = [];
  Object.keys(S.a).forEach(function (k) {
    var v = S.a[k];
    if (typeof v === 'string') vals.push(v);
    else if (Array.isArray(v)) v.forEach(function (x) { if (typeof x === 'string') vals.push(x); });
  });
  return vals.filter(function (v) { return UNSURE_RE.test(v.trim()); }).length;
}
// Solo para quien llega sin plan. Es recomendación, no asignación.
function recommendPlan() {
  var a = S.a, b = branchOf(a);
  if (a.city && !isMiamiDade(a.city)) return 'Borsoga Edition';
  if (a.finish === 'Lujo' || (b.isHouse && a.spaces.length > 4) || a.extras.length >= 2) return 'Borsoga Edition';
  if (b.needsPlans || b.isNew || structuralFlag() || a.plumbing === 'Sí') return 'Premium';
  return 'Essential';
}
function route() {
  var a = S.a;
  if (PICKED === 'Borsoga Edition') return ['call','Vamos a hablar','Borsoga Edition se cotiza en una llamada. Tenemos todo lo que nos contaste, así que la conversación empieza donde la dejaste.'];
  if (a.state && !isFlorida(a.state)) return ['call','Vamos a hablar','La dirección del proyecto está fuera de Florida. Eso lo revisamos contigo antes de hablar de precio.'];
  if (a.city && !isMiamiDade(a.city)) return ['call','Vamos a hablar','Tu proyecto está fuera de Miami-Dade. Podemos hacerlo, pero el alcance y el desplazamiento los cerramos hablando.'];
  if (structuralFlag()) return ['call','Vamos a hablar','Tu proyecto mueve paredes o toca la fachada. Eso necesita un arquitecto o ingeniero con licencia, así que lo armamos contigo antes de dar un número.'];
  if (unitTotal() > 6) return ['call','Vamos a hablar','Tu proyecto tiene ' + unitTotal() + ' espacios. A ese tamaño el precio lo armamos contigo, no con una calculadora.'];
  if (a.finish === 'Lujo' && a.workType === 'Obra nueva') return ['call','Vamos a hablar','Nivel lujo en obra nueva. Eso lo conversamos antes de darte un número.'];
  if (a.health === 'Sí') return ['call','Vamos a hablar','Un proyecto que pasa por el departamento de salud tiene su propio calendario. Lo armamos contigo antes de hablar de precio.'];
  if (unsureCount() >= 4) return ['range','Te enviamos un rango','Quedaron varias cosas por definir, así que en vez de un número te mandamos un rango y lo cerramos contigo en una llamada.'];
  return ['mail','Recibimos tu proyecto','Vamos a revisar lo que nos contaste y te escribimos para hablar del precio y el plazo. Nada de esto es automático: lo mira una persona del estudio.'];
}
// Devuelve la lista de campos pendientes, no un booleano: el botón necesita
// poder señalar *qué* falta, no solo negarse a avanzar.
function missing() {
  var a = S.a, b = branchOf(a), m = [];
  var need = function (cond, field) { if (cond) m.push(field); };
  switch (S.step) {
    case 1:
      need(!a.projectType, 'projectType');
      if (b.isInvest) { need(!a.dealType, 'dealType'); need(!a.ownership, 'ownership'); }
      if (b.isCom) {
        need(!a.commercialType, 'commercialType');
        need(a.commercialType === 'Otro' && !a.commercialOther, 'commercialOther');
        need(!a.occupancy, 'occupancy');
      }
      need(b.asksProperty && !a.propertyType, 'propertyType');
      need(!!a.projectType && !a.workType, 'workType');
      need(b.isNew && !a.stage, 'stage');
      if (b.isRemodel) { need(!a.year, 'year'); need(a.structure.length === 0, 'structure'); }
      need(!!a.workType && !EMAIL_RE.test(a.email || ''), 'email');
      break;
    case 2:
      need(a.spaces.length === 0, 'spaces');
      need(a.spaces.length > 0 && !a.keepFurniture, 'keepFurniture');
      need(a.spaces.length > 0 && !a.pieces, 'pieces');
      need(a.size < 0, 'size');
      break;
    case 3:
      need(b.asksMillwork && a.millwork.length === 0, 'millwork');
      need(b.asksPlumbing && !a.plumbing, 'plumbing');
      need(b.asksAppliances && !a.appliances, 'appliances');
      need(b.asksLaundry && !a.laundry, 'laundry');
      need(b.asksLaundry && !a.laundryLayout, 'laundryLayout');
      need(b.asksBar && !a.barEquip, 'barEquip');
      need(b.asksPool && !a.pool, 'pool');
      need(b.asksHoa && !a.hoa, 'hoa');
      need(b.asksHealth && !a.health, 'health');
      if (!b.noAccess) {
        need(!a.noMaterial && (b.needsPlans ? FILES.planFiles.length < 1 : FILES.photos.length < 3), 'material');
      }
      break;
    case 4:
      need(!a.finish, 'finish');
      need(!!a.finish && !a.clarity, 'clarity');
      break;
    case 5: break;
    case 6:
      need(!a.name, 'name'); need(!EMAIL_RE.test(a.email || ''), 'email'); need(!a.phone, 'phone');
      need(!a.isOwner, 'isOwner');
      if (a.isOwner === OWNER_REP) {
        need(!a.ownerName, 'ownerName');
        need(!EMAIL_RE.test(a.ownerEmail || ''), 'ownerEmail');
      }
      if (a.signer === 'Como empresa') {
        need(!a.entName, 'entName'); need(!a.entState, 'entState');
        need(!a.entSigner, 'entSigner'); need(!a.entRole, 'entRole');
      }
      need(!a.decider, 'decider');
      need(!a.street, 'street'); need(!a.city, 'city'); need(!a.state, 'state'); need(!a.zip, 'zip');
      need(!a.timing, 'timing'); need(!a.deadline, 'deadline');
      if (a.deadline === DEADLINE_FIXED) {
        need(!a.deadlineDate, 'deadlineDate'); need(!a.deadlineWhy, 'deadlineWhy');
      }
      need(!a.pro, 'pro'); need(!a.portfolio, 'portfolio'); need(!a.privacy, 'privacy');
      break;
  }
  return m;
}
var MISSING = [];
function canContinue() { return missing().length === 0; }
function upsell() {
  var a = S.a;
  if (a.finish === 'Lujo' && a.spaces.length <= 2) return 'Elegiste nivel lujo. A ese nivel de acabado tu contratista va a pedir planos y guía de materiales, y eso entra a partir de Premium.';
  if (a.spaces.length > 4) return 'Tu proyecto tiene ' + a.spaces.length + ' espacios. Borsoga Edition está pensado para proyectos de este tamaño.';
  return '';
}

// ---------------------------------------------------------------- persistencia
function persist() {
  try { localStorage.setItem(KEY, JSON.stringify({ step: S.step, a: S.a, at: Date.now() })); } catch (e) {}
}
function setA(patch) {
  S.a = prune(Object.assign({}, S.a, patch));
  S.touched = true;
  persist();
  render();
}
function toggleIn(field, value, exclusive) {
  var cur = S.a[field] || [], on = cur.indexOf(value) > -1, next;
  if (exclusive) next = on ? [] : [value];
  else {
    var kept = cur.filter(function (v) { return !EXCL[field] || EXCL[field].indexOf(v) < 0; });
    next = on ? kept.filter(function (v) { return v !== value; }) : kept.concat([value]);
  }
  var o = {}; o[field] = next; setA(o);
}
var EXCL = { structure: [STRUCT_NONE, STRUCT_UNSURE], millwork: [MW_NONE, MW_UNSURE] };

// ---------------------------------------------------------------- render helpers
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
function checks(field, values, exclusives) {
  var cur = S.a[field] || [];
  return '<div class="q-grid">' + values.map(function (v) {
    return '<button type="button" class="q-card" data-check="' + esc(field) + '" data-val="' + esc(v) +
      '" data-excl="' + ((exclusives || []).indexOf(v) > -1) + '" aria-pressed="' + (cur.indexOf(v) > -1) +
      '"><span class="q-box"></span><span>' + lbl(v) + '</span></button>';
  }).join('') + '</div>';
}
function field(name, ph, type) {
  return '<input class="q-in" type="' + (type || 'text') + '" data-field="' + name + '" placeholder="' +
    lbl(ph) + '" value="' + esc(S.a[name]) + '"' +
    (type === 'email' ? ' autocomplete="email" inputmode="email" spellcheck="false"' : '') + '>';
}

// ---------------------------------------------------------------- pasos
function step1() {
  var a = S.a, b = branchOf(a), h = '';
  h += group('¿Para qué es este proyecto?', '', cards('projectType', [PURPOSE_LIVE, PURPOSE_INVEST, PURPOSE_COM]), 'projectType');

  if (b.isInvest) {
    h += group('¿Es para vender o para rentar?', '', chips('dealType', ['Para vender', 'Para rentar']), 'dealType');
    h += group('¿Ya es tuya?', '', chips('ownership', ['Sí, ya es mía', 'Estoy en proceso de compra']), 'ownership');
  }
  if (b.isCom) {
    h += group('¿Qué tipo de espacio comercial?', '',
      chips('commercialType', ['Oficina','Retail','Showroom','Restaurante o bar','Hospitalidad','Amenidades de edificio','Modelo de ventas','Otro']) +
      (a.commercialType === 'Otro' ? '<div style="margin-top:12px;max-width:420px">' + field('commercialOther', '¿Qué tipo de espacio es?') + '</div>' : ''),
      ['commercialType','commercialOther']);
    h += group('¿El local está vacío o en operación?', '', chips('occupancy', ['Vacío o en obra','En operación','Todavía no lo tengo']), 'occupancy');
  }
  if (b.asksProperty) h += group('¿Qué tipo de propiedad es?', '', cards('propertyType', ['Condominio','Casa','Penthouse']), 'propertyType');
  if (a.projectType) h += group('¿Obra nueva o remodelación?', '', chips('workType', ['Obra nueva','Remodelación']), 'workType');
  if (b.isNew) h += group('¿En qué etapa está la obra?', '', chips('stage', ['Todavía en planos','En construcción','Terminada sin entregar']), 'stage');
  if (b.isRemodel) {
    h += group('¿De qué año es aproximadamente la propiedad?', '', chips('year', ['Antes de 1990','1990 a 2010','Después de 2010','No sé']), 'year');
    h += group('¿El proyecto incluye alguno de estos?', 'Marca todo lo que aplique.',
      checks('structure', STRUCT, [STRUCT_NONE, STRUCT_UNSURE]) +
      (structuralFlag() ? '<div class="q-note warn">' + esc(t('qi_structural')) + '</div>' : ''), 'structure');
  }
  if (a.workType) {
    var sug = suggestEmail(a.email);
    h += group('¿A dónde te guardamos el avance?',
      'Lo guardamos en este navegador para que puedas volver donde quedaste. Te lo pedimos también para poder contactarte.',
      '<div style="max-width:420px">' + field('email', 'tu@correo.com', 'email') +
      (a.email && !EMAIL_RE.test(a.email) ? '<p class="q-err">' + esc(t('srv_email_bad')) + '</p>' : '') +
      (sug ? '<p class="q-err">' + fill(t('qi_didyoumean'), { email: esc(sug) }) + ' <button type="button" class="q-back" data-fix-email="1" style="margin-left:8px">' + esc(t('srv_fix')) + '</button></p>' : '') +
      '</div>', 'email');
  }
  return h;
}

function step2() {
  var a = S.a, b = branchOf(a), h = '';
  h += group('¿Qué espacios quieres diseñar?',
    'Elige todos los que quieras. No hay mínimo: puedes contratar uno solo. Si tienes más de uno, ajusta la cantidad.',
    '<div class="q-grid">' + spaceListOf(a).map(function (t) {
      var on = a.spaces.indexOf(t) > -1, n = a.counts[t] || 1;
      return '<div class="q-space" data-space="' + esc(t) + '" aria-pressed="' + on + '">' +
        '<span style="display:flex;align-items:center;gap:12px"><span class="q-radio"></span><span>' + esc(t) + '</span></span>' +
        (on ? '<span style="display:flex;align-items:center;gap:10px" data-stop="1">' +
          '<button type="button" class="q-step" data-count="' + esc(t) + '" data-d="-1"' + (n <= 1 ? ' disabled' : '') + '>−</button>' +
          '<span style="font-size:15px;min-width:14px;text-align:center">' + n + '</span>' +
          '<button type="button" class="q-step" data-count="' + esc(t) + '" data-d="1"' + (n >= 10 ? ' disabled' : '') + '>+</button></span>' : '') +
        '</div>';
    }).join('') + '</div>', 'spaces');

  if (a.spaces.length) {
    h += group('¿Vas a conservar muebles que ya tienes?', '',
      chips('keepFurniture', KEEP) +
      (a.keepFurniture === KEEP_YES
        ? '<div style="margin-top:14px">' + checks('keepSpaces', a.spaces) + '</div>' : ''),
      'keepFurniture');
    h += group('¿Ya tienes piezas de mobiliario decididas?', '',
      chips('pieces', PIECES) +
      ((a.pieces === PIECES_DECIDED || a.pieces === PIECES_REFS)
        ? '<div style="margin-top:14px;max-width:520px">' +
          field('piecesLink', 'Enlace a tu lista o tablero (opcional)') + '</div>' : ''),
      'pieces');
  }

  h += group('¿Qué tan grande es tu proyecto?', 'Una idea general basta. Los detalles los tomamos en la visita.',
    '<div class="q-grid">' + SIZE_OPTIONS.map(function (o, i) {
      return '<button type="button" class="q-card" data-size="' + i + '" aria-pressed="' + (a.size === i) + '" style="flex-direction:column;align-items:flex-start;gap:8px">' +
        '<span style="font-size:18px;font-weight:500">' + esc(o[0]) + '</span>' +
        '<span style="font-size:14px;line-height:1.5;opacity:.72">' + esc(o[1]) + '</span>' +
        '<span style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;opacity:.6">' + esc(fill(t('qi_imgs_per_space'), { n: IMGS[i] })) + '</span></button>';
    }).join('') + '</div>' +
    '<div style="margin-top:16px;max-width:320px"><label style="display:block;font-size:14px;color:rgba(0,0,0,.6);margin-bottom:8px">' + esc(t('qi_sqft_q')) + ' <span style="opacity:.7">' + esc(t('qi_optional')) + '</span></label>' +
    field('sqft', 'Opcional') + '</div>' +
    (imageTotal() > 0 ? '<div class="q-note" style="display:flex;align-items:baseline;gap:12px"><strong style="font-size:26px;font-weight:600">' + imageTotal() + '</strong><span>' + esc(t('qi_images_total')) + '</span></div>' : ''), 'size');

  h += group('¿Cuánto piensas invertir en obra y mobiliario?',
    'Es opcional, pero si nos lo compartes ajustamos el estimado a tu realidad en vez de darte un rango amplio.',
    chips('budget', BUDGETS));
  return h;
}

function filedrop(kind, title, note, accept) {
  var n = FILES[kind].length;
  return '<label class="q-drop' + (n ? ' has' : '') + '" style="margin-top:14px">' +
    '<input type="file" multiple accept="' + accept + '" data-files="' + kind + '"' +
    (kind === 'photos' ? ' capture="environment"' : '') + '>' +
    '<span style="flex:1"><span style="display:block;font-size:16px;font-weight:500">' + esc(title) + '</span>' +
    '<span style="display:block;font-size:14px;color:rgba(0,0,0,.55);margin-top:4px">' + esc(note) + '</span></span>' +
    '<span style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:rgba(0,0,0,.5)">' +
    (n ? n + (n === 1 ? ' archivo' : ' archivos') : 'Elegir') + '</span></label>' +
    FILES[kind].map(function (f, i) {
      return '<span class="q-file"><span>' + esc(f.name) + '</span>' +
        '<button type="button" class="q-back" data-rmfile="' + kind + '" data-i="' + i + '" style="font-size:10px">Quitar</button></span>';
    }).join('');
}

function step3() {
  var a = S.a, b = branchOf(a), h = '';

  // Las preguntas que dependen de qué espacios eligió: antes vivían en el
  // paso 2 y lo dejaban interminable. Ahora tienen paso propio.
  if (b.asksMillwork) h += group('¿En cuáles se van a hacer muebles a la medida?',
    'Gabinetes de cocina, clósets, muebles de baño, paneles de pared, libreros. Lo contrario es comprar todo ya hecho.',
    checks('millwork', a.spaces.concat([MW_NONE, MW_UNSURE]), [MW_NONE, MW_UNSURE]), 'millwork');
  if (b.asksPlumbing) h += group('¿Se van a mover los puntos de agua o desagüe?', '',
    chips('plumbing', ['Sí','No','No sé']), 'plumbing');
  if (b.asksAppliances) h += group('¿Ya elegiste los electrodomésticos?',
    'Las medidas de los electrodomésticos definen toda la gabinetería, así que conviene tenerlos decididos antes de empezar.',
    chips('appliances', [APPL_DECIDED, 'Todavía no', APPL_HELP]) +
    (a.appliances === APPL_DECIDED ? filedrop('applianceFiles', 'Súbenos la lista o las fichas técnicas', 'Opcional. Imágenes o PDF.', 'image/*,application/pdf') : '') +
    (a.appliances === APPL_HELP ? '<div class="q-note">' + esc(t('qi_appl_note')) + '</div>' : ''),
    'appliances');
  if (b.asksLaundry) {
    h += group('¿Ya elegiste la lavadora y la secadora?', '',
      chips('laundry', [APPL_DECIDED, 'Todavía no', APPL_HELP]), 'laundry');
    h += group('¿Cómo van a ir?', 'Apiladas ocupan menos; lado a lado piden más frente de pared.',
      chips('laundryLayout', LAUNDRY_LAYOUT), 'laundryLayout');
  }
  if (b.asksBar) h += group('¿Ya elegiste el equipo de la barra?',
    'Fregadero, hielera, enfriador de bebidas, cafetera.',
    chips('barEquip', [APPL_DECIDED, 'Todavía no', APPL_HELP]), 'barEquip');
  if (b.asksPool) h += group('¿El proyecto incluye la piscina o su área?', '',
    chips('pool', ['Sí','No','No hay piscina']), 'pool');
  if (b.asksHoa) h += group(b.isHouse ? '¿Tu comunidad tiene HOA con reglas de diseño?' : '¿El edificio pide aprobación de la asociación o del condominio?',
    '', chips('hoa', ['Sí','No','No sé']), 'hoa');
  if (b.asksHealth) h += group('¿El proyecto necesita aprobación del departamento de salud?', '',
    chips('health', ['Sí','No','No sé']), 'health');

  // Material del espacio
  var lead = b.inPurchase ? 'Todavía no es tuya, así que no hay nada que fotografiar. Súbenos lo que tengas del listado o del desarrollo. Nada aquí es obligatorio.'
    : b.noAccess ? 'Todavía no tienes el local. Súbenos los planos o el material que te hayan dado. Nada aquí es obligatorio.'
    : b.isNew ? 'En obra nueva no hay fotos. Necesitamos los planos o el material del desarrollo.'
    : 'Necesitamos verlo para darte un estimado real. Con el celular basta.';

  if (!b.needsPlans) {
    h += group('Muéstranos tu espacio', lead,
      '<div class="q-note" style="margin-top:0;margin-bottom:16px"><strong style="display:block;margin-bottom:8px">' + esc(t('qi_photos_what')) + '</strong>' +
      esc(t('qi_photos_list')) + '</div>' +
      filedrop('photos', 'Toma o elige tus fotos', 'De 3 a 6 fotos. Con el celular basta.', 'image/*') +
      filedrop('planFiles', 'Tus planos, si los tienes', 'Opcional. Imágenes o PDF.', 'image/*,application/pdf'), 'material');
  } else {
    h += group('Muéstranos el proyecto', lead,
      filedrop('planFiles', b.inPurchase ? 'Sube lo que tengas de la propiedad' : 'Sube los planos o el material del desarrollo',
        b.inPurchase ? 'Fotos del listado, planos, medidas. Imágenes o PDF.' : 'Imágenes o PDF. Lo que te haya dado el desarrollador sirve.',
        'image/*,application/pdf') +
      filedrop('photos', 'Fotos del lugar, si ya se puede entrar', 'Opcional.', 'image/*'), 'material');
  }
  h += '<div class="q-group"><button type="button" class="q-card" data-nomaterial="1" aria-pressed="' + a.noMaterial + '">' +
    '<span class="q-box"></span><span>' + esc(t('qi_nomaterial')) + '</span></button>' +
    (a.noMaterial ? '<div class="q-note">' + esc(t('qi_nomaterial_note')) + '</div>' : '') +
    '<p class="q-hint" style="margin-top:16px">' + esc(t('qi_photos_privacy')) + '</p></div>';
  return h;
}

function step4() {
  var a = S.a;
  var lv = [['Nivel 01','Estándar'],['Nivel 02','Alta gama'],['Nivel 03','Lujo']];
  var h = group('Estas son tres cocinas nuestras. Señala la que se parece a lo que quieres.', '',
    '<div class="q-grid">' + lv.map(function (o) {
      return '<button type="button" class="q-lvl" data-set="finish" data-val="' + esc(o[1]) + '" aria-pressed="' + (a.finish === o[1]) + '">' +
        '<span class="q-slot">Proyecto real — ' + esc(o[1].toLowerCase()) + '</span>' +
        '<span style="padding:16px 18px"><span style="display:block;font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:rgba(0,0,0,.45)">' + esc(o[0]) + '</span>' +
        '<span style="display:block;font-size:19px;font-weight:600;margin-top:4px">' + esc(o[1]) + '</span></span></button>';
    }).join('') + '</div>', 'finish');
  if (a.finish) h += group('¿Qué tan claro tienes lo que quieres?', '', chips('clarity', CLARITY), 'clarity');
  return h;
}

function step5() {
  var a = S.a;
  var ex = [
    ['Borsoga Immersive','Caminas tu espacio con lentes de realidad virtual. Vamos a donde estés.'],
    ['Tour 360','Un recorrido navegable de tu proyecto. Se abre en cualquier navegador.'],
    ['Imágenes adicionales','Más vistas de tu proyecto, además de las que ya trae tu plan.']
  ];
  var h = group('Extras', 'Se cotizan aparte. Lo que no marques aquí queda fuera de tu proyecto.',
    '<div class="q-grid">' + ex.map(function (o) {
      return '<button type="button" class="q-card" data-check="extras" data-val="' + esc(o[0]) + '" data-excl="false" aria-pressed="' + (a.extras.indexOf(o[0]) > -1) + '" style="align-items:flex-start">' +
        '<span class="q-box" style="margin-top:3px"></span><span><span style="display:block">' + esc(o[0]) + '</span>' +
        '<span style="display:block;font-size:14px;line-height:1.5;color:rgba(0,0,0,.6);margin-top:4px">' + esc(o[1]) + '</span></span></button>';
    }).join('') + '</div>');
  var up = upsell();
  if (up) h += '<div class="q-note warn"><strong style="display:block;margin-bottom:6px">' + esc(t('qi_a_note')) + '</strong>' + esc(TR(up)) + '</div>';

  // Venta cruzada: qué le ofrecemos depende de para qué es el proyecto.
  var b2 = branchOf(a);
  var sc = b2.isInvest ? SHOWCASE_SELL : b2.isCom ? SHOWCASE_COM : SHOWCASE_LIVE;
  h += group('¿Vas a necesitar algo más cuando esté terminado?', '',
    checks('showcase', sc.concat([SHOWCASE_NONE]), [SHOWCASE_NONE]));
  return h;
}

function step6() {
  var a = S.a, h = '';
  h += group('Tus datos', '', '<div class="q-fields">' + field('name', 'Nombre legal completo') +
    field('email', 'Correo', 'email') + field('phone', 'Teléfono', 'tel') + '</div>', ['name','email','phone']);
  h += group('¿Firmas a título personal o como empresa?', '', chips('signer', ['A título personal','Como empresa']) +
    (a.signer === 'Como empresa' ? '<div class="q-fields" style="margin-top:12px">' + field('entName','Nombre legal de la empresa') +
      field('entState','Estado de registro') + field('entSigner','Quién firma') + field('entRole','Su cargo') + '</div>' : ''));
  h += group('¿Eres el dueño de la propiedad?', '', chips('isOwner', ['Sí', OWNER_REP]) +
    (a.isOwner === OWNER_REP ? '<div class="q-fields" style="margin-top:12px">' + field('ownerName','Nombre del dueño') +
      field('ownerEmail','Correo del dueño','email') + '</div>' : ''), ['isOwner','ownerName','ownerEmail']);
  h += group('¿Quién decide en este proyecto?', '', chips('decider', DECIDERS), 'decider');
  h += group('Dirección del proyecto', '', '<div class="q-fields">' + field('street','Calle y número') +
    field('city','Ciudad') + field('state','Estado') + field('zip','Código postal') + '</div>' +
    (a.state && !isFlorida(a.state) ? '<div class="q-note">' + esc(t('qi_outside_fl')) + '</div>' : ''), ['street','city','state','zip']);
  h += group('¿Cuándo quieres empezar?', '',
    chips('timing', ['Lo antes posible','En 1 a 3 meses', TIMING_EXPLORING]) +
    (a.timing === TIMING_EXPLORING
      ? '<div style="margin-top:14px;max-width:520px">' +
        field('exploring', '¿Qué te haría decidirte? (opcional)') + '</div>' : ''),
    'timing');
  h += group('¿Tienes una fecha límite?', '', chips('deadline', ['No, sin fecha fija','Sí, pero es flexible', DEADLINE_FIXED]) +
    (a.deadline === DEADLINE_FIXED ? '<div class="q-fields" style="margin-top:12px">' + field('deadlineDate','','date') +
      field('deadlineWhy','Motivo: mudanza, cierre de compra, apertura, otro') + '</div>' : ''), ['deadline','deadlineDate','deadlineWhy']);
  h += group('¿Ya trabajas con un contratista o un arquitecto?', '',
    chips('pro', ['Sí','No', PRO_REFERRAL, 'No lo he decidido']) +
    (a.pro === PRO_REFERRAL
      ? '<div class="q-note">' + esc(t('qi_referral_note')) + '</div>' : ''),
    'pro');
  h += group('¿Podemos publicar tu proyecto terminado?', 'Nos ayuda a mostrar nuestro trabajo. Lo confirmamos en el contrato.', chips('portfolio', PORTFOLIO), 'portfolio');
  h += '<div class="q-group"><button type="button" class="q-card" data-privacy="1" aria-pressed="' + a.privacy + '">' +
    '<span class="q-box"></span><span>' + fill(t('qi_privacy_accept'), { link: '<a href="' + PRIV_URL + '" target="_blank" style="border-bottom:1px solid">' + esc(t('qi_privacy_link')) + '</a>' }) + '</span></button>' +
    '<input type="text" data-field="bot" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px" value="' + esc(a.bot) + '">' +
    (S.notice ? '<p class="q-err">' + esc(S.notice) + '</p>' : '') +
    '<p class="q-hint" style="margin-top:16px">' + esc(t('qi_not_contract')) + '</p></div>';
  return h;
}

function summary() {
  var a = S.a, b = branchOf(a), r = [];
  var add = function (l, v) { if (v) r.push([l, v]); };
  add('Plan recomendado', recommendPlan());
  add('Proyecto', [a.projectType, a.dealType].filter(Boolean).join(' · '));
  add('Propiedad', b.isCom ? (a.commercialType === 'Otro' ? a.commercialOther : a.commercialType) : a.propertyType);
  add('Obra', [a.workType, b.isNew ? a.stage : a.year].filter(Boolean).join(' · '));
  add('Espacios', spaceSummary());
  if (b.asksMillwork) add('Muebles a la medida', a.millwork.join(' · '));
  if (b.asksPlumbing) add('Agua y desagüe', a.plumbing);
  if (b.asksAppliances) add('Electrodomésticos', a.appliances);
  if (b.asksLaundry) add('Lavandería', [a.laundry, a.laundryLayout].filter(Boolean).join(' · '));
  if (b.asksBar) add('Equipo de barra', a.barEquip);
  add('Mobiliario que conserva', a.keepFurniture === KEEP_YES
    ? KEEP_YES + ' · ' + a.keepSpaces.join(', ') : a.keepFurniture);
  add('Piezas decididas', a.pieces + (a.piecesLink ? ' · ' + a.piecesLink : ''));
  if (b.asksPool) add('Piscina', a.pool);
  if (b.asksStructure) add('Paredes y fachada', a.structure.join(' · '));
  if (structuralFlag()) add('Marcado', 'Obra estructural o de fachada. Lo revisamos antes de cotizar.');
  if (b.asksHoa) add(b.isHouse ? 'HOA' : 'Asociación', a.hoa);
  if (b.asksHealth) add('Departamento de salud', a.health);
  add('Material', a.noMaterial ? 'Todavía sin material'
    : [FILES.photos.length ? FILES.photos.length + ' fotos' : '', FILES.planFiles.length ? FILES.planFiles.length + ' planos' : ''].filter(Boolean).join(' · '));
  add('Tamaño', a.size >= 0 ? SIZE_OPTIONS[a.size][0] + (a.sqft ? ' · ' + a.sqft + ' pies²' : '') : '');
  add('Imágenes', imageTotal() + ' en total');
  add('Nivel de acabado', a.finish);
  add('Punto de partida', a.clarity);
  add('Presupuesto declarado', a.budget);
  add('Extras', a.extras.length ? a.extras.join(', ') : 'Ninguno');
  add('Dirección', [a.street, a.city, a.state, a.zip].filter(Boolean).join(', '));
  add('Cuándo', a.timing);
  add('Fecha límite', a.deadline === DEADLINE_FIXED ? [a.deadlineDate, a.deadlineWhy].filter(Boolean).join(' · ') : a.deadline);
  add('Quién decide', a.decider);
  add('Portafolio', a.portfolio);
  add('Más al terminar', a.showcase.filter(function (v) { return v !== SHOWCASE_NONE; }).join(', '));
  if (a.timing === TIMING_EXPLORING && a.exploring) add('Qué le haría decidirse', a.exploring);
  if (a.pro === PRO_REFERRAL) add('Marcado', 'Pide que le recomendemos contratista.');
  if (a.city && !isMiamiDade(a.city)) add('Marcado', 'Fuera de Miami-Dade.');
  if (unsureCount() >= 4) add('Marcado', 'Varias respuestas sin definir. Va a rango y a llamada.');
  return r;
}

function doneScreen() {
  var rt = S.result || route();
  var h = '<div style="max-width:62ch">' +
    '<p style="font-size:11px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:rgba(0,0,0,.45);margin:0 0 18px">Listo</p>' +
    '<h1 style="margin:0;font-size:clamp(32px,5vw,54px);font-weight:600;letter-spacing:-.03em;line-height:1.02">' + esc(rt[1]) + '</h1>';
  if (rt[0] === 'mail') h += '<p style="display:flex;align-items:baseline;gap:14px;margin:26px 0 0"><strong style="font-size:34px;font-weight:600;letter-spacing:-.03em">48</strong><span style="font-size:16px;color:rgba(0,0,0,.7)">Te escribimos en persona en menos de 48 horas</span></p>';
  h += '<p style="margin:22px 0 0;font-size:17px;line-height:1.6;color:rgba(0,0,0,.72)">' + esc(rt[2]) + '</p>';
  h += '<div class="q-note" style="margin-top:26px"><strong style="display:block;margin-bottom:6px">' + esc(t('qi_your_plan')) + '</strong>' +
    (PICKED ? fill(t('qi_plan_picked'), { plan: esc(PICKED) })
            : fill(t('qi_plan_reco'), { plan: esc(recommendPlan()) })) + '</div>';
  h += '</div><dl class="q-sum">' + summary().map(function (p) {
    return '<div><dt>' + lbl(p[0]) + '</dt><dd>' + lbl(p[1]) + '</dd></div>';
  }).join('') + '</dl>' +
  '<p class="q-hint" style="margin-top:28px">' + esc(t('qi_confirm_visit')) + '</p>';
  return h;
}

// ---------------------------------------------------------------- render
function render() {
  var main = document.getElementById('q-main');
  var nav = document.getElementById('q-nav');
  var seg = document.getElementById('q-seg');

  seg.innerHTML = [1,2,3,4,5,6].map(function (i) {
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

  if (S.done) {
    nav.hidden = true;
    main.innerHTML = doneScreen();
    window.scrollTo(0, 0);
    return;
  }
  nav.hidden = false;
  MISSING = missing();
  var fn = [step1, step2, step3, step4, step5, step6][S.step - 1];
  main.innerHTML = '<div style="margin-bottom:clamp(28px,4vw,44px)">' +
    '<p style="font-size:11px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:rgba(0,0,0,.45);margin:0 0 12px">' + STEPS[S.step-1][0] + '</p>' +
    '<h1 style="margin:0;font-size:clamp(28px,4.4vw,44px);font-weight:600;letter-spacing:-.03em;line-height:1.05">' + STEPS[S.step-1][1] + '</h1></div>' + fn();

  document.getElementById('q-back').disabled = S.step === 1;
  document.getElementById('q-count').textContent = 'Paso ' + S.step + ' de 6';
  var next = document.getElementById('q-next');
  // Nunca deshabilitado por campos pendientes: pulsarlo es lo que revela qué
  // falta. Un botón gris no explica nada; solo deja al usuario atascado.
  next.disabled = S.sending;
  var nextLabel = S.sending ? (S.notice || 'Enviando…') : (S.step === 6 ? 'Enviar mi proyecto' : 'Continuar');
  next.querySelector('.q-btn-label').textContent = nextLabel;
  next.setAttribute('aria-label', nextLabel);
  var aviso = document.getElementById('q-aviso');
  if (S.showErrors && MISSING.length) {
    aviso.textContent = MISSING.length === 1 ? 'Falta 1 respuesta' : 'Faltan ' + MISSING.length + ' respuestas';
    aviso.hidden = false;
  } else { aviso.hidden = true; }
}

function go(n) { S.step = n; S.notice = ''; S.showErrors = false; persist(); render(); window.scrollTo(0, 0); }

// ---------------------------------------------------------------- eventos
document.addEventListener('click', function (e) {
  var t = e.target.closest('[data-set],[data-check],[data-space],[data-count],[data-size],[data-nomaterial],[data-privacy],[data-fix-email],[data-rmfile]');
  if (!t) return;
  if (t.dataset.count !== undefined) {
    e.stopPropagation();
    var n = Math.min(10, Math.max(1, (S.a.counts[t.dataset.count] || 1) + parseInt(t.dataset.d, 10)));
    var c = Object.assign({}, S.a.counts); c[t.dataset.count] = n;
    return setA({ counts: c });
  }
  if (t.dataset.set !== undefined) return setA(govObj(t.dataset.set, t.dataset.val));
  if (t.dataset.check !== undefined) return toggleIn(t.dataset.check, t.dataset.val, t.dataset.excl === 'true');
  if (t.dataset.space !== undefined) {
    var s = t.dataset.space, on = S.a.spaces.indexOf(s) > -1;
    var counts = Object.assign({}, S.a.counts);
    if (on) delete counts[s]; else counts[s] = counts[s] || 1;
    return setA({ spaces: on ? S.a.spaces.filter(function (v) { return v !== s; }) : S.a.spaces.concat([s]), counts: counts });
  }
  if (t.dataset.size !== undefined) return setA({ size: parseInt(t.dataset.size, 10) });
  if (t.dataset.nomaterial !== undefined) return setA({ noMaterial: !S.a.noMaterial });
  if (t.dataset.privacy !== undefined) return setA({ privacy: !S.a.privacy });
  if (t.dataset.fixEmail !== undefined) return setA({ email: suggestEmail(S.a.email) });
  if (t.dataset.rmfile !== undefined) {
    FILES[t.dataset.rmfile].splice(parseInt(t.dataset.i, 10), 1);
    return render();
  }
});
function govObj(k, v) { var o = {}; o[k] = v; return o; }

document.addEventListener('change', function (e) {
  if (e.target.dataset && e.target.dataset.files !== undefined) {
    var kind = e.target.dataset.files;
    FILES[kind] = FILES[kind].concat(Array.prototype.slice.call(e.target.files || []));
    S.touched = true;
    render();
  }
});
document.addEventListener('input', function (e) {
  var f = e.target.dataset && e.target.dataset.field;
  if (!f) return;
  S.a[f] = e.target.value;
  S.touched = true;
  persist();
  // No re-renderizamos en cada tecla: se perdería el foco y la posición del
  // cursor. Solo refrescamos el contador de pendientes si ya se mostró.
  if (S.showErrors) {
    MISSING = missing();
    var aviso = document.getElementById('q-aviso');
    if (aviso) {
      aviso.hidden = MISSING.length === 0;
      aviso.textContent = MISSING.length === 1 ? 'Falta 1 respuesta' : 'Faltan ' + MISSING.length + ' respuestas';
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
    S.showErrors = true;
    render();
    // Llevamos al primer pendiente: en pasos largos puede quedar fuera de vista.
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
function submit() {
  var a = S.a;
  if (a.bot) { S.notice = 'No pudimos enviar tu proyecto desde este correo. Escríbenos y lo resolvemos contigo.'; return render(); }
  if (isDisposable(a.email)) { S.notice = 'Necesitamos un correo donde podamos enviarte la propuesta.'; return render(); }
  var sent = {};
  try { sent = JSON.parse(localStorage.getItem(SUBMIT_KEY) || '{}'); } catch (e) {}
  var k = String(a.email).trim().toLowerCase();
  if ((sent[k] || 0) >= MAX_SUBMITS) { S.notice = 'Ya recibimos tu proyecto. Si necesitas cambiar algo, escríbenos.'; return render(); }

  S.sending = true; S.notice = ''; render();

  // Los archivos van directos a Blob: las funciones de Vercel tienen un tope
  // de ~4,5 MB de cuerpo y seis fotos de móvil lo superan. Aquí solo viajan
  // las URLs resultantes.
  var pending = [];
  ['photos','planFiles','applianceFiles'].forEach(function (kind) {
    FILES[kind].forEach(function (f) { pending.push({ kind: kind, file: f }); });
  });

  var lote = Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36);
  var subidos = [];

  loadUploader()
    .then(function () {
      var hechos = 0;
      return pending.reduce(function (chain, item) {
        return chain.then(function () {
          var safe = item.file.name.replace(/[^\w.\-]+/g, '_').slice(-80);
          return window.borsogaUpload(item.file, 'leads/' + lote + '/' + item.kind + '/' + safe,
            function (pct) {
              S.notice = 'Subiendo ' + (hechos + 1) + ' de ' + pending.length + ' · ' + pct + '%';
              var n = document.getElementById('q-next');
              if (n) {
                n.querySelector('.q-btn-label').textContent = S.notice;
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
      return fetch('/api/submit/', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          answers: a,
          derived: {
            unitTotal: unitTotal(), imageTotal: imageTotal(), spaceSummary: spaceSummary(),
            picked: PICKED, recommend: recommendPlan(), route: route()[0],
            unsure: unsureCount(), structural: structuralFlag()
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
      S.done = true;
      render();
    })
    .catch(function (err) {
      S.sending = false;
      S.notice = (err && err.message ? 'No pudimos subir tus archivos: ' + err.message
                                     : 'No pudimos enviarlo. Revisa tu conexión e inténtalo otra vez.');
      render();
    });
}

// El SDK de Blob pesa ~100 KB: solo se carga si hay archivos que subir.
var uploaderPromise = null;
function loadUploader() {
  var hayArchivos = FILES.photos.length || FILES.planFiles.length || FILES.applianceFiles.length;
  if (!hayArchivos) return Promise.resolve();
  if (window.borsogaUpload) return Promise.resolve();
  if (uploaderPromise) return uploaderPromise;
  uploaderPromise = new Promise(function (resolve, reject) {
    var s = document.createElement('script');
    s.src = '/assets/upload.js';
    s.onload = function () { window.borsogaUpload ? resolve() : reject(new Error('el subidor no cargó')); };
    s.onerror = function () { reject(new Error('no se pudo cargar el subidor')); };
    document.head.appendChild(s);
  });
  return uploaderPromise;
}

// ---------------------------------------------------------------- arranque
try {
  var saved = JSON.parse(localStorage.getItem(KEY) || 'null');
  if (saved && saved.a && saved.step > 1) {
    if (confirm(fill(t('q_resume'), { n: '0' + saved.step }))) {
      S.a = prune(Object.assign(blank(), saved.a));
      S.step = Math.min(6, Math.max(1, saved.step));
      S.touched = true;
    } else { localStorage.removeItem(KEY); }
  }
} catch (e) {}
render();
})();
