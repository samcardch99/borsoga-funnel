# -*- coding: utf-8 -*-
"""Componentes compartidos: <head>, header, footer, secciones y tablas.

Los estilos inline replican los del artboard de Claude Design. Los
`style-hover="..."` del diseño (que no existen en HTML real) se traducen a
clases con reglas :hover reales en BASE_CSS.
"""
import json
import os
import re

from content import SERVICIOS
from i18n_load import IDIOMAS, ORIGEN, T, cadenas, idioma, t
from motion import MOTION_CSS, MOTION_JS, HEAD_INLINE, SCRIPTS, GSAP

SITE = "https://plans.borsogastudio.com"
_SRC = os.path.dirname(os.path.abspath(__file__))

# El español vive en la raíz porque es el idioma de origen y el que ya está
# indexado; los demás cuelgan de su prefijo. Cambiar esto rompería las URLs
# publicadas, así que la regla está aquí y en ningún otro sitio.
OG_LOCALE = {"es": "es_ES", "en": "en_US"}

# Los slugs también se traducen: un sitio en inglés con /politica-de-privacidad/
# en la barra de direcciones se lee a medio hacer. El mapa es la única fuente,
# y `localizar_enlaces()` lo aplica al HTML ya montado.
SLUGS = {
    "en": {
        "/diseno-web/": "/web-design/",
        "/diseno-grafico/": "/graphic-design/",
        "/planes-av/": "/av-plans/",
        "/configurador/": "/configurator/",
        "/configurador-av/": "/av-configurator/",
        "/politica-de-privacidad/": "/privacy-policy/",
    },
}


def ruta(path, lang=None):
    """URL pública de `path` en un idioma."""
    lang = lang or idioma()
    if lang == ORIGEN:
        return path
    return f"/{lang}{SLUGS.get(lang, {}).get(path, path)}"


def localizar_enlaces(html, lang, disponibles=None):
    """Prefija y traduce los enlaces internos del HTML ya generado.

    Se hace aquí y no en cada `href` porque hay más de cien repartidos por ocho
    módulos: una regla que se puede leer entera es más fiable que cien llamadas
    que hay que acordarse de poner. Se dejan fuera los assets y la API, que no
    tienen versión por idioma, y todo lo que no empiece por "/" (anclas,
    mailto:, enlaces externos) no llega a coincidir.

    `disponibles` son las rutas que existen en ese idioma. Lo que no esté en la
    lista se queda apuntando a su versión original: mientras una página no esté
    traducida, mandar al lector a la española es mejor que mandarlo a un 404.
    """
    if lang == ORIGEN:
        return html

    # Los enlaces del conmutador de idioma ya apuntan a donde deben —cada uno a
    # otro idioma— así que se apartan antes de reescribir y se devuelven después.
    # Sin esto el enlace "ES" de la versión inglesa acababa apuntando a /en/.
    apartados = []

    def guarda(m):
        apartados.append(m.group(0))
        return f"\x00{len(apartados) - 1}\x00"

    html = re.sub(r'<a data-i18n-link\b[^>]*>', guarda, html)

    def cambia(m):
        destino = m.group(1)
        if disponibles is not None and destino not in disponibles:
            return m.group(0)
        return 'href="' + ruta(destino, lang)

    html = re.sub(r'href="(/(?!assets/|api/)[^"#?]*)', cambia, html)
    return re.sub(r"\x00(\d+)\x00", lambda m: apartados[int(m.group(1))], html)


