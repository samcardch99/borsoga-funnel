# -*- coding: utf-8 -*-
"""Portada de servicios de Borsoga Studio.

Portada del artboard 'Servicios Borsoga Studio'. Es la página más elaborada del
conjunto: una cortina negra cae sobre el hero al cargar, el logo cambia de
color según el scroll, y el nombre de cada servicio se cruza con su
descripción al pasar por encima.

Dos decisiones propias:

  · La cortina se mide en JS (el negro llega justo al pie del titular y se
    disuelve en el hueco antes del párrafo). Si el JS no corre, no hay cortina
    y el hero se ve en negro sobre blanco: legible, sin depender de nada.
  · **El formulario del diseño no envía a ninguna parte** — su `onSend` solo
    pinta el acuse. Aquí se conecta a /api/submit como servicio `contacto`,
    porque una portada que recoge datos y los tira es peor que no tenerla.
"""
import os
from i18n_load import t
from shell import head, footer, BASE_CSS, bundle_i18n, selector_idioma

_SRC = os.path.dirname(os.path.abspath(__file__))

WRAP = "width:min(100%,1240px);margin:0 auto;padding:0 clamp(20px,4vw,48px)"
BTN = ("border:1px solid #000;padding:20px 34px;min-height:44px;"
       "font-size:12px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;"
       "display:inline-block")

# La marca de Borsoga dibujada a mano para poder animarla por partes: el anillo
# y los dos arcos se trazan con DrawSVG y el punto central se transforma en la
# palomita con MorphSVG. El `d` del centro se escribe ya como palomita, así que
# si el CDN de GSAP no responde la marca se ve igualmente terminada y correcta.
CIRCULO = ("M60,45C68.28,45,75,51.72,75,60C75,68.28,68.28,75,60,75"
           "C51.72,75,45,68.28,45,60C45,51.72,51.72,45,60,45Z")
PALOMITA = "M44.5,59L53.5,68L76.5,45L82,50.5L53.5,79L39,64.5Z"

def rampa(desde, largo, pasos=14):
    """Misma curva que `rampa()` en el script, para que la cortina sin JS
    termine exactamente igual que la medida. Se escribe una vez aquí y una vez
    allí porque el fallback tiene que existir antes de que corra nada."""
    s = []
    for i in range(pasos + 1):
        p = i / pasos
        ss = p * p * p * (p * (p * 6 - 15) + 10)
        s.append(f"rgba(0,0,0,{1 - ss:.3f}) {round(desde + largo * p)}px")
    return ",".join(s)


# Medidas de reserva: el pie del titular y el inicio del párrafo en un
# escritorio corriente. El JS las corrige en cuanto puede medir de verdad.
CORTINA_B, CORTINA_COLA = 430, 190
CORTINA = f"linear-gradient(to bottom,#000 0,#000 {CORTINA_B}px,{rampa(CORTINA_B, CORTINA_COLA)})"

MARCA = f"""<svg id="bs-mark" viewBox="0 0 120 120" fill="none" aria-hidden="true">
<circle id="bs-mk-ring" cx="60" cy="60" r="55" stroke="#fff" stroke-width="1.5" opacity=".55"/>
<path id="bs-mk-l" d="M50.2,23.3A38,38 0 0,0 50.2,96.7" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
<path id="bs-mk-r" d="M69.8,23.3A38,38 0 0,1 69.8,96.7" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
<path id="bs-mk-c" d="{PALOMITA}" fill="#fff"/>
</svg>"""

# Los cuatro llevan a sus propios planes. En el diseño, 02/03/04 abrían el
# formulario de contacto; aquí no, porque las cuatro páginas existen y mandar a
# un formulario a quien pidió ver planes es hacerle dar un rodeo.
# El formulario sigue vivo para el CTA de developers y el de reunión, que sí
# son consultas abiertas sin una página que las responda.
SERVICIOS = [("srv_n1", "srv_name1", "srv_line1", "srv_what1", "/interior-design/"),
             ("srv_n2", "srv_name2", "srv_line2", "srv_what2", "/planes-av/"),
             ("srv_n3", "srv_name3", "srv_line3", "srv_what3", "/diseno-grafico/"),
             ("srv_n4", "srv_name4", "srv_line4", "srv_what4", "/diseno-web/")]

