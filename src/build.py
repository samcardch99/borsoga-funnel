# -*- coding: utf-8 -*-
"""Genera el sitio estático de planes a partir de content.py + shell.py."""
import os, shutil, sys
from content import *
from shell import *
from i18n_load import IDIOMAS, ORIGEN, usar, faltantes, sin_traducir
import privacidad
import quiz
import quiz_av
import planes_av
import servicios as pag_servicios   # alias: shell exporta una función servicios()

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "build")

# CTA provisional hasta que exista el configurador / formulario de propuesta.
MAIL = "borsogastudio@gmail.com"
def mailto(asunto):
    return f"mailto:{MAIL}?subject={asunto.replace(' ', '%20')}"


def plan_nav(items):
    a = "".join(
        f'<a href="#{i}" class="pnav" style="flex:1 1 150px;background:#fff;padding:18px 20px;'
        f'display:flex;flex-direction:column;gap:6px">'
        f'<span style="font-size:10px;font-weight:600;letter-spacing:.2em;color:rgba(0,0,0,.42)">{T(n)}</span>'
        f'<span style="font-size:16px;font-weight:600;letter-spacing:-.01em">{T(tit)}</span></a>'
        for i, n, tit in items)
    return (f'<nav style="{WRAP};padding-bottom:clamp(40px,6vw,64px)">'
            f'<div style="display:flex;flex-wrap:wrap;gap:1px;background:rgba(0,0,0,.12);'
            f'border:1px solid rgba(0,0,0,.12)">{a}</div></nav>')


def hero(eyebrow, h1, lead):
    return (f'<section class="m-hero" style="{WRAP};padding-top:clamp(56px,10vw,132px);padding-bottom:clamp(40px,6vw,72px)">'
            f'<div class="m-eyebrow" style="{EYEBROW};margin-bottom:clamp(24px,4vw,40px)">{T(eyebrow)}</div>'
            f'<h1 style="margin:0;font-size:clamp(38px,7.4vw,78px);font-weight:600;letter-spacing:-.035em;'
            f'line-height:.98;max-width:16ch">{T(h1)}</h1>'
            f'<p style="margin:clamp(24px,4vw,40px) 0 0;font-size:clamp(17px,1.7vw,22px);font-weight:300;'
            f'line-height:1.5;color:rgba(0,0,0,.68);max-width:56ch">{T(lead)}</p></section>')


def plan_head(num, name, tagline, desc, ringn, badge=False, white=False):
    tc = "#fff" if white else "#000"
    ec = "rgba(255,255,255,.5)" if white else "rgba(0,0,0,.45)"
    dc = "rgba(255,255,255,.7)" if white else "rgba(0,0,0,.68)"
    bdg = ('<div style="background:#000;color:#fff;font-size:10px;font-weight:600;letter-spacing:.14em;'
           'text-transform:uppercase;padding:5px 10px">' + t("mas_elegido") + '</div>') if badge else ""
    d = (f'<p style="margin:0;font-size:16px;line-height:1.55;color:{dc}">{T(desc)}</p>') if desc else ""
    return (f'<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:20px">'
            f'<div style="display:flex;flex-wrap:wrap;align-items:center;gap:12px;padding-top:6px">'
            f'<div style="font-size:11px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:{ec}">{T(num)}</div>{bdg}</div>'
            f'{rings(ringn, white)}</div>'
            f'<h2 style="margin:0;font-size:clamp(32px,5vw,54px);font-weight:600;letter-spacing:-.03em;line-height:1">{name}</h2>'
            f'<p style="margin:0;font-size:clamp(18px,1.7vw,23px);font-weight:300;line-height:1.4;color:{tc}">{T(tagline)}</p>{d}')


def ctas(primary, secondary, href, white=False):
    p = "btn-w" if white else "btn-d"
    s = "btn-o" if white else "btn-l"
    return (f'<div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:4px">'
            f'<a href="{href}" class="{p}" style="{BTN};flex:1 1 190px">{T(primary)}</a>'
            f'<a href="{href}" class="{s}" style="{BTN};flex:1 1 190px">{T(secondary)}</a></div>')


def ideal(text, white=False):
    bc = "rgba(255,255,255,.22)" if white else "rgba(0,0,0,.14)"
    lc = "rgba(255,255,255,.5)" if white else "rgba(0,0,0,.45)"
    tc = "rgba(255,255,255,.72)" if white else "rgba(0,0,0,.72)"
    return (f'<div style="border-top:1px solid {bc};padding-top:18px">'
            f'<div style="font-size:11px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;'
            f'color:{lc};margin-bottom:8px">' + t("ideal_para") + '</div>'
            f'<p style="margin:0;font-size:15px;line-height:1.55;color:{tc}">{T(text)}</p></div>')


