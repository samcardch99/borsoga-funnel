"""Cuestionario de Mutati: «Unas preguntas antes de arrancar».

Página temporal en /mutati/, fuera del sitemap y con noindex. Transcribe el
documento que el estudio le pasó a Mutati (diez preguntas, todas opcionales) y
manda las respuestas al correo del estudio a través de `api/mutati.ts`.

Va con la identidad de Mutati y no con la de Borsoga: la contesta el cliente.
Los colores y la tipografía salen de la hoja de estilos de mutatidesign.com
(`--color-light`, `--color-brown`, `--color-bone`, `--color-red`; Montserrat), y
los dos SVG son el logotipo y el monograma tal cual están en esa web.

Las preguntas del correo viven también en `api/mutati.ts`: si se cambia una
aquí, hay que cambiarla allí.
"""

import html as _html

LOGOTIPO = """<svg viewBox="0 0 371 67" fill="none" role="img" aria-label="Mutati">
<path d="M13.5926 27.3716V64.9939H0V2.70471H13.6196L35.4273 42.599L57.6132 2.70471H70.8816V65.021H57.289V27.5339L35.5894 66.9413L13.5926 27.3716Z" fill="currentColor"/>
<path d="M91.5542 34.4849V2.70471H105.255V34.4849C105.255 46.3045 109.903 53.1473 121.09 53.1473C132.278 53.1473 136.926 46.3045 136.926 34.5661V2.70471H150.789V34.5661C150.789 53.7153 140.547 65.8324 121.09 65.8324C101.634 65.8324 91.5542 53.8235 91.5542 34.4849Z" fill="currentColor"/>
<path d="M184.757 15.1193H164.976L164.895 2.67767H217.995V15.1193H198.242V64.994H184.784V15.1193H184.757Z" fill="currentColor"/>
<path d="M254.179 0L289.877 64.9939H275.23L268.934 53.2555H239.236L232.966 64.9939H218.022L254.179 0ZM262.854 41.9228L254.017 25.4783L245.235 41.9228H262.827H262.854Z" fill="currentColor"/>
<path d="M308.793 15.1193H289.012L288.931 2.67767H342.032V15.1193H322.278V64.994H308.82V15.1193H308.793Z" fill="currentColor"/>
<path d="M357.326 2.70471H371V65.021H357.326V2.70471Z" fill="currentColor"/>
</svg>"""

MONOGRAMA = """<svg viewBox="0 0 45 52" fill="none" aria-hidden="true">
<path d="M21.5013 19.2784L25.9514 9.45455L36.7314 33.9034H45V36.7841H37.1867V51.9557H34.3228V36.7841H27.611C27.5669 38.5568 27.6844 40.3295 27.611 42.1023C27.4347 46.992 25.452 51.1875 20.1795 51.8818C13.688 52.7386 9.41417 48.8386 9.28199 42.3386V27.3148H12.2193V42.9443C12.5571 47.1989 15.0392 49.3409 19.2689 49.0602C22.735 48.8386 24.4533 46.3125 24.6736 43.0182V28.792H20.4586L18.564 33.1205L15.3916 33.15L18.564 25.9261V9.51364L11.6759 19.6773C11.6172 19.7659 11.5437 19.7659 11.4703 19.7659C11.1913 19.8102 10.4129 19.7955 10.1191 19.7659C9.78133 19.7364 9.81071 19.5886 9.61978 19.3523L2.8639 9.45455V51.9557H0V0.0590909L10.78 15.8364L21.5013 0V19.2784ZM21.795 25.8523H29.9755L25.9073 16.708L21.7804 25.8523H21.795ZM33.5297 33.9034L31.2386 28.8068H27.611V33.9034H33.5297Z" fill="currentColor"/>
<path d="M40.6969 31.7761C42.1813 31.7761 43.3846 30.5658 43.3846 29.0727C43.3846 27.5797 42.1813 26.3693 40.6969 26.3693C39.2126 26.3693 38.0093 27.5797 38.0093 29.0727C38.0093 30.5658 39.2126 31.7761 40.6969 31.7761Z" fill="currentColor"/>
</svg>"""