PROOF = [("srv_proof_l1", "srv_proof_d1", "srv_slot_ph1"), ("srv_proof_l2", "srv_proof_d2", "srv_slot_ph2"),
         ("srv_proof_l3", "srv_proof_d3", "srv_slot_ph3"), ("srv_proof_l4", "srv_proof_d4", "srv_slot_ph4")]

CSS = """
@keyframes bs-in { from { opacity:0 } to { opacity:1 } }
@keyframes bs-fall { from { transform:translate3d(0,-100%,0) } to { transform:none } }
#bs-curtain{position:absolute;top:-170px;left:0;right:0;pointer-events:none;z-index:0;overflow:hidden;
height:620px;min-height:clamp(420px,62vw,640px)}
#bs-curtain>div{height:100%;min-height:clamp(420px,62vw,640px);
animation:bs-fall 1.6s cubic-bezier(.16,.86,.22,1) both}
.js .bs-fade{opacity:0}
.js .bs-fade.on{animation:bs-in .9s ease-out both}
.srv-row{border-top:1px solid rgba(0,0,0,.14);padding:clamp(28px,4vw,46px) 0;display:grid;
grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:clamp(20px,3vw,40px);align-items:start}
.srv-head{display:flex;align-items:flex-start;gap:clamp(14px,2vw,22px);cursor:pointer;
-webkit-tap-highlight-color:transparent;background:none;border:none;text-align:left;padding:0;width:100%;font:inherit}
.srv-swap{position:relative;flex:1;min-width:0;align-self:stretch;min-height:clamp(76px,7vw,96px)}
.srv-name,.srv-what{position:absolute;inset:0;margin:0;transition:opacity .3s ease,transform .3s ease}
.srv-name{font-size:clamp(23px,2.9vw,34px);font-weight:600;letter-spacing:-.025em;line-height:1.08;max-width:14ch}
.srv-what{font-size:clamp(15px,1.5vw,18px);font-weight:300;line-height:1.45;letter-spacing:-.01em;
color:rgba(0,0,0,.82);opacity:0;transform:translateY(6px);pointer-events:none}
.srv-row[data-open=true] .srv-name{opacity:0;transform:translateY(-6px);pointer-events:none}
.srv-row[data-open=true] .srv-what{opacity:1;transform:none;pointer-events:auto}
/* Mismo barrido de relleno que las páginas de planes: el color sube desde el
   borde inferior en vez de encenderse de golpe. El ::before va detrás del texto
   con z-index:-1, y el isolation:isolate evita que se cuele por debajo del
   fondo propio del botón. */
.srv-btn,.srv-btn-inv,.srv-btn-dark{position:relative;overflow:hidden;isolation:isolate;
transition:color .3s ease,border-color .3s ease}
.srv-btn::before,.srv-btn-inv::before,.srv-btn-dark::before{content:"";position:absolute;inset:0;z-index:-1;
transform:scaleY(0);transform-origin:50% 100%;transition:transform .38s cubic-bezier(.22,1,.36,1)}
.srv-btn{background:#fff;color:#000}
.srv-btn-inv,.srv-btn-dark{background:#000;color:#fff}
.srv-btn::before{background:#000}
.srv-btn-inv::before{background:#fff}
.srv-btn-dark::before{background:rgba(255,255,255,.16)}
@media (hover:hover){
  .srv-btn:hover::before,.srv-btn-inv:hover::before,.srv-btn-dark:hover::before{transform:scaleY(1)}
  .srv-btn:hover{color:#fff}
  .srv-btn-inv:hover{color:#000}
}
#bs-sent{background:#000;color:#fff;padding:clamp(28px,4vw,40px);display:flex;
flex-direction:column;gap:clamp(16px,2.2vw,22px);align-items:flex-start}
#bs-mark{width:clamp(64px,9vw,84px);height:auto;flex:none;overflow:visible}
.js #bs-mark{opacity:0}
#bs-mark.on{opacity:1;transition:opacity .35s ease}
#bs-modal{position:fixed;inset:0;z-index:60;background:rgba(0,0,0,.62);display:flex;
align-items:flex-start;justify-content:center;padding:clamp(16px,4vw,56px);overflow:auto}
#bs-modal[hidden]{display:none}
.bs-in{border:1px solid rgba(0,0,0,.2);background:#fff;padding:16px;font-size:15px;width:100%;font-family:inherit}
.bs-in:focus{outline:none;border-color:#000}
@media (prefers-reduced-motion:reduce){
  #bs-curtain>div,.js .bs-fade.on{animation:none}
  .js .bs-fade{opacity:1}
  .srv-name,.srv-what{transition:none}
}
"""