def wrapper(pid, inner, white=False, last=False):
    bg = "background:#000;color:#fff;" if white else ""
    card = f'{bg}padding:clamp(26px,4vw,58px);display:flex;flex-wrap:wrap;gap:clamp(30px,4vw,64px)'
    if not white:
        card = CARD
    pb = "clamp(56px,8vw,104px)" if last else "clamp(16px,2vw,24px)"
    return (f'<section id="{pid}" style="{WRAP};padding-bottom:{pb};scroll-margin-top:88px">'
            f'<article class="m-card" style="{card}">{inner}</article></section>')


# ================================================================ DISEÑO WEB

def page_web():
    h = head(t("meta_t_web"),
             "Tres planes de diseño web hechos a medida desde cero: Essential, Premium y "
             "Borsoga Edition. Sin plantillas ni constructores genéricos.", "/diseno-web/")
    h += header("Solicitar propuesta", "#propuesta")
    cta = mailto("Propuesta de diseño web")

    h += hero("Diseño web", "Un sitio hecho a medida, no ensamblado",
              "Los tres planes comparten el mismo estándar de autoría y calidad. Lo que cambia no es "
              "el esfuerzo, sino el alcance del sistema. Eso hace que Essential no se lea como una "
              "versión recortada, sino como una pieza completa a menor escala.")
    h += plan_nav([("essential", "PLAN 01", "Web Essential"),
                   ("premium", "PLAN 02", "Web Premium"),
                   ("edition", "PLAN 03", "Web Borsoga Edition")])

    # Plan 01
    left = (f'<div style="{COL_L}">'
            + plan_head("Plan 01", "Web<br>Essential", "Una pieza completa. Diseñada, no ensamblada.",
                        "Sitio de presencia profesional, hecho a medida desde cero. Sin plantillas, "
                        "sin constructores genéricos.", 1)
            + statbar([stat("5", "secciones"), stat("1", "ronda de revisiones")])
            + ctas("Solicitar propuesta", "Ver un sitio real", cta) + '</div>')
    right = (f'<div style="{COL_R}">' + block("Incluye", WEB_ESSENTIAL_INCLUYE)
             + ideal("Profesionales, estudios y negocios que necesitan una presencia digital seria y bien construida.")
             + '</div>')
    h += wrapper("essential", left + right)

    # Plan 02
    left = (f'<div style="{COL_L}">'
            + plan_head("Plan 02", "Web<br>Premium", "Un sitio que trabaja, crece y se mantiene.",
                        "Todo lo de Essential, más profundidad de contenido, movimiento y capacidad de gestión.",
                        2, badge=True)
            + statbar([stat("12", "páginas"), stat("2", "rondas de revisiones")])
            + ctas("Solicitar propuesta", "Ver un sitio real", cta) + '</div>')
    right = (f'<div style="{COL_R}">'
             + inherit_box("Todo lo del plan Web Essential", WEB_INHERIT_PREMIUM, 1)
             + block("Suma a Essential", WEB_PREMIUM_SUMA)
             + ideal("Marcas activas que publican contenido, hacen campañas y necesitan que el sitio evolucione.")
             + '</div>')
    h += wrapper("premium", left + right)

    # Plan 03
    left = (f'<div style="{COL_L}">'
            + plan_head("Plan 03", "Web Borsoga<br>Edition",
                        "No un sitio. Una plataforma diseñada alrededor de tu operación.",
                        "Desarrollo a medida: el sitio deja de ser una vitrina y pasa a ser infraestructura de negocio.",
                        3, white=True)
            + statbar([stat("3", "rondas", True), stat("6", "meses de soporte", True)], white=True)
            + ctas("Solicitar propuesta", "Ver una plataforma real", cta, white=True) + '</div>')
    grp = "".join(block(t, items, white=True) for t, items in WEB_EDITION_GROUPS)
    right = (f'<div style="{COL_R}">'
             + inherit_box("Todo lo del plan Web Premium", WEB_INHERIT_EDITION, 2, white=True)
             + grp
             + ideal("Negocios que venden, operan o gestionan clientes a través de internet.", white=True)
             + '</div>')
    h += wrapper("edition", left + right, white=True, last=True)

    h += transversal("Los tres planes se diseñan y desarrollan dentro del estudio. "
                     "Una sola autoría, de la idea al código.")

    # Mantenimiento
    h += (f'<section style="background:rgba(0,0,0,.025)"><div style="{WRAP};'
          f'padding-top:clamp(56px,8vw,104px);padding-bottom:clamp(56px,8vw,104px)">'
          + section_head("Mantenimiento", "Planes de mantenimiento opcionales",
                         "Contratables por mes o por año, de forma independiente al proyecto.")
          + compare_table(WEB_CARE, [("", "CARE", False), ("", "CARE +", True)],
                          grid="minmax(160px,2fr) repeat(2,minmax(80px,1fr))", sticky=False)
          + '</div></section>')

    # Comparación
    h += (f'<section style="border-top:1px solid rgba(0,0,0,.14)"><div style="{WRAP};'
          f'padding-top:clamp(56px,8vw,104px);padding-bottom:clamp(56px,8vw,104px)">'
          + section_head("Comparación", "Qué incluye cada plan")
          + compare_table(WEB_COMPARE, [("01", "Essential", False), ("02", "Premium", False),
                                        ("03", "Borsoga Edition", True)])
          + '</div></section>')

    h += servicios("/diseno-web/")
    h += cierre("¿No sabes cuál te toca?",
                "Cuéntanos el tipo de proyecto, el alcance y el plazo. Te mandamos una propuesta con "
                "el plan que te sirve.", "Solicitar propuesta", cta)
    return h + footer()