LUJO = [
    "Que se vea más caro",
    "Que se sienta más exclusivo, más cerrado al público",
    "Que tenga mejores animaciones y se mueva más bonito",
    "Que las fotos y el video sean mejores",
    "Que los textos suenen mejor",
    "Que se sienta más tranquilo, más cine y menos folleto",
    "Otra cosa",
]

# (clave, pregunta, aclaración, filas del campo). La 2 es de casillas y se pinta aparte.
PREGUNTAS = [
    ("q1", "¿Qué es lo primero que cambiaría de la web?",
     "Lo primero que se le venga a la cabeza, sin pensarlo mucho.", 3),
    ("q2", "Cuando dice “más lujoso”, ¿a qué se refiere?", "Marque las que quiera.", 0),
    ("q3", "Si solo pudiéramos arreglar una cosa, ¿cuál sería?", "", 3),
    ("q4", "¿Hay algo que sí le guste y que prefiera que no toquemos?", "", 3),
    ("q5", "Mándenos dos o tres webs que le gusten.",
     "De lo que sea: relojes, hoteles, autos, moda. No tienen que ser de aviación.", 4),
    ("q6", "¿Y alguna que no le guste?", "Nos sirve igual o más.", 3),
    ("q7", "Fotos y video: ¿qué tiene hoy y hay chance de producir material nuevo?",
     "Se lo decimos derecho: de todo lo que se puede cambiar, esto es lo que más se nota.", 4),
    ("q8", "¿Se puede mostrar el taller, el proceso, las manos trabajando? "
           "¿Y hay aviones o clientes que no se puedan mostrar?", "", 4),
    ("q9", "Mirando el menú de hoy: ¿falta algo o sobra algo?", "", 3),
    ("q10", "Lo que sea que no le hayamos preguntado.", "", 4),
]

# Las que hay que contestar. Con un audio adjunto ninguna lo es: el documento
# ofrece contarlo hablando en vez de escribirlo. Espejo en api/mutati.ts.
OBLIGATORIAS = ["q1", "q2", "q3", "q4", "q5", "q7", "q8"]

MENU = ["Home", "About", "Projects", "The Artifact", "The Holder", "Contact"]

