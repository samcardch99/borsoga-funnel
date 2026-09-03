# -*- coding: utf-8 -*-
"""Configurador de Interior Design — 6 pasos.

Portado del artboard 'Cuestionario Interior Design' del proyecto de Claude
Design. La lógica se queda en cliente porque el diseño lo exige: las preguntas
condicionales aparecen al instante, el contador de imágenes se actualiza en
vivo y los espacios llevan stepper de cantidad. Un formulario por páginas
perdería las tres cosas.

Las constantes van en JS tal cual están en el diseño, no traducidas a Python:
así hay una sola copia y se comparan línea a línea con el original.

El servidor (api/submit.ts, función de Vercel) valida y guarda. Como el precio lo pone una
persona, el enrutamiento del cliente solo decide qué plantilla de correo se
envía; el servidor lo recalcula igualmente para la notificación interna, para
que un cliente manipulado no pueda desinformar al estudio.
"""
import os
from i18n_load import t
from shell import bundle_i18n, head, footer, BASE_CSS, WRAP, EYEBROW

QUIZ_CSS = """
body{background:#fff}
.q-wrap{min-height:100vh;display:flex;flex-direction:column}
.q-main{width:min(100%,1080px);margin:0 auto;padding:clamp(32px,5vw,56px) clamp(20px,4vw,40px) 140px;flex:1}
.q-group{margin-bottom:clamp(34px,5vw,52px)}
.q-q{font-size:clamp(19px,2.2vw,24px);font-weight:500;letter-spacing:-.02em;line-height:1.3;margin:0 0 6px}
.q-hint{font-size:14px;line-height:1.55;color:rgba(0,0,0,.55);margin:0 0 16px;max-width:62ch}
.q-opts{display:flex;flex-wrap:wrap;gap:10px}
.q-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px}
.q-chip,.q-card{font-family:inherit;text-align:left;cursor:pointer;transition:border-color .18s ease,background .18s ease,color .18s ease}
.q-chip{border:1px solid rgba(0,0,0,.2);background:#fff;padding:14px 20px;font-size:15px;color:rgba(0,0,0,.75)}
.q-chip[aria-pressed=true]{border:1.5px solid #000;background:#000;color:#fff;padding:13.5px 19.5px;font-weight:500}
.q-card{border:1px solid rgba(0,0,0,.16);background:#fff;padding:20px 22px;display:flex;align-items:center;gap:14px;width:100%;font-size:16px;line-height:1.35}
.q-card[aria-pressed=true]{border:1.5px solid #000;padding:19.5px 21.5px;font-weight:500}
@media (hover:hover){.q-chip:hover,.q-card:hover{border-color:rgba(0,0,0,.55)}}
.q-radio{width:18px;height:18px;border-radius:50%;border:1.5px solid rgba(0,0,0,.28);flex:none}
.q-card[aria-pressed=true] .q-radio{border:5px solid #000}
.q-box{width:20px;height:20px;border:1.5px solid rgba(0,0,0,.28);flex:none}
.q-card[aria-pressed=true] .q-box{background:#000;border-color:#000}
.q-in{font-family:inherit;font-size:16px;padding:15px 16px;border:1px solid rgba(0,0,0,.22);background:#fff;width:100%}
.q-in:focus{outline:none;border-color:#000}
.q-fields{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px}
.q-space{background:#fff;padding:15px 15px 15px 20px;display:flex;align-items:center;gap:12px;
justify-content:space-between;min-height:64px;box-shadow:0 0 0 1px rgba(0,0,0,.14);cursor:pointer}
.q-space[aria-pressed=true]{box-shadow:0 0 0 1.5px #000;position:relative;z-index:1}
.q-step{width:30px;height:30px;background:#fff;border:1px solid rgba(0,0,0,.28);font-size:16px;
line-height:1;display:flex;align-items:center;justify-content:center;padding:0;flex:none;cursor:pointer}
.q-step:disabled{border-color:rgba(0,0,0,.1);color:rgba(0,0,0,.24);cursor:default}
.q-note{border:1px solid rgba(0,0,0,.16);padding:16px 18px;font-size:14px;line-height:1.6;
color:rgba(0,0,0,.7);margin-top:14px}
.q-note.warn{border-color:#000;background:rgba(0,0,0,.03)}
.q-drop{border:1px dashed rgba(0,0,0,.34);background:#fff;padding:clamp(22px,3vw,30px);display:flex;
align-items:center;gap:18px;cursor:pointer;flex-wrap:wrap;width:100%}
.q-drop.has{border-style:solid;border-color:#000}
.q-drop input{position:absolute;width:1px;height:1px;opacity:0}
.q-file{display:flex;gap:10px;font-size:14px;color:rgba(0,0,0,.65);padding:7px 0}
.q-nav{position:fixed;left:0;right:0;bottom:0;background:#fff;border-top:1px solid rgba(0,0,0,.14);z-index:30}
.q-nav{transition:transform .25s ease,visibility .25s ease}
.q-nav.q-at-footer{transform:translateY(100%);visibility:hidden;pointer-events:none}
.q-nav-in{width:min(100%,1080px);margin:0 auto;padding:16px clamp(20px,4vw,40px);display:flex;
align-items:center;justify-content:space-between;gap:16px}
.q-nav-group{display:flex;align-items:center;gap:20px;min-width:0}
.q-nav-icon{display:none}
.q-back{background:none;border:none;font-size:11px;font-weight:600;letter-spacing:.12em;
text-transform:uppercase;padding:8px 0;cursor:pointer;border-bottom:1px solid #000}
.q-back:disabled{color:rgba(0,0,0,.22);border-bottom-color:transparent;cursor:default}
.q-next{background:#000;color:#fff;border:1px solid #000;padding:16px 30px;font-size:11px;
font-weight:600;letter-spacing:.12em;text-transform:uppercase;cursor:pointer}
.q-next:disabled{background:rgba(0,0,0,.08);color:rgba(0,0,0,.34);border-color:transparent;cursor:default}
.q-seg{display:flex;gap:3px;width:min(100%,1080px);margin:0 auto;padding:0 clamp(20px,4vw,40px) 0}
.q-seg i{flex:1 1 0;height:3px;background:rgba(0,0,0,.14)}
.q-seg i.on{background:#000}
.q-sum{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1px;margin-top:36px}
.q-sum div{background:#fff;box-shadow:0 0 0 1px rgba(0,0,0,.12);padding:16px 18px}
.q-sum dt{font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;
color:rgba(0,0,0,.45);margin-bottom:6px}
.q-sum dd{margin:0;font-size:15px;line-height:1.45}
.q-err{font-size:14px;color:#000;border-left:2px solid #000;padding-left:12px;margin-top:10px}
.q-lvl{border:1px solid rgba(0,0,0,.16);background:#fff;padding:0;cursor:pointer;
display:flex;flex-direction:column;text-align:left}
.q-lvl[aria-pressed=true]{border:1.5px solid #000}
/* Estado "falta responder". Rojo contenido, del mismo registro que el resto
   del diseño: marco, no relleno chillón. */
.q-invalid .q-card,.q-invalid .q-chip,.q-invalid .q-in,.q-invalid .q-space,.q-invalid .q-lvl{
box-shadow:0 0 0 1.5px #b42318!important;border-color:#b42318!important}
.q-invalid .q-drop{border-color:#b42318}
.q-invalid .q-q{color:#b42318}
.q-falta{margin:12px 0 0;font-size:13px;font-weight:500;color:#b42318;
display:flex;align-items:center;gap:7px}
.q-falta::before{content:"";width:6px;height:6px;background:#b42318;flex:none}
@media (prefers-reduced-motion:no-preference){
  .q-invalid{animation:q-shake .3s ease}
  @keyframes q-shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
}
.q-slot{aspect-ratio:4/3;background:rgba(0,0,0,.04);display:flex;align-items:center;
justify-content:center;font-size:12px;color:rgba(0,0,0,.32);letter-spacing:.08em;text-transform:uppercase}
@media (max-width:640px){
  .q-main{padding-bottom:calc(92px + env(safe-area-inset-bottom,0px))}
  .q-nav-in{padding:9px 12px calc(9px + env(safe-area-inset-bottom,0px));gap:8px}
  .q-nav-group{gap:8px}
  .q-nav-status{flex:1;justify-content:flex-end}
  .q-back,.q-next{width:42px;height:42px;min-width:42px;padding:0;border:1px solid rgba(0,0,0,.18);
    display:inline-flex;align-items:center;justify-content:center}
  .q-back{background:#fff}
  .q-back:disabled{border-color:rgba(0,0,0,.08)}
  .q-next{background:#000;border-color:#000}
  .q-nav-icon{width:19px;height:19px;display:block;fill:none;stroke:currentColor;stroke-width:1.8;
    stroke-linecap:round;stroke-linejoin:round}
  .q-btn-label{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;
    clip:rect(0,0,0,0);white-space:nowrap;border:0}
  #q-count{display:none}
  #q-aviso{font-size:10px!important;line-height:1.2;max-width:12ch;text-align:right}
}
"""