# ============================================================= DISEÑO GRÁFICO

def page_grafico():
    h = head(t("meta_t_grafico"),
             "Brand Identity, Social Media Design y Marketing & Graphic Design. Una sola dirección "
             "creativa, desde la identidad hasta cada punto de contacto.", "/diseno-grafico/")
    h += header("Solicitar propuesta", "#propuesta")
    cta = mailto("Propuesta de diseño gráfico")

    h += hero("Diseño gráfico", "Una sola dirección creativa",
              "Todos los productos comparten el mismo estándar de autoría, criterio y calidad. Lo que "
              "cambia no es el cuidado del diseño, sino el alcance del sistema. Así, el nivel Essential "
              "no se entiende como una versión recortada, sino como una solución completa a menor escala.")
    h += plan_nav([("brand", "LÍNEA 01", "Brand Identity"),
                   ("social", "LÍNEA 02", "Social Media Design"),
                   ("marketing", "LÍNEA 03", "Marketing &amp; Graphic Design")])

    h += (f'<section id="brand" style="{WRAP};padding-bottom:clamp(28px,4vw,44px);scroll-margin-top:88px">'
          f'<div style="{EYEBROW};margin-bottom:14px">{T("Línea 01")}</div>'
          f'<h2 style="{H2}">Brand Identity</h2></section>')

    left = (f'<div style="{COL_L}">'
            + plan_head("Plan 01", "Brand<br>Essentials",
                        "Una base visual completa. Clara, coherente y lista para crecer.",
                        "Identidad visual esencial para negocios que necesitan presentarse de forma "
                        "profesional sin construir todavía un sistema de marca extenso.", 1)
            + statbar([stat("1", "ronda de revisiones")])
            + f'<div style="margin-top:4px"><a href="{cta}" class="btn-d" style="{BTN}">Solicitar propuesta</a></div></div>')
    right = (f'<div style="{COL_R}">' + block("Incluye", BRAND_ESSENTIALS)
             + ideal("Emprendimientos, profesionales y negocios que necesitan una identidad visual seria, "
                     "coherente y lista para utilizarse.") + '</div>')
    h += wrapper("brand-01", left + right)

    left = (f'<div style="{COL_L}">'
            + plan_head("Plan 02", "Brand<br>Premium", "De una identidad visual a un sistema de marca.",
                        "Todo lo de Brand Essentials, con mayor profundidad conceptual, flexibilidad "
                        "gráfica y aplicaciones que permiten que la marca funcione de forma consistente "
                        "en distintos puntos de contacto.", 2, badge=True)
            + statbar([stat("2", "rondas de revisiones")])
            + f'<div style="margin-top:4px"><a href="{cta}" class="btn-d" style="{BTN}">Solicitar propuesta</a></div></div>')
    apps = ('<div><div style="' + LIST_HEAD + '">' + T("Aplicaciones posibles") + '</div>'
            '<ul style="display:flex;flex-direction:column;gap:7px;padding-top:14px">'
            + "".join(f'<li style="font-size:15px;line-height:1.5;color:rgba(0,0,0,.7)">{T(ap)}</li>'
                      for ap in BRAND_APLICACIONES) + '</ul></div>')
    right = (f'<div style="{COL_R}">'
             + inherit_box("Todo lo de Brand Essentials", BRAND_INHERIT_PREMIUM, 1)
             + block("Suma a Essentials", BRAND_PREMIUM) + apps
             + ideal("Marcas activas que necesitan verse consistentes en web, redes, materiales "
                     "comerciales y aplicaciones físicas o digitales.") + '</div>')
    h += wrapper("brand-02", left + right)

    left = (f'<div style="{COL_L}">'
            + plan_head("Plan 03", "Brand Borsoga<br>Edition",
                        "No un logo. Una dirección creativa construida alrededor de la marca.",
                        "Incluye todo lo de Brand Premium, pero el proyecto deja de centrarse únicamente "
                        "en la identidad y pasa a construir un ecosistema visual completo, preparado para "
                        "comunicación, campañas y crecimiento.", 3, white=True)
            + statbar([stat("3", "rondas de revisiones", True)], white=True)
            + f'<div style="margin-top:4px"><a href="{cta}" class="btn-w" style="{BTN}">Solicitar propuesta</a></div></div>')
    right = (f'<div style="{COL_R}">'
             + inherit_box("Todo lo de Brand Premium", BRAND_INHERIT_EDITION, 2, white=True)
             + "".join(block(t, i, white=True) for t, i in BRAND_EDITION_GROUPS)
             + ideal("Empresas que necesitan una identidad con profundidad, dirección creativa y un "
                     "sistema visual capaz de sostener múltiples canales y campañas.", white=True) + '</div>')
    h += wrapper("brand-03", left + right, white=True, last=True)

    h += transversal("El mismo estándar de diseño. Lo que cambia es la profundidad del sistema.")

    # Social — productos
    prods = "".join(
        f'<div class="m-tile" style="background:#fff;box-shadow:0 0 0 1px rgba(0,0,0,.14);padding:clamp(22px,2.6vw,32px);'
        f'display:flex;flex-direction:column;gap:12px">'
        f'<div style="font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;'
        f'color:rgba(0,0,0,.45)">{T(n)}</div>'
        f'<h3 style="margin:0;font-size:21px;font-weight:600;letter-spacing:-.02em">{T(tit)}</h3>'
        f'<p style="margin:0;font-size:15px;line-height:1.55;color:rgba(0,0,0,.68)">{T(d)}</p></div>'
        for n, tit, d in SOCIAL_PRODUCTS)
    h += (f'<section id="social" style="scroll-margin-top:68px;background:rgba(0,0,0,.025);'
          f'border-top:1px solid rgba(0,0,0,.14)"><div style="{WRAP};'
          f'padding-top:clamp(56px,8vw,104px);padding-bottom:clamp(56px,8vw,104px)">'
          + section_head("Línea 02", "Social Media Design",
                         "Contenido diseñado como un sistema visual, no como publicaciones aisladas. "
                         "Cada formato se considera un producto diferente porque cambia la cantidad de "
                         "diseño, narrativa, adaptación y edición necesaria. La identidad de la marca se "
                         "mantiene como base común en todos los formatos.")
          + f'<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1px">{prods}</div>'
          + f'<div style="margin-top:clamp(32px,4vw,48px);border-top:1px solid rgba(0,0,0,.14);padding-top:22px;max-width:70ch">'
          f'<div style="{EYEBROW};margin-bottom:10px">{T("Criterio de alcance")}</div>'
          f'<p style="margin:0;font-size:16px;line-height:1.6;color:rgba(0,0,0,.7)">' + T('Un post estático, un '
          'carrusel y un reel no se contabilizan como la misma unidad de trabajo. Cada formato tiene un '
          'nivel distinto de diseño, estructura, edición y producción; por eso puede cotizarse de forma '
          'independiente o combinarse dentro de planes mensuales.') + '</p></div></div></section>')

    # Social — planes
    h += (f'<section style="{WRAP};padding-top:clamp(56px,8vw,104px)">'
          + section_head("Planes mensuales", "Tres niveles de producción y acompañamiento") + '</section>')

    left = (f'<div style="{COL_L}">'
            + plan_head("Social · Plan 01", "Social<br>Essential",
                        "Presencia visual constante, sin perder coherencia de marca.",
                        "Plan mensual para negocios que necesitan mantener sus canales activos con una "
                        "línea gráfica clara y consistente.", 1)
            + statbar([stat("8", "piezas al mes")])
            + f'<div style="margin-top:4px"><a href="{cta}" class="btn-d" style="{BTN}">Solicitar propuesta</a></div></div>')
    right = (f'<div style="{COL_R}">' + block("Incluye", SOCIAL_ESSENTIAL)
             + ideal("Negocios que ya tienen una identidad definida y necesitan una presencia visual "
                     "estable y profesional en redes.") + '</div>')
    h += wrapper("social-01", left + right)

    left = (f'<div style="{COL_L}">'
            + plan_head("Social · Plan 02", "Social<br>Premium",
                        "Más formatos, más narrativa y una dirección visual mensual.",
                        "Todo lo de Social Essential, con una mezcla más completa de formatos y un mayor "
                        "nivel de dirección visual.", 2, badge=True)
            + statbar([stat("12–16", "piezas al mes")])
            + f'<div style="margin-top:4px"><a href="{cta}" class="btn-d" style="{BTN}">Solicitar propuesta</a></div></div>')
    right = (f'<div style="{COL_R}">'
             + inherit_box("Todo lo de Social Essential", SOCIAL_INHERIT, 1)
             + block("Suma a Essential", SOCIAL_PREMIUM)
             + ideal("Marcas activas que publican con frecuencia y necesitan diversidad de formatos sin "
                     "perder una dirección visual reconocible.") + '</div>')
    h += wrapper("social-02", left + right)

    left = (f'<div style="{COL_L}">'
            + plan_head("Social · Plan 03", "Social Borsoga<br>Edition",
                        "No más contenido. Más dirección creativa.",
                        "Borsoga funciona como una extensión del equipo creativo de la marca. El objetivo "
                        "no es aumentar únicamente la cantidad de publicaciones, sino dirigir cómo la marca "
                        "se ve, se mueve y comunica visualmente a lo largo del tiempo.", 3, white=True)
            + f'<div style="margin-top:4px"><a href="{cta}" class="btn-w" style="{BTN}">Solicitar propuesta</a></div></div>')
    right = (f'<div style="{COL_R}">'
             + "".join(block(t, i, white=True) for t, i in SOCIAL_EDITION_GROUPS)
             + ideal("Marcas que necesitan un equipo creativo externo capaz de sostener y dirigir su "
                     "presencia visual de manera continua.", white=True) + '</div>')
    h += wrapper("social-03", left + right, white=True, last=True)

    h += transversal("Misma dirección visual. Distinto nivel de producción y acompañamiento.")

    # Marketing
    grp = "".join(
        f'<div><div style="{LIST_HEAD}">{T(tit)}</div>'
        f'<ul style="display:flex;flex-direction:column;padding-top:4px">'
        + "".join(f'<li style="{LI}"><span style="{DOT}" aria-hidden="true"></span><span>{T(i)}</span></li>'
                  for i in items) + '</ul></div>'
        for tit, items in MARKETING_GROUPS)
    com = "".join(f'<li style="{LI}"><span style="{DOT}" aria-hidden="true"></span><span>{T(c)}</span></li>'
                  for c in COMERCIALIZACION)
    h += (f'<section id="marketing" style="scroll-margin-top:68px;border-top:1px solid rgba(0,0,0,.14);'
          f'background:rgba(0,0,0,.025)"><div style="{WRAP};'
          f'padding-top:clamp(56px,8vw,104px);padding-bottom:clamp(56px,8vw,104px)">'
          + section_head("Línea 03", "Marketing &amp; Graphic Design",
                         "Diseño aplicado a ventas, comunicación, campañas y materiales de marca. Esta "
                         "categoría agrupa proyectos que no pertenecen necesariamente a la creación de una "
                         "identidad ni a la producción mensual de redes sociales. Cada pieza se desarrolla "
                         "alrededor del sistema visual de la marca y se cotiza según alcance, extensión y complejidad.")
          + f'<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));'
          f'gap:clamp(28px,4vw,52px);background:#fff;border:1px solid rgba(0,0,0,.14);'
          f'padding:clamp(26px,4vw,44px)">{grp}</div>'
          + f'<div style="display:flex;flex-wrap:wrap;gap:clamp(28px,4vw,52px);margin-top:clamp(28px,4vw,44px)">'
          f'<div style="flex:1 1 380px"><div style="{LIST_HEAD}">{T("Cómo se comercializa")}</div><ul>{com}</ul></div>'
          f'<div style="flex:1 1 320px">'
          + ideal("Empresas que necesitan materiales comerciales o de comunicación específicos, diseñados "
                  "con el mismo criterio visual de su marca.")
          + f'<div style="margin-top:20px;border:1px solid rgba(0,0,0,.14);padding:18px 20px">'
          f'<div style="{EYEBROW};margin-bottom:8px">{T("No incluido por defecto")}</div>'
          f'<p style="margin:0;font-size:14px;line-height:1.6;color:rgba(0,0,0,.65)">' + T('Community management · '
          'Pauta publicitaria · Grabación presencial · Fotografía · Copywriting estratégico · Gestión de '
          'influencers. Se cotizan como servicios adicionales.') + '</p></div></div></div></div></section>')

    h += servicios("/diseno-grafico/")
    h += cierre("Una sola dirección creativa, desde la identidad hasta cada punto de contacto.",
                "Cuéntanos el tipo de proyecto, el alcance y el plazo. Te mandamos una propuesta.",
                "Solicitar propuesta", cta)
    return h + footer()