def bundle_i18n(ramas=("ui", "msg", "opt", "plural")):
    """Cadenas del idioma activo para el JS de la página.

    Se embebe sólo el idioma que toca —no los dos— porque el bundle pesa lo
    suyo y ninguna página necesita el otro. `BORSOGA_LANG` le dice al script
    qué rama leer.

    Y sólo las ramas que la página use: `opt` es el vocabulario de los
    cuestionarios (más de 700 entradas en inglés) y la portada no lo toca. Sin
    este recorte la portada inglesa pesaba 67 KB más que la española por texto
    que nunca iba a pintar.
    """
    lang = idioma()
    d = cadenas(lang)
    datos = {"name": lang, "locale": "es-US" if lang == ORIGEN else "en-US"}
    datos.update({r: d[r] for r in ramas})
    payload = json.dumps({lang: datos}, ensure_ascii=False, separators=(",", ":"))
    return (f'<script>window.BORSOGA_LANG="{lang}";'
            f'window.BORSOGA_I18N=Object.assign(window.BORSOGA_I18N||{{}},{payload});</script>')


def selector_idioma(path=None, color="#000", ident=""):
    """Conmutador de idioma.

    Enlaces reales a la misma página en el otro idioma: sin JS, indexables, y
    respaldados por el hreflang del <head>. Todo hereda el `color` del
    contenedor y distingue activo de inactivo por opacidad, para que la cabecera
    de la portada —que pasa de blanco a negro con el scroll— pueda cambiarlo con
    una sola propiedad en vez de repintar cada pieza.
    """
    act = idioma()
    path = _PATH if path is None else path
    base = "font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:inherit"
    piezas = []
    for l in IDIOMAS:
        if l == act:
            piezas.append(f'<span aria-current="true" style="{base}">{l}</span>')
        else:
            piezas.append(f'<a data-i18n-link href="{ruta(path, l)}" hreflang="{l}" '
                          f'style="{base};opacity:.5">{l}</a>')
    sep = f'<span aria-hidden="true" style="{base};opacity:.35">/</span>'
    ids = f' id="{ident}"' if ident else ""
    return (f'<div{ids} style="display:flex;align-items:center;gap:8px;color:{color};'
            f'transition:color .35s ease" role="group" aria-label="{t("chrome_lang")}">'
            f'{sep.join(piezas)}</div>')


WRAP = "width:min(100%,1240px);margin:0 auto;padding:0 clamp(20px,4vw,48px)"
EYEBROW = ("font-size:11px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;"
           "color:rgba(0,0,0,.45)")
H2 = "margin:0;font-size:clamp(26px,3.8vw,42px);font-weight:600;letter-spacing:-.03em;line-height:1.05"
CARD = ("border:1px solid rgba(0,0,0,.14);background:#fff;padding:clamp(26px,4vw,58px);"
        "display:flex;flex-wrap:wrap;gap:clamp(30px,4vw,64px)")
COL_L = "flex:1 1 320px;max-width:420px;display:flex;flex-direction:column;gap:clamp(20px,3vw,28px)"
COL_R = "flex:1 1 400px;display:flex;flex-direction:column;gap:clamp(26px,3vw,36px)"
LIST_HEAD = ("font-size:11px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;"
             "color:rgba(0,0,0,.45);padding-bottom:14px;border-bottom:1px solid rgba(0,0,0,.14)")
LI = ("display:flex;gap:14px;padding:13px 0;border-bottom:1px solid rgba(0,0,0,.08);"
      "font-size:16px;line-height:1.45")
DOT = "width:7px;height:7px;border-radius:50%;background:#000;flex:none;margin-top:7px"
BTN = ("padding:17px 22px;font-size:12px;font-weight:600;letter-spacing:.12em;"
       "text-transform:uppercase;text-align:center;display:block")