def quiz_nav():
    """Barra común de ambos configuradores; texto accesible, iconos en móvil."""
    return f"""<div class="q-nav" id="q-nav" hidden>
<div class="q-nav-in">
<div class="q-nav-group">
<button class="q-back" id="q-back" type="button" aria-label="{t('q_back')}">
<svg class="q-nav-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>
<span class="q-btn-label">{t('q_back')}</span></button>
<button class="q-back" id="q-save" type="button" aria-label="{t('q_save')}" style="border-bottom-color:rgba(0,0,0,.25)">
<svg class="q-nav-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h10l2 2v14H6z"/><path d="M9 4v6h6V4M9 20v-6h6v6"/></svg>
<span class="q-btn-label">{t('q_save')}</span></button>
</div>
<div class="q-nav-group q-nav-status">
<span id="q-aviso" hidden style="font-size:12px;font-weight:600;letter-spacing:.04em;color:#b42318"></span>
<span id="q-count" style="font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:rgba(0,0,0,.45)"></span>
<button class="q-next" id="q-next" type="button" aria-label="Continuar">
<svg class="q-nav-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>
<span class="q-btn-label">Continuar</span></button>
</div>
</div>
</div>"""


QUIZ_FOOTER_JS = """<script>
(function () {
  function boot() {
    var nav = document.getElementById('q-nav'), foot = document.querySelector('footer');
    if (!nav || !foot || !('IntersectionObserver' in window)) return;
    new IntersectionObserver(function (entries) {
      nav.classList.toggle('q-at-footer', entries[0].isIntersecting);
    }, { threshold: 0.01 }).observe(foot);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once:true });
  else boot();
})();
</script>"""


