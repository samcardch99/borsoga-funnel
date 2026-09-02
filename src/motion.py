# -*- coding: utf-8 -*-
"""Capa de movimiento: GSAP 3.13 + ScrollTrigger.

Criterio: el diseño es editorial y duro (blanco y negro, sin esquinas
redondeadas). El movimiento acompaña, no decora. Un solo gesto de entrada, y
hover únicamente donde comunica algo: que un elemento es pulsable, o qué fila
de la tabla estás leyendo.

Decisiones importantes tras la primera versión, que cargaba demasiado:

  · Fuera SplitText y el revelado del h1 línea a línea. Era la floritura más
    visible, dependía de que la tipografía hubiera cargado, y al reevaluarse
    `matchMedia` dejaba el titular invisible. Ahora es un fundido y ya.
  · Fuera la barra de progreso, los anillos, las listas ítem a ítem, el
    escalonado de encabezados y cierre, y los hover de viñeta e inversión.
  · **Nada se oculta por CSS salvo el hero.** Los revelados usan `gsap.from()`,
    así que el estado natural del contenido es *visible*: si un ScrollTrigger no
    dispara, el bloque simplemente no se anima — nunca desaparece. Ocultar por
    CSS y revelar por JS ya dejó 33 filas de tabla y 4 tarjetas invisibles.

Reglas duras:
  · `prefers-reduced-motion` desactiva todo vía matchMedia.
  · Hover solo bajo `@media (hover:hover)`: en táctil se quedaría pegado.
  · El hero, que sí se oculta, tiene temporizador de rescate.
"""

GSAP = "https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist"

# Conjunto que entra al hacer scroll. Un único gesto para todos.
REVEAL = ".m-card,.m-svc,.m-tile,.m-table"

MOTION_CSS = """
/* Lo único que se oculta: el hero. Se anima al arrancar, no depende del scroll. */
.js .m-hero .m-eyebrow,.js .m-hero h1,.js .m-hero p{opacity:0}

/* ---------- header ---------- */
header{transition:box-shadow .3s ease}
header.m-stuck{box-shadow:0 1px 0 rgba(0,0,0,.06),0 8px 24px -20px rgba(0,0,0,.4)}

/* ---------- hover: subrayado que barre ---------- */
.nav-m,footer a{position:relative}
.nav-m::after,footer a::after{content:"";position:absolute;left:0;bottom:-3px;
height:1px;width:100%;background:currentColor;transform:scaleX(0);
transform-origin:100% 50%;transition:transform .34s cubic-bezier(.22,1,.36,1)}
@media (hover:hover){
  .nav-m:hover::after,footer a:hover::after{transform:scaleX(1);transform-origin:0 50%}
  footer a:hover{color:#fff}
}

/* ---------- hover: botones, relleno desde abajo ---------- */
.btn-d,.btn-l,.btn-w,.btn-o{position:relative;overflow:hidden;isolation:isolate;
transition:color .3s ease,border-color .3s ease}
.btn-d::before,.btn-l::before,.btn-w::before,.btn-o::before{content:"";position:absolute;
inset:0;z-index:-1;transform:scaleY(0);transform-origin:50% 100%;
transition:transform .38s cubic-bezier(.22,1,.36,1)}
.btn-l::before{background:#000}
.btn-o::before{background:#fff}
.btn-d::before{background:rgba(255,255,255,.14)}
.btn-w::before{background:rgba(0,0,0,.055)}
@media (hover:hover){
  .btn-d:hover::before,.btn-l:hover::before,.btn-w:hover::before,.btn-o:hover::before{transform:scaleY(1)}
  .btn-l:hover{color:#fff;border-color:#000}
  .btn-o:hover{color:#000}
}

/* ---------- hover: tarjetas de servicio (son enlaces: hay que notarlo) ---------- */
.svc span:last-child{position:relative}
.svc span:last-child::after{content:"→";position:absolute;margin-left:.5em;opacity:0;
transform:translateX(-5px);transition:opacity .3s ease,transform .34s cubic-bezier(.22,1,.36,1)}
@media (hover:hover){.svc:hover span:last-child::after{opacity:1;transform:translateX(0)}}

/* ---------- hover: navegación de planes ---------- */
.pnav{transition:background .28s ease}
@media (hover:hover){.pnav:hover{background:rgba(0,0,0,.05)!important}}

/* ---------- hover: filas de la tabla (ayuda a seguir la fila que lees) ---------- */
.cmp-row{transition:background .18s ease}
@media (hover:hover){.cmp-row:hover{background:rgba(0,0,0,.04)}}

/* ---------- hover: tarjetas sueltas ---------- */
.m-tile{transition:box-shadow .28s ease}
@media (hover:hover){.m-tile:hover{box-shadow:0 0 0 1.5px #000!important}}

/* ---------- acordeón "lo que no incluye" ---------- */
details summary span:last-child{display:inline-block;
transition:transform .34s cubic-bezier(.22,1,.36,1)}
details[open] summary span:last-child{transform:rotate(45deg)}

/* ---------- reduced-motion ---------- */
@media (prefers-reduced-motion:reduce){
  .js .m-hero .m-eyebrow,.js .m-hero h1,.js .m-hero p{opacity:1!important}
  *,*::before,*::after{transition-duration:.01ms!important;animation-duration:.01ms!important}
}
"""