CSS = """
:root{
  --claro:#e8e3e1; --campo:#f2efed; --hueso:#cbc6bc; --marron:#493e2a;
  --marron-2:rgba(73,62,42,.72); --marron-3:rgba(73,62,42,.5); --rojo:#94270e;
  --sans:'Montserrat',ui-sans-serif,system-ui,-apple-system,'Segoe UI',sans-serif;
}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--claro);color:var(--marron);font-family:var(--sans);
  font-size:16px;line-height:1.65;font-weight:400;-webkit-font-smoothing:antialiased}
.m-wrap{max-width:720px;margin:0 auto;padding-inline:clamp(18px,5vw,40px);
  padding-block:clamp(36px,7vw,80px) clamp(48px,8vw,96px)}
.m-logo{display:block;color:var(--marron)}
.m-logo svg{display:block;width:100%;height:auto}
.m-barra{height:4px;background:var(--marron);margin-top:clamp(18px,3vw,28px)}
.m-cab{display:flex;flex-direction:column;gap:18px;padding-top:clamp(28px,5vw,48px)}
h1{margin:0;font-size:clamp(26px,4.4vw,38px);font-weight:500;letter-spacing:-.015em;line-height:1.15;
  text-wrap:balance}
.m-intro{margin:0;font-size:clamp(16px,1.9vw,18px);font-weight:300;max-width:60ch}
.m-intro a{color:inherit;text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:1px}
.m-borrador{margin:0;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--marron-3)}

form{margin-top:clamp(36px,6vw,56px)}
ol.m-lista{list-style:none;margin:0;padding:0;border-top:1px solid var(--hueso)}
.m-p{display:grid;grid-template-columns:3.2em 1fr;gap:0 12px;padding:clamp(24px,4vw,34px) 0;
  border-bottom:1px solid var(--hueso)}
.m-num{font-size:13px;font-weight:600;letter-spacing:.12em;font-variant-numeric:tabular-nums;
  padding-top:4px;color:var(--marron-3)}
.m-cuerpo{display:flex;flex-direction:column;gap:12px;min-width:0}
.m-q{font-size:clamp(17px,2.1vw,19px);font-weight:500;line-height:1.4;margin:0;padding:0}
.m-h{margin:-4px 0 0;font-size:15px;font-weight:300;color:var(--marron-2);max-width:60ch}
fieldset .m-h{margin-top:6px}
.m-aviso{margin:0;padding-left:14px;border-left:2px solid var(--rojo);font-size:15px;
  font-weight:400;color:var(--marron);max-width:58ch}
.m-menu{display:flex;flex-wrap:wrap;gap:6px;margin:0;padding:0;list-style:none}
.m-menu li{font-size:12px;letter-spacing:.06em;border:1px solid var(--hueso);border-radius:999px;
  padding:4px 11px;color:var(--marron-2)}
textarea,input[type=text]{width:100%;font:inherit;font-size:16px;font-weight:400;color:var(--marron);
  background:var(--campo);border:1px solid var(--hueso);border-radius:2px;padding:12px 14px;
  line-height:1.55;resize:vertical}
textarea{min-height:5.2em;overflow:hidden}
textarea:focus,input[type=text]:focus{outline:none;border-color:var(--marron);background:#f6f4f2}
fieldset{border:0;margin:0;padding:0;min-width:0}
legend{padding:0}
.m-casillas{display:flex;flex-direction:column;gap:2px;margin-top:4px}
.m-casilla{display:flex;gap:14px;align-items:flex-start;cursor:pointer;padding:9px 0;font-size:16px;
  font-weight:400;line-height:1.45}
.m-casilla input{appearance:none;-webkit-appearance:none;flex:none;width:18px;height:18px;margin:2px 0 0;
  border:1.5px solid var(--marron);border-radius:1px;background:transparent;display:grid;place-content:center;
  cursor:pointer}
.m-casilla input::after{content:"";width:10px;height:6px;border-left:2px solid var(--claro);
  border-bottom:2px solid var(--claro);transform:translateY(-1px) rotate(-45deg);opacity:0}
.m-casilla input:checked{background:var(--marron)}
.m-casilla input:checked::after{opacity:1}
.m-casilla input:focus-visible{outline:2px solid var(--marron);outline-offset:3px}
.m-otra{margin-top:8px}

.m-audio{margin-top:clamp(36px,6vw,56px);padding:clamp(22px,4vw,30px);border:1px solid var(--hueso);
  display:flex;flex-direction:column;gap:12px;scroll-margin-top:24px}
.m-audio h2{margin:0;font-size:clamp(18px,2.2vw,20px);font-weight:500}
.m-audio p{margin:0;font-size:15px;font-weight:300;color:var(--marron-2);max-width:56ch}
.m-archivos{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}
.m-archivos li{display:flex;justify-content:space-between;gap:12px;align-items:center;font-size:14px;
  padding:8px 12px;background:var(--campo)}
.m-archivos span{overflow-wrap:anywhere}
.m-quitar{background:none;border:0;font:inherit;font-size:12px;letter-spacing:.08em;text-transform:uppercase;
  color:var(--marron-2);cursor:pointer;padding:6px 2px;flex:none}
.m-quitar:hover{color:var(--rojo)}

.m-fin{margin-top:clamp(36px,6vw,56px);display:flex;flex-direction:column;gap:18px}
.m-fin label{font-size:15px;font-weight:500}
.m-nombre{max-width:360px}
.m-cierre{margin:8px 0 0;font-size:clamp(16px,1.9vw,18px);font-weight:300}
.m-acciones{display:flex;flex-wrap:wrap;gap:14px 22px;align-items:center}
.m-btn{font:inherit;font-size:12px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;
  border-radius:999px;padding:17px 34px;min-height:48px;cursor:pointer;
  transition:background .2s ease,color .2s ease}
.m-btn-lleno{background:var(--marron);color:var(--claro);border:1px solid var(--marron)}
.m-btn-lleno:hover:enabled{background:transparent;color:var(--marron)}
.m-btn-linea{background:transparent;color:var(--marron);border:1px solid var(--marron);align-self:flex-start;
  padding:13px 24px;min-height:44px}
.m-btn-linea:hover{background:var(--marron);color:var(--claro)}
.m-btn:disabled{opacity:.55;cursor:default}
.m-btn:focus-visible{outline:2px solid var(--marron);outline-offset:3px}
.m-estado{margin:0;font-size:14px;color:var(--marron-2);min-height:1.4em}
.m-estado.error{color:var(--rojo)}
.m-opc{font-weight:300;color:var(--marron-3)}
.m-falta{margin:0;font-size:14px;color:var(--rojo)}
.falta textarea,.falta input[type=text]{border-color:var(--rojo)}
.falta .m-casilla input{border-color:var(--rojo)}
.m-telon-sale{position:fixed;inset:0;z-index:60;background:var(--marron);transform:scaleY(0);
  transform-origin:bottom;animation:m-telon-sube-cubre .7s cubic-bezier(.7,0,.25,1) forwards}
@keyframes m-telon-sube-cubre{to{transform:scaleY(1)}}
.m-pie{margin-top:clamp(56px,9vw,96px);display:flex;justify-content:center;color:var(--marron-3)}
.m-pie svg{width:30px;height:auto;display:block}
.m-oculto{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}
@media (max-width:520px){.m-p{grid-template-columns:1fr;gap:8px}.m-num{padding-top:0}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
"""