QUIZ_JS = ("<script>\n" +
            open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "quiz.js"),
                 encoding="utf-8").read() +
            "\n</script>")


def page():
    h = head(t("meta_t_quiz"),
             "Responde seis preguntas sobre tu espacio y te enviamos un estimado en menos de 24 horas.",
             "/configurador/")
    # El configurador no se indexa: es una herramienta, no una página de entrada.
    h = h.replace('<meta name="theme-color"', '<meta name="robots" content="noindex,follow">\n<meta name="theme-color"')
    h = h.replace("</head>", f"<style>{QUIZ_CSS}</style>\n{bundle_i18n()}\n</head>")

    h += f"""<div class="q-wrap">
<header style="position:sticky;top:0;z-index:30;background:#fff;border-bottom:1px solid rgba(0,0,0,.12)">
<div style="width:min(100%,1080px);margin:0 auto;padding:0 clamp(20px,4vw,40px);height:64px;display:flex;align-items:center;justify-content:space-between;gap:20px">
<a href="/interior-design/" aria-label="Volver a los planes"><img src="/assets/logo-negro.png" alt="Borsoga" width="1629" height="333" style="width:126px;height:auto;display:block"></a>
<div style="display:flex;align-items:center;gap:14px">
<div style="display:flex;align-items:center;gap:9px;border:1px solid rgba(0,0,0,.16);padding:7px 12px">
<span id="q-ring" aria-hidden="true"></span>
<span id="q-plan" style="font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase"></span>
</div>
<span id="q-saved" style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:rgba(0,0,0,.4)"></span>
</div>
</div>
<div class="q-seg" id="q-seg" aria-hidden="true"></div>
</header>

<main class="q-main" id="q-main">
<noscript><p style="font-size:17px;line-height:1.6">{t("q_nojs_1")}
<a href="mailto:borsogastudio@gmail.com" style="border-bottom:1px solid">borsogastudio@gmail.com</a>
{t("q_nojs_2")}</p></noscript>
</main>

{quiz_nav()}
</div>
{QUIZ_JS}
{QUIZ_FOOTER_JS}
"""
    return h + footer().replace("</main>\n", "")
