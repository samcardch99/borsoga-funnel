# -*- coding: utf-8 -*-
"""Configurador de Architectural Visualization.

Comparte shell y CSS con el de interiorismo (`quiz.py`): son dos servicios
distintos pero la misma pieza de interfaz, y duplicar los estilos habría
significado que se desincronizaran a la primera.
"""
import os
from i18n_load import t
from shell import bundle_i18n, head, footer
from quiz import QUIZ_CSS

# El diseño de AV invierte la selección a negro, y sube los steppers a 44px
# (objetivo táctil). El de interiorismo no: por eso van como override y no
# tocando QUIZ_CSS, que comparten los dos.
AV_CSS = """
.q-card[aria-pressed=true],.q-chip[aria-pressed=true],.q-space[aria-pressed=true]{
background:#000!important;color:#fff!important;border-color:#000!important}
.q-card[aria-pressed=true] .q-radio,.q-space[aria-pressed=true] .q-radio{
border-color:#fff;border-width:5px}
.q-card[aria-pressed=true] .q-box{background:#fff;border-color:#fff}
.q-card,.q-chip,.q-space{color:rgba(0,0,0,.62)}
.q-space[aria-pressed=true]{box-shadow:0 0 0 1.5px #000}
.q-space[aria-pressed=true] .q-step{border-color:rgba(255,255,255,.55);color:#fff}
.q-space[aria-pressed=true] .q-step:disabled{border-color:rgba(255,255,255,.2);color:rgba(255,255,255,.35)}
.q-step{width:44px;height:44px;background:transparent}
.q-invalid .q-card[aria-pressed=true],.q-invalid .q-chip[aria-pressed=true]{box-shadow:0 0 0 1.5px #b42318!important}
"""

_SRC = os.path.dirname(os.path.abspath(__file__))
QUIZ_JS = ("<script>\n" + open(os.path.join(_SRC, "quiz_av.js"), encoding="utf-8").read() + "\n</script>")



def page():
    h = head(t("meta_t_quiz_av"),
             "Cuéntanos las escenas que necesitas y te enviamos tu rango de inversión.",
             "/configurador-av/")
    h = h.replace('<meta name="theme-color"',
                  '<meta name="robots" content="noindex,follow">\n<meta name="theme-color"')
    h = h.replace("</head>", f"<style>{QUIZ_CSS}{AV_CSS}</style>\n{bundle_i18n()}\n</head>")

    h += """<div class="q-wrap">
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

<div class="q-nav" id="q-nav" hidden>
<div class="q-nav-in">
<div style="display:flex;align-items:center;gap:20px">
<button class="q-back" id="q-back" type="button">{t("q_back")}</button>
<button class="q-back" id="q-save" type="button" style="border-bottom-color:rgba(0,0,0,.25)">{t("q_save")}</button>
</div>
<div style="display:flex;align-items:center;gap:18px">
<span id="q-aviso" hidden style="font-size:12px;font-weight:600;letter-spacing:.04em;color:#b42318"></span>
<span id="q-count" style="font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:rgba(0,0,0,.45)"></span>
<button class="q-next" id="q-next" type="button">Continuar</button>
</div>
</div>
</div>
</div>
""" + QUIZ_JS + "\n"
    return h + footer().replace("</main>\n", "")