JS = r"""
(function () {
  'use strict';
  var CLAVE = 'mutati.preguntas.v1';
  var MAX_MB = 25;
  var form = document.getElementById('m-form');
  var estado = document.getElementById('m-estado');
  var enviar = document.getElementById('m-enviar');
  var lista = document.getElementById('m-archivos');
  var entrada = document.getElementById('m-audio-input');
  var audios = [];

  function crecer(t) { t.style.height = 'auto'; t.style.height = (t.scrollHeight + 2) + 'px'; }
  function avisar(txt, error) { estado.textContent = txt || ''; estado.className = 'm-estado' + (error ? ' error' : ''); }

  function leer() {
    var a = { q2: [] };
    form.querySelectorAll('textarea[name], input[type=text][name]').forEach(function (el) { a[el.name] = el.value; });
    form.querySelectorAll('input[name=q2]:checked').forEach(function (el) { a.q2.push(el.value); });
    return a;
  }
  function escribir(a) {
    form.querySelectorAll('textarea[name], input[type=text][name]').forEach(function (el) {
      if (el.name !== 'bot' && typeof a[el.name] === 'string') el.value = a[el.name];
    });
    form.querySelectorAll('input[name=q2]').forEach(function (el) { el.checked = (a.q2 || []).indexOf(el.value) > -1; });
  }
  function hayTexto(a) {
    return Object.keys(a).some(function (k) {
      return k !== 'bot' && (Array.isArray(a[k]) ? a[k].length : String(a[k] || '').trim());
    });
  }

  // Borrador: se guarda al escribir y se recupera sin preguntar.
  var t0;
  function guardar() {
    clearTimeout(t0);
    t0 = setTimeout(function () { try { localStorage.setItem(CLAVE, JSON.stringify(leer())); } catch (e) {} }, 300);
  }
  try {
    var previo = JSON.parse(localStorage.getItem(CLAVE) || 'null');
    if (previo && hayTexto(previo)) {
      escribir(previo);
      document.getElementById('m-borrador').textContent = 'Recuperamos lo que había escrito en este dispositivo.';
    }
  } catch (e) {}
  form.querySelectorAll('textarea').forEach(function (t) { crecer(t); t.addEventListener('input', function () { crecer(t); }); });
  form.addEventListener('input', guardar);
  form.addEventListener('change', guardar);

  // Audios
  function pintarAudios() {
    lista.innerHTML = '';
    audios.forEach(function (f, i) {
      var li = document.createElement('li');
      var s = document.createElement('span');
      s.textContent = f.name + ' · ' + (f.size / 1048576).toFixed(1) + ' MB';
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'm-quitar'; b.textContent = 'Quitar';
      b.setAttribute('aria-label', 'Quitar ' + f.name);
      b.addEventListener('click', function () { audios.splice(i, 1); pintarAudios(); revisar(); });
      li.appendChild(s); li.appendChild(b); lista.appendChild(li);
    });
  }
  document.getElementById('m-audio-btn').addEventListener('click', function () { entrada.click(); });
  entrada.addEventListener('change', function () {
    var grandes = [];
    Array.prototype.forEach.call(entrada.files || [], function (f) {
      if (f.size > MAX_MB * 1048576) grandes.push(f.name); else if (audios.length < 5) audios.push(f);
    });
    entrada.value = '';
    pintarAudios();
    revisar();
    avisar(grandes.length ? 'Este audio pasa de ' + MAX_MB + ' MB y no se puede subir: ' + grandes.join(', ') + '.' : '', grandes.length);
  });

  var subidor;
  function cargarSubidor() {
    if (window.borsogaUpload) return Promise.resolve();
    return subidor || (subidor = new Promise(function (ok, mal) {
      var s = document.createElement('script');
      s.src = '/assets/upload.js';
      s.onload = function () { window.borsogaUpload ? ok() : mal(new Error('subidor')); };
      s.onerror = function () { mal(new Error('subidor')); };
      document.head.appendChild(s);
    }));
  }

  // Obligatorias: espejo de OBLIGATORIAS en mutati.py y en api/mutati.ts.
  var OBLIGATORIAS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q7', 'q8'];
  var intentado = false;
  function faltan(a) {
    var f = {};
    if (!audios.length) OBLIGATORIAS.forEach(function (k) {
      if (k === 'q2') {
        if (!a.q2.length) f.q2 = 'Marque al menos una.';
        else if (a.q2.indexOf('Otra cosa') > -1 && !String(a.q2otra || '').trim()) f.q2 = 'Cuéntenos cuál es la otra cosa.';
      } else if (!String(a[k] || '').trim()) f[k] = 'Falta esta respuesta.';
    });
    if (!String(a.nombre || '').trim()) f.nombre = 'Díganos quién responde.';
    return f;
  }
  function marcar(f) {
    form.querySelectorAll('[data-clave]').forEach(function (el) {
      var k = el.getAttribute('data-clave'), msg = f[k], p = document.getElementById(k + '-falta');
      el.classList.toggle('falta', !!msg);
      if (p) { p.hidden = !msg; p.textContent = msg || ''; }
      el.querySelectorAll('textarea, input[type=text]').forEach(function (c) {
        if (msg) c.setAttribute('aria-invalid', 'true'); else c.removeAttribute('aria-invalid');
      });
    });
  }
  // Tras un intento fallido, las marcas se van quitando según se contesta.
  function revisar() { if (intentado) marcar(faltan(leer())); }
  form.addEventListener('input', revisar);
  form.addEventListener('change', revisar);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var a = leer();
    var f = faltan(a), claves = Object.keys(f);
    if (claves.length) {
      intentado = true;
      marcar(f);
      var nums = claves.filter(function (k) { return k !== 'nombre'; }).map(function (k) { return k.slice(1); });
      avisar((nums.length ? 'Faltan respuestas obligatorias: ' + nums.join(', ') + (f.nombre ? ' y quién responde' : '') + '.'
                          : 'Díganos quién responde.') +
             (nums.length ? ' Si prefiere, adjunte un audio y no hace falta escribirlas.' : ''), true);
      var primero = form.querySelector('[data-clave="' + claves[0] + '"]');
      if (primero) {
        primero.scrollIntoView({ behavior: 'smooth', block: 'center' });
        var campo = primero.querySelector(claves[0] === 'q2' && a.q2.length ? 'textarea' : 'input, textarea');
        if (campo) setTimeout(function () { campo.focus({ preventScroll: true }); }, 350);
      }
      return;
    }
    marcar({});
    enviar.disabled = true;
    var lote = Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36);
    var subidos = [], subiendo = true;
    (audios.length ? cargarSubidor() : Promise.resolve())
      .then(function () {
        return audios.reduce(function (cadena, f, i) {
          return cadena.then(function () {
            var nombre = f.name.replace(/[^\w.\-]+/g, '_').slice(-80) || 'audio';
            return window.borsogaUpload(f, 'leads/' + lote + '/audioFiles/' + nombre, function (pct) {
              avisar('Subiendo audio ' + (i + 1) + ' de ' + audios.length + ' · ' + pct + ' %');
            }).then(function (b) { subidos.push({ kind: 'audioFiles', name: f.name, url: b.url, size: f.size }); });
          });
        }, Promise.resolve());
      })
      .then(function () {
        subiendo = false;
        avisar('Enviando…');
        return fetch('/api/mutati/', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ answers: a, files: subidos, bot: a.bot || '' })
        });
      })
      .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
      .then(function (r) {
        if (!r || !r.ok) {
          enviar.disabled = false;
          avisar((r && r.error) || 'No pudimos enviarlo. Inténtelo otra vez en un momento; lo que escribió sigue aquí.', true);
          return;
        }
        try { localStorage.removeItem(CLAVE); } catch (e) {}
        // Un telón marrón cubre el formulario y la página de recibido lo levanta:
        // una sola transición repartida entre las dos páginas.
        var destino = '/mutati/recibido/';
        if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) {
          location.assign(destino);
          return;
        }
        var telon = document.createElement('div');
        telon.className = 'm-telon-sale';
        telon.addEventListener('animationend', function () { location.assign(destino); });
        document.body.appendChild(telon);
        // por si animationend no llega (pestaña en segundo plano)
        setTimeout(function () { location.assign(destino); }, 1400);
      })
      .catch(function (err) {
        if (window.console) console.error(err);
        enviar.disabled = false;
        avisar(subiendo ? 'No pudimos subir el audio. Inténtelo otra vez o escríbanos a borsogastudio@gmail.com.'
                        : 'No pudimos enviarlo. Revise la conexión e inténtelo otra vez; lo que escribió sigue aquí.', true);
      });
  });
})();
"""


