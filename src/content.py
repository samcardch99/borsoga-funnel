# -*- coding: utf-8 -*-
"""Contenido portado literalmente desde el proyecto de Claude Design
'Borsoga Studio: Contexto y marca' (de80c73f-a179-46b2-82e5-5b56f55a9435).

Cada estructura aquí replica los arrays de `renderVals()` de los artboards
.dc.html. Cuando el diseño cambie, se edita este archivo y se reconstruye.
"""

# ---------------------------------------------------------------- servicios

SERVICIOS = [
    # Orden y nombres del diseño actual. Cada URL nombra su servicio.
    ("Servicio 01", "Interior Design",             "Essential · Premium · Edition", "/interior-design/"),
    ("Servicio 02", "Architectural Visualization", "Essential · Premium · Edition", "/planes-av/"),
    ("Servicio 03", "Branding",                    "Brand · Social · Marketing",    "/diseno-grafico/"),
    ("Servicio 04", "Web y App",                   "Essential · Premium · Edition", "/diseno-web/"),
]

# ------------------------------------------------------------- diseño web

WEB_ESSENTIAL_INCLUYE = [
    'Diseño 100% original — sin templates ni themes comprados',
    'Hasta 5 secciones / páginas (Home, Servicios, Proyectos, Sobre, Contacto)',
    'Código propio, ligero y rápido (Lighthouse 90+ en performance)',
    'Responsive real: diseñado para móvil, tablet y desktop, no solo adaptado',
    'SEO técnico base: metadatos, Open Graph, sitemap, schema, indexación',
    'Formulario de contacto conectado a correo o WhatsApp',
    'Dirección de arte: tipografía, color y jerarquía definidos por el estudio',
    'Dominio, hosting y certificado SSL configurados y entregados funcionando',
    'Google Analytics + Search Console instalados',
    '1 ronda de revisiones',
    '30 días de soporte post-lanzamiento',
]

WEB_PREMIUM_SUMA = [
    'Hasta 12 páginas / secciones + estructura escalable',
    'Animaciones y microinteracciones (scroll, transiciones, motion de marca)',
    'Blog o sección de proyectos autoeditable (CMS ligero)',
    'Multiidioma (ES / EN)',
    'SEO avanzado: investigación de keywords, copy optimizado, velocidad afinada',
    'Integración con Instagram, Google Business, Calendly o sistema de reservas',
    'Página de captura / landing adicional para campañas',
    'Dashboard básico de métricas (visitas, origen de tráfico, conversiones)',
    '2 rondas de revisiones',
    '30 días de soporte post-lanzamiento',
]

WEB_EDITION_GROUPS = [
    ('Plataforma y producto', [
        'Aplicación web personalizada (áreas privadas, portales de cliente, configuradores, calculadoras de presupuesto)',
        'Ecommerce completo: catálogo, carrito, pagos (Stripe / PayPal), envíos, inventario, cupones',
        'CMS a medida — construido en torno a cómo trabaja el cliente, no al revés',
        'Sistema de usuarios, roles y permisos',
        'Contratos y firma digital + cobro de anticipos en línea',
    ]),
    ('Automatización e integraciones', [
        'Conexión con CRM (HubSpot, Twenty, Airtable u otro)',
        'Automatizaciones de WhatsApp Business: confirmaciones, seguimiento, recordatorios, notificaciones internas',
        'Flujos de email automatizados (bienvenida, carrito abandonado, post-venta)',
        'Integraciones API con facturación, calendarios, logística o herramientas internas',
    ]),
    ('Datos e inteligencia', [
        'Dashboard de analítica a medida: embudo, conversión, valor de cliente, fuentes de venta',
        'Tracking de eventos y atribución de campañas',
        'Reportes automáticos periódicos por correo',
        'A/B testing sobre secciones clave',
    ]),
    ('Diseño y marca', [
        'Sistema de diseño propio (design system) documentado y reutilizable',
        'Motion design y piezas 3D / visualización integradas al sitio',
    ]),
    ('Acompañamiento', [
        'Sesión estratégica inicial y mapa de la arquitectura antes de diseñar',
        '3 rondas de revisiones',
        '6 meses de soporte y evolución incluidos',
        'Mantenimiento Care+ incluido el primer año',
        'Contacto directo con el estudio, sin intermediarios',
    ]),
]