# ============================================================== VISUALIZACIÓN

def page_visualizacion():
    h = head(t("meta_t_interior"),
             "Tres planes de visualización de interiores en Florida: Essential, Premium y Borsoga "
             "Edition. Desde una habitación hasta la casa completa.", "/interior-design/")
    h += header("Empezar", "/configurador/")
    CFG = "/configurador/"

    h += hero("Interior design", "Elige hasta dónde llega tu proyecto",
              "Tres planes. Tú eliges cuántos espacios quieres diseñar, desde una habitación hasta la "
              "casa completa. El plan decide qué tan lejos llevamos cada uno.")
    h += plan_nav([("essential", "PLAN 01", "Essential"),
                   ("premium", "PLAN 02", "Premium"),
                   ("edition", "PLAN 03", "Borsoga Edition")])

    left = (f'<div style="{COL_L}">'
            + plan_head("Plan 01", "Essential", "Ve tu espacio antes de construirlo.", None, 1)
            + statbar([stat("2", "revisiones")])
            + ctas("Comienza tu proyecto", "Ver un proyecto real", CFG + "?plan=Essential") + '</div>')
    right = (f'<div style="{COL_R}">' + block("Incluye", INT_ESSENTIAL_INCLUYE)
             + block("Qué recibes", INT_ESSENTIAL_RECIBES) + excluye(INT_ESSENTIAL_NO) + '</div>')
    h += wrapper("essential", left + right)

    left = (f'<div style="{COL_L}">'
            + plan_head("Plan 02", "Premium",
                        "Para que se construya como lo diseñaste. Tu contratista y tu carpintero no "
                        "tienen que adivinar.", None, 2)
            + statbar([stat("3", "revisiones")])
            + ctas("Comienza tu experiencia", "Ver un proyecto real", CFG + "?plan=Premium") + '</div>')
    right = (f'<div style="{COL_R}">'
             + inherit_box("Todo lo del plan Essential", INT_INHERIT_PREMIUM, 1)
             + block("Y además", INT_PREMIUM_SUMA) + block("Qué recibes", INT_PREMIUM_RECIBES)
             + excluye(INT_PREMIUM_NO) + '</div>')
    h += wrapper("premium", left + right)

    left = (f'<div style="{COL_L}">'
            + plan_head("Plan 03", "Borsoga<br>Edition",
                        "El proyecto completo, con una idea detrás. Disponible en toda Florida.", None,
                        3, white=True)
            + statbar([stat("4", "revisiones", True), stat("2", "presenciales", True)], white=True)
            + ctas("Solicita tu Borsoga Edition", "Ver un proyecto real", CFG + "?plan=Borsoga+Edition", white=True) + '</div>')
    right = (f'<div style="{COL_R}">'
             + inherit_box("Todo lo del plan Premium", INT_INHERIT_EDITION, 2, white=True)
             + block("Y además", INT_EDITION_SUMA, white=True)
             + block("Qué recibes", INT_EDITION_RECIBES, white=True)
             + excluye(INT_EDITION_NO, white=True) + '</div>')
    h += wrapper("edition", left + right, white=True, last=True)

    # Extras
    ex = "".join(
        f'<article class="m-tile" style="border:1px solid rgba(0,0,0,.14);background:#fff;padding:clamp(26px,3vw,40px);'
        f'display:flex;flex-direction:column;gap:16px">'
        f'<div style="{EYEBROW}">{T(n)}</div>'
        f'<h3 style="margin:0;font-size:clamp(24px,3vw,32px);font-weight:600;letter-spacing:-.02em">{T(tit)}</h3>'
        f'<p style="margin:0;font-size:16px;line-height:1.55;color:rgba(0,0,0,.68)">{T(d)}</p>'
        f'<div style="border-top:1px solid rgba(0,0,0,.14);padding-top:16px">'
        f'<div style="font-size:11px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;'
        f'color:rgba(0,0,0,.45);margin-bottom:8px">' + t("como_se_entrega") + '</div>'
        f'<p style="margin:0;font-size:15px;line-height:1.55;color:rgba(0,0,0,.7)">{T(e)}</p></div>'
        f'<a href="{CFG}" class="btn-l" style="{BTN};margin-top:auto">' + t("pedir_cotizacion") + '</a></article>'
        for n, tit, d, e in INT_EXTRAS)
    h += (f'<section style="border-top:1px solid rgba(0,0,0,.14);background:rgba(0,0,0,.025)">'
          f'<div style="{WRAP};padding-top:clamp(56px,8vw,104px);padding-bottom:clamp(56px,8vw,104px)">'
          + section_head("Extras", "Dos formas de ver tu proyecto antes de que exista",
                         "Se cotizan aparte y funcionan con cualquiera de los tres planes.")
          + f'<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));'
          f'gap:clamp(20px,3vw,32px)">{ex}</div></div></section>')

    h += (f'<section style="border-top:1px solid rgba(0,0,0,.14)"><div style="{WRAP};'
          f'padding-top:clamp(56px,8vw,104px);padding-bottom:clamp(56px,8vw,104px)">'
          + section_head("Comparación", "Qué incluye cada plan")
          + compare_table(INT_COMPARE, [("01", "Essential", False), ("02", "Premium", False),
                                        ("03", "Borsoga Edition", True)])
          + '</div></section>')

    rev = "".join(
        f'<div class="m-tile" style="background:#fff;box-shadow:0 0 0 1px rgba(0,0,0,.14);padding:clamp(22px,2.6vw,30px);'
        f'display:flex;flex-direction:column;gap:14px">'
        f'<div style="font-size:34px;font-weight:600;letter-spacing:-.03em;line-height:1">{n}</div>'
        f'<p style="margin:0;font-size:16px;line-height:1.5;flex:1">{T(tit)}</p>'
        f'<div style="font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;'
        f'color:rgba(0,0,0,.45)">{T(w)}</div></div>'
        for n, tit, w in INT_REVISIONES)
    h += (f'<section style="border-top:1px solid rgba(0,0,0,.14);background:rgba(0,0,0,.025)">'
          f'<div style="{WRAP};padding-top:clamp(56px,8vw,104px);padding-bottom:clamp(56px,8vw,104px)">'
          + section_head("Revisiones", "Cómo funcionan las revisiones",
                         "Cada revisión tiene su momento y su tema.")
          + f'<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1px">{rev}</div>'
          f'</div></section>')

    cond = "".join(
        f'<div class="m-tile" style="background:#fff;box-shadow:0 0 0 1px rgba(0,0,0,.14);padding:clamp(22px,2.4vw,28px);'
        f'display:flex;flex-direction:column;gap:10px">'
        f'<div style="font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase">{T(tit)}</div>'
        f'<p style="margin:0;font-size:15px;line-height:1.55;color:rgba(0,0,0,.68)">{T(d)}</p></div>'
        for tit, d in INT_CONDICIONES)
    h += (f'<section style="border-top:1px solid rgba(0,0,0,.14)"><div style="{WRAP};'
          f'padding-top:clamp(56px,8vw,104px);padding-bottom:clamp(56px,8vw,104px)">'
          + section_head("Condiciones", "Lo que aplica a los tres planes")
          + f'<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1px">{cond}</div>'
          f'</div></section>')

    h += servicios("/interior-design/")
    h += cierre("¿No sabes cuál te toca?",
                "Responde seis preguntas sobre tu espacio y te enviamos un estimado en menos de 24 horas.",
                "Empezar", CFG, anchor="configurador")
    return h + footer()