BASE_CSS = """html{-webkit-text-size-adjust:100%;scroll-behavior:smooth}
body{margin:0;background:#fff;font-family:'Poppins',system-ui,sans-serif;color:#000;
-webkit-font-smoothing:antialiased;text-wrap:pretty}
*{box-sizing:border-box}
a{color:#000;text-decoration:none}
ul{margin:0;padding:0;list-style:none}
summary{cursor:pointer;list-style:none}
summary::-webkit-details-marker{display:none}
summary::marker{content:''}
button{font-family:inherit;cursor:pointer}
img{max-width:100%}
/* El navegador oculta [hidden] con `display:none`, pero cualquier `display`
   escrito en el atributo style gana por especificidad y el elemento se sigue
   viendo. Pasó con la caja de "¿quisiste decir…?": tenía display:flex inline,
   así que aparecía siempre —con el botón suelto y sin pregunta— aunque el
   atributo hidden estuviera puesto. Esta regla lo zanja para todo el sitio. */
[hidden]{display:none!important}
.nav-m:hover{color:rgba(0,0,0,.85)}
.btn-d{background:#000;color:#fff;border:1px solid #000}
.btn-d:hover{background:rgba(0,0,0,.82);border-color:rgba(0,0,0,.82);color:#fff}
.btn-l{background:#fff;color:#000;border:1px solid #000}
.btn-l:hover{background:#000;color:#fff}
.btn-w{background:#fff;color:#000;border:1px solid #fff}
.btn-w:hover{background:rgba(255,255,255,.85);border-color:rgba(255,255,255,.85);color:#000}
.btn-o{background:transparent;color:#fff;border:1px solid #fff}
.btn-o:hover{background:#fff;color:#000}
.svc:hover{box-shadow:0 0 0 1.5px #000!important}
.exc{color:rgba(0,0,0,.5)}
.exc:hover{color:#000}
.exc-w{color:rgba(255,255,255,.6)}
.exc-w:hover{color:#fff}
.skip{position:absolute;left:-9999px}
.skip:focus{left:12px;top:12px;z-index:99;background:#000;color:#fff;padding:12px 18px;font-size:13px}
:focus-visible{outline:2px solid #000;outline-offset:2px}
/* Un viewport 4K usado a escala nativa (3840px) conserva la densidad visual
   del diseño a 2K (2560px): 3840 / 2560 = 1.5. En sistemas que ya escalan la
   pantalla 4K a 1920px CSS esta regla no entra, porque allí no hace falta. */
@media screen and (min-width:3400px){html{zoom:1.5}}
@media (max-width:640px){
  .cmp-h{top:0!important}
  .nav-services{display:none!important}
}
"""


_PATH = "/"


def head(title, desc, path, og_title=None):
    """<head> completo: SEO, Open Graph, canonical, favicon e idiomas."""
    global _PATH
    _PATH = path
    lang = idioma()
    url = SITE + ruta(path, lang)
    # hreflang recíproco: cada versión declara todas, incluida ella misma, que es
    # lo que Google exige para no tratarlas como contenido duplicado. x-default
    # apunta al español por ser el origen.
    alternos = "\n".join(
        f'<link rel="alternate" hreflang="{l}" href="{SITE}{ruta(path, l)}">' for l in IDIOMAS)
    alternos += f'\n<link rel="alternate" hreflang="x-default" href="{SITE}{ruta(path, ORIGEN)}">'
    return f"""<!DOCTYPE html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{url}">
{alternos}
<meta property="og:type" content="website">
<meta property="og:site_name" content="Borsoga Studio">
<meta property="og:locale" content="{OG_LOCALE[lang]}">
<meta property="og:title" content="{og_title or title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{SITE}/assets/logo-negro.png">
<meta name="twitter:card" content="summary">
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/assets/apple-touch-icon.png" sizes="180x180">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
<style>{BASE_CSS}{MOTION_CSS}</style>
{SCRIPTS}
{HEAD_INLINE}
</head>
<body>
<a class="skip" href="#main">{t("chrome_skip")}</a>
"""


def header(cta_label, cta_href, nav_href="#servicios"):
    return f"""<header style="position:sticky;top:0;z-index:30;background:#fff;border-bottom:1px solid rgba(0,0,0,.12)">
<div style="{WRAP.replace('padding:0 ','padding:0 ')};height:68px;display:flex;align-items:center;justify-content:space-between;gap:24px">
<a href="/" aria-label="{t('chrome_home')}"><img src="/assets/logo-negro.png" alt="Borsoga" width="1629" height="333" style="width:132px;height:auto;display:block"></a>
<nav style="display:flex;align-items:center;gap:clamp(16px,3vw,32px)">
<a href="{nav_href}" class="nav-m nav-services" style="font-size:12px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:rgba(0,0,0,.5)">{t("chrome_nav_services")}</a>
<a href="{cta_href}" style="font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;border-bottom:1px solid #000;padding-bottom:2px">{T(cta_label)}</a>
{selector_idioma()}
</nav>
</div>
</header>
<main id="main">
"""


