# -*- coding: utf-8 -*-
"""Página de planes de Architectural Visualization.

Portada del artboard 'Planes Architectural Visualization'. A diferencia de las
otras páginas de planes, ésta está escrita entera en claves i18n, así que los
textos se resuelven desde `i18n/es.js` en vez de estar transcritos aquí.

Los CTA llevan al configurador AV con el plan en la URL. El diseño usa valores
en minúscula (`?plan=essential`); el configurador acepta los nombres visibles,
así que se traducen al construir en vez de tocar la lógica del cliente.
"""
from i18n_load import t
from shell import (head, header, footer, cierre, WRAP, EYEBROW, H2, CARD, COL_L, COL_R,
                   LIST_HEAD, LI, DOT, BTN, rings, bullets, block, stat, statbar,
                   inherit_box, excluye, compare_table, section_head, transversal, servicios)

CFG = "/configurador-av/"
PLAN_URL = {"Essential": "Essential", "Premium": "Premium", "Borsoga Edition": "Borsoga+Edition"}

COMPARE = [
    ["Modelado 3D", True, True, True],
    ["Vistas por escena", "2", "4", "4"],
    ["Condiciones de luz", "1", "2", "2"],
    ["Ambientación", "Básica", "Completa", "Completa"],
    ["Detalles de materiales", False, True, True],
    ["Video de recorrido", False, True, True],
    ["Resolución", "Alta", "Impresión", "10K"],
    ["Dirección de arte", False, False, True],
    ["Video cinemático", False, False, True],
    ["Post-producción avanzada", False, False, True],
    ["Escena nocturna", False, False, True],
    ["Piezas verticales para redes", False, False, True],
    ["Revisiones", "2", "3", "4"],
]

CONDICIONES = [("donde_trabajamos", "av_c1"), ("av_c_need", "av_c2"), ("av_c_scenes", "av_c3"),
               ("los_archivos", "av_c4"), ("cuanto_tarda", "av_c5"), ("como_se_paga", "av_c6"),
               ("que_firmas", "av_c7"), ("lo_que_no_esta_en_tu", "av_c8")]

REVISIONES = [("1", "av_r1", "en_los_tres_planes"), ("2", "av_r2", "en_los_tres_planes"),
              ("3", "av_r3", "premium_y_edition"), ("4", "av_r4", "solo_edition")]

EXTRAS = [("extra_01", "borsoga_immersive", "av_x1_d", "av_x1_h"),
          ("extra_02", "tour_360", "av_x2_d", "av_x2_h"),
          ("av_extra_03", "av_x3_t", "av_x3_d", "av_x3_h"),
          ("av_extra_04", "av_x4_t", "av_x4_d", "av_x4_h")]

PRUEBA = [("Essential", "av_proof_d1", "av_slot1"), ("Premium", "av_proof_d2", "av_slot2"),
          ("Borsoga Edition", "av_proof_d3", "av_slot3")]