# ======================================================================= HUB

def page_index():
    h = head("Planes y servicios — Borsoga Studio",
             "Diseño web, diseño gráfico y visualización de interiores. Los planes de Borsoga Studio, "
             "estudio de diseño en Miami, Florida.", "/")
    h += header("Escríbenos", mailto("Consulta — Borsoga Studio"))
    h += hero("Borsoga Studio", "Una sola autoría, cuatro servicios",
              "Cada servicio tiene sus propios planes, pero el criterio es el mismo: lo que cambia entre "
              "un plan y otro no es el cuidado del diseño, sino el alcance del sistema.")
    h += servicios("/")
    h += cierre("¿No sabes por dónde empezar?",
                "Cuéntanos el tipo de proyecto, el alcance y el plazo. Te decimos qué servicio y qué plan "
                "te sirven, y te mandamos una propuesta.",
                "Escríbenos", mailto("Consulta — Borsoga Studio"))
    return h + footer()


# ==================================================================== BUILD

SITEMAP_PRIO = {"/": "1.0", "/en/": "1.0", "/politica-de-privacidad/": "0.3"}


def _sitemap(rutas):
    """Se genera del mismo diccionario de páginas: no puede quedar desfasado."""
    from datetime import date
    hoy = date.today().isoformat()
    urls = "".join(
        f'  <url><loc>https://plans.borsogastudio.com{r}</loc>'
        f'<lastmod>{hoy}</lastmod><priority>{SITEMAP_PRIO.get(r, "0.8")}</priority></url>\n'
        for r in rutas)
    return ('<?xml version="1.0" encoding="UTF-8"?>\n'
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls + '</urlset>\n')


