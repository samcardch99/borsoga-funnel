# -*- coding: utf-8 -*-
"""Las dos páginas de cuestionario: diseño web y diseño gráfico.

Comparten shell, CSS y motor (`brief.js`); lo único que cambia es el fichero de
preguntas y el diccionario que se embebe. La estructura de la página —cabecera
pegajosa, barra de pasos, barra inferior fija— es la misma de los dos
configuradores, así que se reutiliza `QUIZ_CSS` en vez de copiarlo. La barra
inferior sí es propia: en móvil el diseño la reparte en tres filas y conserva el
texto de los botones, y la de los configuradores hace otra cosa.

Lo que sí es propio de estos dos es el registro visual del artboard: esquinas
redondeadas, selección en negro pleno y objetivos táctiles de 44 px. Va como
capa encima, no tocando `QUIZ_CSS`, que comparten con interiorismo y AV.
"""
import os

from i18n_load import t
from quiz import QUIZ_CSS
from shell import bundle_extra, bundle_i18n, footer, head

_SRC = os.path.dirname(os.path.abspath(__file__))

BRIEF_CSS = """
.q-main{padding-bottom:calc(150px + env(safe-area-inset-bottom,0px))}
.q-group{margin-bottom:clamp(34px,4.6vw,50px)}
.q-head{display:flex;flex-wrap:wrap;gap:8px 16px;align-items:baseline;justify-content:space-between}
.q-q{font-size:18px;font-weight:500;line-height:1.4;margin:0}
.q-tag{font-size:10px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;
color:rgba(0,0,0,.62);flex:none}
.q-hint{margin:6px 0 0;max-width:64ch}
.q-head+.q-hint{margin-bottom:0}
.q-group .q-opts,.q-group .q-grid,.q-group .q-axes,.q-group .q-drop,.q-group .q-fields,
.q-group>.q-in{margin-top:16px}
.q-grid{grid-template-columns:repeat(auto-fit,minmax(280px,1fr))}
.q-grid.q-col{grid-template-columns:1fr}
.q-card,.q-chip{border-radius:16px;color:rgba(0,0,0,.62)}
.q-card{min-height:64px}
.q-chip{min-height:52px;display:inline-flex;align-items:center;gap:0}
.q-chip-box{gap:11px}
.q-card[aria-pressed=true],.q-chip[aria-pressed=true]{background:#000;color:#fff;border-color:#000}
.q-card[aria-pressed=true] .q-radio{border:1.5px solid #fff;background:#fff}
.q-card[aria-pressed=true] .q-box,.q-chip[aria-pressed=true] .q-box{background:#fff;border-color:#fff}
.q-box{border-radius:6px}
.q-chip.q-off{color:rgba(0,0,0,.3);border-color:rgba(0,0,0,.08);cursor:default}
.q-in{border-radius:999px;padding:16px 20px}
.q-in-corto{max-width:480px}
.q-area{border-radius:18px;padding:16px;line-height:1.55;max-width:640px;resize:vertical;display:block}
.q-fields{max-width:760px}
.q-campo{display:flex;flex-direction:column;gap:7px}
.q-campo-t{font-size:13px;font-weight:500;line-height:1.4}
.q-drop{border-radius:16px;max-width:640px}
.q-drop-ring{width:40px;height:40px;flex:none;border:1.5px solid #000;border-radius:50%;
box-shadow:inset 0 0 0 11.5px #fff,inset 0 0 0 13px #000}
.q-file{align-items:center;justify-content:space-between;max-width:640px;
border-bottom:1px solid rgba(0,0,0,.08)}
.q-x{background:none;border:none;font-size:18px;line-height:1;color:rgba(0,0,0,.5);
padding:6px 10px;cursor:pointer}
.q-axes{max-width:680px}
.q-ax{display:flex;flex-wrap:wrap;align-items:center;gap:8px 18px;padding:14px 0;
border-bottom:1px solid rgba(0,0,0,.09)}
.q-ax-lado{font-size:15px;line-height:1.35;flex:1 1 90px;min-width:0}
.q-ax-der{text-align:right}
.q-ax-puntos{display:flex;align-items:center;gap:4px;flex:none}
.q-ax-p{width:44px;height:44px;background:none;border:none;padding:0;cursor:pointer;
display:flex;align-items:center;justify-content:center;flex:none}
.q-ax-p span{width:18px;height:18px;border-radius:50%;border:1.5px solid rgba(0,0,0,.26);display:block}
.q-ax-p[aria-pressed=true] span{background:#000;border-color:#000}
.q-priv{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-top:24px}
.q-priv-box{width:44px;height:44px;border-radius:12px;border:1px solid rgba(0,0,0,.28);
background:#fff;padding:0;flex:none;cursor:pointer}
.q-priv-box[aria-pressed=true]{background:#000;border-color:#000;
box-shadow:inset 0 0 0 13px #000,inset 0 0 0 14px #fff}
.q-priv span{font-size:15px;line-height:1.5}
.q-priv a{border-bottom:1px solid}
.q-bot{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}
.q-volver{display:inline-flex;align-items:center;gap:9px;border:1px solid rgba(0,0,0,.2);
border-radius:999px;padding:11px 18px;min-height:44px;font-size:11px;font-weight:600;
letter-spacing:.12em;text-transform:uppercase}
@media (hover:hover){.q-volver:hover{background:#000;color:#fff;border-color:#000}}
.q-paso{margin-bottom:clamp(30px,4vw,48px)}
.q-paso-n{font-size:11px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;
color:rgba(0,0,0,.62);margin:0 0 10px}
.q-paso-t{margin:0;font-size:clamp(30px,4.6vw,52px);font-weight:600;letter-spacing:-.035em;
line-height:1.02;max-width:22ch}
.q-fin{border:1px solid rgba(0,0,0,.16);border-radius:16px}
.q-fin-caja{background:#000;color:#fff;border-radius:16px;padding:clamp(36px,6vw,72px)}
.q-fin-caja h2{margin:0;font-size:clamp(38px,6vw,74px);font-weight:600;letter-spacing:-.04em;line-height:1}
.q-fin-1{margin:clamp(26px,3.6vw,38px) 0 0;font-size:clamp(18px,1.9vw,23px);line-height:1.45;max-width:44ch}
.q-fin-2{margin:clamp(18px,2.2vw,26px) 0 0;font-size:17px;font-weight:300;line-height:1.6;
color:rgba(255,255,255,.72);max-width:56ch}
.q-fin-firma{margin-top:clamp(30px,4.4vw,48px);padding-top:clamp(20px,2.6vw,28px);
border-top:1px solid rgba(255,255,255,.28);font-size:11px;font-weight:600;letter-spacing:.2em;
text-transform:uppercase;color:rgba(255,255,255,.6)}
.q-fin-sub{padding:clamp(26px,4vw,44px) clamp(26px,4vw,44px) 0;font-size:11px;font-weight:600;
letter-spacing:.18em;text-transform:uppercase;color:rgba(0,0,0,.62)}
.q-fin .q-sum{margin:0;padding:clamp(18px,2.4vw,26px) clamp(26px,4vw,44px) clamp(26px,4vw,44px);
gap:clamp(12px,1.4vw,18px);background:transparent}
.q-fin .q-sum div{border-radius:16px}
.q-invalid .q-card[aria-pressed=true],.q-invalid .q-chip[aria-pressed=true]{
box-shadow:0 0 0 1.5px #b42318!important}
/* La marca girando detrás del contenido, **solo en móvil**. El artboard la
   trae como 28 trazos en línea; aquí vive en `assets/borsoga-fondo.svg` para no
   repetir 14 KB en cada página y para que el navegador la cachee entre los dos
   cuestionarios. El giro lo pone la página porque el tamaño cambia con la
   pantalla. */
.q-fondo{display:none;position:fixed;inset:0;z-index:0;overflow:hidden;
pointer-events:none;opacity:.28}
.q-fondo img{position:absolute;top:50%;left:50%;width:min(150%,560px);height:auto;
transform:translate(-50%,-50%);transform-origin:center;display:block;
animation:bs-spin 120s linear infinite;
/* La marca desborda la pantalla a propósito: el `img{max-width:100%}` de la
   hoja base la encogía hasta caber, y el diseño la quiere recortada. */
max-width:none}
@keyframes bs-spin{to{transform:translate(-50%,-50%) rotate(360deg)}}
@media (prefers-reduced-motion:reduce){.q-fondo img{animation:none}}
/* El contenido va por encima: el fondo es un elemento posicionado y, sin esto,
   taparía el texto en vez de quedarse detrás. Se deja puesto en los dos tamaños
   porque no cuesta nada y evita que reaparezca el problema si el fondo vuelve. */
.q-main,.q-volver-fila{position:relative;z-index:1}
.q-cab{width:min(100%,1080px);margin:0 auto;padding:0 clamp(20px,4vw,40px);height:68px;
display:flex;align-items:center;justify-content:space-between;gap:20px}
.q-cab img{width:132px;height:auto;display:block}
.q-volver-fila{width:min(100%,1080px);margin:0 auto;
padding:clamp(26px,3.6vw,40px) clamp(20px,4vw,40px) 0;display:flex}
.q-saved{font-size:11px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;
color:rgba(0,0,0,.62)}

/* Barra inferior propia. La de los configuradores se queda en una sola fila y
   en móvil colapsa a dos iconos; ésta reparte las mismas piezas en tres filas,
   que es como las coloca el artboard de iPhone. */
.qb-nav{position:fixed;left:0;right:0;bottom:0;z-index:30;background:#fff;
border-top:1px solid rgba(0,0,0,.14)}
.qb-aviso{width:min(100%,1080px);margin:0 auto;padding:12px clamp(20px,4vw,40px) 0;
display:flex;gap:11px;align-items:flex-start;font-size:14px;line-height:1.45;font-weight:500}
.qb-aviso::before{content:"";width:9px;height:9px;border-radius:50%;background:#000;
flex:none;margin-top:6px}
.qb-in{width:min(100%,1080px);margin:0 auto;padding:14px clamp(20px,4vw,40px);
display:flex;align-items:center;gap:18px}
/* El envoltorio de los botones solo existe para el móvil: en escritorio se
   deshace y el orden visual lo fija `order`. */
.qb-botones{display:contents}
#q-back{order:1}
.qb-save{order:2}
.qb-estado{order:3}
#q-next{order:4}
.qb-txt{background:transparent;border:none;font-family:inherit;font-size:11px;font-weight:600;
letter-spacing:.12em;text-transform:uppercase;color:#000;padding:14px 0;min-height:44px;
border-bottom:1px solid #000;cursor:pointer}
.qb-txt:disabled{color:rgba(0,0,0,.22);border-bottom-color:transparent;cursor:default}
.qb-save{font-weight:500;color:rgba(0,0,0,.62);border-bottom:none}
@media (hover:hover){.qb-save:hover{color:#000}}
.qb-estado{display:flex;align-items:center;gap:9px;min-width:0;margin-left:auto}
.qb-meta{font-size:11px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;
color:rgba(0,0,0,.62)}
.q-saved-nav{color:rgba(0,0,0,.42);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
display:none}
.qb-next{background:#000;color:#fff;border:1px solid #000;border-radius:999px;font-family:inherit;
padding:20px 34px;min-height:44px;font-size:12px;font-weight:600;letter-spacing:.12em;
text-transform:uppercase;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;
transition:background .18s ease,color .18s ease}
@media (hover:hover){.qb-next:hover:enabled{background:#fff;color:#000}}
.qb-next:disabled{background:rgba(0,0,0,.08);color:rgba(0,0,0,.34);border-color:transparent;
cursor:default}

/* ---------------------------------------------------------------- móvil
   Medidas del artboard 'Cuestionario Diseno Web iPhone' (402 × 874): márgenes
   de 18 px, cabecera de 56 px, título de paso a 29 px y una sola columna en
   todas las listas de opciones. */
@media (max-width:640px){
  .q-fondo{display:block}
  .q-cab{padding:0 18px;height:56px;gap:12px}
  .q-cab img{width:104px}
  .q-seg{padding:0 18px 12px;gap:2px}
  .q-cab .q-saved{display:none}
  .q-saved-nav{display:inline}
  .q-volver-fila{padding:16px 18px}
  .q-main{padding:0 18px 210px}
  .q-paso{margin:18px 0 30px}
  .q-paso-t{font-size:29px}
  .q-group{margin-bottom:34px}
  .q-grid{grid-template-columns:1fr}
  .q-fields{grid-template-columns:1fr;gap:12px}
  .q-fin{margin-top:18px}
  .q-fin-caja{padding:24px 20px}
  .q-fin-caja h2{font-size:40px}
  .q-fin-1{margin:26px 0 0;font-size:18px}
  .q-fin-2{margin:18px 0 0}
  .q-fin-firma{margin-top:30px;padding-top:20px}
  .q-fin-sub{padding:20px 20px 0}
  .q-fin .q-sum{padding:16px 20px 20px;grid-template-columns:1fr;gap:12px}
  /* Tres filas: el aviso arriba, el paso y "guardar" en medio, y abajo los
     dos botones juntos y centrados, como en el artboard. */
  .qb-aviso{padding:12px 18px 0}
  .qb-in{display:grid;grid-template-columns:1fr auto;align-items:center;gap:6px 12px;
    padding:10px 18px calc(16px + env(safe-area-inset-bottom,0px))}
  .qb-estado{grid-row:1;grid-column:1;margin-left:0}
  .qb-save{grid-row:1;grid-column:2;justify-self:end;font-size:10px;padding:12px 0}
  .qb-meta{font-size:10px}
  .qb-botones{grid-row:2;grid-column:1/-1;display:flex;align-items:stretch;
    justify-content:center;gap:10px;padding-top:6px}
  #q-back{font-size:10px}
  #qb-count{display:inline}
  #q-next{padding:18px 28px}
  /* Los dos extremos del eje y sus cinco puntos no caben en una línea: el
     rótulo de la derecha se salía de la pantalla. Pasan a dos filas. */
  .q-ax{display:grid;grid-template-columns:1fr auto;gap:10px;padding:16px 0}
  .q-ax-lado{flex:none;font-size:14px;grid-row:1}
  .q-ax-der{grid-column:2}
  .q-ax-puntos{grid-row:2;grid-column:1/-1;width:100%;justify-content:space-between}
}
"""