def _plan(pid, num, nombre, linea, stats, cta, incluye, recibe, no_incluye,
          ringn, hereda=None, white=False, last=False):
    left = (f'<div style="{COL_L}">'
            f'<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:20px">'
            f'<div style="font-size:11px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;'
            f'color:{"rgba(255,255,255,.5)" if white else "rgba(0,0,0,.45)"};padding-top:6px">{num}</div>'
            f'{rings(ringn, white)}</div>'
            f'<h2 style="margin:0;font-size:clamp(32px,5vw,54px);font-weight:600;letter-spacing:-.03em;line-height:1">{nombre}</h2>'
            f'<p style="margin:0;font-size:clamp(18px,1.7vw,23px);font-weight:300;line-height:1.4;'
            f'color:{"#fff" if white else "#000"}">{linea}</p>'
            + statbar(stats, white=white)
            + f'<div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:4px">'
              f'<a href="{CFG}?plan={PLAN_URL[cta[1]]}" class="{"btn-w" if white else "btn-d"}" '
              f'style="{BTN};flex:1 1 190px">{cta[0]}</a>'
              f'<a href="#prueba" class="{"btn-o" if white else "btn-l"}" '
              f'style="{BTN};flex:1 1 190px">{t("ver_un_proyecto_real")}</a></div></div>')
    right = f'<div style="{COL_R}">'
    if hereda:
        right += inherit_box(hereda[0], hereda[1], hereda[2], white=white)
    right += block(t("incluye") if not hereda else t("y_ademas"), incluye, white=white)
    right += block(t("que_recibes"), recibe, white=white)
    right += excluye(no_incluye, white=white)
    right += "</div>"
    card = (f'background:#000;color:#fff;padding:clamp(26px,4vw,58px);display:flex;'
            f'flex-wrap:wrap;gap:clamp(30px,4vw,64px)') if white else CARD
    pb = "clamp(56px,8vw,104px)" if last else "clamp(16px,2vw,24px)"
    return (f'<section id="{pid}" style="{WRAP};padding-bottom:{pb};scroll-margin-top:88px">'
            f'<article class="m-card" style="{card}">{left}{right}</article></section>')