def servicios(current):
    """Sección 'Los cuatro servicios'. `current` es el href de la página actual."""
    cards = []
    for num, name, note, href in SERVICIOS:
        here = href == current
        sub = t("estas_aqui") if here else note
        col = "rgba(0,0,0,.6)" if href else "rgba(0,0,0,.4)"
        box = ("box-shadow:0 0 0 1.5px #000;position:relative;z-index:1" if here
               else "box-shadow:0 0 0 1px rgba(0,0,0,.14)")
        inner = (f'<span style="font-size:11px;font-weight:600;letter-spacing:.14em;'
                 f'text-transform:uppercase;color:rgba(0,0,0,.45)">{num}</span>'
                 f'<span style="font-size:19px;font-weight:600;letter-spacing:-.02em">{name}</span>'
                 f'<span style="font-size:14px;line-height:1.5;color:{col}">{sub}</span>')
        sty = (f'background:#fff;{box};padding:clamp(22px,2.4vw,30px);'
               f'display:flex;flex-direction:column;gap:10px')
        if href and not here:
            cards.append(f'<a href="{href}" class="svc m-svc" style="{sty}">{inner}</a>')
        else:
            cards.append(f'<div class="m-svc" style="{sty}">{inner}</div>')
    return f"""<section id="servicios" style="border-top:1px solid rgba(0,0,0,.14);background:rgba(0,0,0,.025);scroll-margin-top:68px">
<div style="{WRAP};padding-top:clamp(56px,8vw,104px);padding-bottom:clamp(56px,8vw,104px)">
<div style="max-width:60ch;margin-bottom:clamp(32px,5vw,56px)">
<div style="{EYEBROW};margin-bottom:18px">El estudio</div>
<h2 style="{H2}">{t("chrome_nav_services")}</h2>
</div>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1px">
{''.join(cards)}
</div>
</div>
</section>
"""


def cierre(title, body, btn, href, anchor="propuesta"):
    return f"""<section id="{anchor}" class="m-cta" style="background:#000;color:#fff;scroll-margin-top:68px">
<div style="{WRAP};padding-top:clamp(64px,10vw,132px);padding-bottom:clamp(64px,10vw,132px);display:flex;flex-wrap:wrap;gap:clamp(32px,5vw,72px);align-items:flex-end">
<div style="flex:1 1 420px">
<h2 style="margin:0;font-size:clamp(32px,5.6vw,62px);font-weight:600;letter-spacing:-.035em;line-height:1;max-width:18ch">{T(title)}</h2>
<p style="margin:clamp(20px,3vw,32px) 0 0;font-size:clamp(17px,1.6vw,21px);font-weight:300;line-height:1.5;color:rgba(255,255,255,.7);max-width:46ch">{T(body)}</p>
</div>
<div style="flex:0 1 300px;width:100%">
<a href="{href}" class="btn-w" style="padding:22px 32px;font-size:13px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;width:100%;display:block;text-align:center">{T(btn)}</a>
</div>
</div>
</section>
"""


def footer():
    return f"""</main>
<footer style="background:#000;color:#fff;border-top:1px solid rgba(255,255,255,.16)">
<div style="{WRAP};padding-top:32px;padding-bottom:32px;display:flex;flex-wrap:wrap;gap:20px;align-items:center;justify-content:space-between">
<img src="/assets/logo-blanco.png" alt="Borsoga" width="1629" height="333" style="width:126px;height:auto;display:block">
<div style="display:flex;flex-wrap:wrap;gap:20px;align-items:center">
<a href="/politica-de-privacidad/" style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.55)">{t("chrome_privacy")}</a>
<span style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.45)">Borsoga LLC · Miami, Florida</span>
{selector_idioma(color="#fff")}
</div>
</div>
</footer>
{MOTION_JS}
</body>
</html>
"""


