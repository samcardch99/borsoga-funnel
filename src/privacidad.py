# -*- coding: utf-8 -*-
"""Política de privacidad. Redactada a partir de los datos que el cuestionario
de Interior Design recoge realmente (ver artboard 'Cuestionario Interior Design').

El texto describe lo que el sitio hace de verdad: qué campos se guardan, dónde
van los archivos y con qué proveedores se comparten. Si cambia el tratamiento
—un proveedor nuevo, otro plazo de conservación— hay que cambiarlo aquí, porque
es la única descripción publicada de ese tratamiento.
"""
from i18n_load import T, t
from shell import head, header, footer, cierre, WRAP, EYEBROW, H2

ACTUALIZADA = "27 de agosto de 2026"
MAIL = "borsogastudio@gmail.com"

P = "margin:0 0 18px;font-size:16px;line-height:1.65;color:rgba(0,0,0,.78)"
H3 = "margin:0 0 16px;font-size:clamp(20px,2.4vw,26px);font-weight:600;letter-spacing:-.02em;line-height:1.2"
LI = "font-size:16px;line-height:1.6;color:rgba(0,0,0,.78);padding:9px 0 9px 22px;position:relative"
BULLET = ('<span style="position:absolute;left:0;top:17px;width:6px;height:6px;border-radius:50%;'
          'background:rgba(0,0,0,.4)" aria-hidden="true"></span>')