def page():
    h = head(t("meta_t_av"),
             t("av_lead")[:155], "/planes-av/")
    h += header(t("empezar"), "#cierre")

    # ---------------------------------------------------------------- hero
    h += (f'<section class="m-hero" style="{WRAP};padding-top:clamp(56px,10vw,132px);padding-bottom:clamp(40px,6vw,72px)">'
          f'<div class="m-eyebrow" style="{EYEBROW};margin-bottom:clamp(24px,4vw,40px)">{t("av_eyebrow")}</div>'
          f'<h1 style="margin:0;font-size:clamp(38px,7.4vw,78px);font-weight:600;letter-spacing:-.035em;'
          f'line-height:.98;max-width:16ch">{t("av_title")}</h1>'
          f'<p style="margin:clamp(24px,4vw,40px) 0 0;font-size:clamp(17px,1.7vw,22px);font-weight:300;'
          f'line-height:1.5;color:rgba(0,0,0,.68);max-width:56ch">{t("av_lead")}</p></section>')

    nav = "".join(
        f'<a href="#{i}" class="pnav" style="flex:1 1 150px;background:#fff;padding:18px 20px;'
        f'display:flex;flex-direction:column;gap:6px">'
        f'<span style="font-size:10px;font-weight:600;letter-spacing:.2em;color:rgba(0,0,0,.42)">{n}</span>'
        f'<span style="font-size:16px;font-weight:600;letter-spacing:-.01em">{p}</span></a>'
        for i, n, p in [("essential", "PLAN 01", t("essential")), ("premium", "PLAN 02", t("premium")),
                        ("edition", "PLAN 03", t("borsoga_edition"))])
    h += (f'<nav style="{WRAP};padding-bottom:clamp(40px,6vw,64px)">'
          f'<div style="display:flex;flex-wrap:wrap;gap:1px;background:rgba(0,0,0,.12);'
          f'border:1px solid rgba(0,0,0,.12)">{nav}</div></nav>')

    # ---------------------------------------------------------------- planes
    h += _plan("essential", t("plan_01"), t("essential"), t("av_p1_line"),
               [stat("2", t("revisiones_2"))], (t("comienza_tu_proyecto"), "Essential"),
               [t(f"av_p1_i{i}") for i in range(1, 8)], [t("av_p1_g1")], t("av_p1_not"), 1)
    h += _plan("premium", t("plan_02"), t("premium"), t("av_p2_line"),
               [stat("3", t("revisiones_2"))], (t("comienza_tu_experiencia"), "Premium"),
               [t(f"av_p2_a{i}") for i in range(1, 8)], [t("av_p2_g1"), t("av_p2_g2")], t("av_p2_not"), 2,
               hereda=(t("todo_lo_del_plan_essential"), t("av_p2_inherit"), 1))
    h += _plan("edition", t("plan_03"), f'{t("borsoga")}<br>{t("edition")}', t("av_p3_line"),
               [stat("4", t("revisiones_2"), True), stat("10K", t("av_renders"), True)],
               (t("solicita_tu_borsoga_edition"), "Borsoga Edition"),
               [t(f"av_p3_a{i}") for i in range(1, 8)], [t(f"av_p3_g{i}") for i in range(1, 6)],
               t("av_p3_not"), 3, hereda=(t("todo_lo_del_plan_premium"), t("av_p3_inherit"), 2),
               white=True, last=True)

    # ------------------------------------------------------------ developers
    h += (f'<section style="border-top:1px solid rgba(0,0,0,.14);border-bottom:1px solid rgba(0,0,0,.14)">'
          f'<div style="{WRAP};padding-top:clamp(28px,4vw,44px);padding-bottom:clamp(28px,4vw,44px);'
          f'display:flex;flex-wrap:wrap;gap:16px;align-items:baseline;justify-content:space-between">'
          f'<span style="font-size:clamp(17px,2vw,22px);font-weight:300">{t("av_dev_q")}</span>'
          f'<a href="/?form=developer" class="nav-m" style="font-size:12px;font-weight:600;'
          f'letter-spacing:.1em;text-transform:uppercase;border-bottom:1px solid #000;padding-bottom:2px">'
          f'{t("av_dev_link")}</a></div></section>')

    # ---------------------------------------------------------------- prueba
    tarjetas = "".join(
        f'<div class="m-tile" style="background:#fff;box-shadow:0 0 0 1px rgba(0,0,0,.14)">'
        f'<div style="aspect-ratio:4/3;background:rgba(0,0,0,.04);display:flex;align-items:center;'
        f'justify-content:center;font-size:12px;letter-spacing:.08em;text-transform:uppercase;'
        f'color:rgba(0,0,0,.32);text-align:center;padding:16px">{t(ph)}</div>'
        f'<div style="padding:20px 22px">'
        f'<div style="font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;'
        f'color:rgba(0,0,0,.45);margin-bottom:6px">{label}</div>'
        f'<p style="margin:0;font-size:15px;line-height:1.55;color:rgba(0,0,0,.68)">{t(desc)}</p></div></div>'
        for label, desc, ph in PRUEBA)
    h += (f'<section id="prueba" style="background:rgba(0,0,0,.025);scroll-margin-top:68px">'
          f'<div style="{WRAP};padding-top:clamp(56px,8vw,104px);padding-bottom:clamp(56px,8vw,104px)">'
          + section_head(t("av_proof_eyebrow"), t("av_proof_title"), t("av_proof_lead"))
          + f'<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));'
            f'gap:clamp(20px,3vw,28px)">{tarjetas}</div></div></section>')

    # ---------------------------------------------------------------- extras
    defs = "".join(
        f'<div style="flex:1 1 280px;border-left:2px solid #000;padding-left:18px">'
        f'<div style="{EYEBROW};margin-bottom:8px">{t(tt)}</div>'
        f'<p style="margin:0;font-size:15px;line-height:1.6;color:rgba(0,0,0,.7)">{t(dd)}</p></div>'
        for tt, dd in [("av_def_view_t", "av_def_view_d"), ("av_def_scene_t", "av_def_scene_d")])
    ex = "".join(
        f'<article class="m-tile" style="border:1px solid rgba(0,0,0,.14);background:#fff;'
        f'padding:clamp(26px,3vw,36px);display:flex;flex-direction:column;gap:14px">'
        f'<div style="{EYEBROW}">{t(n)}</div>'
        f'<h3 style="margin:0;font-size:clamp(21px,2.4vw,26px);font-weight:600;letter-spacing:-.02em">{t(nombre)}</h3>'
        f'<p style="margin:0;font-size:15px;line-height:1.55;color:rgba(0,0,0,.68)">{t(desc)}</p>'
        f'<div style="border-top:1px solid rgba(0,0,0,.14);padding-top:14px">'
        f'<div style="{EYEBROW};margin-bottom:6px">{t("como_se_entrega")}</div>'
        f'<p style="margin:0;font-size:14px;line-height:1.55;color:rgba(0,0,0,.7)">{t(how)}</p></div>'
        f'<a href="{CFG}" class="btn-l" style="{BTN};margin-top:auto">{t("pedir_cotizacion")}</a></article>'
        for n, nombre, desc, how in EXTRAS)
    h += (f'<section style="border-top:1px solid rgba(0,0,0,.14)"><div style="{WRAP};'
          f'padding-top:clamp(56px,8vw,104px);padding-bottom:clamp(56px,8vw,104px)">'
          + section_head(t("extras"), t("av_extras_title"), t("av_extras_lead"))
          + f'<div style="display:flex;flex-wrap:wrap;gap:clamp(24px,4vw,44px);'
            f'margin-bottom:clamp(32px,5vw,52px)">{defs}</div>'
          + f'<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));'
            f'gap:clamp(18px,2.4vw,26px)">{ex}</div></div></section>')

    # ---------------------------------------------------------- comparativa
    h += (f'<section style="border-top:1px solid rgba(0,0,0,.14);background:rgba(0,0,0,.025)">'
          f'<div style="{WRAP};padding-top:clamp(56px,8vw,104px);padding-bottom:clamp(56px,8vw,104px)">'
          + section_head(t("comparacion"), t("que_incluye_cada_plan"))
          + compare_table(COMPARE, [("01", t("essential"), False), ("02", t("premium"), False),
                                    ("03", t("borsoga_edition"), True)])
          + '</div></section>')

    # ---------------------------------------------------------- revisiones
    rev = "".join(
        f'<div class="m-tile" style="background:#fff;box-shadow:0 0 0 1px rgba(0,0,0,.14);'
        f'padding:clamp(22px,2.6vw,30px);display:flex;flex-direction:column;gap:14px">'
        f'<div style="font-size:34px;font-weight:600;letter-spacing:-.03em;line-height:1">{n}</div>'
        f'<p style="margin:0;font-size:16px;line-height:1.5;flex:1">{t(txt)}</p>'
        f'<div style="{EYEBROW}">{t(quien)}</div></div>'
        for n, txt, quien in REVISIONES)
    h += (f'<section style="border-top:1px solid rgba(0,0,0,.14)"><div style="{WRAP};'
          f'padding-top:clamp(56px,8vw,104px);padding-bottom:clamp(56px,8vw,104px)">'
          + section_head(t("revisiones"), t("como_funcionan_las_revisiones"), t("av_rev_lead"))
          + f'<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1px">{rev}</div>'
          f'</div></section>')

    # --------------------------------------------------------- condiciones
    cond = "".join(
        f'<div class="m-tile" style="background:#fff;box-shadow:0 0 0 1px rgba(0,0,0,.14);'
        f'padding:clamp(22px,2.4vw,28px);display:flex;flex-direction:column;gap:10px">'
        f'<div style="font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase">{t(k)}</div>'
        f'<p style="margin:0;font-size:15px;line-height:1.55;color:rgba(0,0,0,.68)">{t(v)}</p></div>'
        for k, v in CONDICIONES)
    h += (f'<section style="border-top:1px solid rgba(0,0,0,.14);background:rgba(0,0,0,.025)">'
          f'<div style="{WRAP};padding-top:clamp(56px,8vw,104px);padding-bottom:clamp(56px,8vw,104px)">'
          + section_head(t("condiciones"), t("lo_que_aplica_a_los_tres"))
          + f'<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1px">{cond}</div>'
          f'</div></section>')

    h += servicios("/planes-av/")
    h += cierre(t("av_close_title"), t("av_close_lead"), t("av_close_cta"), CFG, anchor="cierre")
    return h + footer()