WEB_COMPARE = [
    ['Diseño 100% original', True, True, True],
    ['Páginas / secciones', 'Hasta 5', 'Hasta 12', 'A medida'],
    ['Código propio y rápido', True, True, True],
    ['Responsive real', True, True, True],
    ['SEO técnico base', True, True, True],
    ['Dominio, hosting y SSL', True, True, True],
    ['Analytics + Search Console', True, True, True],
    ['Animaciones y microinteracciones', False, True, True],
    ['Blog o proyectos autoeditable (CMS)', False, True, True],
    ['Multiidioma (ES / EN)', False, True, True],
    ['SEO avanzado', False, True, True],
    ['Integraciones externas', False, True, True],
    ['Dashboard de métricas', False, 'Básico', 'A medida'],
    ['Aplicación web personalizada', False, False, True],
    ['Ecommerce completo', False, False, True],
    ['CMS a medida', False, False, True],
    ['Usuarios, roles y permisos', False, False, True],
    ['Contratos, firma digital y cobros', False, False, True],
    ['CRM y automatizaciones', False, False, True],
    ['A/B testing', False, False, True],
    ['Design system documentado', False, False, True],
    ['Motion y piezas 3D integradas', False, False, True],
    ['Sesión estratégica inicial', False, False, True],
    ['Rondas de revisiones', '1', '2', '3'],
    ['Soporte post-lanzamiento', '30 días', '30 días', '6 meses'],
    ['Mantenimiento Care+ incluido', False, False, 'Primer año'],
]

WEB_CARE = [
    ['Actualizaciones y parches de seguridad', True, True],
    ['Backups automáticos', 'Semanal', 'Diario'],
    ['Monitoreo de uptime', True, True],
    ['Horas de cambios de contenido', '1 h / mes', '4 h / mes'],
    ['Reporte de rendimiento y tráfico', 'Trimestral', 'Mensual'],
    ['Optimización SEO continua', False, True],
    ['Soporte prioritario', False, True],
]

WEB_INHERIT_PREMIUM = ('Diseño 100% original · Código propio y rápido · Responsive real · '
                       'SEO técnico base · Formulario de contacto · Dirección de arte · '
                       'Dominio, hosting y SSL · Analytics y Search Console')
WEB_INHERIT_EDITION = ('Hasta 12 páginas y estructura escalable · Animaciones y microinteracciones · '
                       'CMS ligero · Multiidioma · SEO avanzado · Integraciones · '
                       'Landing de campaña · Dashboard de métricas')

# ---------------------------------------------------------- diseño gráfico

BRAND_ESSENTIALS = [
    'Primary Logo — diseño de logotipo principal',
    'Logo Variations — versiones horizontales, verticales y reducidas según necesidad',
    'Color Palette — paleta principal y combinaciones de uso',
    'Typography System — tipografías y jerarquías básicas',
    'Profile / Favicon Assets — recursos para perfiles y usos digitales',
    'Basic Graphic Language — criterios básicos de composición y uso visual',
    'Basic Brand Guidelines — guía compacta de aplicación',
    'Archivos finales organizados para uso digital e impresión',
    '1 ronda de revisiones',
]

BRAND_PREMIUM = [
    'Brand Concept — concepto visual y dirección de la identidad',
    'Extended Visual System — sistema gráfico ampliado y modular',
    'Graphic Language — reglas de composición, formas, recursos y estilo visual',
    'Patterns & Supporting Graphics — patrones y elementos secundarios',
    'Iconography — lenguaje de iconos cuando el proyecto lo requiere',
    'Photography / Image Direction — criterios para selección y tratamiento de imágenes',
    'Brand Applications — aplicaciones seleccionadas según el tipo de negocio',
    'Social Media Starter Kit — base visual para perfiles y contenido social',
    'Extended Brand Guidelines — documento de uso más completo',
    '2 rondas de revisiones',
]