SECCIONES = [
    ("Quién trata tus datos", [
        ("p", "Borsoga LLC, con domicilio en Miami, Florida (Estados Unidos), es responsable de la "
              "información que recoges y envías a través de este sitio. En este documento nos referimos "
              "a nosotros como «Borsoga Studio» o «el estudio»."),
        ("p", f"Para cualquier asunto relacionado con tus datos puedes escribirnos a "
              f'<a href="mailto:{MAIL}" style="border-bottom:1px solid rgba(0,0,0,.3)">{MAIL}</a>.'),
    ]),
    ("Qué información recogemos", [
        ("p", "Solo pedimos lo que necesitamos para preparar tu propuesta y, si contratas, para redactar "
              "el contrato. No compramos bases de datos ni recogemos información por tu cuenta."),
        ("h", "Datos de contacto e identificación"),
        ("ul", ["Tu nombre legal completo, correo electrónico y teléfono.",
                "Si firmas como empresa: el nombre legal de la entidad, su estado de registro, quién "
                "firma y su cargo.",
                "Si no eres el dueño de la propiedad: el nombre y el correo del dueño, porque es quien "
                "tiene que firmar el contrato."]),
        ("h", "Datos del proyecto"),
        ("ul", ["La dirección del inmueble donde se haría el proyecto.",
                "Tus respuestas sobre el tipo de proyecto, los espacios, el tamaño, el nivel de acabado, "
                "los plazos y quién toma la decisión.",
                "El rango de inversión que nos indiques, si decides compartirlo. Es opcional.",
                "Si ya trabajas con un contratista o un arquitecto."]),
        ("h", "Archivos que subes"),
        ("ul", ["Fotografías del interior del inmueble.",
                "Planos, fichas técnicas de electrodomésticos y otros documentos que nos envíes."]),
        ("h", "Datos técnicos"),
        ("ul", ["Guardamos tus respuestas en el almacenamiento local de tu navegador para que puedas "
                "salir del cuestionario y retomarlo donde lo dejaste.",
                "Nuestro servidor registra datos de conexión habituales, como la dirección IP y el "
                "navegador, por seguridad y para detectar envíos automatizados."]),
    ]),
    ("Para qué usamos tu información", [
        ("ul", ["Preparar el estimado y la propuesta de tu proyecto.",
                "Contactarte para resolver dudas o agendar una llamada o una visita.",
                "Redactar el contrato y gestionar el pago si decides contratarnos.",
                "Enviarte un enlace para retomar el cuestionario si lo dejas a medias.",
                "Evitar envíos automatizados, spam y usos abusivos del formulario."]),
        ("p", "<strong>No usamos tus datos para publicidad ni te inscribimos en newsletters.</strong> "
              "Si en algún momento queremos escribirte por algo distinto de tu proyecto, te lo "
              "pediremos aparte."),
    ]),
    ("Las fotos de tu espacio", [
        ("p", "Sabemos que son fotos del interior de tu casa o de tu local, así que las tratamos con el "
              "mismo cuidado que los datos de contacto."),
        ("ul", ["Se guardan en almacenamiento privado, no en una carpeta pública ni indexable.",
                "Las ve únicamente el equipo de Borsoga Studio que trabaja en tu proyecto.",
                "No las compartimos con terceros, no las vendemos y no las usamos para entrenar "
                "sistemas de inteligencia artificial.",
                "No las publicamos en nuestro portafolio ni en redes sociales salvo que nos des permiso "
                "expreso. En el cuestionario te preguntamos por ello y lo confirmamos por escrito en el "
                "contrato. Puedes decir que no y no cambia nada del servicio."]),
    ]),
    ("Con quién la compartimos", [
        ("p", "No vendemos tu información. La compartimos únicamente con proveedores que necesitamos "
              "para operar, y solo con lo imprescindible:"),
        ("ul", ["Nuestro proveedor de alojamiento web y de correo, para almacenar la información y "
                "enviarte mensajes.",
                "Nuestro procesador de pagos, si contratas, para cobrar el anticipo. El estudio no "
                "guarda los números de tu tarjeta ni de tu cuenta.",
                "Nuestro proveedor de firma electrónica, si contratas, para que firmes el contrato.",
                "Un contratista, arquitecto o ingeniero, solo cuando tu proyecto lo requiera y "
                "únicamente si nos lo autorizas."]),
        ("p", "También podríamos tener que entregar información si nos lo exige una autoridad o una "
              "orden judicial."),
    ]),
    ("Cuánto tiempo la guardamos", [
        ("ul", ["Si nos escribes y no llegamos a trabajar juntos, conservamos tu consulta hasta "
                "<strong>24 meses</strong> y después la eliminamos.",
                "Si contratas, conservamos el expediente del proyecto mientras dure la relación y "
                "después el tiempo que exijan las obligaciones contables y fiscales aplicables en "
                "Florida.",
                "Puedes pedirnos que borremos tus datos antes de esos plazos, salvo que tengamos una "
                "obligación legal de conservarlos."]),
    ]),
    ("Cómo la protegemos", [
        ("p", "El sitio se sirve por conexión cifrada (HTTPS). Los archivos que subes se guardan en un "
              "área privada con acceso restringido y las cuentas del estudio están protegidas con "
              "contraseñas propias. Ningún sistema es infalible: si llegara a producirse una brecha que "
              "afecte a tu información, te lo comunicaríamos."),
    ]),
    ("Tus derechos", [
        ("p", "Escríbenos y te atendemos, vengas de donde vengas. Puedes pedirnos:"),
        ("ul", ["Acceder a la información que tenemos sobre ti.",
                "Corregir cualquier dato incorrecto.",
                "Eliminar tu información.",
                "Una copia de tus datos en un formato que puedas reutilizar.",
                "Retirar tu consentimiento en cualquier momento, incluido el permiso para publicar tu "
                "proyecto."]),
        ("p", "Respondemos en un plazo máximo de 30 días. No cobramos por ello y no te penalizamos por "
              "ejercer estos derechos."),
    ]),
    ("Cookies y almacenamiento local", [
        ("p", "Este sitio no usa cookies de publicidad ni de seguimiento de terceros. El cuestionario "
              "usa el almacenamiento local de tu navegador para guardar tus respuestas a medida que "
              "avanzas, de modo que no las pierdas si cierras la página. Esa información se queda en tu "
              "dispositivo y puedes borrarla vaciando los datos del sitio en tu navegador."),
    ]),
    ("Menores", [
        ("p", "Este sitio está dirigido a personas adultas. No recogemos deliberadamente información de "
              "menores de 18 años. Si detectamos que hemos recibido datos de un menor, los eliminamos."),
    ]),
    ("Cambios en esta política", [
        ("p", "Si cambiamos algo, actualizamos la fecha del encabezado. Cuando el cambio sea "
              "significativo y afecte a proyectos en curso, lo avisamos por correo."),
    ]),
]