SCRIPT = """
<script>
(function () {
  'use strict';
  var T = (window.BORSOGA_I18N || {})[window.BORSOGA_LANG || 'es'] || { ui: {}, msg: {} };
  var t = function (k) { return (T.ui && T.ui[k]) || (T.msg && T.msg[k]) || ''; };
  var EMAIL_RE = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/;
  var TYPOS = {'gmial.com':'gmail.com','gmai.com':'gmail.com','gmail.co':'gmail.com','gmail.con':'gmail.com',
   'gmil.com':'gmail.com','gnail.com':'gmail.com','hotmial.com':'hotmail.com','hotmai.com':'hotmail.com',
   'hotmail.co':'hotmail.com','yahooo.com':'yahoo.com','yaho.com':'yahoo.com','outlok.com':'outlook.com',
   'outlook.co':'outlook.com','icoud.com':'icloud.com'};
  var sug = function (e) { var p = String(e||'').split('@');
    var f = p.length > 1 ? TYPOS[p[1].trim().toLowerCase()] : null; return f ? p[0] + '@' + f : ''; };
  var fill = function (s, v) { return String(s||'').replace(/\\{(\\w+)\\}/g, function (m,k) { return v[k]!=null?v[k]:''; }); };
  var $ = function (id) { return document.getElementById(id); };

  document.documentElement.classList.add('js');
  [].forEach.call(document.querySelectorAll('.bs-fade'), function (el) { el.classList.add('on'); });

  // ---------- cortina: el negro llega al pie del titular y se disuelve antes
  // del párrafo. Se mide en vez de fijarse porque el titular reflowea con el
  // ancho y con la carga de la tipografía.
  var curtain = $('bs-curtain'), h1 = $('bs-h1'), hero = $('bs-hero');
  var lastT = 0, lastB = 0;

  // El final del degradado se traza con smootherstep en vez de tres paradas
  // sueltas. La curva entra y sale plana, así que no se ve la costura donde
  // acaba el negro ni el borde donde el degradado toca el blanco: las dos
  // uniones eran justo lo que hacía que el acabado se notara duro. Se muestrea
  // en 14 paradas, suficientes para que no aparezcan bandas en pantallas de 8
  // bits, y la cola se alarga por debajo del párrafo —el último 3% de negro
  // repartido en 80px es lo que hace que el remate se lea suave.
  function rampa(desde, largo) {
    var s = [];
    for (var i = 0; i <= 14; i++) {
      var p = i / 14, ss = p * p * p * (p * (p * 6 - 15) + 10);
      s.push('rgba(0,0,0,' + (1 - ss).toFixed(3) + ') ' +
             Math.round(desde + largo * p) + 'px');
    }
    return s.join(',');
  }
  function medir() {
    if (!curtain || !hero) return;
    var cero = curtain.getBoundingClientRect().top;
    var total = Math.round(hero.getBoundingClientRect().top - cero);
    var negro = h1 ? Math.round(h1.getBoundingClientRect().bottom - cero + 14) : Math.round(total * 0.72);
    if (total > 300 && (total !== lastT || negro !== lastB)) {
      lastT = total; lastB = negro;
      var b = Math.min(negro, Math.round(total * 0.86));
      var cola = total - b;
      curtain.style.height = (b + cola) + 'px';
      curtain.firstElementChild.style.background =
        'linear-gradient(to bottom,#000 0,#000 ' + b + 'px,' + rampa(b, cola) + ')';
    }
  }
  addEventListener('resize', medir);
  medir(); setTimeout(medir, 400);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(medir);

  // ---------- header: transparente sobre el negro, blanco al bajar
  var header = $('bs-header'), lb = $('bs-logo-b'), lw = $('bs-logo-w'),
      lang = $('bs-lang'), arriba = null;
  function scroll() {
    var top = (scrollY || 0) < 40;
    if (top === arriba) return;
    arriba = top;
    header.style.background = top ? 'transparent' : '#fff';
    header.style.borderBottomColor = top ? 'rgba(255,255,255,.14)' : 'rgba(0,0,0,.12)';
    lb.style.opacity = top ? '0' : '1';
    lw.style.opacity = top ? '1' : '0';
    if (lang) lang.style.color = top ? '#fff' : '#000';
  }
  addEventListener('scroll', scroll, { passive: true });
  scroll();

  // ---------- servicios: el nombre se cruza con su descripción
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-toggle]');
    if (!b) return;
    var fila = b.closest('.srv-row');
    fila.dataset.open = fila.dataset.open === 'true' ? 'false' : 'true';
  });
  [].forEach.call(document.querySelectorAll('.srv-row'), function (fila) {
    fila.addEventListener('mouseenter', function () { fila.dataset.open = 'true'; });
    fila.addEventListener('mouseleave', function () { fila.dataset.open = 'false'; });
  });

  // ---------- formulario
  var modal = $('bs-modal'), servicio = '';
  function etiqueta(s) {
    if (s === 'developer') return t('srv_service_developer');
    if (s === 'meeting') return t('srv_meet_subject');
    return t(s);
  }
  function abrir(s) {
    servicio = s || '';
    $('bs-svc-l').textContent = etiqueta(servicio);
    $('bs-svc').hidden = !servicio;
    if (servicio === 'meeting') {
      var p = modal.querySelector('[name=project]');
      if (!p.value) p.value = t('srv_meet_subject');
    }
    $('bs-form').hidden = false; $('bs-sent').hidden = true; $('bs-err').hidden = true;
    hecho = false; $('bs-mark').classList.remove('on');
    precargar();
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    var n = modal.querySelector('[name=name]'); if (n) n.focus();
  }
  function cerrar() { modal.hidden = true; document.body.style.overflow = ''; }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-form]');
    if (b) { e.preventDefault(); return abrir(b.dataset.form); }
    if (e.target === modal || e.target.closest('#bs-close')) return cerrar();
    if (e.target.closest('#bs-fix')) {
      var el = modal.querySelector('[name=email]');
      el.value = sug(el.value); return revisar();
    }
  });
  addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) cerrar(); });

  function datos() {
    var o = {};
    [].forEach.call(modal.querySelectorAll('[name]'), function (i) { o[i.name] = i.value.trim(); });
    return o;
  }
  function revisar() {
    var f = datos(), s = sug(f.email);
    $('bs-bad').hidden = !(f.email && !EMAIL_RE.test(f.email));
    $('bs-sug').hidden = !s;
    if (s) $('bs-sug-t').textContent = fill(t('srv_did_you_mean'), { email: s });
  }
  modal.addEventListener('input', revisar);


  // ---------- acuse: la marca de Borsoga se traza y el punto central se
  // convierte en palomita. GSAP y sus dos plugins se piden al abrir el
  // formulario, no al cargar la página: quien nunca lo abre no paga tres
  // peticiones, y quien lo abre tarda en rellenarlo más de lo que tardan en
  // llegar. Si el CDN falla la marca se muestra ya terminada —por eso el `d`
  // del centro se escribe como palomita en el HTML y no como círculo.
  var CDN = 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/';
  var CIRCULO = '__CIRCULO__', PALOMITA = '__PALOMITA__';
  var listo = null, espera = [], hecho = false;   // null = sin pedir, false = no hay GSAP

  function guion(srcs, cb) {
    var i = 0;
    (function sig() {
      if (i >= srcs.length) return cb();
      var e = document.createElement('script');
      e.src = CDN + srcs[i++];
      e.onload = sig;
      e.onerror = cb;            // si uno cae, se resuelve sin GSAP y se acabó
      document.head.appendChild(e);
    })();
  }
  function precargar() {
    if (listo !== null) return;
    listo = 'pidiendo';
    guion(['gsap.min.js', 'MorphSVGPlugin.min.js', 'DrawSVGPlugin.min.js'], function () {
      listo = !!(window.gsap && window.MorphSVGPlugin && window.DrawSVGPlugin);
      if (listo) gsap.registerPlugin(MorphSVGPlugin, DrawSVGPlugin);
      espera.splice(0).forEach(function (f) { f(); });
    });
  }
  function mostrarMarca() { hecho = true; $('bs-mark').classList.add('on'); }

  function animarMarca() {
    if (hecho) return;
    if (matchMedia('(prefers-reduced-motion:reduce)').matches || listo === false)
      return mostrarMarca();
    if (listo !== true) {                       // todavía en vuelo: se espera
      espera.push(animarMarca); precargar();
      return setTimeout(function () { if (!hecho) mostrarMarca(); }, 900);
    }
    mostrarMarca();
    gsap.timeline()
      .set('#bs-mk-c', { morphSVG: CIRCULO, scale: 0, transformOrigin: '50% 50%' })
      .from('#bs-sent', { autoAlpha: 0, y: 12, duration: .5, ease: 'power2.out' })
      .fromTo('#bs-mk-ring', { drawSVG: '50% 50%' },
              { drawSVG: '0% 100%', duration: 1.05, ease: 'power2.inOut' }, .1)
      .fromTo(['#bs-mk-l', '#bs-mk-r'], { drawSVG: '50% 50%' },
              { drawSVG: '0% 100%', duration: .8, ease: 'power2.out', stagger: .1 }, .2)
      .to('#bs-mk-c', { scale: 1, duration: .5, ease: 'back.out(2.2)' }, .6)
      .to('#bs-mk-c', { morphSVG: PALOMITA, duration: .55, ease: 'power2.inOut' }, 1.1)
      .from(['#bs-sent-t', '#bs-sent-s'],
            { autoAlpha: 0, y: 10, duration: .55, stagger: .1, ease: 'power2.out' }, .8);
  }
  function acusar(email) {
    $('bs-form').hidden = true;
    $('bs-sent').hidden = false;
    $('bs-sent-t').textContent = t('srv_sent_title');
    $('bs-sent-s').textContent = fill(t('srv_sent_sub'), { email: email });
    animarMarca();
  }

  $('bs-send').addEventListener('click', function () {
    var f = datos(), falta = [];
    if (!f.name) falta.push(t('f_name'));
    if (!EMAIL_RE.test(f.email)) falta.push(t('f_email'));
    if (!f.phone) falta.push(t('f_phone'));
    if (!f.project) falta.push(t('f_project'));
    if (falta.length) {
      $('bs-err').hidden = false;
      $('bs-err').textContent = t('err_missing') + ' ' + falta.join(', ') + '.';
      return revisar();
    }
    if (f.bot) return acusar(f.email);   // trampa para robots: acuse falso

    $('bs-err').hidden = true;
    var btn = $('bs-send'), original = btn.textContent;
    btn.disabled = true; btn.textContent = t('sending');
    fetch('/api/submit/', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        service: 'contacto',
        answers: { name: f.name, email: f.email, phone: f.phone, project: f.project,
                   servicio: etiqueta(servicio) || 'Portada de servicios',
                   servicioClave: servicio, privacy: true },
        derived: { origen: 'servicios' }, files: []
      })
    })
      .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
      .then(function (j) {
        btn.disabled = false; btn.textContent = original;
        if (!j || !j.ok) {
          $('bs-err').hidden = false;
          $('bs-err').textContent = (j && j.error) || t('err_send');
          return;
        }
        acusar(f.email);
      })
      .catch(function () {
        btn.disabled = false; btn.textContent = original;
        $('bs-err').hidden = false;
        $('bs-err').textContent = t('err_net');
      });
  });

  // Los CTA de otras páginas abren el formulario con el asunto ya puesto.
  try {
    var q = new URLSearchParams(location.search).get('form');
    if (q) abrir(q);
  } catch (e) {}
})();
</script>
"""

