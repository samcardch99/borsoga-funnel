/**
 * Cuestionario de Diseño Web — 10 pasos.
 *
 * Portado del artboard 'Cuestionario Diseno Web'. Las constantes van en español
 * tal cual están en el diseño, sin traducir: son el valor canónico que viaja al
 * servidor y el índice por el que `opt` busca la traducción al pintarlas.
 *
 * Las preguntas son datos; quien las pinta y las valida es `brief.js`.
 */
(function () {
'use strict';

var YES = 'Sí';
var NO = 'No';
var UNSURE = 'No estoy seguro';
var YES_NO = [YES, NO];
var YES_NO_UNSURE = [YES, NO, UNSURE];

var SCRATCH = 'Crear un sitio web desde cero';
var PROJECT_TYPES = [SCRATCH, 'Rediseñar completamente el sitio actual', 'Mejorar u optimizar el sitio actual', 'Añadir secciones o funcionalidades al sitio actual'];
var PLATFORMS = ['WordPress', 'Wix', 'Squarespace', 'Shopify', 'Webflow', 'Desarrollo a medida', 'No lo sé', 'Otro'];
var ACCESS = [YES, NO, 'No lo sé'];

var ID_FULL = 'Sí, completa';
var ID_UPDATE = 'Sí, pero necesita actualizarse';
var ID_NONE = 'No, hay que crearla';
var IDENTITY = [ID_FULL, ID_UPDATE, ID_NONE];

var CATEGORY = ['Servicios profesionales', 'Tecnología', 'Salud', 'Real Estate / Desarrollo inmobiliario', 'Arquitectura / Construcción', 'Hospitality', 'Retail', 'Alimentos y bebidas', 'Moda / Lifestyle', 'Producto de consumo', 'E-commerce', 'Marca personal', 'Nonprofit', 'Otro'];
var MARKETS = ['Localmente', 'En todo Estados Unidos', 'Latinoamérica', 'Internacionalmente', 'Online / sin mercado geográfico específico', 'Otro'];

var GOALS = ['Generar contactos / leads', 'Vender online', 'Agendar citas o reservas', 'Mostrar portafolio o proyectos', 'Dar credibilidad y presencia institucional', 'Informar y publicar contenido', 'Captar inversionistas', 'Otro'];
var ACTIONS = ['Llenar un formulario', 'Llamar o escribir por WhatsApp', 'Comprar', 'Reservar', 'Descargar un documento', 'Suscribirse', 'Ver proyectos o productos', 'Solicitar una cotización', 'Otro'];

var SELLS_TO = ['Consumidores — B2C', 'Empresas — B2B', 'Ambos', 'Otro'];
var SOURCES = ['Redes sociales', 'Búsqueda en Google', 'Anuncios pagados', 'Referidos / boca a boca', 'Email', 'Eventos o material impreso', 'Otro'];
var DEVICES = ['Mayoría móvil', 'Mayoría desktop', 'Equilibrado', 'No lo sé'];

var PAGES = ['Inicio', 'Sobre nosotros', 'Servicios', 'Productos / tienda', 'Portafolio / proyectos', 'Blog / noticias', 'Testimonios', 'Equipo', 'Preguntas frecuentes', 'Contacto', 'Reservas', 'Landing pages para campañas', 'Otro'];
var SIZES = ['Una sola página (landing)', '2–5 páginas', '6–10 páginas', 'Más de 10 páginas', 'No lo sé'];
var COPY_READY_FULL = 'Sí, listos';
var COPY_READY = [COPY_READY_FULL, 'Parcialmente', 'No, hay que redactarlos'];
var MEDIA_PRO = 'Sí, de calidad profesional';
var MEDIA = [MEDIA_PRO, 'Sí, pero de baja calidad', NO];
var MEDIA_NEEDS = ['Fotografía', 'Vídeo', 'Renders 3D', 'Imágenes generadas con IA', UNSURE];
var LANGUAGES = ['Inglés', 'Español', 'Inglés + Español', 'Otro'];

var F_FORM = 'Formulario de contacto';
var F_SHOP = 'Tienda online con pagos';
var F_BOOKING = 'Reservas / agenda';
var FEATURES = [F_FORM, 'Chat o botón de WhatsApp', F_BOOKING, F_SHOP, 'Catálogo sin compra', 'Cotizador o calculadora', 'Área privada de clientes', 'Blog', 'Newsletter', 'Galería / portafolio', 'Mapa', 'Descarga de documentos', 'Otro'];
var SKU_COUNT = ['1–10', '11–50', '51–200', 'Más de 200'];
var DELIVERY = ['Envío físico', 'Recogida en local', 'Producto digital', 'Servicio'];
var INTEGRATIONS_NONE = 'Ninguna por ahora';
var INTEGRATIONS = ['CRM', 'Email marketing', 'WhatsApp / automatización de mensajes', 'Calendario o sistema de citas', 'Pasarela de pago', 'Google Analytics / Meta Pixel', INTEGRATIONS_NONE, 'Otro'];
var AUTOMATIONS = [YES, NO, 'Quiero saber más'];

var TRAITS = ['Elegante', 'Moderno', 'Sofisticado', 'Premium', 'Cercano', 'Humano', 'Profesional', 'Confiable', 'Innovador', 'Audaz', 'Minimalista', 'Técnico', 'Exclusivo', 'Artesanal', 'Dinámico', 'Juvenil', 'Atemporal', 'Disruptivo', 'Serio', 'Cálido'];
var AXES = [['wx1a', 'wx1b'], ['wx2a', 'wx2b'], ['wx3a', 'wx3b'], ['wx4a', 'wx4b'], ['wx5a', 'wx5b']];
var MOTION = ['Mínimo — sitio estático, rápido y directo', 'Moderado — transiciones suaves y detalles al hacer scroll', 'Alto — experiencia inmersiva (3D, animaciones, scroll narrativo)'];
var FEELINGS = ['Confianza', 'Seguridad', 'Deseo', 'Curiosidad', 'Tranquilidad', 'Exclusividad', 'Inspiración', 'Energía', 'Cercanía', 'Innovación', 'Profesionalismo', 'Otro'];

var DOMAIN = [YES, NO, 'Necesito ayuda para elegirlo'];
var HOSTING = [YES, NO, 'No lo sé', 'Prefiero que Borsoga lo gestione'];
var UPDATER = ['Nosotros mismos', 'Borsoga', 'Todavía no está definido'];
var SEO = ['Prioritario', 'Importante pero no urgente', 'No por ahora'];
var APPROVERS = ['Una persona', 'Dos personas', 'Tres o más personas', 'Un equipo/directiva'];
var BUDGET = [YES, 'Prefiero recibir una propuesta', 'Todavía no está definido'];

var conSitio = function (a) { return !!a.projectType && a.projectType !== SCRATCH; };
var tiene = function (a, campo, v) { return (a[campo] || []).indexOf(v) > -1; };

window.BORSOGA_BRIEF({
  servicio: 'web',
  planes: ['Web-Essential', 'Web-Premium', 'Web-Edition'],
  clave: 'borsoga.cuestionario.dw.v1',
  contador: 'dw_step_counter',
  contadorTope: 'dw_picked',
  subir: 'dw_upload',
  enlace: 'dw_link',
  guardado: 'dw_save_note',
  archivos: ['brandFiles', 'refFiles'],
  contactoCampos: { correo: 'email' },
  final: { titulo: 'dw_final_title', p1: 'dw_final_p1', p2: 'dw_final_p2',
           firma: 'dw_final_sig', resumen: 'dw_sum_title' },

  vacio: {
    company: '', webSocial: '', projectType: '', platform: '', keepWhat: '', painWhat: '', access: '',
    identity: '', identityScope: '', brandLink: '',
    whatDoes: '', products: '', mainProduct: '', category: '', diff: '', competitors: '', markets: [],
    goal: '', actions: [], success: '',
    sellsTo: '', visitor: '', doubts: '', sources: [], devices: '',
    pages: [], structure: '', size: '', copyReady: '', copyScope: '', media: '', mediaNeeds: [],
    alwaysVisible: '', highlight: '', languages: [],
    features: [], forms: '', skuCount: '', delivery: [], platformsSelling: '', booking: '',
    integrations: [], automations: '',
    refsText: '', refsWhy: '', refsNot: '', avoidSites: '',
    personality: [], axes: {}, motion: '', feelings: [], visualElements: '', avoidVisual: '',
    domain: '', hosting: '', updater: '', support: '', seo: '', restrictions: '',
    launchDate: '', launchDateValue: '', whatHappens: '', approvers: '', budget: '', budgetValue: '',
    anythingElse: '', contactName: '', email: '', phone: '', privacy: false, bot: ''
  },

  // Una respuesta que ya no aplica no existe: se borra para que no llegue al
  // resumen ni al estudio.
  poda: function (a) {
    a = Object.assign({}, a);
    if (!conSitio(a)) { a.platform = ''; a.keepWhat = ''; a.painWhat = ''; a.access = ''; }
    if (a.identity !== ID_UPDATE && a.identity !== ID_NONE) a.identityScope = '';
    if (a.copyReady === COPY_READY_FULL || !a.copyReady) a.copyScope = '';
    if (a.media === MEDIA_PRO || !a.media) a.mediaNeeds = [];
    if (!tiene(a, 'features', F_FORM)) a.forms = '';
    if (!tiene(a, 'features', F_SHOP)) { a.skuCount = ''; a.delivery = []; a.platformsSelling = ''; }
    if (!tiene(a, 'features', F_BOOKING)) a.booking = '';
    // "Ninguna por ahora" no convive con integraciones concretas.
    if (tiene(a, 'integrations', INTEGRATIONS_NONE) && a.integrations.length > 1) a.integrations = [INTEGRATIONS_NONE];
    var ax = {};
    AXES.forEach(function (_, i) { if (a.axes && a.axes[i] != null) ax[i] = a.axes[i]; });
    a.axes = ax;
    if (a.launchDate !== YES) { a.launchDateValue = ''; a.whatHappens = ''; }
    if (a.budget !== YES) a.budgetValue = '';
    return a;
  },

  pasos: [
    { titulo: 'dw_s1', preguntas: [
      { f: 'company', q: 'w_company', tipo: 'texto', req: true },
      { f: 'webSocial', q: 'w_webSocial', h: 'wh_webSocial', tipo: 'texto', ph: 'borsoga.studio' },
      { f: 'projectType', q: 'w_projectType', tipo: 'cards', ops: PROJECT_TYPES, req: true, col: true },
      { f: 'platform', q: 'w_platform', tipo: 'chips', ops: PLATFORMS, req: true, si: conSitio },
      { f: 'keepWhat', q: 'w_keepWhat', tipo: 'area', si: conSitio },
      { f: 'painWhat', q: 'w_painWhat', tipo: 'area', si: conSitio },
      { f: 'access', q: 'w_access', tipo: 'chips', ops: ACCESS, req: true, si: conSitio },
      { f: 'identity', q: 'w_identity', tipo: 'cards', ops: IDENTITY, req: true },
      { f: 'identityScope', q: 'w_identityScope', tipo: 'chips', ops: YES_NO_UNSURE, req: true,
        si: function (a) { return a.identity === ID_UPDATE || a.identity === ID_NONE; } },
      { f: 'brandFiles', q: 'w_brandFiles', tipo: 'subida', enlace: 'brandLink' }
    ] },

    { titulo: 'dw_s2', preguntas: [
      { f: 'whatDoes', q: 'w_whatDoes', h: 'wh_whatDoes', tipo: 'area', req: true },
      { f: 'products', q: 'w_products', tipo: 'area' },
      { f: 'mainProduct', q: 'w_mainProduct', tipo: 'texto' },
      { f: 'category', q: 'w_category', tipo: 'chips', ops: CATEGORY, req: true },
      { f: 'diff', q: 'w_diff', h: 'wh_diff', tipo: 'area', req: true },
      { f: 'competitors', q: 'w_competitors', h: 'wh_competitors', tipo: 'area' },
      { f: 'markets', q: 'w_markets', tipo: 'checks', ops: MARKETS, req: true }
    ] },

    { titulo: 'dw_s3', preguntas: [
      { f: 'goal', q: 'w_goal', tipo: 'cards', ops: GOALS, req: true },
      { f: 'actions', q: 'w_actions', h: 'wh_actions', tipo: 'tope', ops: ACTIONS, tope: 3, req: true },
      { f: 'success', q: 'w_success', h: 'wh_success', tipo: 'area', req: true }
    ] },

    { titulo: 'dw_s4', preguntas: [
      { f: 'sellsTo', q: 'w_sellsTo', tipo: 'chips', ops: SELLS_TO, req: true },
      { f: 'visitor', q: 'w_visitor', h: 'wh_visitor', tipo: 'area', req: true },
      { f: 'doubts', q: 'w_doubts', tipo: 'area' },
      { f: 'sources', q: 'w_sources', tipo: 'checks', ops: SOURCES, req: true },
      { f: 'devices', q: 'w_devices', tipo: 'chips', ops: DEVICES, req: true }
    ] },

    { titulo: 'dw_s5', preguntas: [
      { f: 'pages', q: 'w_pages', tipo: 'checks', ops: PAGES, req: true },
      { f: 'structure', q: 'w_structure', tipo: 'area' },
      { f: 'size', q: 'w_size', tipo: 'chips', ops: SIZES, req: true },
      { f: 'copyReady', q: 'w_copyReady', tipo: 'chips', ops: COPY_READY, req: true },
      { f: 'copyScope', q: 'w_copyScope', tipo: 'chips', ops: YES_NO_UNSURE, req: true,
        si: function (a) { return !!a.copyReady && a.copyReady !== COPY_READY_FULL; } },
      { f: 'media', q: 'w_media', tipo: 'cards', ops: MEDIA, req: true },
      { f: 'mediaNeeds', q: 'w_mediaNeeds', tipo: 'chipchecks', ops: MEDIA_NEEDS, req: true,
        si: function (a) { return !!a.media && a.media !== MEDIA_PRO; } },
      { f: 'alwaysVisible', q: 'w_alwaysVisible', h: 'wh_alwaysVisible', tipo: 'area' },
      { f: 'highlight', q: 'w_highlight', tipo: 'area' },
      { f: 'languages', q: 'w_languages', tipo: 'chipchecks', ops: LANGUAGES, req: true }
    ] },

    { titulo: 'dw_s6', preguntas: [
      { f: 'features', q: 'w_features', tipo: 'checks', ops: FEATURES, req: true },
      { f: 'forms', q: 'w_forms', tipo: 'area', req: true,
        si: function (a) { return tiene(a, 'features', F_FORM); } },
      { f: 'skuCount', q: 'w_skuCount', tipo: 'chips', ops: SKU_COUNT, req: true,
        si: function (a) { return tiene(a, 'features', F_SHOP); } },
      { f: 'delivery', q: 'w_delivery', tipo: 'chipchecks', ops: DELIVERY, req: true,
        si: function (a) { return tiene(a, 'features', F_SHOP); } },
      { f: 'platformsSelling', q: 'w_platformsSelling', tipo: 'texto',
        si: function (a) { return tiene(a, 'features', F_SHOP); } },
      { f: 'booking', q: 'w_booking', tipo: 'area', req: true,
        si: function (a) { return tiene(a, 'features', F_BOOKING); } },
      { f: 'integrations', q: 'w_integrations', tipo: 'checks', ops: INTEGRATIONS,
        solo: INTEGRATIONS_NONE, req: true },
      { f: 'automations', q: 'w_automations', h: 'wh_automations', tipo: 'chips', ops: AUTOMATIONS, req: true }
    ] },

    { titulo: 'dw_s7', preguntas: [
      // Vale con enlaces escritos o con capturas subidas: pedir las dos cosas
      // dejaría fuera a quien solo tiene una.
      { f: 'refFiles', q: 'w_refs', h: 'wh_refs', tipo: 'subida', area: 'refsText',
        req: function (a, F) { return !!String(a.refsText).trim() || F.refFiles.length > 0; } },
      { f: 'refsWhy', q: 'w_refsWhy', h: 'wh_refsWhy', tipo: 'area', req: true },
      { f: 'refsNot', q: 'w_refsNot', tipo: 'area' },
      { f: 'avoidSites', q: 'w_avoidSites', tipo: 'area' },
      { f: 'personality', q: 'w_personality', h: 'wh_personality', tipo: 'tope', ops: TRAITS, tope: 5, req: true },
      { f: 'axes', q: 'w_axes', tipo: 'ejes', ejes: AXES, a11y: 'wx_a11y', req: true },
      { f: 'motion', q: 'w_motion', tipo: 'cards', ops: MOTION, req: true, col: true },
      { f: 'feelings', q: 'w_feelings', h: 'wh_feelings', tipo: 'tope', ops: FEELINGS, tope: 3, req: true },
      { f: 'visualElements', q: 'w_visualElements', h: 'wh_visualElements', tipo: 'area' },
      { f: 'avoidVisual', q: 'w_avoidVisual', tipo: 'area' }
    ] },

    { titulo: 'dw_s8', preguntas: [
      { f: 'domain', q: 'w_domain', tipo: 'chips', ops: DOMAIN, req: true },
      { f: 'hosting', q: 'w_hosting', tipo: 'chips', ops: HOSTING, req: true },
      { f: 'updater', q: 'w_updater', tipo: 'chips', ops: UPDATER, req: true },
      { f: 'support', q: 'w_support', tipo: 'chips', ops: YES_NO_UNSURE, req: true },
      { f: 'seo', q: 'w_seo', tipo: 'cards', ops: SEO, req: true },
      { f: 'restrictions', q: 'w_restrictions', h: 'wh_restrictions', tipo: 'area' }
    ] },

    { titulo: 'dw_s9', preguntas: [
      { f: 'launchDate', q: 'w_launchDate', tipo: 'chips', ops: YES_NO, req: true },
      { f: 'launchDateValue', q: 'w_whichDate', tipo: 'fecha', req: true,
        si: function (a) { return a.launchDate === YES; } },
      { f: 'whatHappens', q: 'w_whatHappens', h: 'wh_whatHappens', tipo: 'texto',
        si: function (a) { return a.launchDate === YES; } },
      { f: 'approvers', q: 'w_approvers', tipo: 'cards', ops: APPROVERS, req: true },
      { f: 'budget', q: 'w_budget', tipo: 'chips', ops: BUDGET, req: true },
      { f: 'budgetValue', q: 'w_budgetValue', tipo: 'texto', req: true,
        si: function (a) { return a.budget === YES; } }
    ] },

    { titulo: 'dw_s10', preguntas: [
      { f: 'anythingElse', q: 'w_anythingElse', tipo: 'area' },
      { f: 'contacto', q: 'dw_contact', tipo: 'contacto', req: true,
        nombre: 'contactName', correo: 'email', telefono: 'phone', privacidad: 'privacy',
        lbNombre: 'dw_lb_name', lbCorreo: 'dw_lb_email', lbTelefono: 'dw_lb_phone' }
    ] }
  ],

  resumen: function (a, h) {
    var tr = h.tr, lista = h.lista, raya = '—';
    var val = function (v) { return tr(v) || raya; };
    var filas = [
      ['wsum_company', a.company || raya],
      ['wsum_projectType', val(a.projectType)]
    ];
    if (conSitio(a)) {
      filas.push(['wsum_platform', val(a.platform)]);
      filas.push(['wsum_access', val(a.access)]);
    }
    filas.push(['wsum_identity', val(a.identity) + (a.identityScope ? ' · ' + tr(a.identityScope) : '')]);
    filas.push(['wsum_whatDoes', a.whatDoes || raya]);
    filas.push(['wsum_category', val(a.category)]);
    filas.push(['wsum_diff', a.diff || raya]);
    filas.push(['wsum_markets', lista(a.markets) || raya]);
    filas.push(['wsum_goal', val(a.goal)]);
    filas.push(['wsum_actions', lista(a.actions) || raya]);
    filas.push(['wsum_success', a.success || raya]);
    filas.push(['wsum_sellsTo', val(a.sellsTo)]);
    filas.push(['wsum_sources', lista(a.sources) || raya]);
    filas.push(['wsum_devices', val(a.devices)]);
    filas.push(['wsum_pages', lista(a.pages) || raya]);
    filas.push(['wsum_size', val(a.size)]);
    filas.push(['wsum_copy', val(a.copyReady) + (a.copyScope ? ' · ' + tr(a.copyScope) : '')]);
    filas.push(['wsum_media', val(a.media) + (a.mediaNeeds.length ? ' · ' + lista(a.mediaNeeds) : '')]);
    filas.push(['wsum_languages', lista(a.languages) || raya]);
    filas.push(['wsum_features', lista(a.features) || raya]);
    filas.push(['wsum_integrations', lista(a.integrations) || raya]);
    filas.push(['wsum_automations', val(a.automations)]);
    filas.push(['wsum_personality', lista(a.personality) || raya]);
    filas.push(['wsum_axes', AXES.map(function (ax, i) {
      return a.axes[i] ? h.t(ax[0]) + ' ' + a.axes[i] + '/5 ' + h.t(ax[1]) : '';
    }).filter(Boolean).join(' · ') || raya]);
    filas.push(['wsum_motion', val(a.motion)]);
    filas.push(['wsum_feelings', lista(a.feelings) || raya]);
    filas.push(['wsum_domain', val(a.domain)]);
    filas.push(['wsum_hosting', val(a.hosting)]);
    filas.push(['wsum_updater', val(a.updater)]);
    filas.push(['wsum_seo', val(a.seo)]);
    filas.push(['wsum_launch', a.launchDateValue
      ? a.launchDateValue + (a.whatHappens ? ' · ' + a.whatHappens : '') : val(a.launchDate)]);
    filas.push(['wsum_approvers', val(a.approvers)]);
    filas.push(['wsum_budget', a.budgetValue || val(a.budget)]);
    return filas;
  }
});
})();
