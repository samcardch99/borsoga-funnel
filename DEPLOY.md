# Borsoga Studio — plans.borsogastudio.com

Funnel de ventas generado desde el proyecto de Claude Design
`de80c73f-a179-46b2-82e5-5b56f55a9435` ("Borsoga Studio: Contexto y marca").

**Stack: sitio estático + funciones de Vercel.** El generador en Python emite
el HTML desde los datos de los artboards; las funciones son TypeScript.

## Estructura

    src/content.py       datos portados de los artboards (listas, tablas)
    src/shell.py         head/header/footer/tablas + CSS base
    src/motion.py        capa de movimiento (GSAP + ScrollTrigger)
    src/privacidad.py    política de privacidad
    src/quiz.py          configurador (markup)
    src/quiz.js          configurador (lógica, portada del artboard)
    src/upload-client.js puente a Vercel Blob (se empaqueta con esbuild)
    src/build.py         genera build/
    src/dev.py           servidor de desarrollo
    api/submit.ts        recepción de leads
    api/blob-upload.ts   emite tokens de subida directa a Blob

## Desarrollo

    python3 src/dev.py              # http://localhost:4321
    python3 src/dev.py --open

Vigila `src/*.py`, reconstruye en ~40 ms y recarga el navegador conservando el
scroll. Si el build falla, el traceback sale superpuesto en la página.

Nota: `dev.py` sirve solo lo estático. Para probar las funciones, usa
`vercel dev` o despliega un preview.

## Construir y desplegar

    npm run build          # python3 src/build.py && esbuild del subidor
    vercel deploy          # preview
    vercel deploy --prod   # producción

Vercel ejecuta `npm run build` (definido en vercel.json). El repo se
autoconstruye: no hay que subir `build/`.

## Almacenamiento

- **Blob** (`borsoga-leads`, acceso privado) — provisionado y enlazado.
  Guarda los archivos que sube el cliente y, mientras no haya base de datos,
  también el JSON del lead como red de seguridad.
- **Postgres** — pendiente. Requiere aceptar los términos de Neon en el
  navegador: `vercel install neon`. En cuanto exista `DATABASE_URL`, la
  función crea la tabla `leads` sola y deja de usar el respaldo en Blob.

## Correo

El aviso sale por **EmailJS**, llamando a su API REST desde `api/submit.ts`, no
desde el navegador: la clave pública de EmailJS es visible para cualquiera que
abra el inspector, y con ella se podría gastar la cuota del estudio o mandar
correos en su nombre. Desde el servidor la clave privada no sale nunca.

Cinco variables en Vercel (production). Los valores reales están en el panel de
Vercel, no aquí: este fichero es público.

    EMAILJS_SERVICE_ID     el servicio de Gmail conectado en el panel de EmailJS
    EMAILJS_TEMPLATE_ID    la plantilla del aviso
    EMAILJS_PUBLIC_KEY     Account → General
    EMAILJS_PRIVATE_KEY    Account → General, revelándola con el icono del ojo
    STUDIO_EMAIL           la dirección que recibe los avisos

**Al copiar la clave privada, hay que revelarla antes con el icono del ojo.** El
panel enmascara el campo poniendo bullets *en el propio valor* del input, así que
copiarlo cerrado da 21 caracteres de basura y la API responde
`403 API access in strict mode, but no Private Key was provided`.

Ajustes hechos en el panel de EmailJS:

1. **Account → Security → "Allow EmailJS API for non-browser applications"**,
   activado. Sin esto rechaza cualquier llamada que no venga de un navegador.
   Al activarlo, "Use Private Key" pasa a ser obligatorio.
2. La plantilla usa `{{{content}}}` **con tres llaves**: el cuerpo se arma en la
   función y llega como HTML ya montado; con dos llaves Handlebars lo escaparía y
   el correo llegaría lleno de `&lt;div&gt;`. Ojo: el editor de código
   auto-cierra las etiquetas, y al escribir el `<div>` envolvente añade un
   `</div>` de más que hay que borrar.