def _limpiar(vivos):
    """Borra páginas de builds anteriores.

    Sin esto, una ruta renombrada seguía desplegándose con su contenido viejo
    —que es justo lo que pasó al pasar /visualizacion/ a /interior-design/—.
    Recorre el árbol entero porque desde que hay /en/ las páginas ya no están
    todas al primer nivel.
    """
    if not os.path.isdir(OUT):
        return
    assets = os.path.join(OUT, "assets")
    for raiz, _, ficheros in os.walk(OUT):
        if raiz == assets or raiz.startswith(assets + os.sep):
            continue
        for f in ficheros:
            rel = os.path.relpath(os.path.join(raiz, f), OUT)
            if rel not in vivos:
                os.remove(os.path.join(raiz, f))
                print(f"  ✗ retirado {rel} (de un build anterior)")
    # y de paso los directorios que se hayan quedado sin nada dentro
    for raiz, _, _ in sorted(os.walk(OUT), key=len, reverse=True):
        if raiz in (OUT, assets) or raiz.startswith(assets + os.sep):
            continue
        if not os.listdir(raiz):
            os.rmdir(raiz)


# Páginas cuyo texto sale entero de i18n y por tanto pueden publicarse ya en
# inglés. Las demás todavía tienen frases escritas en español dentro del código
# (content.py, quiz.js, quiz_av.js, privacidad.py); publicarlas bajo /en/ sería
# publicar una página española con la URL cambiada, que es peor que no tenerla.
# Según se vayan extrayendo sus cadenas, se añaden aquí.
LISTAS_EN = {"index.html", "planes-av/index.html",
             "interior-design/index.html", "diseno-web/index.html",
             "diseno-grafico/index.html", "politica-de-privacidad/index.html",
             "configurador/index.html", "configurador-av/index.html"}