# Las dos siluetas viven en Python (el HTML necesita la palomita como estado
# de reposo) y se inyectan en el script para que MorphSVG parta del círculo.
SCRIPT = SCRIPT.replace("__CIRCULO__", CIRCULO).replace("__PALOMITA__", PALOMITA)


def page():
    h = head(t("meta_t_servicios"),
             t("srv_authorship")[:155], "/")
    h = h.replace("</head>", f"<style>{CSS}</style>\n{bundle_i18n(('ui', 'msg'))}\n</head>")

    filas = ""
    for i, (n, name, line, what, destino) in enumerate(SERVICIOS):
        cta = (f'<a href="{destino}" class="srv-btn" style="{BTN}">'
               f'{t("srv_cta_plans")}</a>')
        filas += (f'<div class="srv-row" data-open="false">'
                  f'<button type="button" class="srv-head" data-toggle="{i}">'
                  f'<span style="display:flex;align-items:center;gap:11px;flex:none">'
                  f'<span style="width:15px;height:15px;border:1.5px solid #000;border-radius:50%;flex:none"></span>'
                  f'<span style="font-size:clamp(30px,3.6vw,44px);font-weight:600;letter-spacing:-.04em;'
                  f'line-height:.9">{t(n)}</span></span>'
                  f'<span class="srv-swap"><h2 class="srv-name">{t(name)}</h2>'
                  f'<p class="srv-what">{t(what)}</p></span></button>'
                  f'<div style="display:flex;flex-direction:column;gap:clamp(20px,2.6vw,28px);align-items:flex-start">'
                  f'<p style="margin:0;font-size:clamp(16px,1.6vw,19px);font-weight:300;line-height:1.5;'
                  f'color:rgba(0,0,0,.72);max-width:38ch">{t(line)}</p>{cta}</div></div>')

    prueba = "".join(
        f'<div style="display:flex;flex-direction:column;gap:14px">'
        f'<div style="width:100%;aspect-ratio:4/3;background:rgba(0,0,0,.04);display:flex;'
        f'align-items:center;justify-content:center;text-align:center;padding:16px;font-size:12px;'
        f'letter-spacing:.08em;text-transform:uppercase;color:rgba(0,0,0,.32)">{t(ph)}</div>'
        f'<div style="display:flex;flex-direction:column;gap:6px">'
        f'<div style="font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase">{t(lb)}</div>'
        f'<div style="font-size:14px;line-height:1.5;color:rgba(0,0,0,.6)">{t(d)}</div></div></div>'
        for lb, d, ph in PROOF)

    h += f"""<div style="position:relative;min-height:100vh">
<div id="bs-curtain" aria-hidden="true"><div style="background:{CORTINA}"></div></div>

<header id="bs-header" style="position:sticky;top:0;z-index:30;transition:background .35s ease,border-color .35s ease;background:transparent;border-bottom:1px solid rgba(255,255,255,.14)">
<div style="{WRAP};height:68px;display:flex;align-items:center;justify-content:space-between;gap:20px">
<a href="/" style="position:relative;width:132px;flex:none" aria-label="Borsoga Studio">
<img src="/assets/logo-negro.png" alt="Borsoga" width="1629" height="333" id="bs-logo-b" style="width:132px;height:auto;display:block;transition:opacity .35s ease;opacity:0">
<img src="/assets/logo-blanco.png" alt="" width="1629" height="333" id="bs-logo-w" aria-hidden="true" style="position:absolute;top:0;left:0;width:132px;height:auto;display:block;transition:opacity .35s ease;opacity:1">
</a>
{selector_idioma(color="#fff", ident="bs-lang")}
</div>
</header>

<main style="{WRAP}">
<section style="padding:clamp(44px,8vw,96px) 0 clamp(26px,4vw,40px);display:flex;flex-direction:column;gap:clamp(18px,2.6vw,26px)">
<div class="bs-fade" style="animation-delay:.65s;position:relative;z-index:1;font-size:11px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.6)">{t("srv_eyebrow")}</div>
<h1 id="bs-h1" class="bs-fade" style="animation-delay:.78s;position:relative;z-index:1;margin:0;color:#fff;font-size:clamp(26px,3.6vw,42px);font-weight:400;letter-spacing:-.02em;line-height:1.28;max-width:34ch">{t("srv_title")}</h1>
<p id="bs-hero" class="bs-fade" style="animation-delay:.88s;position:relative;z-index:1;font-size:clamp(16px,1.6vw,19px);font-weight:300;line-height:1.55;color:rgba(0,0,0,.6);max-width:52ch;margin-top:clamp(88px,9vw,140px)">{t("srv_authorship")}</p>
</section>

<div class="bs-fade" style="animation-delay:.95s;position:relative;z-index:1;border-top:1px solid rgba(0,0,0,.14);padding-top:16px;font-size:13px;line-height:1.6;color:rgba(0,0,0,.62);max-width:60ch">{t("srv_sequence")}</div>

<section style="padding-top:clamp(8px,1.6vw,16px)">{filas}</section>
</main>

<section style="background:#000;color:#fff">
<div style="{WRAP};padding-top:clamp(36px,6vw,76px);padding-bottom:clamp(36px,6vw,76px);display:flex;flex-direction:column;gap:clamp(20px,2.8vw,30px);align-items:flex-start">
<div style="font-size:11px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.5)">{t("srv_form_eyebrow")}</div>
<h2 style="margin:0;font-size:clamp(26px,3.8vw,44px);font-weight:600;letter-spacing:-.03em;line-height:1.04;max-width:24ch">{t("srv_dev_title")}</h2>
<p style="margin:0;font-size:clamp(16px,1.7vw,20px);font-weight:300;line-height:1.5;color:rgba(255,255,255,.68);max-width:46ch">{t("srv_form_lead")}</p>
<button type="button" class="srv-btn-inv" data-form="developer" style="border:1px solid #fff;padding:20px 34px;min-height:44px;font-size:12px;font-weight:600;letter-spacing:.12em;text-transform:uppercase">{t("srv_dev_cta")}</button>
</div>
</section>

<div style="{WRAP}">
<section id="prueba" style="scroll-margin-top:80px;padding:clamp(44px,7vw,88px) 0 clamp(32px,5vw,56px);display:flex;flex-direction:column;gap:clamp(24px,3.4vw,36px)">
<div style="display:flex;flex-direction:column;gap:14px">
<div style="font-size:11px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:rgba(0,0,0,.62)">{t("srv_proof_eyebrow")}</div>
<h2 style="margin:0;font-size:clamp(24px,3.4vw,40px);font-weight:600;letter-spacing:-.03em;line-height:1.06;max-width:22ch">{t("srv_proof_title")}</h2>
<p style="margin:0;font-size:clamp(16px,1.6vw,19px);font-weight:300;line-height:1.55;color:rgba(0,0,0,.65);max-width:52ch">{t("srv_proof_lead")}</p>
<div style="font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:rgba(0,0,0,.62)">{t("srv_proof_credit")}</div>
</div>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,max(46%,230px)),1fr));gap:clamp(14px,2vw,20px)">{prueba}</div>
</section>

<section style="border-top:1px solid rgba(0,0,0,.14);padding:clamp(44px,7vw,88px) 0 clamp(56px,9vw,112px);display:flex;flex-direction:column;gap:clamp(18px,2.4vw,24px);align-items:flex-start">
<div style="font-size:11px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:rgba(0,0,0,.62)">{t("srv_lost_q")}</div>
<h2 style="margin:0;font-size:clamp(28px,4.2vw,48px);font-weight:600;letter-spacing:-.03em;line-height:1.04;max-width:24ch">{t("srv_meet_title")}</h2>
<p style="margin:0;font-size:clamp(16px,1.7vw,20px);font-weight:300;line-height:1.5;color:rgba(0,0,0,.65);max-width:44ch">{t("srv_meet_sub")}</p>
<button type="button" class="srv-btn-dark" data-form="meeting" style="border:1px solid #000;padding:20px 34px;min-height:44px;font-size:12px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;margin-top:clamp(6px,1vw,10px)">{t("srv_meet_cta")}</button>
</section>
</div>

<footer style="border-top:1px solid rgba(0,0,0,.12)">
<div style="{WRAP};padding-top:22px;padding-bottom:22px;display:flex;flex-wrap:wrap;gap:16px;align-items:center;justify-content:space-between">
<span style="font-size:11px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:rgba(0,0,0,.62)">{t("srv_footer")}</span>
<a href="/politica-de-privacidad/" style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:rgba(0,0,0,.45)">{t("chrome_privacy")}</a>
</div>
</footer>

<div id="bs-modal" hidden role="dialog" aria-modal="true" aria-labelledby="bs-modal-t">
<div style="background:#fff;color:#000;width:min(100%,600px);border:1px solid #000;padding:clamp(24px,4vw,40px);display:flex;flex-direction:column;gap:clamp(20px,2.6vw,28px)">
<div style="display:flex;gap:20px;align-items:flex-start;justify-content:space-between">
<h2 id="bs-modal-t" style="margin:0;font-size:clamp(24px,3.2vw,34px);font-weight:600;letter-spacing:-.03em;line-height:1.06;max-width:20ch">{t("srv_form_title")}</h2>
<button type="button" id="bs-close" style="background:transparent;border:none;padding:12px 4px;min-height:44px;font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:rgba(0,0,0,.62);flex:none">{t("srv_close")}</button>
</div>
<div id="bs-svc" hidden style="border-top:1px solid rgba(0,0,0,.14);border-bottom:1px solid rgba(0,0,0,.14);padding:14px 0;display:flex;flex-wrap:wrap;gap:6px 16px;align-items:baseline">
<div style="font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:rgba(0,0,0,.62)">{t("srv_form_service")}</div>
<div id="bs-svc-l" style="font-size:16px;font-weight:500;line-height:1.4"></div>
</div>
<div id="bs-form" style="display:flex;flex-direction:column;gap:clamp(16px,2.2vw,22px)">
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px">
<input class="bs-in" type="text" name="name" placeholder="{t("srv_ph_name")}">
<input class="bs-in" type="email" name="email" placeholder="{t("srv_ph_email")}" autocomplete="email" inputmode="email" spellcheck="false">
<input class="bs-in" type="tel" name="phone" placeholder="{t("srv_ph_phone")}">
</div>
<div id="bs-bad" hidden style="font-size:13px;line-height:1.55;color:rgba(0,0,0,.6)">{t("srv_email_bad")}</div>
<div id="bs-sug" hidden style="border:1px solid #000;padding:14px 16px;display:flex;flex-wrap:wrap;gap:14px;align-items:center">
<span id="bs-sug-t" style="font-size:15px;line-height:1.45"></span>
<button type="button" id="bs-fix" style="background:#000;color:#fff;border:1px solid #000;padding:15px 24px;min-height:44px;font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;flex:none">{t("srv_fix")}</button>
</div>
<textarea class="bs-in" name="project" rows="4" placeholder="{t("srv_ph_project")}" style="line-height:1.55;resize:vertical"></textarea>
<input type="text" name="bot" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px">
<div style="display:flex;flex-wrap:wrap;gap:16px;align-items:center">
<button type="button" id="bs-send" style="background:#000;color:#fff;border:1px solid #000;padding:15px 24px;min-height:44px;font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase">{t("srv_form_send")}</button>
<span style="font-size:13px;line-height:1.5;color:rgba(0,0,0,.55);max-width:34ch">{t("srv_form_note")}</span>
</div>
<p id="bs-err" hidden style="margin:0;font-size:14px;color:#b42318;border-left:2px solid #b42318;padding-left:12px"></p>
</div>
<div id="bs-sent" hidden>{MARCA}<div style="display:flex;flex-direction:column;gap:10px"><div id="bs-sent-t" style="font-size:clamp(25px,3.3vw,34px);font-weight:600;letter-spacing:-.03em;line-height:1.05"></div><div id="bs-sent-s" style="font-size:17px;font-weight:300;line-height:1.55;color:rgba(255,255,255,.7);max-width:34ch"></div></div></div>
</div>
</div>
</div>
{SCRIPT}
"""
    return h + footer().replace("</main>\n", "").replace(
        '<footer style="background:#000;color:#fff;border-top:1px solid rgba(255,255,255,.16)">', "<!--")\
        .replace("</footer>\n</body>", "-->\n</body>")