# Cada cuestionario: dónde vive, de dónde vuelve, qué diccionario carga y qué
# fichero de preguntas se embebe.
CUESTIONARIOS = {
    "web": {
        "url": "/cuestionario-web/",
        "vuelta": "/diseno-web/",
        "meta": "meta_t_brief_web",
        "desc": ("Cuéntanos el proyecto, el público y las funcionalidades que necesita tu sitio. "
                 "Diez pasos y una propuesta escrita por una persona del estudio."),
        "i18n": "dw",
        "spec": "brief_web.js",
    },
    "grafico": {
        "url": "/cuestionario-grafico/",
        "vuelta": "/diseno-grafico/",
        "meta": "meta_t_brief_gd",
        "desc": ("Cuéntanos la marca, su público y su personalidad. Doce pasos para que la "
                 "identidad se diseñe sobre lo que la empresa es, no sobre suposiciones."),
        "i18n": "gd",
        "spec": "brief_grafico.js",
    },
}


def nav():
    """Barra inferior de los cuestionarios.

    Mismas piezas que la de los configuradores pero en su propio marcado: el
    diseño de móvil las reparte en tres filas y mantiene el texto de los
    botones, mientras que la otra barra colapsa a dos iconos. El rótulo de
    "guardado" aparece dos veces —cabecera en escritorio, barra en móvil— y cada
    tamaño esconde el que le sobra: es el mismo dato en el sitio donde el diseño
    lo pone, y así el motor puede escribir en los dos con un solo selector.
    """
    return f"""<div class="qb-nav" id="q-nav" hidden>
<p class="qb-aviso" id="qb-aviso" hidden></p>
<div class="qb-in">
<span class="qb-estado">
<span class="qb-meta" id="qb-count"></span>
<span class="qb-meta q-saved q-saved-nav"></span>
</span>
<button class="qb-txt qb-save" id="q-save" type="button">{t('q_save')}</button>
<div class="qb-botones">
<button class="qb-txt" id="q-back" type="button">{t('q_back')}</button>
<button class="qb-next" id="q-next" type="button"><span class="qb-label">{t('next')}</span></button>
</div>
</div>
</div>"""