def _e(s):
    return _html.escape(s, quote=True)


def _pregunta(n, clave, q, h, filas):
    num = f'<div class="m-num" aria-hidden="true">{n:02d}</div>'
    if clave == "q2":
        casillas = "".join(
            f'<label class="m-casilla"><input type="checkbox" name="q2" value="{_e(v)}" id="q2-{i}">'
            f'<span>{_e(v + (" (cuéntenos abajo)" if v == "Otra cosa" else ""))}</span></label>'
            for i, v in enumerate(LUJO))
        return (f'<li class="m-p" data-clave="q2">{num}<fieldset class="m-cuerpo" aria-describedby="q2-falta">'
                f'<legend class="m-q">{_e(q)}</legend><p class="m-h">{_e(h)}</p>'
                f'<div class="m-casillas">{casillas}</div>'
                f'<label class="m-oculto" for="q2otra">Otra cosa</label>'
                f'<textarea class="m-otra" id="q2otra" name="q2otra" rows="2" '
                f'placeholder="Si marcó «Otra cosa», cuéntenos aquí."></textarea>'
                f'<p class="m-falta" id="q2-falta" hidden></p>'
                f'</fieldset></li>')
    extra = ""
    if clave == "q7":
        extra = f'<p class="m-aviso">{_e(h)}</p>'
    elif h:
        extra = f'<p class="m-h">{_e(h)}</p>'
    if clave == "q9":
        extra += ('<ul class="m-menu" aria-label="Menú actual">'
                  + "".join(f"<li>{_e(x)}</li>" for x in MENU) + "</ul>")
    obligatoria = clave in OBLIGATORIAS
    opcional = "" if obligatoria else ' <span class="m-opc">(opcional)</span>'
    requerido = ' aria-required="true"' if obligatoria else ""
    return (f'<li class="m-p" data-clave="{clave}">{num}<div class="m-cuerpo">'
            f'<label class="m-q" for="{clave}">{_e(q)}{opcional}</label>{extra}'
            f'<textarea id="{clave}" name="{clave}" rows="{filas}"{requerido} aria-describedby="{clave}-falta"></textarea>'
            f'<p class="m-falta" id="{clave}-falta" hidden></p>'
            f'</div></li>')