# Se activa antes de pintar para que el hero no parpadee.
HEAD_INLINE = '<script>document.documentElement.classList.add("js")</script>'

SCRIPTS = (f'<script defer src="{GSAP}/gsap.min.js"></script>'
           f'<script defer src="{GSAP}/ScrollTrigger.min.js"></script>')

MOTION_JS = """
<script>
(function () {
  var HERO = '.m-hero .m-eyebrow,.m-hero h1,.m-hero p';
  var REVEAL = '__REVEAL__';

  // Pase lo que pase, el hero acaba visible. Si GSAP tarda o falla, esto lo salva.
  var safety = setTimeout(function () {
    document.documentElement.classList.remove('js');
  }, 2500);

  function boot() {
    if (!window.gsap) { document.documentElement.classList.remove('js'); return; }
    gsap.registerPlugin(ScrollTrigger);

    gsap.matchMedia().add({
      ok: '(prefers-reduced-motion: no-preference)',
      reduce: '(prefers-reduced-motion: reduce)'
    }, function (ctx) {
      if (ctx.conditions.reduce) {
        clearTimeout(safety);
        gsap.set(HERO, { opacity: 1 });
        return;
      }

      gsap.defaults({ ease: 'power3.out' });

      // Sombra del header al despegarse del borde.
      ScrollTrigger.create({
        start: 'top -8',
        onToggle: function (s) {
          var h = document.querySelector('header');
          if (h) h.classList.toggle('m-stuck', s.isActive);
        }
      });

      // Entrada del hero: fundido y un empujón corto hacia arriba.
      gsap.timeline({ onStart: function () { clearTimeout(safety); } })
        .to('.m-hero .m-eyebrow', { opacity: 1, duration: .5 })
        .to('.m-hero h1', { opacity: 1, y: 0, duration: .8, startAt: { y: 20 } }, '-=.3')
        .to('.m-hero p', { opacity: 1, y: 0, duration: .7, startAt: { y: 14 } }, '-=.55');

      // Todo lo demás: `from()`, así el estado natural es visible.
      // Si un trigger no dispara, el bloque no se anima; nunca desaparece.
      ScrollTrigger.batch(REVEAL, {
        start: 'top 92%', once: true, batchMax: 8,
        onEnter: function (batch) {
          gsap.from(batch, { opacity: 0, y: 16, duration: .7, stagger: .06, overwrite: true });
        }
      });
    });
  }

  if (document.readyState === 'complete') boot();
  else window.addEventListener('load', boot, { once: true });
})();
</script>
""".replace("__REVEAL__", REVEAL)