def render_body(items):
    out = []
    for kind, val in items:
        if kind == "p":
            out.append(f'<p style="{P}">{T(val)}</p>')
        elif kind == "h":
            out.append(f'<div style="{EYEBROW};margin:26px 0 12px">{T(val)}</div>')
        elif kind == "ul":
            li = "".join(f'<li style="{LI}">{BULLET}{T(x)}</li>' for x in val)
            out.append(f'<ul style="margin:0 0 18px">{li}</ul>')
    return "".join(out)


def page():
    h = head(t("meta_t_privacidad"), T("Qué información recoge Borsoga Studio, para qué la usa, con quién la comparte y qué derechos tienes sobre ella."), "/politica-de-privacidad/")
    h += header(T("Volver al inicio"), "/", nav_href="/#servicios")

    h += (f'<section class="m-hero" style="{WRAP};max-width:min(100%,860px);padding-top:clamp(48px,8vw,96px);'
          f'padding-bottom:clamp(28px,4vw,44px)">'
          f'<div class="m-eyebrow" style="{EYEBROW};margin-bottom:clamp(20px,3vw,32px)">{T("Legal")}</div>'
          f'<h1 style="margin:0;font-size:clamp(34px,6vw,62px);font-weight:600;letter-spacing:-.035em;'
          f'line-height:1;max-width:16ch">{t("chrome_privacy")}</h1>'
          f'<p style="margin:clamp(20px,3vw,30px) 0 0;font-size:17px;font-weight:300;line-height:1.55;'
          f'color:rgba(0,0,0,.65);max-width:58ch">' + T('Este documento explica qué información nos das al usar '
          'este sitio y nuestro cuestionario, qué hacemos con ella y qué puedes pedirnos en cualquier '
          'momento. Está escrito para que se entienda, no para protegernos a nosotros.') + '</p>'
          f'<p style="margin:22px 0 0;font-size:12px;font-weight:600;letter-spacing:.12em;'
          f'text-transform:uppercase;color:rgba(0,0,0,.45)">{T("Última actualización")}: {T(ACTUALIZADA)}</p>'
          f'</section>')

    # índice
    idx = "".join(
        f'<li><a href="#s{i}" style="font-size:15px;line-height:1.5;color:rgba(0,0,0,.7);'
        f'display:block;padding:8px 0;border-bottom:1px solid rgba(0,0,0,.08)">'
        f'<span style="color:rgba(0,0,0,.35);margin-right:10px">{i:02d}</span>{T(tit)}</a></li>'
        for i, (tit, _) in enumerate(SECCIONES, 1))
    h += (f'<section style="{WRAP};max-width:min(100%,860px);padding-bottom:clamp(40px,6vw,64px)">'
          f'<nav style="border:1px solid rgba(0,0,0,.14);padding:clamp(22px,3vw,30px)" '
          f'aria-label="{T("Índice de la política")}">'
          f'<div style="{EYEBROW};margin-bottom:12px">{T("En esta página")}</div>'
          f'<ul>{idx}</ul></nav></section>')

    secs = "".join(
        f'<section id="s{i}" style="scroll-margin-top:88px;padding-bottom:clamp(34px,5vw,52px);'
        f'border-bottom:1px solid rgba(0,0,0,.1);margin-bottom:clamp(34px,5vw,52px)">'
        f'<div style="{EYEBROW};margin-bottom:14px">{i:02d}</div>'
        f'<h2 style="{H3}">{T(tit)}</h2>{render_body(body)}</section>'
        for i, (tit, body) in enumerate(SECCIONES, 1))
    h += (f'<div style="{WRAP};max-width:min(100%,860px);padding-bottom:clamp(20px,3vw,32px)">{secs}'
          f'<div style="border:1px solid rgba(0,0,0,.14);padding:clamp(24px,3vw,34px)">'
          f'<div style="{EYEBROW};margin-bottom:12px">{T("Contacto")}</div>'
          f'<h2 style="{H3}">{T("¿Alguna duda sobre tus datos?")}</h2>'
          f'<p style="{P}">{T("Escríbenos a")} '
          f'<a href="mailto:{MAIL}" style="border-bottom:1px solid rgba(0,0,0,.3)">{MAIL}</a> '
          f'{T("y te respondemos. Borsoga LLC · Miami, Florida.")}</p></div></div>')

    return h + footer()