def _js(*ficheros):
    return "".join("<script>\n" + open(os.path.join(_SRC, f), encoding="utf-8").read() + "\n</script>\n"
                   for f in ficheros)


def page(cual):
    c = CUESTIONARIOS[cual]
    h = head(t(c["meta"]), c["desc"], c["url"])
    # El cuestionario no se indexa: es una herramienta, no una página de entrada.
    h = h.replace('<meta name="theme-color"',
                  '<meta name="robots" content="noindex,follow">\n<meta name="theme-color"')
    # Solo ui y msg del diccionario común: el vocabulario de opciones de este
    # cuestionario viene entero de su propia carga, y el de los otros servicios
    # no pinta nada aquí.
    h = h.replace("</head>", f'<style>{QUIZ_CSS}{BRIEF_CSS}</style>\n'
                             f'{bundle_i18n(("ui", "msg"))}\n{bundle_extra(c["i18n"])}\n</head>')

    h += f"""<div class="q-wrap">
<div class="q-fondo" aria-hidden="true"><img src="/assets/borsoga-fondo.svg" alt="" width="735" height="738"></div>
<header style="position:sticky;top:0;z-index:30;background:#fff;border-bottom:1px solid rgba(0,0,0,.12)">
<div class="q-cab">
<a href="{c['vuelta']}" aria-label="{t('back_to_plans')}"><img src="/assets/logo-negro.png" alt="Borsoga" width="1629" height="333"></a>
<span class="q-saved"></span>
</div>
<div class="q-seg" id="q-seg" aria-hidden="true"></div>
</header>

<div class="q-volver-fila">
<a class="q-volver" href="{c['vuelta']}">
<svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" style="display:block;flex:none"><path d="M17 9H1M1 9L8 2M1 9L8 16" stroke="currentColor" stroke-width="1.3"/></svg>
{t('back_to_plans')}</a>
</div>

<main class="q-main" id="q-main">
<noscript><p style="font-size:17px;line-height:1.6">{t("q_nojs_1")}
<a href="mailto:borsogastudio@gmail.com" style="border-bottom:1px solid">borsogastudio@gmail.com</a>
{t("q_nojs_2")}</p></noscript>
</main>

{nav()}
</div>
{_js("brief.js", c["spec"])}"""
    return h + footer().replace("</main>\n", "")