BRAND_APLICACIONES = [
    'Business cards y papelería',
    'Firmas de correo y documentos corporativos',
    'Presentación institucional o sales deck base',
    'Social media covers, avatars y templates iniciales',
    'Señalización, packaging o piezas físicas según el proyecto',
]

BRAND_EDITION_GROUPS = [
    ('Estrategia y dirección', [
        'Visual Strategy — definición de territorios visuales y criterios de posicionamiento',
        'Creative Direction — dirección creativa transversal para la marca',
        'Art Direction — lenguaje visual para campañas, fotografía, video y aplicaciones',
        'Complete Brand Identity — sistema de identidad completo y documentado',
    ]),
    ('Sistema visual avanzado', [
        'Advanced Graphic System — recursos modulares y reglas de composición',
        'Extended Iconography, patterns y elementos de apoyo',
        'Digital Applications — piezas clave para canales digitales',
        'Physical Applications — aplicaciones seleccionadas para entornos físicos',
        'Social Media Template System — sistema de templates coherente con la identidad',
        'Presentation / Proposal System — base visual para documentos y presentaciones',
    ]),
    ('Acompañamiento', [
        'Sesión estratégica inicial y mapa de necesidades visuales antes de diseñar',
        '3 rondas de revisiones',
        'Entrega organizada del sistema completo y sus aplicaciones',
        'Contacto directo con el estudio, sin intermediarios',
    ]),
]

BRAND_INHERIT_PREMIUM = ('Primary Logo · Logo Variations · Color Palette · Typography System · '
                         'Profile / Favicon Assets · Basic Graphic Language · '
                         'Basic Brand Guidelines · Archivos finales organizados')
BRAND_INHERIT_EDITION = ('Brand Concept · Extended Visual System · Graphic Language · '
                         'Patterns &amp; Supporting Graphics · Iconography · '
                         'Photography / Image Direction · Brand Applications · '
                         'Social Media Starter Kit · Extended Brand Guidelines')

SOCIAL_PRODUCTS = [
    ('Producto 01', 'Static Post', 'Pieza gráfica individual para una publicación. Composición, tipografía, imagen y adaptación a la identidad de marca.'),
    ('Producto 02', 'Carousel', 'Contenido de múltiples slides organizado como una narrativa visual coherente, con jerarquía y continuidad entre láminas.'),
    ('Producto 03', 'Story', 'Pieza vertical para Stories. Puede ser independiente o adaptación de una campaña o publicación principal.'),
    ('Producto 04', 'Reel / Short-Form Video', 'Edición y diseño de video vertical: ritmo, textos, gráficos, transiciones y recursos visuales.'),
    ('Producto 05', 'Motion Post', 'Pieza gráfica animada o motion graphic sin necesidad de partir de una grabación de video.'),
    ('Producto 06', 'Social Media Templates', 'Sistema reutilizable de plantillas para que la marca mantenga consistencia visual en publicaciones futuras.'),
]

SOCIAL_ESSENTIAL = [
    'Hasta 8 piezas de contenido visual al mes',
    'Combinación de Static Posts y Stories',
    'Adaptaciones de tamaño para formatos equivalentes',
    'Implementación de la identidad visual existente',
    'Sistema básico de composición para mantener consistencia',
    'Organización mensual de entregables',
    '1 ronda de revisiones por pieza',
]

SOCIAL_PREMIUM = [
    'Hasta 12–16 piezas mensuales, según combinación de formatos',
    'Static Posts, Carousels y Stories',
    'Reels / Short-Form Video dentro del mix mensual',
    'Basic Motion Graphics cuando el contenido lo requiera',
    'Custom Templates — plantillas diseñadas específicamente para la marca',
    'Feed Direction — criterio visual para mantener coherencia entre publicaciones',
    'Monthly Visual Direction — revisión de consistencia y evolución del sistema',
    '2 rondas de revisiones por pieza',
]

SOCIAL_INHERIT = ('Static Posts y Stories · Adaptaciones de tamaño · '
                  'Implementación de la identidad visual · Sistema básico de composición · '
                  'Organización mensual de entregables')