def _head(titulo, css):
    icono = _e(MONOGRAMA.replace("currentColor", "#493e2a").replace(chr(10), "").replace("#", "%23"))
    return f"""<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex,nofollow">
<meta name="theme-color" content="#e8e3e1">
<title>{titulo}</title>
<link rel="icon" href="data:image/svg+xml,{icono}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap">
<style>{css}</style>
</head>
"""


def page():
    preguntas = "".join(_pregunta(i + 1, *p) for i, p in enumerate(PREGUNTAS))
    return _head("Mutati · Unas preguntas antes de arrancar", CSS) + f"""<body>
<div class="m-wrap">
<header>
<div class="m-logo">{LOGOTIPO}</div>
<div class="m-barra"></div>
<div class="m-cab">
<h1>Unas preguntas antes de arrancar</h1>
<p class="m-intro">Antes de ponernos a mover cosas queremos entender bien qué tiene en mente. Son diez preguntas y le toma unos diez minutos.</p>
<p class="m-intro">Responda con lo que se le ocurra, sin formalidades. Las que dicen «opcional» puede saltárselas. Y si prefiere contárnoslo hablando, <a href="#audio">mándenos un audio</a> y nosotros lo pasamos en limpio; así no hace falta escribir las respuestas.</p>
<p class="m-borrador" id="m-borrador">Lo que escriba se guarda en este dispositivo hasta que lo envíe.</p>
</div>
</header>

<form id="m-form" novalidate>
<ol class="m-lista">{preguntas}</ol>

<section class="m-audio" id="audio" aria-labelledby="audio-t">
<h2 id="audio-t">¿Prefiere contarlo hablando?</h2>
<p>Grabe una nota de voz en el teléfono y adjúntela aquí. Nosotros la pasamos en limpio, así que con el audio no hace falta escribir las respuestas; solo díganos quién responde. Hasta cinco audios de 25 MB cada uno.</p>
<input type="file" id="m-audio-input" accept="audio/*,.m4a,.mp3,.wav,.ogg,.opus,.aac,.amr,.webm" multiple hidden>
<button type="button" class="m-btn m-btn-linea" id="m-audio-btn">Adjuntar audio</button>
<ul class="m-archivos" id="m-archivos" aria-live="polite"></ul>
</section>

<div class="m-fin">
<div style="display:flex;flex-direction:column;gap:8px" data-clave="nombre">
<label for="nombre">¿Quién responde?</label>
<input type="text" class="m-nombre" id="nombre" name="nombre" autocomplete="name" aria-required="true" aria-describedby="nombre-falta">
<p class="m-falta" id="nombre-falta" hidden></p>
</div>
<div class="m-oculto" aria-hidden="true"><label for="bot">No llenar</label><input type="text" id="bot" name="bot" tabindex="-1" autocomplete="off"></div>
<p class="m-cierre">Con esto ya tenemos para armarle una propuesta concreta. Gracias.</p>
<div class="m-acciones">
<button type="submit" class="m-btn m-btn-lleno" id="m-enviar">Enviar respuestas</button>
<p class="m-estado" id="m-estado" role="status" aria-live="polite"></p>
</div>
</div>
</form>

<footer class="m-pie">{MONOGRAMA}</footer>
</div>
<script>{JS}</script>
</body>
</html>
"""


