# Borsoga Funnel

Funnel de ventas de [Borsoga Studio](https://plans.borsogastudio.com). Sitio
estático bilingüe generado con Python, más tres funciones sin servidor que
recogen los leads.

    src/build.py          genera las 16 páginas en build/
    src/*.py              una página o componente cada uno
    src/quiz*.js          los dos configuradores, en el navegador
    src/i18n/             las cadenas: es.js es el origen, en.js la traducción
    api/                  submit, blob-upload y los clientes de Twenty y AV
    assets/              logos y favicon; el build los copia a build/assets/

    npm run build         construye todo
    python3 src/dev.py    servidor local con recarga en vivo (puerto 4380)

## Cómo está montado

**El sitio se genera, no se escribe.** Cada página es una función de Python que
devuelve HTML. El diseño vive en Claude Design y su contenido se transcribe a
`content.py` y a `i18n/`, así que un cambio de texto es un cambio de datos y no
de plantillas.

**Bilingüe con el español como origen.** El castellano vive en la raíz y el
inglés bajo `/en/` con los slugs traducidos (`/diseno-web/` → `/en/web-design/`)
y `hreflang` recíproco. `i18n_load.py` resuelve por clave con `t()` y por cadena
de origen con `T()`, al estilo de gettext, para el texto que vive dentro del
código y no tiene nombre.

**Los cuestionarios guardan sus respuestas en español aunque la página esté en
inglés.** Ese valor es el que compara `api/submit.ts`; traducirlo rompería las
reglas del servidor. Sólo se traduce al pintarlo, con `lbl()`, nunca el dato que
viaja.

**Un lead no se pierde por un fallo de terceros.** Va a Postgres, al CRM y al
correo por separado, y cada destino puede caerse sin arrastrar a los demás. Si
fallaran los tres a la vez, la respuesta lo dice en lugar de fingir que llegó.

## Lo que no hace, a propósito

**No publica precios.** El estimado lo pone una persona en contacto directo. Los
importes que aparecen en los configuradores son el presupuesto que declara el
cliente, no tarifas del estudio.

**No manda estimados automáticos.** Los configuradores captan información y
proponen un plan; el número lo cierra alguien del estudio.

## Despliegue

Vercel, desde este repositorio. `DEPLOY.md` tiene la configuración: base de
datos, almacenamiento de archivos, CRM y el aviso por correo.