# --------------------------------------------------------------- utilidades

def rings(n, white=False):
    c = "#fff" if white else "#000"
    d = "".join(f'<div style="position:absolute;inset:{i*11}px;border:1.5px solid {c};border-radius:50%"></div>'
                for i in range(n))
    return f'<div class="m-ring" style="position:relative;width:64px;height:64px;flex:none" aria-hidden="true">{d}</div>'


def bullets(items, white=False):
    bc = "#fff" if white else "#000"
    bd = "rgba(255,255,255,.1)" if white else "rgba(0,0,0,.08)"
    li = "".join(
        f'<li class="m-li" style="{LI};border-bottom-color:{bd}">'
        f'<span style="{DOT};background:{bc}" aria-hidden="true"></span><span>{T(t)}</span></li>'
        for t in items)
    return f'<ul>{li}</ul>'


def block(title, items, white=False):
    lh = LIST_HEAD
    if white:
        lh = lh.replace("rgba(0,0,0,.45)", "rgba(255,255,255,.5)").replace("rgba(0,0,0,.14)", "rgba(255,255,255,.22)")
    return f'<div><div style="{lh}">{T(title)}</div>{bullets(items, white)}</div>'


def stat(num, label, white=False):
    c = "rgba(255,255,255,.6)" if white else "rgba(0,0,0,.55)"
    return (f'<div style="display:flex;align-items:center;gap:10px">'
            f'<span style="font-size:22px;font-weight:600;letter-spacing:-.02em">{num}</span>'
            f'<span style="font-size:12px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:{c}">{T(label)}</span></div>')


def statbar(parts, white=False):
    bc = "rgba(255,255,255,.22)" if white else "rgba(0,0,0,.14)"
    sep = f'<div style="width:1px;height:18px;background:{bc}" aria-hidden="true"></div>'
    return (f'<div style="display:flex;align-items:center;gap:16px;border-top:1px solid {bc};'
            f'border-bottom:1px solid {bc};padding:14px 0;flex-wrap:wrap">{sep.join(parts)}</div>')


def inherit_box(label, text, ringn, white=False):
    bg = "rgba(255,255,255,.07)" if white else "rgba(0,0,0,.035)"
    rc = "rgba(255,255,255,.5)" if white else "rgba(0,0,0,.45)"
    tc = "rgba(255,255,255,.62)" if white else "rgba(0,0,0,.6)"
    lc = "rgba(255,255,255,.55)" if white else "rgba(0,0,0,.5)"
    mini = "".join(f'<div style="position:absolute;inset:{i*6}px;border:1.5px solid {rc};border-radius:50%"></div>'
                   for i in range(ringn))
    return (f'<div style="background:{bg};padding:20px 22px">'
            f'<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">'
            f'<div style="position:relative;width:20px;height:20px;flex:none" aria-hidden="true">{mini}</div>'
            f'<div style="font-size:11px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:{lc}">{T(label)}</div></div>'
            f'<p style="margin:0;font-size:14px;line-height:1.65;color:{tc}">{T(text)}</p></div>')


def excluye(text, white=False):
    cls = "exc-w" if white else "exc"
    bc = "rgba(255,255,255,.22)" if white else "rgba(0,0,0,.14)"
    tc = "rgba(255,255,255,.6)" if white else "rgba(0,0,0,.6)"
    return (f'<details style="border-top:1px solid {bc};padding-top:16px">'
            f'<summary class="{cls}" style="display:flex;align-items:center;justify-content:space-between;gap:16px;'
            f'font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase">'
            f'<span>{t("lo_que_este_plan_no_incluye")}</span><span aria-hidden="true">+</span></summary>'
            f'<p style="margin:14px 0 0;font-size:14px;line-height:1.6;color:{tc}">{T(text)}</p></details>')