def _paginas():
    """Las ocho páginas, resueltas en el idioma que esté activo."""
    return {
        "index.html": pag_servicios.page(),
        "diseno-web/index.html": page_web(),
        "diseno-grafico/index.html": page_grafico(),
        "interior-design/index.html": page_visualizacion(),
        "politica-de-privacidad/index.html": privacidad.page(),
        "configurador/index.html": quiz.page(),
        "configurador-av/index.html": quiz_av.page(),
        "planes-av/index.html": planes_av.page(),
    }


def _salida(path, lang):
    """Fichero de destino de una página en un idioma, con el slug traducido."""
    url = "/" + path.replace("index.html", "")
    return ruta(url, lang).lstrip("/") + "index.html"


def _copiar_assets():
    """Lleva los ficheros de `assets/` a `build/assets/`.

    Existen porque el build no los genera: son fuentes (los dos logos, el
    favicon, el icono de iOS). Vivían dentro de `build/`, que está en
    .gitignore, así que un despliegue hecho desde el repositorio los habría
    dejado fuera y el sitio habría salido sin logo ni favicon —el build sólo
    reconstruye el HTML, y `upload.js` lo produce esbuild aparte.
    """
    origen = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "assets")
    if not os.path.isdir(origen):
        return
    destino = os.path.join(OUT, "assets")
    os.makedirs(destino, exist_ok=True)
    for f in sorted(os.listdir(origen)):
        if f.startswith("."):
            continue
        shutil.copy2(os.path.join(origen, f), os.path.join(destino, f))
    print(f"  assets/ → build/assets/ ({len(os.listdir(origen))} ficheros)")