CSS_RECIBIDO = """
:root{--claro:#e8e3e1;--hueso:#cbc6bc;--marron:#493e2a;--marron-2:rgba(73,62,42,.72);--marron-3:rgba(73,62,42,.5);
  --sans:'Montserrat',ui-sans-serif,system-ui,-apple-system,'Segoe UI',sans-serif;
  --curva:cubic-bezier(.7,0,.25,1);--suave:cubic-bezier(.2,.7,.2,1)}
*{box-sizing:border-box}
html,body{height:100%}
body{margin:0;background:var(--claro);color:var(--marron);font-family:var(--sans);-webkit-font-smoothing:antialiased}
.r-escena{min-height:100%;display:grid;grid-template-rows:1fr auto;padding-inline:clamp(18px,5vw,40px);
  padding-block:clamp(32px,6vw,64px)}
.r-centro{align-self:center;width:100%;max-width:720px;margin:0 auto;display:flex;flex-direction:column}
.r-logo{overflow:hidden}
.r-logo svg{display:block;width:100%;height:auto}
.r-barra{height:4px;background:var(--marron);margin-top:clamp(18px,3vw,28px)}
.r-texto{display:flex;flex-direction:column;gap:14px;padding-top:clamp(36px,6vw,60px)}
h1{margin:0;font-size:clamp(40px,8vw,76px);font-weight:500;letter-spacing:-.03em;line-height:1}
.r-texto p{margin:0;font-size:clamp(17px,2.1vw,20px);font-weight:300;line-height:1.55;max-width:44ch}
.r-pie{display:flex;justify-content:center;color:var(--marron-3);padding-top:40px}
.r-pie svg{width:30px;height:auto;display:block}
.r-telon{position:fixed;inset:0;z-index:10;background:var(--marron);transform-origin:top;pointer-events:none}

/* La salida del formulario deja la pantalla cubierta; aquí el telón se levanta
   y la escena se arma como la portada de mutatidesign.com: la barra crece
   desde el centro y el logotipo sube desde ella. */
@media (prefers-reduced-motion:no-preference){
  .r-telon{animation:r-levanta .9s var(--curva) .1s both}
  .r-logo svg{animation:r-sube 1s var(--suave) .75s both}
  .r-barra{animation:r-crece .9s var(--curva) .6s both}
  h1{animation:r-aparece .8s var(--suave) 1.25s both}
  .r-texto p{animation:r-aparece .8s var(--suave) 1.4s both}
  .r-pie{animation:r-funde 1s ease 1.8s both}
}
@media (prefers-reduced-motion:reduce){.r-telon{display:none}}
@keyframes r-levanta{from{transform:scaleY(1)}to{transform:scaleY(0)}}
@keyframes r-sube{from{transform:translateY(105%)}to{transform:none}}
@keyframes r-crece{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes r-aparece{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes r-funde{from{opacity:0}to{opacity:1}}
"""


def recibido():
    return _head("Mutati · Recibido", CSS_RECIBIDO) + f"""<body>
<div class="r-telon" aria-hidden="true"></div>
<main class="r-escena">
<div class="r-centro">
<div class="r-logo">{LOGOTIPO}</div>
<div class="r-barra"></div>
<div class="r-texto">
<h1>Recibido.</h1>
<p>Con esto ya tenemos para armarle una propuesta concreta. Gracias.</p>
</div>
</div>
<footer class="r-pie">{MONOGRAMA}</footer>
</main>
</body>
</html>
"""