def _cell(v, shade=False):
    bg = "background:rgba(0,0,0,.045)" if shade else ""
    inner = ('<span style="width:9px;height:9px;border-radius:50%;background:#000;display:block"></span>'
             if v is True else
             '<span style="width:12px;height:1px;background:rgba(0,0,0,.3);display:block"></span>'
             if v is False else
             f'<span style="font-size:clamp(11px,1vw,13px);font-weight:500;text-align:center;line-height:1.25">{T(v)}</span>')
    label = t("cmp_si") if v is True else t("cmp_no") if v is False else T(v)
    return (f'<div role="cell" aria-label="{label}" style="border-left:1px solid rgba(0,0,0,.1);display:flex;'
            f'align-items:center;justify-content:center;padding:12px 6px;{bg}">{inner}</div>')


def compare_table(rows, cols, grid="minmax(140px,1.9fr) repeat(3,minmax(58px,1fr))", sticky=True):
    """Tabla comparativa. `cols` = [(num, nombre, invertida)]."""
    hd = ['<div style="padding:16px clamp(12px,2vw,20px)"></div>']
    for num, name, inv in cols:
        bg = "background:#000;color:#fff" if inv else ""
        nc = "rgba(255,255,255,.5)" if inv else "rgba(0,0,0,.4)"
        num_html = (f'<span style="font-size:10px;font-weight:600;letter-spacing:.14em;color:{nc}">{num}</span>'
                    if num else "")
        hd.append(f'<div role="columnheader" style="padding:14px 8px;text-align:center;border-left:1px solid rgba(0,0,0,.1);'
                  f'display:flex;flex-direction:column;gap:4px;justify-content:flex-end;{bg}">{num_html}'
                  f'<span style="font-size:clamp(10px,1.1vw,13px);font-weight:600;letter-spacing:-.01em;line-height:1.15">{T(name)}</span></div>')
    st = "position:sticky;top:68px;background:#fff;z-index:10" if sticky else "background:#fff"
    out = [f'<div role="table" class="m-table" style="background:#fff;border:1px solid rgba(0,0,0,.14)">',
           f'<div role="row" class="cmp-h" style="display:grid;grid-template-columns:{grid};'
           f'border-bottom:1px solid rgba(0,0,0,.18);{st}">{"".join(hd)}</div>']
    n = len(cols)
    for row in rows:
        label, vals = row[0], row[1:]
        cells = "".join(_cell(v, shade=(i == n - 1)) for i, v in enumerate(vals))
        out.append(f'<div role="row" class="cmp-row" style="display:grid;grid-template-columns:{grid};'
                   f'border-bottom:1px solid rgba(0,0,0,.08)">'
                   f'<div role="rowheader" style="padding:14px clamp(12px,2vw,20px);font-size:clamp(13px,1.2vw,15px);'
                   f'line-height:1.35;display:flex;align-items:center">{T(label)}</div>{cells}</div>')
    out.append('</div>')
    return "".join(out)


def section_head(eyebrow, title, lead=None, mb="clamp(32px,5vw,56px)"):
    p = (f'<p style="margin:18px 0 0;font-size:17px;font-weight:300;line-height:1.55;'
         f'color:rgba(0,0,0,.65)">{T(lead)}</p>') if lead else ""
    return (f'<div class="m-head" style="max-width:60ch;margin-bottom:{mb}">'
            f'<div style="{EYEBROW};margin-bottom:18px">{T(eyebrow)}</div>'
            f'<h2 style="{H2}">{T(title)}</h2>{p}</div>')


def transversal(text):
    return (f'<section style="border-top:1px solid rgba(0,0,0,.14);border-bottom:1px solid rgba(0,0,0,.14)">'
            f'<div style="{WRAP};padding-top:clamp(32px,5vw,56px);padding-bottom:clamp(32px,5vw,56px)">'
            f'<p style="margin:0;font-size:clamp(18px,2.2vw,26px);font-weight:300;line-height:1.4;'
            f'letter-spacing:-.01em;max-width:44ch">{T(text)}</p></div></section>')