def main():
    pages, urls = {}, []
    for lang in IDIOMAS:
        usar(lang)
        # rutas que existen en este idioma: el resto de enlaces se dejan en español
        vivas = {"/" + p.replace("index.html", "")
                 for p in _paginas() if lang == ORIGEN or p in LISTAS_EN}
        for path, html in _paginas().items():
            if lang != ORIGEN and path not in LISTAS_EN:
                continue
            destino = _salida(path, lang)
            pages[destino] = localizar_enlaces(html, lang, vivas)
            # Los configuradores no se indexan: son herramientas, no entradas.
            if "configurador" not in path and "configurator" not in destino:
                urls.append("/" + destino.replace("index.html", ""))
    usar(ORIGEN)

    pages["sitemap.xml"] = _sitemap(sorted(set(urls)))
    pages["robots.txt"] = ("User-agent: *\nAllow: /\n\n"
                           "Sitemap: https://plans.borsogastudio.com/sitemap.xml\n")

    _copiar_assets()
    _limpiar(set(pages))
    for path, html in sorted(pages.items()):
        full = os.path.join(OUT, path)
        os.makedirs(os.path.dirname(full), exist_ok=True)
        open(full, "w", encoding="utf-8").write(html)
        print(f"  {path:36s} {len(html.encode()):>8,} bytes")

    pend = sin_traducir()
    if pend:
        print(f"\n  ⚠ {len(pend)} cadenas siguen en español dentro de las páginas inglesas")
    falt = faltantes()
    if falt:
        print(f"  ⚠ {len(falt)} claves no existen en el idioma pedido")
    no_en = sorted(set(_paginas()) - LISTAS_EN)
    if no_en:
        print(f"  · sin versión inglesa todavía: {', '.join(x.replace('/index.html','') for x in no_en)}")


if __name__ == "__main__":
    main()