SOCIAL_EDITION_GROUPS = [
    ('Dirección creativa', [
        'Creative Direction mensual para la presencia digital',
        'Art Direction para campañas, lanzamientos y contenido especial',
        'Campaign Concepts — concepto visual de campañas seleccionadas',
        'Feed Direction y evolución continua del lenguaje visual',
    ]),
    ('Producción visual', [
        'Static Content, Carousels y Stories',
        'Reels / Short-Form Video',
        'Motion Graphics',
        'Advertising Graphics y piezas de campaña',
        'Custom Template System',
        'Cross-platform Adaptations para canales seleccionados',
    ]),
    ('Integración de marca', [
        'Revisión continua de consistencia con la identidad visual',
        'Coordinación de piezas sociales con campañas, web y materiales comerciales',
        'Biblioteca organizada de recursos visuales y templates',
        'Contacto directo con el estudio, sin intermediarios',
    ]),
]

MARKETING_GROUPS = [
    ('Sales & Presentations', ['Presentations / Pitch Decks', 'Company Profiles', 'Brochures', 'Catalogs', 'Proposal Templates']),
    ('Digital & Campaigns', ['Digital Ads', 'Email Graphics', 'Web / Campaign Banners', 'Launch Graphics', 'Campaign Key Visuals']),
    ('Print & Physical', ['Business Cards', 'Flyers', 'Signage', 'Packaging', 'Print Materials', 'Event Graphics', 'Promotional Materials']),
]

COMERCIALIZACION = [
    'Puede contratarse como pieza individual o como conjunto de entregables para una campaña.',
    'El alcance se define por número de páginas, formatos, adaptaciones, complejidad y nivel de dirección de arte.',
    'Cuando varias piezas forman parte de una misma campaña, se recomienda cotizarlas como sistema y no como diseños aislados.',
]

# ----------------------------------------------------------- visualización

INT_ESSENTIAL_INCLUYE = [
    'Vamos a tu espacio y lo medimos (Miami-Dade)',
    'Levantamos tu espacio en 3D',
    'Imágenes de cómo se va a ver tu proyecto',
    'Revisión 1 — cómo se organiza el espacio',
    'Revisión 2 — materiales, acabados e iluminación',
]
INT_ESSENTIAL_RECIBES = ['Las imágenes de tu proyecto en alta resolución (JPG / PNG)']
INT_ESSENTIAL_NO = ('Presentación · Planos de ningún tipo · Guía de materiales · '
                    'Proveedores · Mobiliario · Plan de iluminación')

INT_PREMIUM_SUMA = [
    'Un plano de tu espacio con medidas',
    'Una vista frontal de cada pared que importa',
    'Dónde va cada luz',
    'Dónde va cada piso y cada acabado',
    'Guía de materiales: qué material va en cada lugar, sin decir el proveedor',
    'Presentación del proyecto',
    'Revisión 3 — los planos y los materiales',
]
INT_PREMIUM_RECIBES = [
    'Las imágenes en alta resolución (JPG / PNG)',
    'Tus planos: el espacio con medidas, la vista frontal de cada pared, techos e iluminación, pisos y acabados (PDF)',
    'La guía de materiales (PDF)',
    'La presentación del proyecto (PDF)',
]
INT_PREMIUM_NO = ('Proveedores · La compra del material o el mobiliario · '
                  'Planos para sacar permisos · Supervisión de obra')

INT_EDITION_SUMA = [
    'Trabajamos en toda Florida, sin cobrarte el viaje',
    'La idea que sostiene el proyecto: por qué este material, por qué esta luz, por qué el espacio se siente así',
    'Planos con más detalle',
    'Presentación para tus clientes',
    'Un video de tu proyecto, hecho como una película',
    'Un video que explica el proyecto',
    'Vamos juntos a ver los materiales, con proveedores de aquí y de fuera',
    'Opciones de mobiliario elegidas para tu espacio',
    '2 de las revisiones se presentan en persona',
    'Revisión 4 — la idea y los videos',
]
INT_EDITION_RECIBES = [
    'Todo lo del plan Premium',
    'La idea del proyecto, escrita (PDF)',
    'Tus planos con más detalle (PDF)',
    'La presentación para tus clientes (PDF)',
    'El video hecho como película (MP4)',
    'El video que explica el proyecto (MP4)',
    'La lista de materiales y las opciones de mobiliario, con dónde conseguirlos (PDF)',
]
INT_EDITION_NO = ('La compra y el traslado del mobiliario · El montaje y la decoración final · '
                  'Supervisión de obra · Ingeniería y permisos')