Campos de la plantilla: `To Email` = `{{to_email}}`, `Reply To` = `{{reply_to}}`,
`From Name` = `{{from_name}}`, `Subject` = `{{subject}}`, cuerpo = `{{{content}}}`.

El destino está fijado en el campo `To Email` de la plantilla, no en un
parámetro. `STUDIO_EMAIL` sigue existiendo porque la función la usa para decidir
si hay correo configurado, pero quien manda es la plantilla.

Si la API responde `412 Gmail_API: Invalid grant`, la autorización de Google del
servicio ha caducado: Email Services → editar el servicio → Disconnect → volver a
conectar. Exige iniciar sesión, así que lo hace una persona.

Nota de entregabilidad: al enviar a través de la cuenta que se conecte en
EmailJS (Gmail, por ejemplo), el correo sale con el SPF/DKIM de ese proveedor,
así que **no hace falta autenticar borsogastudio.com** para que llegue. Eso sigue
siendo necesario si algún día se envía desde el propio dominio.

Límite de la API: **1 petición por segundo**. Cada lead manda un correo, así que
sólo importaría con envíos simultáneos.

## DNS

`plans.borsogastudio.com` es un registro ALIAS → `cname.vercel-dns.com.`
gestionado en Hostinger. Snapshot previo al cambio: `176078506` (2026-08-27).
MX de Google, `crm` y la raíz no se tocaron.

## Cuando el diseño cambie

Releer los `.dc.html` con la tool DesignSync, actualizar `src/content.py`
(o `src/quiz.js` si cambia el cuestionario) y reconstruir.

## Páginas

    /                          portada de servicios (con formulario de contacto)
    /planes-av/                planes de Architectural Visualization
    /configurador-av/          configurador AV (6 pasos, escenas anidadas)
    /visualizacion/            planes de Interior Design
    /configurador/             configurador de interiorismo (6 pasos)
    /diseno-web/               planes de Web y App
    /diseno-grafico/           planes de Branding
    /politica-de-privacidad/

## Tres servicios en un endpoint

`POST /api/submit/` acepta `service`: `interior` (por defecto), `av` y
`contacto`. Cada uno con su validación y su enrutamiento, siempre recalculados
en servidor. Las reglas de AV viven en `api/_av.ts`; las de interiorismo y
contacto, en `submit.ts`.

**Cliente y servidor tienen que ir a la par.** Cualquier cambio de reglas hay
que aplicarlo en los dos sitios: ya nos mordió una vez con el texto de la ruta.

## Pendiente

- Precios: no se publican. Se definen en contacto directo (decisión 2026-08-27).
- **Postgres** (aceptar términos de Neon) y **correo** (cuenta de EmailJS).
- SPF/DKIM/DMARC en borsogastudio.com (para que tus respuestas no caigan en spam).
- **254 claves sin traducir al inglés** (`src/i18n/PENDIENTES-EN.md`). Hasta que
  existan, el selector de idioma no se publica.
- Huecos de imagen: niveles de acabado, prueba de AV y prueba de la portada.
- La URL `/visualizacion/` aloja Interior Design mientras que "Visualización"
  es ahora el nombre de otro servicio. Renombrarla rompería enlaces publicados.
- BotID de Vercel sobre el honeypot que ya existe.
- "Ver un proyecto/sitio real": sin destino, falta portafolio.
- Formulario 'Solicitar propuesta' para web y gráfico (esos CTA siguen en mailto:).
- Servicio 02 (Desarrollo de apps): sin planes en el diseño.
- Fotos de nivel de acabado (paso 4): en blanco a propósito.
- La política de privacidad es un borrador: revisar con abogado en Florida.
- El sitio viejo sigue en el hosting compartido de Hostinger; se puede vaciar.