INT_INHERIT_PREMIUM = ('Visita y medidas · Tu espacio en 3D · Imágenes de tu proyecto en alta '
                       'resolución · Revisión 1 y Revisión 2')
INT_INHERIT_EDITION = ('Visita y medidas · Tu espacio en 3D · Imágenes en alta resolución · '
                       'Plano con medidas · Vista frontal de cada pared · Iluminación · '
                       'Pisos y acabados · Guía de materiales · Presentación del proyecto · '
                       'Revisiones 1 a 3')

INT_EXTRAS = [
    ('Extra 01', 'Borsoga Immersive',
     'Camina tu espacio antes de que exista. Llevamos tu proyecto a unos lentes de realidad virtual, '
     'con la última tecnología de Meta, y vamos a donde estés. Te paras en tu cocina, miras hacia arriba, '
     'te acercas a un gabinete. A escala real.',
     'Sesión presencial donde estés. Los lentes los ponemos nosotros.'),
    ('Extra 02', 'Tour 360',
     'Tu proyecto, navegable desde cualquier pantalla. Un recorrido que se mueve, hecho con fotos 360 '
     'de tu proyecto. Se abre en cualquier navegador y lo compartes por link.',
     'Un link que abres en el navegador.'),
]

INT_COMPARE = [
    ['Visita y medidas', True, True, True],
    ['Tu espacio en 3D', True, True, True],
    ['Imágenes de tu proyecto', True, True, True],
    ['Plano con medidas', False, True, True],
    ['Vista frontal de cada pared', False, True, True],
    ['Techos e iluminación', False, True, True],
    ['Pisos y acabados', False, True, True],
    ['Guía de materiales', False, True, True],
    ['Presentación del proyecto', False, True, True],
    ['La idea del proyecto', False, False, True],
    ['Planos con más detalle', False, False, True],
    ['Presentación para tus clientes', False, False, True],
    ['Video hecho como película', False, False, True],
    ['Video que explica el proyecto', False, False, True],
    ['Acompañamiento a ver materiales', False, False, True],
    ['Opciones de mobiliario', False, False, True],
    ['Dónde trabajamos', 'Miami-Dade', 'Miami-Dade', 'Florida'],
    ['Revisiones presentadas en persona', False, False, '2'],
    ['Revisiones', '2', '3', '4'],
]

INT_REVISIONES = [
    ('1', 'Cómo se organiza el espacio: distribución y circulación', 'En los tres planes'),
    ('2', 'Materiales, acabados e iluminación', 'En los tres planes'),
    ('3', 'Los planos y la guía de materiales', 'Premium y Edition'),
    ('4', 'La idea del proyecto y los videos', 'Solo Edition'),
]

INT_CONDICIONES = [
    ('Dónde trabajamos', 'Essential y Premium en Miami-Dade. Borsoga Edition en toda Florida, sin cobrarte el viaje.'),
    ('Cuántos espacios', 'Desde una habitación hasta la casa completa. No hay mínimo: puedes contratar un solo espacio.'),
    ('Cuántas imágenes', 'Depende del tamaño de cada espacio, no del plan: 3 imágenes para un espacio pequeño, 5 para uno mediano, 8 para uno grande.'),
    ('Los archivos', 'Todo llega en formatos que puedes abrir y compartir: imágenes en JPG o PNG, planos y documentos en PDF, videos en MP4.'),
    ('Cuánto tarda', 'Por confirmar'),
    ('Cómo se paga', 'Pagas el 50% para arrancar. <span style="color:rgba(0,0,0,.45)">El resto, por confirmar.</span>'),
    ('Qué firmas', 'Un contrato digital que firmas en línea antes de empezar. <span style="color:rgba(0,0,0,.45)">Detalles por confirmar.</span>'),
    ('Lo que no está en tu plan', 'Ningún plan incluye la compra o el traslado del material y el mobiliario, la supervisión de obra, ni la ingeniería y los permisos.'),
]
