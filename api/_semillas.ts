// Los formularios editables tal como salieron del código (borsoga-studio,
// src/plans/forms/*.json). Solo se usan una vez: la primera vez que se piden y
// la base de datos no tiene ninguna versión, se guardan como versión 1.
import type { Esquema } from "./_esquema.js";
import type { Config } from "./_configurador.js";

export const SEMILLAS: Record<string, Esquema | Config> = {
  web: {
  "formato": 1,
  "servicio": "web",
  "planes": [
    "Web-Essential",
    "Web-Premium",
    "Web-Edition"
  ],
  "clave": "borsoga.cuestionario.dw.v1",
  "textos": {
    "contador": {
      "es": "Paso {n} de {total}",
      "en": "Step {n} of {total}"
    },
    "tope": {
      "es": "{n} de {max}",
      "en": "{n} of {max}"
    },
    "subir": {
      "es": "Arrastra los archivos o pulsa para elegirlos",
      "en": "Drag the files here or tap to choose them"
    },
    "enlace": {
      "es": "O comparte un enlace",
      "en": "Or share a link"
    },
    "guardado": {
      "es": "Tu avance se guarda en este navegador. Puedes cerrar y volver más tarde desde el mismo dispositivo.",
      "en": "Your progress is saved in this browser. You can close it and come back later from the same device."
    },
    "finalTitulo": {
      "es": "THANK YOU.",
      "en": "THANK YOU."
    },
    "finalP1": {
      "es": "Gracias por compartir toda esta información con nosotros.",
      "en": "Thank you for sharing all of this with us."
    },
    "finalP2": {
      "es": "La utilizaremos como punto de partida para definir la estructura, la dirección creativa y la tecnología de un sitio que no solo represente cómo se ve tu empresa hoy, sino hacia dónde quiere ir.",
      "en": "We'll use it as the starting point to define the structure, the creative direction and the technology of a site that represents not only how your company looks today, but where it wants to go."
    },
    "finalFirma": {
      "es": "Borsoga Studio",
      "en": "Borsoga Studio"
    },
    "resumen": {
      "es": "Lo que nos contaste",
      "en": "What you told us"
    }
  },
  "pasos": [
    {
      "id": "p1",
      "titulo": {
        "es": "Tu proyecto",
        "en": "Your project"
      },
      "preguntas": [
        {
          "f": "company",
          "tipo": "texto",
          "q": {
            "es": "¿Cuál es el nombre de la empresa o marca?",
            "en": "What's the name of the company or brand?"
          },
          "req": true,
          "resumen": {
            "es": "Marca",
            "en": "Brand"
          }
        },
        {
          "f": "webSocial",
          "tipo": "texto",
          "q": {
            "es": "¿La marca tiene actualmente sitio web o redes sociales?",
            "en": "Does the brand currently have a website or social media?"
          },
          "h": {
            "es": "Comparte el sitio, Instagram, LinkedIn u otro canal que nos ayude a conocerla.",
            "en": "Share the site, Instagram, LinkedIn or any other channel that helps us get to know it."
          },
          "ph": {
            "es": "borsoga.studio",
            "en": "borsoga.studio"
          }
        },
        {
          "f": "projectType",
          "tipo": "cards",
          "q": {
            "es": "¿Qué tipo de proyecto vamos a desarrollar?",
            "en": "What kind of project are we going to develop?"
          },
          "req": true,
          "col": true,
          "ops": [
            {
              "es": "Crear un sitio web desde cero",
              "en": "Create a website from scratch",
              "fija": true
            },
            {
              "es": "Rediseñar completamente el sitio actual",
              "en": "Completely redesign the current site"
            },
            {
              "es": "Mejorar u optimizar el sitio actual",
              "en": "Improve or optimize the current site"
            },
            {
              "es": "Añadir secciones o funcionalidades al sitio actual",
              "en": "Add sections or features to the current site"
            }
          ],
          "resumen": {
            "es": "Tipo de proyecto",
            "en": "Kind of project"
          }
        },
        {
          "f": "platform",
          "tipo": "chips",
          "q": {
            "es": "¿En qué plataforma está construido el sitio actual?",
            "en": "What platform is the current site built on?"
          },
          "req": true,
          "si": [
            {
              "f": "projectType",
              "op": "filled"
            },
            {
              "f": "projectType",
              "op": "ne",
              "v": "Crear un sitio web desde cero"
            }
          ],
          "ops": [
            {
              "es": "WordPress",
              "en": "WordPress"
            },
            {
              "es": "Wix",
              "en": "Wix"
            },
            {
              "es": "Squarespace",
              "en": "Squarespace"
            },
            {
              "es": "Shopify",
              "en": "Shopify"
            },
            {
              "es": "Webflow",
              "en": "Webflow"
            },
            {
              "es": "Desarrollo a medida",
              "en": "Custom development"
            },
            {
              "es": "No lo sé",
              "en": "I don't know"
            },
            {
              "es": "Otro",
              "en": "Other"
            }
          ],
          "resumen": {
            "es": "Plataforma actual",
            "en": "Current platform"
          }
        },
        {
          "f": "keepWhat",
          "tipo": "area",
          "q": {
            "es": "¿Qué funciona bien del sitio actual y te gustaría conservar?",
            "en": "What works well on the current site and you would like to keep?"
          },
          "si": [
            {
              "f": "projectType",
              "op": "filled"
            },
            {
              "f": "projectType",
              "op": "ne",
              "v": "Crear un sitio web desde cero"
            }
          ]
        },
        {
          "f": "painWhat",
          "tipo": "area",
          "q": {
            "es": "¿Qué no funciona o qué te frustra del sitio actual?",
            "en": "What doesn't work, or what frustrates you about the current site?"
          },
          "si": [
            {
              "f": "projectType",
              "op": "filled"
            },
            {
              "f": "projectType",
              "op": "ne",
              "v": "Crear un sitio web desde cero"
            }
          ]
        },
        {
          "f": "access",
          "tipo": "chips",
          "q": {
            "es": "¿Tienes acceso al dominio, hosting y administrador del sitio actual?",
            "en": "Do you have access to the domain, hosting and admin of the current site?"
          },
          "req": true,
          "si": [
            {
              "f": "projectType",
              "op": "filled"
            },
            {
              "f": "projectType",
              "op": "ne",
              "v": "Crear un sitio web desde cero"
            }
          ],
          "ops": [
            {
              "es": "Sí",
              "en": "Yes"
            },
            {
              "es": "No",
              "en": "No"
            },
            {
              "es": "No lo sé",
              "en": "I don't know"
            }
          ],
          "resumen": {
            "es": "Accesos",
            "en": "Access"
          }
        },
        {
          "f": "identity",
          "tipo": "cards",
          "q": {
            "es": "¿La marca tiene una identidad visual definida (logo, colores, tipografía)?",
            "en": "Does the brand have a defined visual identity (logo, colors, typography)?"
          },
          "req": true,
          "ops": [
            {
              "es": "Sí, completa",
              "en": "Yes, complete"
            },
            {
              "es": "Sí, pero necesita actualizarse",
              "en": "Yes, but it needs updating",
              "fija": true
            },
            {
              "es": "No, hay que crearla",
              "en": "No, it needs to be created",
              "fija": true
            }
          ],
          "resumen": {
            "es": "Identidad visual",
            "en": "Visual identity"
          },
          "junto": [
            "identityScope"
          ]
        },
        {
          "f": "identityScope",
          "tipo": "chips",
          "q": {
            "es": "¿Quieres que Borsoga trabaje la identidad visual como parte de este proyecto?",
            "en": "Would you like Borsoga to work on the visual identity as part of this project?"
          },
          "req": true,
          "si": [
            {
              "f": "identity",
              "op": "in",
              "v": [
                "Sí, pero necesita actualizarse",
                "No, hay que crearla"
              ]
            }
          ],
          "ops": [
            {
              "es": "Sí",
              "en": "Yes",
              "fija": true
            },
            {
              "es": "No",
              "en": "No"
            },
            {
              "es": "No estoy seguro",
              "en": "I'm not sure"
            }
          ]
        },
        {
          "f": "brandFiles",
          "tipo": "subida",
          "q": {
            "es": "Comparte el logo, manual de marca u otros materiales.",
            "en": "Share the logo, brand manual or other materials."
          },
          "enlace": "brandLink"
        }
      ]
    },
    {
      "id": "p2",
      "titulo": {
        "es": "Sobre la empresa",
        "en": "About the company"
      },
      "preguntas": [
        {
          "f": "whatDoes",
          "tipo": "area",
          "q": {
            "es": "Describe brevemente qué hace la empresa.",
            "en": "Briefly describe what the company does."
          },
          "h": {
            "es": "Imagina que tienes que explicárselo a alguien que nunca ha oído hablar de ella.",
            "en": "Imagine you have to explain it to someone who has never heard of it."
          },
          "req": true,
          "resumen": {
            "es": "Qué hace",
            "en": "What it does"
          }
        },
        {
          "f": "products",
          "tipo": "area",
          "q": {
            "es": "¿Qué productos o servicios ofrece?",
            "en": "What products or services does it offer?"
          }
        },
        {
          "f": "mainProduct",
          "tipo": "texto",
          "q": {
            "es": "¿Cuál es actualmente su producto o servicio principal?",
            "en": "What is currently its main product or service?"
          }
        },
        {
          "f": "category",
          "tipo": "chips",
          "q": {
            "es": "¿En qué categoría se encuentra principalmente la empresa?",
            "en": "Which category is the company mainly in?"
          },
          "req": true,
          "ops": [
            {
              "es": "Servicios profesionales",
              "en": "Professional services"
            },
            {
              "es": "Tecnología",
              "en": "Technology"
            },
            {
              "es": "Salud",
              "en": "Health"
            },
            {
              "es": "Real Estate / Desarrollo inmobiliario",
              "en": "Real estate / Development"
            },
            {
              "es": "Arquitectura / Construcción",
              "en": "Architecture / Construction"
            },
            {
              "es": "Hospitality",
              "en": "Hospitality"
            },
            {
              "es": "Retail",
              "en": "Retail"
            },
            {
              "es": "Alimentos y bebidas",
              "en": "Food and beverage"
            },
            {
              "es": "Moda / Lifestyle",
              "en": "Fashion / Lifestyle"
            },
            {
              "es": "Producto de consumo",
              "en": "Consumer product"
            },
            {
              "es": "E-commerce",
              "en": "E-commerce"
            },
            {
              "es": "Marca personal",
              "en": "Personal brand"
            },
            {
              "es": "Nonprofit",
              "en": "Nonprofit"
            },
            {
              "es": "Otro",
              "en": "Other"
            }
          ],
          "resumen": {
            "es": "Categoría",
            "en": "Category"
          }
        },
        {
          "f": "diff",
          "tipo": "area",
          "q": {
            "es": "¿Qué te diferencia de la competencia?",
            "en": "What sets you apart from the competition?"
          },
          "h": {
            "es": "Completa la idea: «A diferencia de otras empresas, nosotros…»",
            "en": "Complete the idea: \"Unlike other companies, we…\""
          },
          "req": true,
          "resumen": {
            "es": "Diferenciador",
            "en": "Differentiator"
          }
        },
        {
          "f": "competitors",
          "tipo": "area",
          "q": {
            "es": "¿Cuáles son tus principales competidores?",
            "en": "Who are your main competitors?"
          },
          "h": {
            "es": "Incluye hasta 3 nombres o enlaces.",
            "en": "Include up to 3 names or links."
          }
        },
        {
          "f": "markets",
          "tipo": "checks",
          "q": {
            "es": "¿Dónde opera o dónde espera operar principalmente?",
            "en": "Where does it operate, or where does it expect to operate?"
          },
          "req": true,
          "ops": [
            {
              "es": "Localmente",
              "en": "Locally"
            },
            {
              "es": "En todo Estados Unidos",
              "en": "Across the United States"
            },
            {
              "es": "Latinoamérica",
              "en": "Latin America"
            },
            {
              "es": "Internacionalmente",
              "en": "Internationally"
            },
            {
              "es": "Online / sin mercado geográfico específico",
              "en": "Online, with no specific geography"
            },
            {
              "es": "Otro",
              "en": "Other"
            }
          ],
          "resumen": {
            "es": "Mercados",
            "en": "Markets"
          }
        }
      ]
    },
    {
      "id": "p3",
      "titulo": {
        "es": "Objetivos del sitio",
        "en": "Goals for the site"
      },
      "preguntas": [
        {
          "f": "goal",
          "tipo": "cards",
          "q": {
            "es": "¿Cuál es el objetivo principal del sitio web?",
            "en": "What is the main goal of the website?"
          },
          "req": true,
          "ops": [
            {
              "es": "Generar contactos / leads",
              "en": "Generate contacts / leads"
            },
            {
              "es": "Vender online",
              "en": "Sell online"
            },
            {
              "es": "Agendar citas o reservas",
              "en": "Take appointments or bookings"
            },
            {
              "es": "Mostrar portafolio o proyectos",
              "en": "Show a portfolio or projects"
            },
            {
              "es": "Dar credibilidad y presencia institucional",
              "en": "Give credibility and an institutional presence"
            },
            {
              "es": "Informar y publicar contenido",
              "en": "Inform and publish content"
            },
            {
              "es": "Captar inversionistas",
              "en": "Attract investors"
            },
            {
              "es": "Otro",
              "en": "Other"
            }
          ],
          "resumen": {
            "es": "Objetivo del sitio",
            "en": "Goal for the site"
          }
        },
        {
          "f": "actions",
          "tipo": "tope",
          "q": {
            "es": "¿Qué acción concreta quieres que realice un visitante?",
            "en": "What specific action do you want a visitor to take?"
          },
          "h": {
            "es": "Selecciona máximo 3.",
            "en": "Pick a maximum of 3."
          },
          "req": true,
          "tope": 3,
          "ops": [
            {
              "es": "Llenar un formulario",
              "en": "Fill in a form"
            },
            {
              "es": "Llamar o escribir por WhatsApp",
              "en": "Call or message on WhatsApp"
            },
            {
              "es": "Comprar",
              "en": "Buy"
            },
            {
              "es": "Reservar",
              "en": "Book"
            },
            {
              "es": "Descargar un documento",
              "en": "Download a document"
            },
            {
              "es": "Suscribirse",
              "en": "Subscribe"
            },
            {
              "es": "Ver proyectos o productos",
              "en": "View projects or products"
            },
            {
              "es": "Solicitar una cotización",
              "en": "Request a quote"
            },
            {
              "es": "Otro",
              "en": "Other"
            }
          ],
          "resumen": {
            "es": "Acción del visitante",
            "en": "Visitor action"
          }
        },
        {
          "f": "success",
          "tipo": "area",
          "q": {
            "es": "Si el sitio resulta exitoso, ¿qué habrá cambiado para la empresa en 12 meses?",
            "en": "If the site works out, what will have changed for the company in 12 months?"
          },
          "h": {
            "es": "Ejemplos: «Recibir más solicitudes de clientes calificados.» · «Dejar de depender de Instagram para vender.» · «Parecer una empresa más sólida frente a inversionistas.»",
            "en": "Examples: \"Getting more enquiries from qualified clients.\" · \"No longer depending on Instagram to sell.\" · \"Looking like a more solid company to investors.\""
          },
          "req": true,
          "resumen": {
            "es": "Éxito a 12 meses",
            "en": "Success in 12 months"
          }
        }
      ]
    },
    {
      "id": "p4",
      "titulo": {
        "es": "Tu público",
        "en": "Your audience"
      },
      "preguntas": [
        {
          "f": "sellsTo",
          "tipo": "chips",
          "q": {
            "es": "¿A quién vende principalmente la empresa?",
            "en": "Who does the company mainly sell to?"
          },
          "req": true,
          "ops": [
            {
              "es": "Consumidores — B2C",
              "en": "Consumers — B2C"
            },
            {
              "es": "Empresas — B2B",
              "en": "Businesses — B2B"
            },
            {
              "es": "Ambos",
              "en": "Both"
            },
            {
              "es": "Otro",
              "en": "Other"
            }
          ],
          "resumen": {
            "es": "Vende a",
            "en": "Sells to"
          }
        },
        {
          "f": "visitor",
          "tipo": "area",
          "q": {
            "es": "Describe a tu visitante ideal.",
            "en": "Describe your ideal visitor."
          },
          "h": {
            "es": "Puedes pensar en: edad aproximada, ubicación, estilo de vida, necesidades, nivel adquisitivo (si es relevante) o, en B2B, tipo de empresa y quién decide.",
            "en": "You can think about: approximate age, location, lifestyle, needs, spending power (if relevant) or, in B2B, the kind of company and who decides."
          },
          "req": true
        },
        {
          "f": "doubts",
          "tipo": "area",
          "q": {
            "es": "¿Qué busca ese visitante al entrar al sitio y qué dudas suele tener antes de contactarte?",
            "en": "What is that visitor looking for when they land on the site, and what doubts do they usually have before getting in touch?"
          }
        },
        {
          "f": "sources",
          "tipo": "checks",
          "q": {
            "es": "¿Desde dónde llegarán principalmente los visitantes?",
            "en": "Where will visitors mainly come from?"
          },
          "req": true,
          "ops": [
            {
              "es": "Redes sociales",
              "en": "Social media"
            },
            {
              "es": "Búsqueda en Google",
              "en": "Google search"
            },
            {
              "es": "Anuncios pagados",
              "en": "Paid ads"
            },
            {
              "es": "Referidos / boca a boca",
              "en": "Referrals / word of mouth"
            },
            {
              "es": "Email",
              "en": "Email"
            },
            {
              "es": "Eventos o material impreso",
              "en": "Events or printed material"
            },
            {
              "es": "Otro",
              "en": "Other"
            }
          ],
          "resumen": {
            "es": "Origen del tráfico",
            "en": "Traffic sources"
          }
        },
        {
          "f": "devices",
          "tipo": "chips",
          "q": {
            "es": "¿Desde qué dispositivo crees que te visitarán más?",
            "en": "Which device do you think they will visit from most?"
          },
          "req": true,
          "ops": [
            {
              "es": "Mayoría móvil",
              "en": "Mostly mobile"
            },
            {
              "es": "Mayoría desktop",
              "en": "Mostly desktop"
            },
            {
              "es": "Equilibrado",
              "en": "Balanced"
            },
            {
              "es": "No lo sé",
              "en": "I don't know"
            }
          ],
          "resumen": {
            "es": "Dispositivo",
            "en": "Device"
          }
        }
      ]
    },
    {
      "id": "p5",
      "titulo": {
        "es": "Estructura y contenido",
        "en": "Structure and content"
      },
      "preguntas": [
        {
          "f": "pages",
          "tipo": "checks",
          "q": {
            "es": "¿Qué páginas o secciones necesita el sitio?",
            "en": "What pages or sections does the site need?"
          },
          "req": true,
          "ops": [
            {
              "es": "Inicio",
              "en": "Home"
            },
            {
              "es": "Sobre nosotros",
              "en": "About us"
            },
            {
              "es": "Servicios",
              "en": "Services"
            },
            {
              "es": "Productos / tienda",
              "en": "Products / shop"
            },
            {
              "es": "Portafolio / proyectos",
              "en": "Portfolio / projects"
            },
            {
              "es": "Blog / noticias",
              "en": "Blog / news"
            },
            {
              "es": "Testimonios",
              "en": "Testimonials"
            },
            {
              "es": "Equipo",
              "en": "Team"
            },
            {
              "es": "Preguntas frecuentes",
              "en": "FAQ"
            },
            {
              "es": "Contacto",
              "en": "Contact"
            },
            {
              "es": "Reservas",
              "en": "Bookings"
            },
            {
              "es": "Landing pages para campañas",
              "en": "Campaign landing pages"
            },
            {
              "es": "Otro",
              "en": "Other"
            }
          ],
          "resumen": {
            "es": "Páginas",
            "en": "Pages"
          }
        },
        {
          "f": "structure",
          "tipo": "area",
          "q": {
            "es": "¿Tienes pensada una estructura o un orden para el sitio?",
            "en": "Do you have a structure or an order in mind for the site?"
          }
        },
        {
          "f": "size",
          "tipo": "chips",
          "q": {
            "es": "¿Qué tamaño aproximado tendrá?",
            "en": "Roughly how big will it be?"
          },
          "req": true,
          "ops": [
            {
              "es": "Una sola página (landing)",
              "en": "A single page (landing)"
            },
            {
              "es": "2–5 páginas",
              "en": "2–5 pages"
            },
            {
              "es": "6–10 páginas",
              "en": "6–10 pages"
            },
            {
              "es": "Más de 10 páginas",
              "en": "More than 10 pages"
            },
            {
              "es": "No lo sé",
              "en": "I don't know"
            }
          ],
          "resumen": {
            "es": "Tamaño",
            "en": "Size"
          }
        },
        {
          "f": "copyReady",
          "tipo": "chips",
          "q": {
            "es": "¿Tienes los textos listos?",
            "en": "Do you have the copy ready?"
          },
          "req": true,
          "ops": [
            {
              "es": "Sí, listos",
              "en": "Yes, ready",
              "fija": true
            },
            {
              "es": "Parcialmente",
              "en": "Partially"
            },
            {
              "es": "No, hay que redactarlos",
              "en": "No, they need to be written"
            }
          ],
          "resumen": {
            "es": "Textos",
            "en": "Copy"
          },
          "junto": [
            "copyScope"
          ]
        },
        {
          "f": "copyScope",
          "tipo": "chips",
          "q": {
            "es": "¿Quieres que Borsoga se encargue de la redacción?",
            "en": "Would you like Borsoga to handle the writing?"
          },
          "req": true,
          "si": [
            {
              "f": "copyReady",
              "op": "filled"
            },
            {
              "f": "copyReady",
              "op": "ne",
              "v": "Sí, listos"
            }
          ],
          "ops": [
            {
              "es": "Sí",
              "en": "Yes",
              "fija": true
            },
            {
              "es": "No",
              "en": "No"
            },
            {
              "es": "No estoy seguro",
              "en": "I'm not sure"
            }
          ]
        },
        {
          "f": "media",
          "tipo": "cards",
          "q": {
            "es": "¿Tienes fotografías o vídeo propios?",
            "en": "Do you have your own photography or video?"
          },
          "req": true,
          "ops": [
            {
              "es": "Sí, de calidad profesional",
              "en": "Yes, professional quality",
              "fija": true
            },
            {
              "es": "Sí, pero de baja calidad",
              "en": "Yes, but low quality"
            },
            {
              "es": "No",
              "en": "No"
            }
          ],
          "resumen": {
            "es": "Material propio",
            "en": "Own material"
          },
          "junto": [
            "mediaNeeds"
          ]
        },
        {
          "f": "mediaNeeds",
          "tipo": "chipchecks",
          "q": {
            "es": "¿Qué necesitarías producir?",
            "en": "What would you need to produce?"
          },
          "req": true,
          "si": [
            {
              "f": "media",
              "op": "filled"
            },
            {
              "f": "media",
              "op": "ne",
              "v": "Sí, de calidad profesional"
            }
          ],
          "ops": [
            {
              "es": "Fotografía",
              "en": "Photography"
            },
            {
              "es": "Vídeo",
              "en": "Video"
            },
            {
              "es": "Renders 3D",
              "en": "3D renders"
            },
            {
              "es": "Imágenes generadas con IA",
              "en": "AI-generated images"
            },
            {
              "es": "No estoy seguro",
              "en": "I'm not sure"
            }
          ]
        },
        {
          "f": "alwaysVisible",
          "tipo": "area",
          "q": {
            "es": "¿Qué información debe estar siempre visible?",
            "en": "What information must always be visible?"
          },
          "h": {
            "es": "Por ejemplo: teléfono, WhatsApp, dirección, horario, botón de reserva.",
            "en": "For example: phone, WhatsApp, address, opening hours, a booking button."
          }
        },
        {
          "f": "highlight",
          "tipo": "area",
          "q": {
            "es": "¿Qué debe destacarse por encima de todo lo demás?",
            "en": "What should stand out above everything else?"
          }
        },
        {
          "f": "languages",
          "tipo": "chipchecks",
          "q": {
            "es": "¿En qué idiomas deberá funcionar el sitio?",
            "en": "Which languages does the site need to work in?"
          },
          "req": true,
          "ops": [
            {
              "es": "Inglés",
              "en": "English"
            },
            {
              "es": "Español",
              "en": "Spanish"
            },
            {
              "es": "Inglés + Español",
              "en": "English + Spanish"
            },
            {
              "es": "Otro",
              "en": "Other"
            }
          ],
          "resumen": {
            "es": "Idiomas",
            "en": "Languages"
          }
        }
      ]
    },
    {
      "id": "p6",
      "titulo": {
        "es": "Funcionalidades",
        "en": "Features"
      },
      "preguntas": [
        {
          "f": "features",
          "tipo": "checks",
          "q": {
            "es": "¿Qué funcionalidades necesita el sitio?",
            "en": "What features does the site need?"
          },
          "req": true,
          "ops": [
            {
              "es": "Formulario de contacto",
              "en": "Contact form",
              "fija": true
            },
            {
              "es": "Chat o botón de WhatsApp",
              "en": "Chat or WhatsApp button"
            },
            {
              "es": "Reservas / agenda",
              "en": "Bookings / scheduling",
              "fija": true
            },
            {
              "es": "Tienda online con pagos",
              "en": "Online shop with payments",
              "fija": true
            },
            {
              "es": "Catálogo sin compra",
              "en": "Catalogue without checkout"
            },
            {
              "es": "Cotizador o calculadora",
              "en": "Quote tool or calculator"
            },
            {
              "es": "Área privada de clientes",
              "en": "Private client area"
            },
            {
              "es": "Blog",
              "en": "Blog"
            },
            {
              "es": "Newsletter",
              "en": "Newsletter"
            },
            {
              "es": "Galería / portafolio",
              "en": "Gallery / portfolio"
            },
            {
              "es": "Mapa",
              "en": "Map"
            },
            {
              "es": "Descarga de documentos",
              "en": "Document downloads"
            },
            {
              "es": "Otro",
              "en": "Other"
            }
          ],
          "resumen": {
            "es": "Funcionalidades",
            "en": "Features"
          }
        },
        {
          "f": "forms",
          "tipo": "area",
          "q": {
            "es": "¿Cuántos formularios necesitas y con qué fin cada uno?",
            "en": "How many forms do you need, and what is each one for?"
          },
          "req": true,
          "si": [
            {
              "f": "features",
              "op": "has",
              "v": [
                "Formulario de contacto"
              ]
            }
          ]
        },
        {
          "f": "skuCount",
          "tipo": "chips",
          "q": {
            "es": "¿Cuántos productos aproximadamente?",
            "en": "Roughly how many products?"
          },
          "req": true,
          "si": [
            {
              "f": "features",
              "op": "has",
              "v": [
                "Tienda online con pagos"
              ]
            }
          ],
          "ops": [
            {
              "es": "1–10",
              "en": "1–10"
            },
            {
              "es": "11–50",
              "en": "11–50"
            },
            {
              "es": "51–200",
              "en": "51–200"
            },
            {
              "es": "Más de 200",
              "en": "More than 200"
            }
          ]
        },
        {
          "f": "delivery",
          "tipo": "chipchecks",
          "q": {
            "es": "¿Cómo se entregan?",
            "en": "How are they delivered?"
          },
          "req": true,
          "si": [
            {
              "f": "features",
              "op": "has",
              "v": [
                "Tienda online con pagos"
              ]
            }
          ],
          "ops": [
            {
              "es": "Envío físico",
              "en": "Physical shipping"
            },
            {
              "es": "Recogida en local",
              "en": "Pickup in store"
            },
            {
              "es": "Producto digital",
              "en": "Digital product"
            },
            {
              "es": "Servicio",
              "en": "Service"
            }
          ]
        },
        {
          "f": "platformsSelling",
          "tipo": "texto",
          "q": {
            "es": "¿Ya vendes en alguna plataforma?",
            "en": "Do you already sell on any platform?"
          },
          "si": [
            {
              "f": "features",
              "op": "has",
              "v": [
                "Tienda online con pagos"
              ]
            }
          ]
        },
        {
          "f": "booking",
          "tipo": "area",
          "q": {
            "es": "¿Qué se reserva y qué herramienta usas hoy para gestionarlo?",
            "en": "What gets booked, and what tool do you use to manage it today?"
          },
          "req": true,
          "si": [
            {
              "f": "features",
              "op": "has",
              "v": [
                "Reservas / agenda"
              ]
            }
          ]
        },
        {
          "f": "integrations",
          "tipo": "checks",
          "q": {
            "es": "¿Con qué herramientas debe conectarse el sitio?",
            "en": "Which tools does the site need to connect to?"
          },
          "req": true,
          "ops": [
            {
              "es": "CRM",
              "en": "CRM"
            },
            {
              "es": "Email marketing",
              "en": "Email marketing"
            },
            {
              "es": "WhatsApp / automatización de mensajes",
              "en": "WhatsApp / message automation"
            },
            {
              "es": "Calendario o sistema de citas",
              "en": "Calendar or appointment system"
            },
            {
              "es": "Pasarela de pago",
              "en": "Payment gateway"
            },
            {
              "es": "Google Analytics / Meta Pixel",
              "en": "Google Analytics / Meta Pixel"
            },
            {
              "es": "Ninguna por ahora",
              "en": "None for now"
            },
            {
              "es": "Otro",
              "en": "Other"
            }
          ],
          "solo": "Ninguna por ahora",
          "resumen": {
            "es": "Integraciones",
            "en": "Integrations"
          }
        },
        {
          "f": "automations",
          "tipo": "chips",
          "q": {
            "es": "¿Te interesa conectar el sitio con automatizaciones en redes sociales?",
            "en": "Are you interested in connecting the site to social media automations?"
          },
          "h": {
            "es": "Por ejemplo: comentario en Instagram → mensaje directo → landing o reserva.",
            "en": "For example: an Instagram comment → a direct message → a landing page or booking."
          },
          "req": true,
          "ops": [
            {
              "es": "Sí",
              "en": "Yes"
            },
            {
              "es": "No",
              "en": "No"
            },
            {
              "es": "Quiero saber más",
              "en": "I want to know more"
            }
          ],
          "resumen": {
            "es": "Automatizaciones",
            "en": "Automations"
          }
        }
      ]
    },
    {
      "id": "p7",
      "titulo": {
        "es": "Diseño visual y referencias",
        "en": "Visual design and references"
      },
      "preguntas": [
        {
          "f": "refFiles",
          "tipo": "subida",
          "q": {
            "es": "Comparte entre 2 y 5 sitios web que te gusten.",
            "en": "Share between 2 and 5 websites you like."
          },
          "h": {
            "es": "No tienen que ser de tu industria. Enlaces o capturas.",
            "en": "They don't have to be from your industry. Links or screenshots."
          },
          "req": true,
          "area": "refsText"
        },
        {
          "f": "refsWhy",
          "tipo": "area",
          "q": {
            "es": "¿Qué te gusta específicamente de esos sitios?",
            "en": "What specifically do you like about those sites?"
          },
          "h": {
            "es": "Evita decir solo «el diseño». Piensa en: navegación, simplicidad, tipografía, color, fotografía, animaciones, sensación premium, claridad del mensaje.",
            "en": "Avoid just saying \"the design\". Think about: navigation, simplicity, typography, color, photography, animation, a premium feel, clarity of the message."
          },
          "req": true
        },
        {
          "f": "refsNot",
          "tipo": "area",
          "q": {
            "es": "¿Qué NO incluirías de esos sitios?",
            "en": "What would you NOT take from those sites?"
          }
        },
        {
          "f": "avoidSites",
          "tipo": "area",
          "q": {
            "es": "¿Hay sitios o estilos que definitivamente NO quieres que tu web recuerde?",
            "en": "Are there sites or styles you definitely do NOT want your site to bring to mind?"
          }
        },
        {
          "f": "personality",
          "tipo": "tope",
          "q": {
            "es": "Si tu sitio fuera una persona, ¿cómo debería ser?",
            "en": "If your site were a person, what should they be like?"
          },
          "h": {
            "es": "Selecciona máximo 5.",
            "en": "Pick a maximum of 5."
          },
          "req": true,
          "tope": 5,
          "ops": [
            {
              "es": "Elegante",
              "en": "Elegant"
            },
            {
              "es": "Moderno",
              "en": "Modern"
            },
            {
              "es": "Sofisticado",
              "en": "Sophisticated"
            },
            {
              "es": "Premium",
              "en": "Premium"
            },
            {
              "es": "Cercano",
              "en": "Approachable"
            },
            {
              "es": "Humano",
              "en": "Human"
            },
            {
              "es": "Profesional",
              "en": "Professional"
            },
            {
              "es": "Confiable",
              "en": "Trustworthy"
            },
            {
              "es": "Innovador",
              "en": "Innovative"
            },
            {
              "es": "Audaz",
              "en": "Bold"
            },
            {
              "es": "Minimalista",
              "en": "Minimal"
            },
            {
              "es": "Técnico",
              "en": "Technical"
            },
            {
              "es": "Exclusivo",
              "en": "Exclusive"
            },
            {
              "es": "Artesanal",
              "en": "Crafted"
            },
            {
              "es": "Dinámico",
              "en": "Dynamic"
            },
            {
              "es": "Juvenil",
              "en": "Youthful"
            },
            {
              "es": "Atemporal",
              "en": "Timeless"
            },
            {
              "es": "Disruptivo",
              "en": "Disruptive"
            },
            {
              "es": "Serio",
              "en": "Serious"
            },
            {
              "es": "Cálido",
              "en": "Warm"
            }
          ],
          "resumen": {
            "es": "Personalidad",
            "en": "Personality"
          }
        },
        {
          "f": "axes",
          "tipo": "ejes",
          "q": {
            "es": "¿Dónde debería situarse el diseño?",
            "en": "Where should the design sit?"
          },
          "req": true,
          "ejes": [
            {
              "a": {
                "es": "Minimalista",
                "en": "Minimal"
              },
              "b": {
                "es": "Expresivo",
                "en": "Expressive"
              }
            },
            {
              "a": {
                "es": "Clásico",
                "en": "Classic"
              },
              "b": {
                "es": "Contemporáneo",
                "en": "Contemporary"
              }
            },
            {
              "a": {
                "es": "Sobrio",
                "en": "Restrained"
              },
              "b": {
                "es": "Audaz",
                "en": "Bold"
              }
            },
            {
              "a": {
                "es": "Corporativo",
                "en": "Corporate"
              },
              "b": {
                "es": "Cercano",
                "en": "Approachable"
              }
            },
            {
              "a": {
                "es": "Informativo",
                "en": "Informative"
              },
              "b": {
                "es": "Emocional",
                "en": "Emotional"
              }
            }
          ],
          "a11y": {
            "es": "{a} a {b}, posición {n} de 5",
            "en": "{a} to {b}, position {n} of 5"
          },
          "resumen": {
            "es": "Posición",
            "en": "Position"
          }
        },
        {
          "f": "motion",
          "tipo": "cards",
          "q": {
            "es": "¿Qué nivel de animación quieres?",
            "en": "How much animation do you want?"
          },
          "req": true,
          "col": true,
          "ops": [
            {
              "es": "Mínimo — sitio estático, rápido y directo",
              "en": "Minimal — a static site, fast and direct"
            },
            {
              "es": "Moderado — transiciones suaves y detalles al hacer scroll",
              "en": "Moderate — smooth transitions and details on scroll"
            },
            {
              "es": "Alto — experiencia inmersiva (3D, animaciones, scroll narrativo)",
              "en": "High — an immersive experience (3D, animation, narrative scroll)"
            }
          ],
          "resumen": {
            "es": "Animación",
            "en": "Animation"
          }
        },
        {
          "f": "feelings",
          "tipo": "tope",
          "q": {
            "es": "¿Cómo quieres que una persona se sienta al entrar al sitio?",
            "en": "How do you want someone to feel when they land on the site?"
          },
          "h": {
            "es": "Selecciona máximo 3.",
            "en": "Pick a maximum of 3."
          },
          "req": true,
          "tope": 3,
          "ops": [
            {
              "es": "Confianza",
              "en": "Trust"
            },
            {
              "es": "Seguridad",
              "en": "Security"
            },
            {
              "es": "Deseo",
              "en": "Desire"
            },
            {
              "es": "Curiosidad",
              "en": "Curiosity"
            },
            {
              "es": "Tranquilidad",
              "en": "Calm"
            },
            {
              "es": "Exclusividad",
              "en": "Exclusivity"
            },
            {
              "es": "Inspiración",
              "en": "Inspiration"
            },
            {
              "es": "Energía",
              "en": "Energy"
            },
            {
              "es": "Cercanía",
              "en": "Closeness"
            },
            {
              "es": "Innovación",
              "en": "Innovation"
            },
            {
              "es": "Profesionalismo",
              "en": "Professionalism"
            },
            {
              "es": "Otro",
              "en": "Other"
            }
          ],
          "resumen": {
            "es": "Debe hacer sentir",
            "en": "Should make people feel"
          }
        },
        {
          "f": "visualElements",
          "tipo": "area",
          "q": {
            "es": "¿Hay elementos visuales que sean importantes para la marca?",
            "en": "Are there visual elements that are important to the brand?"
          },
          "h": {
            "es": "Colores, símbolos, arquitectura, ubicación, materiales, fotografía específica.",
            "en": "Colors, symbols, architecture, location, materials, specific photography."
          }
        },
        {
          "f": "avoidVisual",
          "tipo": "area",
          "q": {
            "es": "¿Hay algo que definitivamente NO quieres ver en el diseño?",
            "en": "Is there anything you definitely do NOT want to see in the design?"
          }
        }
      ]
    },
    {
      "id": "p8",
      "titulo": {
        "es": "Técnico y mantenimiento",
        "en": "Technical and maintenance"
      },
      "preguntas": [
        {
          "f": "domain",
          "tipo": "chips",
          "q": {
            "es": "¿Tienes dominio?",
            "en": "Do you have a domain?"
          },
          "req": true,
          "ops": [
            {
              "es": "Sí",
              "en": "Yes"
            },
            {
              "es": "No",
              "en": "No"
            },
            {
              "es": "Necesito ayuda para elegirlo",
              "en": "I need help choosing one"
            }
          ],
          "resumen": {
            "es": "Dominio",
            "en": "Domain"
          }
        },
        {
          "f": "hosting",
          "tipo": "chips",
          "q": {
            "es": "¿Tienes hosting contratado?",
            "en": "Do you have hosting?"
          },
          "req": true,
          "ops": [
            {
              "es": "Sí",
              "en": "Yes"
            },
            {
              "es": "No",
              "en": "No"
            },
            {
              "es": "No lo sé",
              "en": "I don't know"
            },
            {
              "es": "Prefiero que Borsoga lo gestione",
              "en": "I'd rather Borsoga managed it",
              "fija": true
            }
          ],
          "resumen": {
            "es": "Hosting",
            "en": "Hosting"
          }
        },
        {
          "f": "updater",
          "tipo": "chips",
          "q": {
            "es": "¿Quién actualizará el contenido después del lanzamiento?",
            "en": "Who will update the content after launch?"
          },
          "req": true,
          "ops": [
            {
              "es": "Nosotros mismos",
              "en": "We will, ourselves"
            },
            {
              "es": "Borsoga",
              "en": "Borsoga",
              "fija": true
            },
            {
              "es": "Todavía no está definido",
              "en": "Not defined yet"
            }
          ],
          "resumen": {
            "es": "Actualización",
            "en": "Updates"
          }
        },
        {
          "f": "support",
          "tipo": "chips",
          "q": {
            "es": "¿Necesitas mantenimiento y soporte continuo?",
            "en": "Do you need ongoing maintenance and support?"
          },
          "req": true,
          "ops": [
            {
              "es": "Sí",
              "en": "Yes"
            },
            {
              "es": "No",
              "en": "No"
            },
            {
              "es": "No estoy seguro",
              "en": "I'm not sure"
            }
          ]
        },
        {
          "f": "seo",
          "tipo": "cards",
          "q": {
            "es": "¿Qué importancia tiene el posicionamiento en Google (SEO)?",
            "en": "How important is ranking on Google (SEO)?"
          },
          "req": true,
          "ops": [
            {
              "es": "Prioritario",
              "en": "A priority"
            },
            {
              "es": "Importante pero no urgente",
              "en": "Important but not urgent"
            },
            {
              "es": "No por ahora",
              "en": "Not for now"
            }
          ],
          "resumen": {
            "es": "SEO",
            "en": "SEO"
          }
        },
        {
          "f": "restrictions",
          "tipo": "area",
          "q": {
            "es": "¿Existe alguna restricción que debamos conocer?",
            "en": "Is there any restriction we should know about?"
          },
          "h": {
            "es": "Por ejemplo: requisitos legales, política de privacidad o cookies, accesibilidad, relación con una empresa matriz, elementos que deben mantenerse.",
            "en": "For example: legal requirements, a privacy or cookie policy, accessibility, a relationship with a parent company, elements that must be kept."
          }
        }
      ]
    },
    {
      "id": "p9",
      "titulo": {
        "es": "Plazos y decisiones",
        "en": "Timing and decisions"
      },
      "preguntas": [
        {
          "f": "launchDate",
          "tipo": "chips",
          "q": {
            "es": "¿Existe una fecha importante para lanzar el sitio?",
            "en": "Is there an important date to launch the site?"
          },
          "req": true,
          "ops": [
            {
              "es": "Sí",
              "en": "Yes",
              "fija": true
            },
            {
              "es": "No",
              "en": "No"
            }
          ],
          "resumen": {
            "es": "Fecha de lanzamiento",
            "en": "Launch date"
          },
          "junto": [
            "launchDateValue",
            "whatHappens"
          ]
        },
        {
          "f": "launchDateValue",
          "tipo": "fecha",
          "q": {
            "es": "¿Cuál?",
            "en": "Which one?"
          },
          "req": true,
          "si": [
            {
              "f": "launchDate",
              "op": "eq",
              "v": "Sí"
            }
          ]
        },
        {
          "f": "whatHappens",
          "tipo": "texto",
          "q": {
            "es": "¿Qué ocurrirá en esa fecha?",
            "en": "What will happen on that date?"
          },
          "h": {
            "es": "Ejemplo: lanzamiento, apertura, campaña, evento, presentación a inversionistas.",
            "en": "Example: a launch, an opening, a campaign, an event, an investor presentation."
          },
          "si": [
            {
              "f": "launchDate",
              "op": "eq",
              "v": "Sí"
            }
          ]
        },
        {
          "f": "approvers",
          "tipo": "cards",
          "q": {
            "es": "¿Quién participará en la aprobación del sitio?",
            "en": "Who will take part in approving the site?"
          },
          "req": true,
          "ops": [
            {
              "es": "Una persona",
              "en": "One person"
            },
            {
              "es": "Dos personas",
              "en": "Two people"
            },
            {
              "es": "Tres o más personas",
              "en": "Three or more people"
            },
            {
              "es": "Un equipo/directiva",
              "en": "A team or board"
            }
          ],
          "resumen": {
            "es": "Aprobación",
            "en": "Approval"
          }
        },
        {
          "f": "budget",
          "tipo": "chips",
          "q": {
            "es": "¿Tienes un rango de presupuesto definido?",
            "en": "Do you have a defined budget range?"
          },
          "req": true,
          "ops": [
            {
              "es": "Sí",
              "en": "Yes",
              "fija": true
            },
            {
              "es": "Prefiero recibir una propuesta",
              "en": "I'd rather receive a proposal"
            },
            {
              "es": "Todavía no está definido",
              "en": "Not defined yet",
              "fija": true
            }
          ],
          "resumen": {
            "es": "Presupuesto",
            "en": "Budget"
          },
          "junto": [
            "budgetValue"
          ]
        },
        {
          "f": "budgetValue",
          "tipo": "texto",
          "q": {
            "es": "¿Cuál?",
            "en": "Which one?"
          },
          "req": true,
          "si": [
            {
              "f": "budget",
              "op": "eq",
              "v": "Sí"
            }
          ]
        }
      ]
    },
    {
      "id": "p10",
      "titulo": {
        "es": "Para terminar",
        "en": "To finish"
      },
      "preguntas": [
        {
          "f": "anythingElse",
          "tipo": "area",
          "q": {
            "es": "¿Hay algo importante sobre tu empresa, tu historia o este proyecto que no te hayamos preguntado?",
            "en": "Is there anything important about your company, your history or this project that we haven't asked you?"
          }
        },
        {
          "f": "contacto",
          "tipo": "contacto",
          "q": {
            "es": "Tus datos",
            "en": "Your details"
          },
          "req": true,
          "campos": {
            "nombre": {
              "es": "Nombre",
              "en": "Name"
            },
            "correo": {
              "es": "Correo",
              "en": "Email"
            },
            "telefono": {
              "es": "Teléfono",
              "en": "Phone"
            }
          }
        }
      ]
    }
  ]
} as Esquema,
  grafico: {
  "formato": 1,
  "servicio": "grafico",
  "planes": [
    "Brand-Essentials",
    "Brand-Premium",
    "Brand-Edition",
    "Social-Essential",
    "Social-Premium",
    "Social-Edition"
  ],
  "clave": "borsoga.cuestionario.gd.v2",
  "textos": {
    "contador": {
      "es": "Paso {n} de {total}",
      "en": "Step {n} of {total}"
    },
    "tope": {
      "es": "{n} de {max}",
      "en": "{n} of {max}"
    },
    "subir": {
      "es": "Arrastra los archivos o pulsa para elegirlos",
      "en": "Drag the files here or tap to choose them"
    },
    "enlace": {
      "es": "O comparte un enlace",
      "en": "Or share a link"
    },
    "guardado": {
      "es": "Tu avance se guarda en este navegador. Puedes cerrar y volver más tarde desde el mismo dispositivo.",
      "en": "Your progress is saved in this browser. You can close it and come back later from the same device."
    },
    "finalTitulo": {
      "es": "THANK YOU.",
      "en": "THANK YOU."
    },
    "finalP1": {
      "es": "Gracias por compartir toda esta información con nosotros.",
      "en": "Thank you for sharing all of this with us."
    },
    "finalP2": {
      "es": "La utilizaremos como punto de partida para investigar, definir la dirección creativa y construir una identidad que no solo represente cómo se ve tu empresa hoy, sino hacia dónde quiere ir.",
      "en": "We'll use it as the starting point to research, define the creative direction and build an identity that represents not only how your company looks today, but where it wants to go."
    },
    "finalFirma": {
      "es": "Borsoga Studio",
      "en": "Borsoga Studio"
    },
    "resumen": {
      "es": "Lo que nos contaste",
      "en": "What you told us"
    }
  },
  "pasos": [
    {
      "id": "p1",
      "titulo": {
        "es": "Tu proyecto",
        "en": "Your project"
      },
      "preguntas": [
        {
          "f": "company",
          "tipo": "texto",
          "q": {
            "es": "¿Cuál es el nombre de la empresa o marca?",
            "en": "What's the name of the company or brand?"
          },
          "req": true,
          "resumen": {
            "es": "Marca",
            "en": "Brand"
          }
        },
        {
          "f": "webSocial",
          "tipo": "texto",
          "q": {
            "es": "¿La marca tiene actualmente sitio web o redes sociales?",
            "en": "Does the brand currently have a website or social media?"
          },
          "h": {
            "es": "Puedes compartir el sitio web, Instagram, LinkedIn u otro canal que nos ayude a conocerla.",
            "en": "You can share the website, Instagram, LinkedIn or any other channel that helps us get to know it."
          },
          "ph": {
            "es": "borsoga.studio",
            "en": "borsoga.studio"
          }
        },
        {
          "f": "projectType",
          "tipo": "cards",
          "q": {
            "es": "¿Qué tipo de proyecto vamos a desarrollar?",
            "en": "What kind of project are we going to develop?"
          },
          "req": true,
          "col": true,
          "ops": [
            {
              "es": "Crear una identidad visual desde cero",
              "en": "Create a visual identity from scratch",
              "fija": true
            },
            {
              "es": "Rediseñar completamente una identidad existente",
              "en": "Completely redesign an existing identity",
              "fija": true
            },
            {
              "es": "Actualizar/refrescar una identidad existente",
              "en": "Update or refresh an existing identity",
              "fija": true
            },
            {
              "es": "Ampliar un sistema de identidad que ya existe",
              "en": "Extend an identity system that already exists",
              "fija": true
            }
          ],
          "resumen": {
            "es": "Tipo de proyecto",
            "en": "Kind of project"
          }
        },
        {
          "f": "nameDefined",
          "tipo": "chips",
          "q": {
            "es": "¿El nombre de la marca ya está definido?",
            "en": "Is the brand name already defined?"
          },
          "req": true,
          "si": [
            {
              "f": "projectType",
              "op": "eq",
              "v": "Crear una identidad visual desde cero"
            }
          ],
          "ops": [
            {
              "es": "Sí",
              "en": "Yes",
              "fija": true
            },
            {
              "es": "No",
              "en": "No"
            },
            {
              "es": "Tenemos varias opciones",
              "en": "We have several options"
            }
          ]
        },
        {
          "f": "needsNaming",
          "tipo": "chips",
          "q": {
            "es": "¿Necesitas que Borsoga también participe en el proceso de naming?",
            "en": "Do you need Borsoga to take part in the naming process too?"
          },
          "req": true,
          "si": [
            {
              "f": "projectType",
              "op": "eq",
              "v": "Crear una identidad visual desde cero"
            },
            {
              "f": "nameDefined",
              "op": "filled"
            },
            {
              "f": "nameDefined",
              "op": "ne",
              "v": "Sí"
            }
          ],
          "ops": [
            {
              "es": "Sí",
              "en": "Yes",
              "fija": true
            },
            {
              "es": "No",
              "en": "No"
            },
            {
              "es": "No estoy seguro",
              "en": "I'm not sure"
            }
          ],
          "resumen": {
            "es": "Naming",
            "en": "Naming"
          }
        },
        {
          "f": "identityAge",
          "tipo": "chips",
          "q": {
            "es": "¿Hace cuánto tiempo se creó la identidad actual?",
            "en": "How long ago was the current identity created?"
          },
          "req": true,
          "si": [
            {
              "f": "projectType",
              "op": "in",
              "v": [
                "Rediseñar completamente una identidad existente",
                "Actualizar/refrescar una identidad existente",
                "Ampliar un sistema de identidad que ya existe"
              ]
            }
          ],
          "ops": [
            {
              "es": "Menos de 1 año",
              "en": "Less than 1 year"
            },
            {
              "es": "1–3 años",
              "en": "1–3 years"
            },
            {
              "es": "3–5 años",
              "en": "3–5 years"
            },
            {
              "es": "Más de 5 años",
              "en": "More than 5 years"
            },
            {
              "es": "No lo sé",
              "en": "I don't know"
            }
          ],
          "resumen": {
            "es": "Identidad actual",
            "en": "Current identity"
          }
        },
        {
          "f": "changeReason",
          "tipo": "checks",
          "q": {
            "es": "¿Cuál es la principal razón para cambiarla?",
            "en": "What is the main reason for changing it?"
          },
          "req": true,
          "si": [
            {
              "f": "projectType",
              "op": "in",
              "v": [
                "Rediseñar completamente una identidad existente",
                "Actualizar/refrescar una identidad existente",
                "Ampliar un sistema de identidad que ya existe"
              ]
            }
          ],
          "ops": [
            {
              "es": "La empresa evolucionó",
              "en": "The company has evolved"
            },
            {
              "es": "Se siente anticuada",
              "en": "It feels dated"
            },
            {
              "es": "No representa correctamente nuestro posicionamiento",
              "en": "It doesn't represent our positioning properly"
            },
            {
              "es": "No funciona bien digitalmente",
              "en": "It doesn't work well digitally"
            },
            {
              "es": "No tiene suficiente consistencia",
              "en": "It isn't consistent enough"
            },
            {
              "es": "Queremos llegar a un nuevo público",
              "en": "We want to reach a new audience"
            },
            {
              "es": "Estamos entrando en nuevos mercados",
              "en": "We're entering new markets"
            },
            {
              "es": "Estamos cambiando de nombre",
              "en": "We're changing our name"
            },
            {
              "es": "Estamos lanzando nuevos productos/servicios",
              "en": "We're launching new products or services"
            },
            {
              "es": "Otro",
              "en": "Other"
            }
          ],
          "resumen": {
            "es": "Razón del cambio",
            "en": "Reason for the change"
          }
        },
        {
          "f": "keepWhat",
          "tipo": "area",
          "q": {
            "es": "¿Qué funciona bien en la identidad actual y te gustaría conservar?",
            "en": "What works well in the current identity and you would like to keep?"
          },
          "si": [
            {
              "f": "projectType",
              "op": "in",
              "v": [
                "Rediseñar completamente una identidad existente",
                "Actualizar/refrescar una identidad existente",
                "Ampliar un sistema de identidad que ya existe"
              ]
            }
          ]
        },
        {
          "f": "changeWhat",
          "tipo": "area",
          "q": {
            "es": "¿Qué definitivamente debería cambiar?",
            "en": "What should definitely change?"
          },
          "si": [
            {
              "f": "projectType",
              "op": "in",
              "v": [
                "Rediseñar completamente una identidad existente",
                "Actualizar/refrescar una identidad existente",
                "Ampliar un sistema de identidad que ya existe"
              ]
            }
          ]
        },
        {
          "f": "currentFiles",
          "tipo": "subida",
          "q": {
            "es": "Comparte la identidad actual.",
            "en": "Share the current identity."
          },
          "h": {
            "es": "Logo, manual de marca, sitio web, presentaciones u otros materiales.",
            "en": "Logo, brand manual, website, presentations or other materials."
          },
          "enlace": "currentLink",
          "si": [
            {
              "f": "projectType",
              "op": "in",
              "v": [
                "Rediseñar completamente una identidad existente",
                "Actualizar/refrescar una identidad existente",
                "Ampliar un sistema de identidad que ya existe"
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "p2",
      "titulo": {
        "es": "Sobre la marca",
        "en": "About the brand"
      },
      "preguntas": [
        {
          "f": "whatDoes",
          "tipo": "area",
          "q": {
            "es": "Describe brevemente qué hace la empresa.",
            "en": "Briefly describe what the company does."
          },
          "h": {
            "es": "Imagina que tienes que explicárselo a alguien que nunca ha oído hablar de ella.",
            "en": "Imagine you have to explain it to someone who has never heard of it."
          },
          "req": true,
          "resumen": {
            "es": "Qué hace",
            "en": "What it does"
          }
        },
        {
          "f": "products",
          "tipo": "area",
          "q": {
            "es": "¿Qué productos o servicios ofrece?",
            "en": "What products or services does it offer?"
          }
        },
        {
          "f": "mainProduct",
          "tipo": "texto",
          "q": {
            "es": "¿Cuál es actualmente su producto o servicio principal?",
            "en": "What is currently its main product or service?"
          }
        },
        {
          "f": "category",
          "tipo": "chips",
          "q": {
            "es": "¿En qué categoría se encuentra principalmente la empresa?",
            "en": "Which category is the company mainly in?"
          },
          "req": true,
          "ops": [
            {
              "es": "Servicios profesionales",
              "en": "Professional services"
            },
            {
              "es": "Tecnología",
              "en": "Technology"
            },
            {
              "es": "Salud",
              "en": "Health"
            },
            {
              "es": "Real Estate / Desarrollo inmobiliario",
              "en": "Real estate / Development"
            },
            {
              "es": "Arquitectura / Construcción",
              "en": "Architecture / Construction"
            },
            {
              "es": "Hospitality",
              "en": "Hospitality"
            },
            {
              "es": "Retail",
              "en": "Retail"
            },
            {
              "es": "Alimentos y bebidas",
              "en": "Food and beverage"
            },
            {
              "es": "Moda / Lifestyle",
              "en": "Fashion / Lifestyle"
            },
            {
              "es": "Producto de consumo",
              "en": "Consumer product"
            },
            {
              "es": "E-commerce",
              "en": "E-commerce"
            },
            {
              "es": "Marca personal",
              "en": "Personal brand"
            },
            {
              "es": "Nonprofit",
              "en": "Nonprofit"
            },
            {
              "es": "Otro",
              "en": "Other"
            }
          ],
          "resumen": {
            "es": "Categoría",
            "en": "Category"
          }
        },
        {
          "f": "stage",
          "tipo": "cards",
          "q": {
            "es": "¿En qué etapa se encuentra actualmente?",
            "en": "What stage is it in right now?"
          },
          "req": true,
          "ops": [
            {
              "es": "Próxima a lanzarse",
              "en": "About to launch"
            },
            {
              "es": "Recién lanzada",
              "en": "Just launched"
            },
            {
              "es": "En crecimiento",
              "en": "Growing"
            },
            {
              "es": "Empresa establecida",
              "en": "Established company"
            },
            {
              "es": "En expansión hacia nuevos mercados",
              "en": "Expanding into new markets"
            },
            {
              "es": "En proceso de transformación/rebranding",
              "en": "Going through a transformation or rebrand"
            }
          ],
          "resumen": {
            "es": "Etapa",
            "en": "Stage"
          }
        }
      ]
    },
    {
      "id": "p3",
      "titulo": {
        "es": "Posicionamiento",
        "en": "Positioning"
      },
      "preguntas": [
        {
          "f": "problem",
          "tipo": "area",
          "q": {
            "es": "¿Qué problema resuelve la empresa para sus clientes?",
            "en": "What problem does the company solve for its clients?"
          },
          "req": true
        },
        {
          "f": "diff",
          "tipo": "area",
          "q": {
            "es": "¿Cuál consideras que es su principal diferenciador?",
            "en": "What do you consider its main differentiator?"
          },
          "h": {
            "es": "Completa la idea: «A diferencia de otras empresas, nosotros…»",
            "en": "Complete the idea: \"Unlike other companies, we…\""
          },
          "req": true,
          "resumen": {
            "es": "Diferenciador",
            "en": "Differentiator"
          }
        },
        {
          "f": "vsComp",
          "tipo": "checks",
          "q": {
            "es": "Frente a tu competencia, ¿qué debería hacer diferente tu marca?",
            "en": "Compared to your competition, what should your brand do differently?"
          },
          "ops": [
            {
              "es": "Verse más premium",
              "en": "Look more premium"
            },
            {
              "es": "Verse más moderna",
              "en": "Look more modern"
            },
            {
              "es": "Verse más confiable",
              "en": "Look more trustworthy"
            },
            {
              "es": "Verse más accesible/cercana",
              "en": "Look more approachable"
            },
            {
              "es": "Verse más innovadora",
              "en": "Look more innovative"
            },
            {
              "es": "Verse más especializada",
              "en": "Look more specialized"
            },
            {
              "es": "Verse más sólida/corporativa",
              "en": "Look more solid and corporate"
            },
            {
              "es": "Diferenciarse completamente",
              "en": "Stand completely apart"
            },
            {
              "es": "Otro",
              "en": "Other"
            }
          ],
          "resumen": {
            "es": "Frente a la competencia",
            "en": "Against the competition"
          }
        }
      ]
    },
    {
      "id": "p4",
      "titulo": {
        "es": "Tu público",
        "en": "Your audience"
      },
      "preguntas": [
        {
          "f": "sellsTo",
          "tipo": "chips",
          "q": {
            "es": "¿A quién vende principalmente la empresa?",
            "en": "Who does the company mainly sell to?"
          },
          "req": true,
          "ops": [
            {
              "es": "Consumidores — B2C",
              "en": "Consumers — B2C"
            },
            {
              "es": "Empresas — B2B",
              "en": "Businesses — B2B",
              "fija": true
            },
            {
              "es": "Ambos",
              "en": "Both",
              "fija": true
            },
            {
              "es": "Otro",
              "en": "Other"
            }
          ],
          "resumen": {
            "es": "Vende a",
            "en": "Sells to"
          }
        },
        {
          "f": "idealCompanies",
          "tipo": "area",
          "q": {
            "es": "¿Qué tipo de empresas son tus clientes ideales?",
            "en": "What kind of companies are your ideal clients?"
          },
          "req": true,
          "si": [
            {
              "f": "sellsTo",
              "op": "in",
              "v": [
                "Empresas — B2B",
                "Ambos"
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "p5",
      "titulo": {
        "es": "Personalidad de marca",
        "en": "Brand personality"
      },
      "preguntas": [
        {
          "f": "personality",
          "tipo": "tope",
          "q": {
            "es": "Si tu marca fuera una persona, ¿cómo debería ser?",
            "en": "If your brand were a person, what should they be like?"
          },
          "h": {
            "es": "Selecciona máximo 5.",
            "en": "Pick a maximum of 5."
          },
          "req": true,
          "tope": 5,
          "ops": [
            {
              "es": "Elegante",
              "en": "Elegant"
            },
            {
              "es": "Moderna",
              "en": "Modern"
            },
            {
              "es": "Sofisticada",
              "en": "Sophisticated"
            },
            {
              "es": "Premium",
              "en": "Premium"
            },
            {
              "es": "Cercana",
              "en": "Approachable"
            },
            {
              "es": "Humana",
              "en": "Human"
            },
            {
              "es": "Profesional",
              "en": "Professional"
            },
            {
              "es": "Confiable",
              "en": "Trustworthy"
            },
            {
              "es": "Innovadora",
              "en": "Innovative"
            },
            {
              "es": "Audaz",
              "en": "Bold"
            },
            {
              "es": "Minimalista",
              "en": "Minimal"
            },
            {
              "es": "Técnica",
              "en": "Technical"
            },
            {
              "es": "Exclusiva",
              "en": "Exclusive"
            },
            {
              "es": "Artesanal",
              "en": "Crafted"
            },
            {
              "es": "Dinámica",
              "en": "Dynamic"
            },
            {
              "es": "Juvenil",
              "en": "Youthful"
            },
            {
              "es": "Atemporal",
              "en": "Timeless"
            },
            {
              "es": "Disruptiva",
              "en": "Disruptive"
            },
            {
              "es": "Seria",
              "en": "Serious"
            },
            {
              "es": "Cálida",
              "en": "Warm"
            }
          ],
          "resumen": {
            "es": "Personalidad",
            "en": "Personality"
          }
        },
        {
          "f": "axes",
          "tipo": "ejes",
          "q": {
            "es": "¿Dónde debería situarse la marca?",
            "en": "Where should the brand sit?"
          },
          "req": true,
          "ejes": [
            {
              "a": {
                "es": "Minimalista",
                "en": "Minimal"
              },
              "b": {
                "es": "Expresiva",
                "en": "Expressive"
              }
            },
            {
              "a": {
                "es": "Clásica",
                "en": "Classic"
              },
              "b": {
                "es": "Contemporánea",
                "en": "Contemporary"
              }
            },
            {
              "a": {
                "es": "Cercana",
                "en": "Approachable"
              },
              "b": {
                "es": "Exclusiva",
                "en": "Exclusive"
              }
            },
            {
              "a": {
                "es": "Seria",
                "en": "Serious"
              },
              "b": {
                "es": "Divertida",
                "en": "Playful"
              }
            },
            {
              "a": {
                "es": "Sutil",
                "en": "Subtle"
              },
              "b": {
                "es": "Audaz",
                "en": "Bold"
              }
            },
            {
              "a": {
                "es": "Racional",
                "en": "Rational"
              },
              "b": {
                "es": "Emocional",
                "en": "Emotional"
              }
            }
          ],
          "a11y": {
            "es": "{a} a {b}, posición {n} de 5",
            "en": "{a} to {b}, position {n} of 5"
          },
          "resumen": {
            "es": "Posición",
            "en": "Position"
          }
        }
      ]
    },
    {
      "id": "p6",
      "titulo": {
        "es": "Dirección visual",
        "en": "Visual direction"
      },
      "preguntas": [
        {
          "f": "meaning",
          "tipo": "chips",
          "q": {
            "es": "¿Existen elementos visuales que tengan un significado especial para la marca?",
            "en": "Are there visual elements that carry special meaning for the brand?"
          },
          "h": {
            "es": "Por ejemplo: historia, ubicación, arquitectura, símbolos, naturaleza, iniciales, objetos o conceptos asociados al negocio.",
            "en": "For example: history, location, architecture, symbols, nature, initials, objects or concepts tied to the business."
          },
          "req": true,
          "ops": [
            {
              "es": "Sí",
              "en": "Yes",
              "fija": true
            },
            {
              "es": "No",
              "en": "No"
            },
            {
              "es": "No estoy seguro",
              "en": "I'm not sure"
            }
          ]
        },
        {
          "f": "meaningWhich",
          "tipo": "area",
          "q": {
            "es": "Cuéntanos cuáles y por qué son importantes.",
            "en": "Tell us which ones and why they matter."
          },
          "req": true,
          "si": [
            {
              "f": "meaning",
              "op": "eq",
              "v": "Sí"
            }
          ],
          "resumen": {
            "es": "Elementos con significado",
            "en": "Meaningful elements"
          }
        },
        {
          "f": "avoidElements",
          "tipo": "area",
          "q": {
            "es": "¿Hay algún elemento, símbolo o concepto que definitivamente NO quieras utilizar?",
            "en": "Is there any element, symbol or concept you definitely do NOT want to use?"
          }
        },
        {
          "f": "brandColors",
          "tipo": "cards",
          "q": {
            "es": "¿Existen colores que actualmente sean importantes para la marca?",
            "en": "Are there colors that are currently important to the brand?"
          },
          "req": true,
          "ops": [
            {
              "es": "Sí, debemos conservarlos",
              "en": "Yes, we must keep them",
              "fija": true
            },
            {
              "es": "Sí, pero estamos abiertos a cambiarlos",
              "en": "Yes, but we're open to changing them",
              "fija": true
            },
            {
              "es": "No",
              "en": "No"
            },
            {
              "es": "No estoy seguro",
              "en": "I'm not sure"
            }
          ],
          "resumen": {
            "es": "Color",
            "en": "Color"
          },
          "junto": [
            "whichColors"
          ]
        },
        {
          "f": "whichColors",
          "tipo": "texto",
          "q": {
            "es": "¿Cuáles son y por qué son importantes?",
            "en": "Which ones are they and why do they matter?"
          },
          "req": true,
          "si": [
            {
              "f": "brandColors",
              "op": "in",
              "v": [
                "Sí, debemos conservarlos",
                "Sí, pero estamos abiertos a cambiarlos"
              ]
            }
          ]
        },
        {
          "f": "avoidColors",
          "tipo": "chips",
          "q": {
            "es": "¿Existen colores que prefieres evitar?",
            "en": "Are there colors you would rather avoid?"
          },
          "req": true,
          "ops": [
            {
              "es": "Sí",
              "en": "Yes",
              "fija": true
            },
            {
              "es": "No",
              "en": "No"
            }
          ]
        },
        {
          "f": "whichAvoidColors",
          "tipo": "texto",
          "q": {
            "es": "¿Cuáles y por qué?",
            "en": "Which ones and why?"
          },
          "req": true,
          "si": [
            {
              "f": "avoidColors",
              "op": "eq",
              "v": "Sí"
            }
          ]
        }
      ]
    },
    {
      "id": "p7",
      "titulo": {
        "es": "Referencias visuales",
        "en": "Visual references"
      },
      "preguntas": [
        {
          "f": "refBrands",
          "tipo": "area",
          "q": {
            "es": "Nombra 2 o 3 marcas de referencia que te gusten.",
            "en": "Name 2 or 3 reference brands you like."
          },
          "h": {
            "es": "No tienen que ser de tu industria. Nos sirven para entender el estilo que buscas para tu marca.",
            "en": "They don't have to be from your industry. They help us understand the style you're after for your brand."
          },
          "req": true,
          "resumen": {
            "es": "Marcas de referencia",
            "en": "Reference brands"
          }
        },
        {
          "f": "hasRefs",
          "tipo": "chips",
          "q": {
            "es": "¿Hay marcas cuya identidad visual te parezca especialmente buena?",
            "en": "Are there brands whose visual identity you find particularly good?"
          },
          "h": {
            "es": "No tienen que pertenecer a tu industria.",
            "en": "They don't have to be from your industry."
          },
          "req": true,
          "ops": [
            {
              "es": "Sí",
              "en": "Yes",
              "fija": true
            },
            {
              "es": "No",
              "en": "No"
            }
          ]
        },
        {
          "f": "refFiles",
          "tipo": "subida",
          "q": {
            "es": "Comparte entre 2 y 5 referencias.",
            "en": "Share between 2 and 5 references."
          },
          "h": {
            "es": "Puedes colocar nombres, enlaces o subir imágenes.",
            "en": "You can write names, paste links or upload images."
          },
          "req": true,
          "area": "refsText",
          "si": [
            {
              "f": "hasRefs",
              "op": "eq",
              "v": "Sí"
            }
          ],
          "resumen": {
            "es": "Referencias",
            "en": "References"
          }
        },
        {
          "f": "refsWhy",
          "tipo": "area",
          "q": {
            "es": "¿Qué te gusta específicamente de esas referencias?",
            "en": "What specifically do you like about those references?"
          },
          "h": {
            "es": "Evita simplemente decir «me gusta el logo». Piensa en aspectos como: simplicidad, tipografía, color, composición, fotografía, sensación premium, personalidad, consistencia.",
            "en": "Avoid simply saying \"I like the logo\". Think about things like: simplicity, typography, color, composition, photography, a premium feel, personality, consistency."
          },
          "si": [
            {
              "f": "hasRefs",
              "op": "eq",
              "v": "Sí"
            }
          ]
        }
      ]
    },
    {
      "id": "p8",
      "titulo": {
        "es": "Dónde vivirá la marca",
        "en": "Where the brand will live"
      },
      "preguntas": [
        {
          "f": "touchpoints",
          "tipo": "checks",
          "q": {
            "es": "¿Dónde se utilizará principalmente la identidad?",
            "en": "Where will the identity mainly be used?"
          },
          "req": true,
          "ops": [
            {
              "es": "Sitio web",
              "en": "Website",
              "fija": true
            },
            {
              "es": "Redes sociales",
              "en": "Social media"
            },
            {
              "es": "Aplicaciones / plataformas digitales",
              "en": "Apps / digital platforms"
            },
            {
              "es": "Presentaciones",
              "en": "Presentations"
            },
            {
              "es": "Papelería",
              "en": "Stationery"
            },
            {
              "es": "Señalización",
              "en": "Signage",
              "fija": true
            },
            {
              "es": "Local comercial / oficinas",
              "en": "Store / offices",
              "fija": true
            },
            {
              "es": "Uniformes",
              "en": "Uniforms"
            },
            {
              "es": "Vehículos",
              "en": "Vehicles"
            },
            {
              "es": "Packaging",
              "en": "Packaging",
              "fija": true
            },
            {
              "es": "Productos físicos",
              "en": "Physical products"
            },
            {
              "es": "Material publicitario",
              "en": "Advertising material"
            },
            {
              "es": "Impresos",
              "en": "Print"
            },
            {
              "es": "Merchandising",
              "en": "Merchandising"
            },
            {
              "es": "Otro",
              "en": "Other"
            }
          ],
          "resumen": {
            "es": "Puntos de contacto",
            "en": "Touchpoints"
          }
        },
        {
          "f": "packagingType",
          "tipo": "area",
          "q": {
            "es": "¿Qué tipo de packaging utiliza o utilizará la marca?",
            "en": "What kind of packaging does the brand use, or will it use?"
          },
          "si": [
            {
              "f": "touchpoints",
              "op": "has",
              "v": [
                "Packaging"
              ]
            }
          ]
        },
        {
          "f": "packagingScope",
          "tipo": "chips",
          "q": {
            "es": "¿El diseño de packaging forma parte de este proyecto?",
            "en": "Is packaging design part of this project?"
          },
          "req": true,
          "si": [
            {
              "f": "touchpoints",
              "op": "has",
              "v": [
                "Packaging"
              ]
            }
          ],
          "ops": [
            {
              "es": "Sí",
              "en": "Yes",
              "fija": true
            },
            {
              "es": "No",
              "en": "No"
            },
            {
              "es": "Todavía no está definido",
              "en": "Not defined yet"
            }
          ]
        },
        {
          "f": "spaces",
          "tipo": "chips",
          "q": {
            "es": "¿La identidad deberá aplicarse físicamente a uno o varios espacios?",
            "en": "Will the identity need to be applied physically to one space or several?"
          },
          "req": true,
          "si": [
            {
              "f": "touchpoints",
              "op": "has",
              "v": [
                "Local comercial / oficinas",
                "Señalización"
              ]
            }
          ],
          "ops": [
            {
              "es": "Uno",
              "en": "One"
            },
            {
              "es": "Varios",
              "en": "Several"
            },
            {
              "es": "Todavía no está definido",
              "en": "Not defined yet"
            }
          ]
        },
        {
          "f": "spaceFiles",
          "tipo": "subida",
          "q": {
            "es": "Si ya existen, comparte fotografías, renders o planos.",
            "en": "If they already exist, share photographs, renders or plans."
          },
          "si": [
            {
              "f": "touchpoints",
              "op": "has",
              "v": [
                "Local comercial / oficinas",
                "Señalización"
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "p9",
      "titulo": {
        "es": "Necesidades especiales",
        "en": "Special needs"
      },
      "preguntas": [
        {
          "f": "languages",
          "tipo": "chipchecks",
          "q": {
            "es": "¿En qué idiomas deberá funcionar la identidad?",
            "en": "Which languages does the identity need to work in?"
          },
          "req": true,
          "ops": [
            {
              "es": "Inglés",
              "en": "English"
            },
            {
              "es": "Español",
              "en": "Spanish"
            },
            {
              "es": "Inglés + Español",
              "en": "English + Spanish"
            },
            {
              "es": "Otro",
              "en": "Other"
            }
          ],
          "resumen": {
            "es": "Idiomas",
            "en": "Languages"
          }
        },
        {
          "f": "restrictions",
          "tipo": "area",
          "q": {
            "es": "¿Existe alguna restricción que debamos conocer?",
            "en": "Is there any restriction we should know about?"
          },
          "h": {
            "es": "Por ejemplo: requisitos legales, trademarks, nombre que debe escribirse de una manera específica, colores corporativos obligatorios, relación con una empresa matriz, elementos que deben mantenerse.",
            "en": "For example: legal requirements, trademarks, a name that must be written a specific way, mandatory corporate colors, a relationship with a parent company, elements that must be kept."
          }
        }
      ]
    },
    {
      "id": "p10",
      "titulo": {
        "es": "Para terminar",
        "en": "To finish"
      },
      "preguntas": [
        {
          "f": "anythingElse",
          "tipo": "area",
          "q": {
            "es": "¿Hay algo importante sobre tu empresa, tu historia o este proyecto que no te hayamos preguntado?",
            "en": "Is there anything important about your company, your history or this project that we haven't asked you?"
          }
        },
        {
          "f": "contacto",
          "tipo": "contacto",
          "q": {
            "es": "Tus datos",
            "en": "Your details"
          },
          "req": true,
          "campos": {
            "nombre": {
              "es": "Nombre",
              "en": "Name"
            },
            "correo": {
              "es": "Correo",
              "en": "Email"
            },
            "telefono": {
              "es": "Teléfono",
              "en": "Phone"
            }
          }
        }
      ]
    }
  ]
} as Esquema,
  interior: {
  "formato": 2,
  "servicio": "interior",
  "clave": "borsoga.cuestionario.interior.v4",
  "listas": {
    "projectType": {
      "nombre": "¿Para qué es el proyecto?",
      "ops": [
        {
          "es": "Para vivir yo",
          "en": "To live in myself",
          "rol": "vivir"
        },
        {
          "es": "Para vender o rentar",
          "en": "To sell or rent",
          "rol": "invertir"
        },
        {
          "es": "Es un espacio comercial",
          "en": "It's a commercial space",
          "rol": "comercial"
        }
      ]
    },
    "dealType": {
      "nombre": "¿Vender o rentar?",
      "ops": [
        {
          "es": "Para vender",
          "en": "To sell"
        },
        {
          "es": "Para rentar",
          "en": "To rent"
        }
      ]
    },
    "ownership": {
      "nombre": "¿Ya es tuya?",
      "ops": [
        {
          "es": "Sí, ya es mía",
          "en": "Yes, it's mine"
        },
        {
          "es": "Estoy en proceso de compra",
          "en": "I'm in the process of buying",
          "rol": "en_compra"
        }
      ]
    },
    "commercialType": {
      "nombre": "Tipo de espacio comercial",
      "ops": [
        {
          "es": "Oficina",
          "en": "Office"
        },
        {
          "es": "Retail",
          "en": "Retail"
        },
        {
          "es": "Showroom",
          "en": "Showroom"
        },
        {
          "es": "Restaurante o bar",
          "en": "Restaurant or bar",
          "rol": "salud"
        },
        {
          "es": "Hospitalidad",
          "en": "Hospitality"
        },
        {
          "es": "Amenidades de edificio",
          "en": "Building amenities"
        },
        {
          "es": "Modelo de ventas",
          "en": "Sales gallery"
        },
        {
          "es": "Otro",
          "en": "Other",
          "rol": "otro"
        }
      ]
    },
    "occupancy": {
      "nombre": "¿Vacío o en operación?",
      "ops": [
        {
          "es": "Vacío o en obra",
          "en": "Empty or under construction"
        },
        {
          "es": "En operación",
          "en": "Operating"
        },
        {
          "es": "Todavía no lo tengo",
          "en": "I don't have it yet",
          "rol": "sin_local"
        }
      ]
    },
    "propertyType": {
      "nombre": "Tipo de propiedad",
      "ops": [
        {
          "es": "Condominio",
          "en": "Condo",
          "rol": "condo"
        },
        {
          "es": "Casa",
          "en": "House",
          "rol": "casa"
        },
        {
          "es": "Penthouse",
          "en": "Penthouse",
          "rol": "condo"
        }
      ]
    },
    "workType": {
      "nombre": "¿Obra nueva o remodelación?",
      "ops": [
        {
          "es": "Obra nueva",
          "en": "New construction",
          "rol": "nueva"
        },
        {
          "es": "Remodelación",
          "en": "Remodel",
          "rol": "remodelacion"
        }
      ]
    },
    "stage": {
      "nombre": "Etapa de la obra",
      "ops": [
        {
          "es": "Todavía en planos",
          "en": "Still in drawings"
        },
        {
          "es": "En construcción",
          "en": "Under construction"
        },
        {
          "es": "Terminada sin entregar",
          "en": "Finished, not handed over"
        }
      ]
    },
    "year": {
      "nombre": "Año de la propiedad",
      "ops": [
        {
          "es": "Antes de 1990",
          "en": "Before 1990"
        },
        {
          "es": "1990 a 2010",
          "en": "1990 to 2010"
        },
        {
          "es": "Después de 2010",
          "en": "After 2010"
        },
        {
          "es": "No sé",
          "en": "I don't know",
          "duda": true
        }
      ]
    },
    "structure": {
      "nombre": "Paredes y fachada",
      "ops": [
        {
          "es": "Se mueven o se quitan paredes",
          "en": "Walls being moved or removed",
          "rol": "estructural"
        },
        {
          "es": "Cambios en la fachada del edificio o la casa",
          "en": "Changes to the facade",
          "rol": "estructural"
        },
        {
          "es": "Ninguno de los dos",
          "en": "Neither of those",
          "rol": "exclusiva"
        },
        {
          "es": "No lo sé todavía",
          "en": "I don't know yet",
          "duda": true,
          "rol": "exclusiva"
        }
      ]
    },
    "espacios": {
      "nombre": "Espacios",
      "ops": [
        {
          "es": "Cocina",
          "en": "Kitchen",
          "grupo": "residencial",
          "marcas": {
            "humedo": true,
            "cocina": true
          },
          "plural": {
            "es": "cocinas",
            "en": "kitchens"
          }
        },
        {
          "es": "Baño",
          "en": "Bathroom",
          "grupo": "residencial",
          "marcas": {
            "humedo": true
          },
          "plural": {
            "es": "baños",
            "en": "bathrooms"
          }
        },
        {
          "es": "Dormitorio",
          "en": "Bedroom",
          "grupo": "residencial",
          "plural": {
            "es": "dormitorios",
            "en": "bedrooms"
          }
        },
        {
          "es": "Sala",
          "en": "Living room",
          "grupo": "residencial",
          "plural": {
            "es": "salas",
            "en": "living rooms"
          }
        },
        {
          "es": "Comedor",
          "en": "Dining room",
          "grupo": "residencial",
          "plural": {
            "es": "comedores",
            "en": "dining rooms"
          }
        },
        {
          "es": "Home office",
          "en": "Home office",
          "grupo": "residencial",
          "plural": {
            "es": "home offices",
            "en": "home offices"
          }
        },
        {
          "es": "Clóset",
          "en": "Closet",
          "grupo": "residencial",
          "plural": {
            "es": "clósets",
            "en": "closets"
          }
        },
        {
          "es": "Lavandería",
          "en": "Laundry",
          "grupo": "residencial",
          "marcas": {
            "humedo": true,
            "cocina": true,
            "lavanderia": true
          },
          "plural": {
            "es": "lavanderías",
            "en": "laundries"
          }
        },
        {
          "es": "Entrada",
          "en": "Entry",
          "grupo": "residencial",
          "plural": {
            "es": "entradas",
            "en": "entries"
          }
        },
        {
          "es": "Patio o jardín",
          "en": "Patio or yard",
          "grupo": "casa",
          "marcas": {
            "exterior": true
          },
          "plural": {
            "es": "patios o jardines",
            "en": "patios"
          }
        },
        {
          "es": "Garaje",
          "en": "Garage",
          "grupo": "casa",
          "plural": {
            "es": "garajes",
            "en": "garages"
          }
        },
        {
          "es": "Área de piscina",
          "en": "Pool area",
          "grupo": "casa",
          "marcas": {
            "piscina": true
          },
          "plural": {
            "es": "áreas de piscina",
            "en": "pool areas"
          }
        },
        {
          "es": "Balcón o terraza",
          "en": "Balcony or terrace",
          "grupo": "condo",
          "marcas": {
            "exterior": true
          },
          "plural": {
            "es": "balcones o terrazas",
            "en": "balconies"
          }
        },
        {
          "es": "Recepción o lobby",
          "en": "Reception or lobby",
          "grupo": "comercial",
          "plural": {
            "es": "recepciones o lobbies",
            "en": "lobbies"
          }
        },
        {
          "es": "Área de trabajo",
          "en": "Work area",
          "grupo": "comercial",
          "plural": {
            "es": "áreas de trabajo",
            "en": "work areas"
          }
        },
        {
          "es": "Sala de juntas",
          "en": "Meeting room",
          "grupo": "comercial",
          "plural": {
            "es": "salas de juntas",
            "en": "meeting rooms"
          }
        },
        {
          "es": "Área de clientes",
          "en": "Customer area",
          "grupo": "comercial",
          "plural": {
            "es": "áreas de clientes",
            "en": "customer areas"
          }
        },
        {
          "es": "Comedor o cocina de staff",
          "en": "Staff kitchen or dining",
          "grupo": "comercial",
          "marcas": {
            "humedo": true,
            "cocina": true
          },
          "plural": {
            "es": "comedores o cocinas de staff",
            "en": "staff kitchens"
          }
        },
        {
          "es": "Baños",
          "en": "Restrooms",
          "grupo": "comercial",
          "marcas": {
            "humedo": true
          },
          "plural": {
            "es": "baños",
            "en": "bathrooms"
          }
        },
        {
          "es": "Salón o comedor",
          "en": "Dining room",
          "grupo": "comercial",
          "plural": {
            "es": "salones o comedores",
            "en": "dining rooms"
          }
        },
        {
          "es": "Barra",
          "en": "Bar",
          "grupo": "comercial",
          "marcas": {
            "humedo": true,
            "barra": true
          },
          "plural": {
            "es": "barras",
            "en": "bars"
          }
        },
        {
          "es": "Vitrina y fachada interior",
          "en": "Window and interior facade",
          "grupo": "comercial",
          "plural": {
            "es": "vitrinas y fachadas interiores",
            "en": "windows"
          }
        }
      ]
    },
    "millwork": {
      "nombre": "Muebles a la medida: opciones además de los espacios",
      "ops": [
        {
          "es": "En ninguno, compramos todo hecho",
          "en": "None, we're buying everything ready-made",
          "rol": "exclusiva"
        },
        {
          "es": "Todavía no lo sé",
          "en": "I don't know yet",
          "duda": true,
          "rol": "exclusiva"
        }
      ]
    },
    "keepFurniture": {
      "nombre": "¿Conserva muebles?",
      "ops": [
        {
          "es": "Sí, en algunos espacios",
          "en": "Yes, in some spaces",
          "rol": "elige_espacios"
        },
        {
          "es": "No, empezamos de cero",
          "en": "No, we're starting fresh"
        },
        {
          "es": "Todavía no lo sé",
          "en": "I don't know yet",
          "duda": true
        }
      ]
    },
    "pieces": {
      "nombre": "¿Piezas decididas?",
      "ops": [
        {
          "es": "Sí, tengo piezas decididas",
          "en": "Yes, I have pieces decided",
          "rol": "enlace"
        },
        {
          "es": "Tengo referencias, pero nada decidido",
          "en": "I have references, but nothing decided",
          "rol": "enlace"
        },
        {
          "es": "No, todavía no",
          "en": "Not yet"
        },
        {
          "es": "Quiero que ustedes las propongan",
          "en": "I'd like you to propose them"
        }
      ]
    },
    "tamano": {
      "nombre": "Tamaño del proyecto",
      "ops": [
        {
          "es": "Compacto",
          "en": "Compact",
          "desc": {
            "es": "Espacios chicos, sin grandes cambios de distribución",
            "en": "Small spaces, no major layout changes"
          },
          "n": 3
        },
        {
          "es": "Estándar",
          "en": "Standard",
          "desc": {
            "es": "El tamaño típico de un apartamento o una casa",
            "en": "The typical size of an apartment or a house"
          },
          "n": 5
        },
        {
          "es": "Amplio",
          "en": "Spacious",
          "desc": {
            "es": "Espacios grandes, áreas abiertas o dobles alturas",
            "en": "Large spaces, open areas or double heights"
          },
          "n": 8
        }
      ]
    },
    "budget": {
      "nombre": "Presupuesto",
      "ops": [
        {
          "es": "Menos de $25,000",
          "en": "Under $25,000"
        },
        {
          "es": "$25,000 a $75,000",
          "en": "$25,000 to $75,000"
        },
        {
          "es": "$75,000 a $150,000",
          "en": "$75,000 to $150,000"
        },
        {
          "es": "$150,000 a $400,000",
          "en": "$150,000 to $400,000"
        },
        {
          "es": "Más de $400,000",
          "en": "Over $400,000"
        },
        {
          "es": "Todavía no lo tengo definido",
          "en": "I haven't decided yet"
        }
      ]
    },
    "plumbing": {
      "nombre": "¿Se mueve el agua o el desagüe?",
      "ops": [
        {
          "es": "Sí",
          "en": "Yes"
        },
        {
          "es": "No",
          "en": "No"
        },
        {
          "es": "No sé",
          "en": "I don't know",
          "duda": true
        }
      ]
    },
    "appliances": {
      "nombre": "¿Electrodomésticos elegidos?",
      "ops": [
        {
          "es": "Sí, ya sé cuáles van",
          "en": "Yes, I know which ones",
          "rol": "decidido"
        },
        {
          "es": "Todavía no",
          "en": "Not yet"
        },
        {
          "es": "Quiero que ustedes me ayuden a elegirlos",
          "en": "I'd like you to help me choose",
          "rol": "ayuda"
        }
      ]
    },
    "laundry": {
      "nombre": "¿Lavadora y secadora elegidas?",
      "ops": [
        {
          "es": "Sí, ya sé cuáles van",
          "en": "Yes, I know which ones",
          "rol": "decidido"
        },
        {
          "es": "Todavía no",
          "en": "Not yet"
        },
        {
          "es": "Quiero que ustedes me ayuden a elegirlos",
          "en": "I'd like you to help me choose",
          "rol": "ayuda"
        }
      ]
    },
    "laundryLayout": {
      "nombre": "Cómo van la lavadora y la secadora",
      "ops": [
        {
          "es": "Apiladas",
          "en": "Stacked"
        },
        {
          "es": "Lado a lado",
          "en": "Side by side"
        },
        {
          "es": "No lo sé",
          "en": "I don't know",
          "duda": true
        }
      ]
    },
    "barEquip": {
      "nombre": "¿Equipo de barra elegido?",
      "ops": [
        {
          "es": "Sí, ya sé cuáles van",
          "en": "Yes, I know which ones",
          "rol": "decidido"
        },
        {
          "es": "Todavía no",
          "en": "Not yet"
        },
        {
          "es": "Quiero que ustedes me ayuden a elegirlos",
          "en": "I'd like you to help me choose",
          "rol": "ayuda"
        }
      ]
    },
    "pool": {
      "nombre": "¿Incluye la piscina?",
      "ops": [
        {
          "es": "Sí",
          "en": "Yes"
        },
        {
          "es": "No",
          "en": "No"
        },
        {
          "es": "No hay piscina",
          "en": "There's no pool"
        }
      ]
    },
    "hoa": {
      "nombre": "¿HOA o asociación?",
      "ops": [
        {
          "es": "Sí",
          "en": "Yes"
        },
        {
          "es": "No",
          "en": "No"
        },
        {
          "es": "No sé",
          "en": "I don't know",
          "duda": true
        }
      ]
    },
    "health": {
      "nombre": "¿Departamento de salud?",
      "ops": [
        {
          "es": "Sí",
          "en": "Yes"
        },
        {
          "es": "No",
          "en": "No"
        },
        {
          "es": "No sé",
          "en": "I don't know",
          "duda": true
        }
      ]
    },
    "finish": {
      "nombre": "Nivel de acabado",
      "ops": [
        {
          "es": "Estándar",
          "en": "Standard",
          "etiqueta": {
            "es": "Nivel 01",
            "en": "Level 01"
          }
        },
        {
          "es": "Alta gama",
          "en": "High-end",
          "etiqueta": {
            "es": "Nivel 02",
            "en": "Level 02"
          }
        },
        {
          "es": "Lujo",
          "en": "Luxury",
          "etiqueta": {
            "es": "Nivel 03",
            "en": "Level 03"
          }
        }
      ]
    },
    "clarity": {
      "nombre": "¿Qué tan claro lo tiene?",
      "ops": [
        {
          "es": "Ya tengo referencias y decisiones tomadas",
          "en": "I have references and decisions made"
        },
        {
          "es": "Tengo una idea general",
          "en": "I have a general idea"
        },
        {
          "es": "Cuento con ustedes para definirlo",
          "en": "I'm counting on you to define it"
        }
      ]
    },
    "extras": {
      "nombre": "Extras",
      "ops": [
        {
          "es": "Borsoga Immersive",
          "en": "Borsoga Immersive",
          "desc": {
            "es": "Caminas tu espacio con lentes de realidad virtual. Vamos a donde estés.",
            "en": "Walk your space before it exists. We come to you with the headset."
          }
        },
        {
          "es": "Tour 360",
          "en": "Tour 360",
          "desc": {
            "es": "Un recorrido navegable de tu proyecto. Se abre en cualquier navegador.",
            "en": "Your project, walkable from any screen. Opens in any browser."
          }
        },
        {
          "es": "Imágenes adicionales",
          "en": "Additional images",
          "desc": {
            "es": "Más vistas de tu proyecto, además de las que ya trae tu plan.",
            "en": "More views than the ones your project includes."
          }
        }
      ]
    },
    "showcase": {
      "nombre": "Algo más al terminar",
      "ops": [
        {
          "es": "Imágenes para el listing",
          "en": "Images for the listing",
          "grupo": "invertir"
        },
        {
          "es": "Tour 360 para tus compradores",
          "en": "A 360 tour for your buyers",
          "grupo": "invertir"
        },
        {
          "es": "Brochure o material impreso",
          "en": "A brochure or printed material",
          "grupo": "invertir"
        },
        {
          "es": "Una página del proyecto",
          "en": "A page for the project",
          "grupo": "invertir"
        },
        {
          "es": "Imágenes para redes y publicidad",
          "en": "Images for social and advertising",
          "grupo": "comercial"
        },
        {
          "es": "Tour 360 del local",
          "en": "A 360 tour of the space",
          "grupo": "comercial"
        },
        {
          "es": "Identidad o rótulos del negocio",
          "en": "Branding or signage for the business",
          "grupo": "comercial"
        },
        {
          "es": "Una página del negocio",
          "en": "A page for the business",
          "grupo": "comercial"
        },
        {
          "es": "Fotos profesionales del terminado",
          "en": "Professional photos when it's done",
          "grupo": "vivir"
        },
        {
          "es": "Video del proyecto",
          "en": "A video of the project",
          "grupo": "vivir"
        },
        {
          "es": "No, por ahora no",
          "en": "Not for now",
          "rol": "ninguno"
        }
      ]
    },
    "signer": {
      "nombre": "¿Firma personal o empresa?",
      "ops": [
        {
          "es": "A título personal",
          "en": "Personally",
          "rol": "personal"
        },
        {
          "es": "Como empresa",
          "en": "As a company",
          "rol": "empresa"
        }
      ]
    },
    "isOwner": {
      "nombre": "¿Es el dueño?",
      "ops": [
        {
          "es": "Sí",
          "en": "Yes"
        },
        {
          "es": "No, soy el representante autorizado",
          "en": "No, I'm the authorized representative",
          "rol": "representante"
        }
      ]
    },
    "decider": {
      "nombre": "¿Quién decide?",
      "ops": [
        {
          "es": "Yo solo",
          "en": "Just me"
        },
        {
          "es": "Mi pareja y yo",
          "en": "My partner and I"
        },
        {
          "es": "Un grupo o un comité",
          "en": "A group or a committee"
        }
      ]
    },
    "timing": {
      "nombre": "¿Cuándo empezar?",
      "ops": [
        {
          "es": "Lo antes posible",
          "en": "As soon as possible"
        },
        {
          "es": "En 1 a 3 meses",
          "en": "In 1 to 3 months"
        },
        {
          "es": "Estoy explorando",
          "en": "I'm just exploring",
          "rol": "explorando"
        }
      ]
    },
    "deadline": {
      "nombre": "¿Fecha límite?",
      "ops": [
        {
          "es": "No, sin fecha fija",
          "en": "No fixed date"
        },
        {
          "es": "Sí, pero es flexible",
          "en": "Yes, but it's flexible"
        },
        {
          "es": "Sí, y es fija",
          "en": "Yes, and it's fixed",
          "rol": "fija"
        }
      ]
    },
    "pro": {
      "nombre": "¿Contratista o arquitecto?",
      "ops": [
        {
          "es": "Sí",
          "en": "Yes"
        },
        {
          "es": "No",
          "en": "No"
        },
        {
          "es": "Me gustaría que me recomienden uno",
          "en": "I'd like you to recommend one",
          "rol": "recomendar"
        },
        {
          "es": "No lo he decidido",
          "en": "I haven't decided"
        }
      ]
    },
    "portfolio": {
      "nombre": "¿Publicar el proyecto?",
      "ops": [
        {
          "es": "Sí, sin problema",
          "en": "Yes, no problem"
        },
        {
          "es": "Sí, pero sin decir dónde está",
          "en": "Yes, but don't say where it is"
        },
        {
          "es": "Prefiero que no",
          "en": "I'd rather not"
        }
      ]
    }
  },
  "reglas": {
    "planDefecto": "Essential",
    "plan": [
      {
        "plan": "Borsoga Edition",
        "si": [
          {
            "s": "fuera_zona"
          }
        ]
      },
      {
        "plan": "Borsoga Edition",
        "si": [
          {
            "s": "campo",
            "f": "finish",
            "op": "es",
            "v": "Lujo"
          }
        ]
      },
      {
        "plan": "Borsoga Edition",
        "si": [
          {
            "s": "es_casa"
          },
          {
            "s": "espacios",
            "op": ">",
            "v": 4
          }
        ]
      },
      {
        "plan": "Borsoga Edition",
        "si": [
          {
            "s": "extras",
            "op": ">=",
            "v": 2
          }
        ]
      },
      {
        "plan": "Premium",
        "si": [
          {
            "s": "necesita_planos"
          }
        ]
      },
      {
        "plan": "Premium",
        "si": [
          {
            "s": "obra_nueva"
          }
        ]
      },
      {
        "plan": "Premium",
        "si": [
          {
            "s": "estructural"
          }
        ]
      },
      {
        "plan": "Premium",
        "si": [
          {
            "s": "campo",
            "f": "plumbing",
            "op": "es",
            "v": "Sí"
          }
        ]
      }
    ],
    "ruta": [
      {
        "tipo": "call",
        "si": [
          {
            "s": "plan_elegido",
            "op": "es",
            "v": "Borsoga Edition"
          }
        ],
        "texto": {
          "es": "Borsoga Edition se cotiza en una llamada. Tenemos todo lo que nos contaste, así que la conversación empieza donde la dejaste.",
          "en": "Borsoga Edition is quoted on a call. We have everything you told us, so the conversation starts where you left it."
        }
      },
      {
        "tipo": "call",
        "si": [
          {
            "s": "fuera_florida"
          }
        ],
        "texto": {
          "es": "La dirección del proyecto está fuera de Florida. Eso lo revisamos contigo antes de hablar de precio.",
          "en": "The project address is outside Florida. We go over that with you before talking price."
        }
      },
      {
        "tipo": "call",
        "si": [
          {
            "s": "fuera_zona"
          }
        ],
        "texto": {
          "es": "Tu proyecto está fuera de Miami-Dade. Podemos hacerlo, pero el alcance y el desplazamiento los cerramos hablando.",
          "en": "Your project is outside Miami-Dade. We can do it, but we settle the scope and the travel by talking."
        }
      },
      {
        "tipo": "call",
        "si": [
          {
            "s": "estructural"
          }
        ],
        "texto": {
          "es": "Tu proyecto mueve paredes o toca la fachada. Eso necesita un arquitecto o ingeniero con licencia, así que lo armamos contigo antes de dar un número.",
          "en": "Your project moves walls or touches the façade. That needs a licensed architect or engineer, so we work it out with you before giving a number."
        }
      },
      {
        "tipo": "call",
        "si": [
          {
            "s": "unidades",
            "op": ">",
            "v": 6
          }
        ],
        "texto": {
          "es": "Tu proyecto tiene {unidades} espacios. A ese tamaño el precio lo armamos contigo, no con una calculadora.",
          "en": "Your project has {unidades} spaces. At that size we build the price with you, not with a calculator."
        }
      },
      {
        "tipo": "call",
        "si": [
          {
            "s": "campo",
            "f": "finish",
            "op": "es",
            "v": "Lujo"
          },
          {
            "s": "obra_nueva"
          }
        ],
        "texto": {
          "es": "Nivel lujo en obra nueva. Eso lo conversamos antes de darte un número.",
          "en": "Luxury level in new construction. We talk that through before giving you a number."
        }
      },
      {
        "tipo": "call",
        "si": [
          {
            "s": "campo",
            "f": "health",
            "op": "es",
            "v": "Sí"
          }
        ],
        "texto": {
          "es": "Un proyecto que pasa por el departamento de salud tiene su propio calendario. Lo armamos contigo antes de hablar de precio.",
          "en": "A project that goes through the health department has its own timeline. We work it out with you before talking price."
        }
      },
      {
        "tipo": "range",
        "si": [
          {
            "s": "sin_definir",
            "op": ">=",
            "v": 4
          }
        ],
        "texto": {
          "es": "Quedaron varias cosas por definir, así que en vez de un número te mandamos un rango y lo cerramos contigo en una llamada.",
          "en": "Several things are still undefined, so instead of a number we'll send you a range and close it with you on a call."
        }
      }
    ],
    "rutaDefecto": {
      "tipo": "mail",
      "texto": {
        "es": "Vamos a revisar lo que nos contaste y te escribimos para hablar del precio y el plazo. Nada de esto es automático: lo mira una persona del estudio.",
        "en": "We'll go over what you told us and write to you about price and timeline. None of this is automatic: a person at the studio looks at it."
      }
    },
    "titulos": {
      "call": {
        "es": "Vamos a hablar",
        "en": "Let's talk"
      },
      "range": {
        "es": "Te enviamos un rango",
        "en": "We'll send you a range"
      },
      "mail": {
        "es": "Recibimos tu proyecto",
        "en": "We got your project"
      }
    },
    "avisos": [
      {
        "si": [
          {
            "s": "campo",
            "f": "finish",
            "op": "es",
            "v": "Lujo"
          },
          {
            "s": "espacios",
            "op": "<=",
            "v": 2
          }
        ],
        "texto": {
          "es": "Elegiste nivel lujo. A ese nivel de acabado tu contratista va a pedir planos y guía de materiales, y eso entra a partir de Premium.",
          "en": "You chose the luxury level. At that finish level your contractor will ask for drawings and a materials guide, and that starts at Premium."
        }
      },
      {
        "si": [
          {
            "s": "espacios",
            "op": ">",
            "v": 4
          }
        ],
        "texto": {
          "es": "Tu proyecto tiene {espacios} espacios. Borsoga Edition está pensado para proyectos de este tamaño.",
          "en": "Your project has {espacios} spaces. Borsoga Edition is made for projects this size."
        }
      }
    ]
  },
  "ajustes": {
    "ciudades": [
      "miami",
      "miami beach",
      "miami gardens",
      "miami lakes",
      "miami shores",
      "miami springs",
      "north miami",
      "north miami beach",
      "south miami",
      "west miami",
      "coral gables",
      "hialeah",
      "hialeah gardens",
      "doral",
      "aventura",
      "key biscayne",
      "homestead",
      "florida city",
      "kendall",
      "pinecrest",
      "palmetto bay",
      "cutler bay",
      "sunny isles beach",
      "bal harbour",
      "bay harbor islands",
      "surfside",
      "coconut grove",
      "brickell",
      "opa-locka",
      "opa locka",
      "sweetwater",
      "virginia gardens",
      "medley",
      "golden beach",
      "indian creek",
      "el portal",
      "biscayne park",
      "north bay village"
    ]
  },
  "textos": {
    "q_plan_none": {
      "es": "Sin plan todavía",
      "en": "No plan yet",
      "grupo": "cabecera",
      "o": 0
    },
    "step_counter": {
      "es": "Paso {n} de 6",
      "en": "Step {n} of 6",
      "grupo": "cabecera",
      "o": 1
    },
    "q_plan_sug": {
      "es": "Sugerido",
      "en": "Suggested",
      "grupo": "p1",
      "o": 2
    },
    "q_missing": {
      "es": "Falta responder esto",
      "en": "This one still needs an answer",
      "grupo": "p1",
      "o": 3
    },
    "q_missing_many": {
      "es": "Faltan {n} respuestas",
      "en": "{n} answers to go",
      "grupo": "p1",
      "o": 4
    },
    "qi_imgs_per_space": {
      "es": "{n} imágenes por espacio",
      "en": "{n} images per space",
      "grupo": "p2",
      "o": 5
    },
    "qi_sqft_q": {
      "es": "¿Sabes cuántos pies cuadrados tiene?",
      "en": "Do you know the square footage?",
      "grupo": "p2",
      "o": 6
    },
    "qi_optional": {
      "es": "Opcional",
      "en": "Optional",
      "grupo": "p2",
      "o": 7
    },
    "qi_images_total": {
      "es": "imágenes en total con lo que elegiste",
      "en": "images in total with what you picked",
      "grupo": "p2",
      "o": 8
    },
    "q_missing_one": {
      "es": "Falta 1 respuesta",
      "en": "1 answer to go",
      "grupo": "p2",
      "o": 9
    },
    "qi_nomaterial": {
      "es": "Todavía no tengo material",
      "en": "I don't have material yet",
      "grupo": "p3",
      "o": 10
    },
    "qi_photos_privacy": {
      "es": "Tus fotos se guardan de forma segura, las ve solo el equipo de Borsoga Studio y no se comparten con nadie más.",
      "en": "Your photos are stored securely, only the Borsoga Studio team sees them and they are not shared with anyone else.",
      "grupo": "p3",
      "o": 11
    },
    "qi_outside_fl": {
      "es": "Fuera de Florida lo revisamos contigo antes de hablar de precio.",
      "en": "Outside Florida we review it with you before talking price.",
      "grupo": "p6",
      "o": 12
    },
    "qi_privacy_accept": {
      "es": "He leído y acepto la {link}",
      "en": "I have read and accept the {link}",
      "grupo": "p6",
      "o": 13
    },
    "qi_privacy_link": {
      "es": "política de privacidad",
      "en": "privacy policy",
      "grupo": "p6",
      "o": 14
    },
    "qi_not_contract": {
      "es": "Esto no es un contrato ni una cotización. Es la información con la que preparamos tu propuesta.",
      "en": "This is not a contract or a quote. It's the information we use to prepare your proposal.",
      "grupo": "p6",
      "o": 15
    },
    "qi_your_plan": {
      "es": "Tu plan",
      "en": "Your plan",
      "grupo": "final",
      "o": 16
    },
    "qi_plan_reco": {
      "es": "Por lo que nos contaste, el plan que te sirve es <strong>{plan}</strong>. Te mandamos el estimado con esa base y lo ajustamos si prefieres otro.",
      "en": "From what you told us, the plan that fits is <strong>{plan}</strong>. We'll send the estimate on that basis and adjust it if you prefer another.",
      "grupo": "final",
      "o": 17
    },
    "qi_confirm_visit": {
      "es": "El estimado se confirma en la visita al sitio.",
      "en": "The estimate is confirmed on the site visit.",
      "grupo": "final",
      "o": 18
    },
    "qi_photos_what": {
      "es": "Qué necesitamos ver",
      "en": "What we need to see",
      "grupo": "p3",
      "o": 19
    },
    "qi_photos_list": {
      "es": "Una general desde la entrada · Una de cada pared principal · Una de las ventanas · Si hay algo que hoy te molesta, fotografíalo",
      "en": "One general shot from the entrance · One of each main wall · One of the windows · If something bothers you today, photograph it",
      "grupo": "p3",
      "o": 20
    },
    "qi_nomaterial_note": {
      "es": "Sin fotos ni planos podemos seguir, pero tu estimado va a ser un rango, no un número. Lo cerramos en la visita a tu espacio.",
      "en": "Without photos or drawings we can still go on, but your estimate will be a range, not a number. We settle it on the visit to your space.",
      "grupo": "p3",
      "o": 21
    },
    "qi_referral_note": {
      "es": "Lo anotamos: te presentamos contratistas con los que ya hemos trabajado.",
      "en": "Noted: we'll introduce you to contractors we've already worked with.",
      "grupo": "p6",
      "o": 22
    },
    "qi_a_note": {
      "es": "Una nota",
      "en": "One note",
      "grupo": "p5",
      "o": 23
    },
    "srv_email_bad": {
      "es": "Escríbelo completo, con arroba y dominio: nombre@correo.com",
      "en": "That doesn't look like an email address.",
      "grupo": "p1",
      "o": 24
    },
    "qi_structural": {
      "es": "Los cambios de fachada o de paredes estructurales necesitan un arquitecto o ingeniero con licencia, y eso no está incluido en ningún plan. Podemos coordinar con el tuyo, o ayudarte a encontrar uno.",
      "en": "Façade changes or structural walls need a licensed architect or engineer, and that is not included in any plan. We can coordinate with yours, or help you find one.",
      "grupo": "p1",
      "o": 25
    },
    "qi_didyoumean": {
      "es": "¿Quisiste decir <strong>{email}</strong>?",
      "en": "Did you mean <strong>{email}</strong>?",
      "grupo": "p1",
      "o": 26
    },
    "srv_fix": {
      "es": "Sí, corregir",
      "en": "Yes, fix it",
      "grupo": "p1",
      "o": 27
    },
    "qi_appl_note": {
      "es": "Lo anotamos: la selección de electrodomésticos entra como parte de tu propuesta.",
      "en": "Noted: appliance selection comes as part of your proposal.",
      "grupo": "p3",
      "o": 28
    },
    "qi_plan_picked": {
      "es": "Elegiste <strong>{plan}</strong>. Preparamos el estimado con esa base.",
      "en": "You chose <strong>{plan}</strong>. We prepare the estimate on that basis.",
      "grupo": "final",
      "o": 29
    },
    "Paso 01 de 06": {
      "es": "Paso 01 de 06",
      "en": "Step 01 of 06",
      "grupo": "cabecera",
      "o": 30
    },
    "Tu proyecto": {
      "es": "Tu proyecto",
      "en": "Your project",
      "grupo": "cabecera",
      "o": 31
    },
    "¿Para qué es este proyecto?": {
      "es": "¿Para qué es este proyecto?",
      "en": "What is this project for?",
      "grupo": "cabecera",
      "o": 32
    },
    "Continuar": {
      "es": "Continuar",
      "en": "Continue",
      "grupo": "cabecera",
      "o": 33
    },
    "Guardado": {
      "es": "Guardado",
      "en": "Saved",
      "grupo": "p1",
      "o": 34
    },
    "¿Es para vender o para rentar?": {
      "es": "¿Es para vender o para rentar?",
      "en": "Is it to sell or to rent?",
      "grupo": "p1",
      "o": 35
    },
    "¿Ya es tuya?": {
      "es": "¿Ya es tuya?",
      "en": "Is it yours yet?",
      "grupo": "p1",
      "o": 36
    },
    "¿Qué tipo de propiedad es?": {
      "es": "¿Qué tipo de propiedad es?",
      "en": "What kind of property is it?",
      "grupo": "p1",
      "o": 37
    },
    "¿Obra nueva o remodelación?": {
      "es": "¿Obra nueva o remodelación?",
      "en": "New build or remodel?",
      "grupo": "p1",
      "o": 38
    },
    "¿En qué etapa está la obra?": {
      "es": "¿En qué etapa está la obra?",
      "en": "What stage is the work at?",
      "grupo": "p1",
      "o": 39
    },
    "tu@correo.com": {
      "es": "tu@correo.com",
      "en": "you@email.com",
      "grupo": "p1",
      "o": 40
    },
    "¿A dónde te guardamos el avance?": {
      "es": "¿A dónde te guardamos el avance?",
      "en": "Where should we save your progress?",
      "grupo": "p1",
      "o": 41
    },
    "Lo guardamos en este navegador para que puedas volver donde quedaste. Te lo pedimos también para poder contactarte.": {
      "es": "Lo guardamos en este navegador para que puedas volver donde quedaste. Te lo pedimos también para poder contactarte.",
      "en": "We save it in this browser so you can come back where you left off. We also ask for it so we can contact you.",
      "grupo": "p1",
      "o": 42
    },
    "Paso 02 de 06": {
      "es": "Paso 02 de 06",
      "en": "Step 02 of 06",
      "grupo": "p2",
      "o": 43
    },
    "Tus espacios y su tamaño": {
      "es": "Tus espacios y su tamaño",
      "en": "Your spaces",
      "grupo": "p2",
      "o": 44
    },
    "¿Qué espacios quieres diseñar?": {
      "es": "¿Qué espacios quieres diseñar?",
      "en": "Which spaces do you want to design?",
      "grupo": "p2",
      "o": 45
    },
    "Elige todos los que quieras. No hay mínimo: puedes contratar uno solo. Si tienes más de uno, ajusta la cantidad.": {
      "es": "Elige todos los que quieras. No hay mínimo: puedes contratar uno solo. Si tienes más de uno, ajusta la cantidad.",
      "en": "Pick as many as you want. There's no minimum: you can hire just one. If you have more than one, adjust the quantity.",
      "grupo": "p2",
      "o": 46
    },
    "¿Vas a conservar muebles que ya tienes?": {
      "es": "¿Vas a conservar muebles que ya tienes?",
      "en": "Will you keep furniture you already have?",
      "grupo": "p2",
      "o": 47
    },
    "Enlace a tu lista o tablero (opcional)": {
      "es": "Enlace a tu lista o tablero (opcional)",
      "en": "Link to your list or board (optional)",
      "grupo": "p2",
      "o": 48
    },
    "¿Ya tienes piezas de mobiliario decididas?": {
      "es": "¿Ya tienes piezas de mobiliario decididas?",
      "en": "Have you decided on any furniture pieces?",
      "grupo": "p2",
      "o": 49
    },
    "Opcional": {
      "es": "Opcional",
      "en": "Optional",
      "grupo": "p2",
      "o": 50
    },
    "¿Qué tan grande es tu proyecto?": {
      "es": "¿Qué tan grande es tu proyecto?",
      "en": "How big is your project?",
      "grupo": "p2",
      "o": 51
    },
    "Una idea general basta. Los detalles los tomamos en la visita.": {
      "es": "Una idea general basta. Los detalles los tomamos en la visita.",
      "en": "A general idea is enough. We take the details on the visit.",
      "grupo": "p2",
      "o": 52
    },
    "¿Cuánto piensas invertir en obra y mobiliario?": {
      "es": "¿Cuánto piensas invertir en obra y mobiliario?",
      "en": "How much are you thinking of investing in works and furniture?",
      "grupo": "p2",
      "o": 53
    },
    "Es opcional, pero si nos lo compartes ajustamos el estimado a tu realidad en vez de darte un rango amplio.": {
      "es": "Es opcional, pero si nos lo compartes ajustamos el estimado a tu realidad en vez de darte un rango amplio.",
      "en": "It's optional, but if you share it we tune the estimate to your situation instead of giving you a wide range.",
      "grupo": "p2",
      "o": 54
    },
    "Paso 03 de 06": {
      "es": "Paso 03 de 06",
      "en": "Step 03 of 06",
      "grupo": "p3",
      "o": 55
    },
    "Tu espacio en detalle": {
      "es": "Tu espacio en detalle",
      "en": "Your space in detail",
      "grupo": "p3",
      "o": 56
    },
    "¿En cuáles se van a hacer muebles a la medida?": {
      "es": "¿En cuáles se van a hacer muebles a la medida?",
      "en": "Which ones will have custom furniture made?",
      "grupo": "p3",
      "o": 57
    },
    "Gabinetes de cocina, clósets, muebles de baño, paneles de pared, libreros. Lo contrario es comprar todo ya hecho.": {
      "es": "Gabinetes de cocina, clósets, muebles de baño, paneles de pared, libreros. Lo contrario es comprar todo ya hecho.",
      "en": "Kitchen cabinets, closets, bathroom vanities, wall panels, bookcases. The alternative is buying everything ready-made.",
      "grupo": "p3",
      "o": 58
    },
    "Sube los planos o el material del desarrollo": {
      "es": "Sube los planos o el material del desarrollo",
      "en": "Upload the drawings or the development's material",
      "grupo": "p3",
      "o": 59
    },
    "Imágenes o PDF. Lo que te haya dado el desarrollador sirve.": {
      "es": "Imágenes o PDF. Lo que te haya dado el desarrollador sirve.",
      "en": "Images or PDF. Whatever the developer gave you works.",
      "grupo": "p3",
      "o": 60
    },
    "Elegir": {
      "es": "Elegir",
      "en": "Choose",
      "grupo": "p3",
      "o": 61
    },
    "Fotos del lugar, si ya se puede entrar": {
      "es": "Fotos del lugar, si ya se puede entrar",
      "en": "Photos of the place, if you can get in yet",
      "grupo": "p3",
      "o": 62
    },
    "Opcional.": {
      "es": "Opcional.",
      "en": "Optional",
      "grupo": "p3",
      "o": 63
    },
    "Muéstranos el proyecto": {
      "es": "Muéstranos el proyecto",
      "en": "Show us the project",
      "grupo": "p3",
      "o": 64
    },
    "En obra nueva no hay fotos. Necesitamos los planos o el material del desarrollo.": {
      "es": "En obra nueva no hay fotos. Necesitamos los planos o el material del desarrollo.",
      "en": "In new construction there are no photos. We need the drawings or the development's material.",
      "grupo": "p3",
      "o": 65
    },
    "Paso 04 de 06": {
      "es": "Paso 04 de 06",
      "en": "Step 04 of 06",
      "grupo": "p4",
      "o": 66
    },
    "Nivel de acabado": {
      "es": "Nivel de acabado",
      "en": "Finish level",
      "grupo": "p4",
      "o": 67
    },
    "Proyecto real": {
      "es": "Proyecto real",
      "en": "Real project",
      "grupo": "p4",
      "o": 68
    },
    "Estas son tres cocinas nuestras. Señala la que se parece a lo que quieres.": {
      "es": "Estas son tres cocinas nuestras. Señala la que se parece a lo que quieres.",
      "en": "These are three of our kitchens. Point to the one closest to what you want.",
      "grupo": "p4",
      "o": 69
    },
    "Paso 05 de 06": {
      "es": "Paso 05 de 06",
      "en": "Step 05 of 06",
      "grupo": "p5",
      "o": 70
    },
    "Extras": {
      "es": "Extras",
      "en": "Extras",
      "grupo": "p5",
      "o": 71
    },
    "Se cotizan aparte. Lo que no marques aquí queda fuera de tu proyecto.": {
      "es": "Se cotizan aparte. Lo que no marques aquí queda fuera de tu proyecto.",
      "en": "These are quoted separately. Whatever you don't tick here stays out of your project.",
      "grupo": "p5",
      "o": 72
    },
    "¿Vas a necesitar algo más cuando esté terminado?": {
      "es": "¿Vas a necesitar algo más cuando esté terminado?",
      "en": "Will you need anything else once it's finished?",
      "grupo": "p5",
      "o": 73
    },
    "Paso 06 de 06": {
      "es": "Paso 06 de 06",
      "en": "Step 06 of 06",
      "grupo": "p6",
      "o": 74
    },
    "Tus datos": {
      "es": "Tus datos",
      "en": "Your details",
      "grupo": "p6",
      "o": 75
    },
    "Nombre legal completo": {
      "es": "Nombre legal completo",
      "en": "Full legal name",
      "grupo": "p6",
      "o": 76
    },
    "Correo": {
      "es": "Correo",
      "en": "Email",
      "grupo": "p6",
      "o": 77
    },
    "Teléfono": {
      "es": "Teléfono",
      "en": "Phone",
      "grupo": "p6",
      "o": 78
    },
    "Nombre legal de la empresa": {
      "es": "Nombre legal de la empresa",
      "en": "Company's legal name",
      "grupo": "p6",
      "o": 79
    },
    "Estado de registro": {
      "es": "Estado de registro",
      "en": "State of registration",
      "grupo": "p6",
      "o": 80
    },
    "Quién firma": {
      "es": "Quién firma",
      "en": "Who signs",
      "grupo": "p6",
      "o": 81
    },
    "Su cargo": {
      "es": "Su cargo",
      "en": "Their title",
      "grupo": "p6",
      "o": 82
    },
    "¿Firmas a título personal o como empresa?": {
      "es": "¿Firmas a título personal o como empresa?",
      "en": "Are you signing personally or as a company?",
      "grupo": "p6",
      "o": 83
    },
    "¿Eres el dueño de la propiedad?": {
      "es": "¿Eres el dueño de la propiedad?",
      "en": "Are you the owner of the property?",
      "grupo": "p6",
      "o": 84
    },
    "¿Quién decide en este proyecto?": {
      "es": "¿Quién decide en este proyecto?",
      "en": "Who decides on this project?",
      "grupo": "p6",
      "o": 85
    },
    "Calle y número": {
      "es": "Calle y número",
      "en": "Street and number",
      "grupo": "p6",
      "o": 86
    },
    "Ciudad": {
      "es": "Ciudad",
      "en": "City",
      "grupo": "p6",
      "o": 87
    },
    "Estado": {
      "es": "Estado",
      "en": "State",
      "grupo": "p6",
      "o": 88
    },
    "Código postal": {
      "es": "Código postal",
      "en": "ZIP code",
      "grupo": "p6",
      "o": 89
    },
    "Dirección del proyecto": {
      "es": "Dirección del proyecto",
      "en": "Project address",
      "grupo": "p6",
      "o": 90
    },
    "¿Cuándo quieres empezar?": {
      "es": "¿Cuándo quieres empezar?",
      "en": "When do you want to start?",
      "grupo": "p6",
      "o": 91
    },
    "¿Tienes una fecha límite?": {
      "es": "¿Tienes una fecha límite?",
      "en": "Do you have a deadline?",
      "grupo": "p6",
      "o": 92
    },
    "¿Ya trabajas con un contratista o un arquitecto?": {
      "es": "¿Ya trabajas con un contratista o un arquitecto?",
      "en": "Are you already working with a contractor or an architect?",
      "grupo": "p6",
      "o": 93
    },
    "¿Podemos publicar tu proyecto terminado?": {
      "es": "¿Podemos publicar tu proyecto terminado?",
      "en": "May we publish your finished project?",
      "grupo": "p6",
      "o": 94
    },
    "Nos ayuda a mostrar nuestro trabajo. Lo confirmamos en el contrato.": {
      "es": "Nos ayuda a mostrar nuestro trabajo. Lo confirmamos en el contrato.",
      "en": "It helps us show our work. We confirm it in the contract.",
      "grupo": "p6",
      "o": 95
    },
    "Enviar mi proyecto": {
      "es": "Enviar mi proyecto",
      "en": "Send my project",
      "grupo": "p6",
      "o": 96
    },
    "Listo": {
      "es": "Listo",
      "en": "Done",
      "grupo": "final",
      "o": 97
    },
    "pies²": {
      "es": "pies²",
      "en": "sq ft",
      "grupo": "final",
      "o": 98
    },
    "en total": {
      "es": "en total",
      "en": "in total",
      "grupo": "final",
      "o": 99
    },
    "Plan recomendado": {
      "es": "Plan recomendado",
      "en": "Recommended plan",
      "grupo": "final",
      "o": 100
    },
    "Proyecto": {
      "es": "Proyecto",
      "en": "Project",
      "grupo": "final",
      "o": 101
    },
    "Obra": {
      "es": "Obra",
      "en": "Construction",
      "grupo": "final",
      "o": 102
    },
    "Espacios": {
      "es": "Espacios",
      "en": "Spaces",
      "grupo": "final",
      "o": 103
    },
    "Muebles a la medida": {
      "es": "Muebles a la medida",
      "en": "Custom-built furniture",
      "grupo": "final",
      "o": 104
    },
    "Piezas decididas": {
      "es": "Piezas decididas",
      "en": "Pieces decided",
      "grupo": "final",
      "o": 105
    },
    "Tamaño": {
      "es": "Tamaño",
      "en": "Size",
      "grupo": "final",
      "o": 106
    },
    "Imágenes": {
      "es": "Imágenes",
      "en": "Images",
      "grupo": "final",
      "o": 107
    },
    "Punto de partida": {
      "es": "Punto de partida",
      "en": "Starting point",
      "grupo": "final",
      "o": 108
    },
    "Dirección": {
      "es": "Dirección",
      "en": "Address",
      "grupo": "final",
      "o": 109
    },
    "Cuándo": {
      "es": "Cuándo",
      "en": "When",
      "grupo": "final",
      "o": 110
    },
    "Quién decide": {
      "es": "Quién decide",
      "en": "Who decides",
      "grupo": "final",
      "o": 111
    },
    "Portafolio": {
      "es": "Portafolio",
      "en": "Portfolio",
      "grupo": "final",
      "o": 112
    },
    "Más al terminar": {
      "es": "Más al terminar",
      "en": "More on completion",
      "grupo": "final",
      "o": 113
    },
    "¿De qué año es aproximadamente la propiedad?": {
      "es": "¿De qué año es aproximadamente la propiedad?",
      "en": "Roughly what year is the property from?",
      "grupo": "p1",
      "o": 114
    },
    "¿El proyecto incluye alguno de estos?": {
      "es": "¿El proyecto incluye alguno de estos?",
      "en": "Does the project include any of these?",
      "grupo": "p1",
      "o": 115
    },
    "Marca todo lo que aplique.": {
      "es": "Marca todo lo que aplique.",
      "en": "Tick everything that applies.",
      "grupo": "p1",
      "o": 116
    },
    "¿Tu comunidad tiene HOA con reglas de diseño?": {
      "es": "¿Tu comunidad tiene HOA con reglas de diseño?",
      "en": "Does your community have an HOA with design rules?",
      "grupo": "p3",
      "o": 117
    },
    "Toma o elige tus fotos": {
      "es": "Toma o elige tus fotos",
      "en": "Take or pick your photos",
      "grupo": "p3",
      "o": 118
    },
    "De 3 a 6 fotos. Con el celular basta.": {
      "es": "De 3 a 6 fotos. Con el celular basta.",
      "en": "3 to 6 photos. Your phone is enough.",
      "grupo": "p3",
      "o": 119
    },
    "Tus planos, si los tienes": {
      "es": "Tus planos, si los tienes",
      "en": "Your drawings, if you have them",
      "grupo": "p3",
      "o": 120
    },
    "Opcional. Imágenes o PDF.": {
      "es": "Opcional. Imágenes o PDF.",
      "en": "Optional. Images or PDF.",
      "grupo": "p3",
      "o": 121
    },
    "Muéstranos tu espacio": {
      "es": "Muéstranos tu espacio",
      "en": "Show us your space",
      "grupo": "p3",
      "o": 122
    },
    "Necesitamos verlo para darte un estimado real. Con el celular basta.": {
      "es": "Necesitamos verlo para darte un estimado real. Con el celular basta.",
      "en": "We need to see it to give you a real estimate. Your phone is enough.",
      "grupo": "p3",
      "o": 123
    },
    "¿Qué tan claro tienes lo que quieres?": {
      "es": "¿Qué tan claro tienes lo que quieres?",
      "en": "How clear are you on what you want?",
      "grupo": "p4",
      "o": 124
    },
    "Nombre del dueño": {
      "es": "Nombre del dueño",
      "en": "Owner's name",
      "grupo": "p6",
      "o": 125
    },
    "Correo del dueño": {
      "es": "Correo del dueño",
      "en": "Owner's email",
      "grupo": "p6",
      "o": 126
    },
    "¿Qué te haría decidirte? (opcional)": {
      "es": "¿Qué te haría decidirte? (opcional)",
      "en": "What would make you decide? (optional)",
      "grupo": "p6",
      "o": 127
    },
    "Propiedad": {
      "es": "Propiedad",
      "en": "Property",
      "grupo": "final",
      "o": 128
    },
    "Mobiliario que conserva": {
      "es": "Mobiliario que conserva",
      "en": "Furniture being kept",
      "grupo": "final",
      "o": 129
    },
    "Paredes y fachada": {
      "es": "Paredes y fachada",
      "en": "Walls and facade",
      "grupo": "final",
      "o": 130
    },
    "HOA": {
      "es": "HOA",
      "en": "HOA",
      "grupo": "final",
      "o": 131
    },
    "Presupuesto declarado": {
      "es": "Presupuesto declarado",
      "en": "Budget",
      "grupo": "final",
      "o": 132
    },
    "Fecha límite": {
      "es": "Fecha límite",
      "en": "Deadline",
      "grupo": "final",
      "o": 133
    },
    "¿Se van a mover los puntos de agua o desagüe?": {
      "es": "¿Se van a mover los puntos de agua o desagüe?",
      "en": "Will the water or drainage points be moved?",
      "grupo": "p3",
      "o": 134
    },
    "Motivo: mudanza, cierre de compra, apertura, otro": {
      "es": "Motivo: mudanza, cierre de compra, apertura, otro",
      "en": "What's driving it? (move-in, closing, opening…)",
      "grupo": "p6",
      "o": 135
    },
    "Todavía sin material": {
      "es": "Todavía sin material",
      "en": "No material yet",
      "grupo": "final",
      "o": 136
    },
    "Ninguno": {
      "es": "Ninguno",
      "en": "None",
      "grupo": "final",
      "o": 137
    },
    "Pide que le recomendemos contratista.": {
      "es": "Pide que le recomendemos contratista.",
      "en": "Asks us to recommend a contractor.",
      "grupo": "final",
      "o": 138
    },
    "Fuera de Miami-Dade.": {
      "es": "Fuera de Miami-Dade.",
      "en": "Outside Miami-Dade.",
      "grupo": "final",
      "o": 139
    },
    "Agua y desagüe": {
      "es": "Agua y desagüe",
      "en": "Water and drainage",
      "grupo": "final",
      "o": 140
    },
    "Material": {
      "es": "Material",
      "en": "Material",
      "grupo": "final",
      "o": 141
    },
    "Marcado": {
      "es": "Marcado",
      "en": "Flagged",
      "grupo": "final",
      "o": 142
    },
    "¿El edificio pide aprobación de la asociación o del condominio?": {
      "es": "¿El edificio pide aprobación de la asociación o del condominio?",
      "en": "Does the building require association or condo approval?",
      "grupo": "p3",
      "o": 143
    },
    "¿Qué tipo de espacio comercial?": {
      "es": "¿Qué tipo de espacio comercial?",
      "en": "What kind of commercial space?",
      "grupo": "p1",
      "o": 144
    },
    "¿El local está vacío o en operación?": {
      "es": "¿El local está vacío o en operación?",
      "en": "Is the space empty or in operation?",
      "grupo": "p1",
      "o": 145
    },
    "Súbenos la lista o las fichas técnicas": {
      "es": "Súbenos la lista o las fichas técnicas",
      "en": "Upload the list or the spec sheets",
      "grupo": "p3",
      "o": 146
    },
    "¿Ya elegiste los electrodomésticos?": {
      "es": "¿Ya elegiste los electrodomésticos?",
      "en": "Have you chosen the appliances?",
      "grupo": "p3",
      "o": 147
    },
    "Las medidas de los electrodomésticos definen toda la gabinetería, así que conviene tenerlos decididos antes de empezar.": {
      "es": "Las medidas de los electrodomésticos definen toda la gabinetería, así que conviene tenerlos decididos antes de empezar.",
      "en": "Appliance dimensions define all the cabinetry, so it's worth deciding on them before we start.",
      "grupo": "p3",
      "o": 148
    },
    "¿Ya elegiste la lavadora y la secadora?": {
      "es": "¿Ya elegiste la lavadora y la secadora?",
      "en": "Have you chosen the washer and dryer?",
      "grupo": "p3",
      "o": 149
    },
    "¿Cómo van a ir?": {
      "es": "¿Cómo van a ir?",
      "en": "How will they go?",
      "grupo": "p3",
      "o": 150
    },
    "Apiladas ocupan menos; lado a lado piden más frente de pared.": {
      "es": "Apiladas ocupan menos; lado a lado piden más frente de pared.",
      "en": "Stacked takes less room; side by side needs more wall width.",
      "grupo": "p3",
      "o": 151
    },
    "Obra estructural o de fachada. Lo revisamos antes de cotizar.": {
      "es": "Obra estructural o de fachada. Lo revisamos antes de cotizar.",
      "en": "Structural or façade work. We review it before quoting.",
      "grupo": "final",
      "o": 152
    },
    "Electrodomésticos": {
      "es": "Electrodomésticos",
      "en": "Appliances",
      "grupo": "final",
      "o": 153
    },
    "Asociación": {
      "es": "Asociación",
      "en": "Association",
      "grupo": "final",
      "o": 154
    },
    "¿El proyecto necesita aprobación del departamento de salud?": {
      "es": "¿El proyecto necesita aprobación del departamento de salud?",
      "en": "Does the project need health department approval?",
      "grupo": "p3",
      "o": 155
    },
    "Departamento de salud": {
      "es": "Departamento de salud",
      "en": "Health department",
      "grupo": "final",
      "o": 156
    },
    "¿El proyecto incluye la piscina o su área?": {
      "es": "¿El proyecto incluye la piscina o su área?",
      "en": "Does the project include the pool or its area?",
      "grupo": "p3",
      "o": 157
    },
    "Te escribimos en persona en menos de 48 horas": {
      "es": "Te escribimos en persona en menos de 48 horas",
      "en": "A person from the studio writes to you within 48 hours",
      "grupo": "final",
      "o": 158
    },
    "Piscina": {
      "es": "Piscina",
      "en": "Pool",
      "grupo": "final",
      "o": 159
    },
    "Todavía no tienes el local. Súbenos los planos o el material que te hayan dado. Nada aquí es obligatorio.": {
      "es": "Todavía no tienes el local. Súbenos los planos o el material que te hayan dado. Nada aquí es obligatorio.",
      "en": "You don't have the space yet. Upload the drawings or the material you were given. Nothing here is required.",
      "grupo": "p3",
      "o": 160
    },
    "Qué le haría decidirse": {
      "es": "Qué le haría decidirse",
      "en": "What would make them decide",
      "grupo": "final",
      "o": 161
    },
    "Sube lo que tengas de la propiedad": {
      "es": "Sube lo que tengas de la propiedad",
      "en": "Upload whatever you have on the property",
      "grupo": "p3",
      "o": 162
    },
    "Fotos del listado, planos, medidas. Imágenes o PDF.": {
      "es": "Fotos del listado, planos, medidas. Imágenes o PDF.",
      "en": "Listing photos, drawings, dimensions. Images or PDF.",
      "grupo": "p3",
      "o": 163
    },
    "Todavía no es tuya, así que no hay nada que fotografiar. Súbenos lo que tengas del listado o del desarrollo. Nada aquí es obligatorio.": {
      "es": "Todavía no es tuya, así que no hay nada que fotografiar. Súbenos lo que tengas del listado o del desarrollo. Nada aquí es obligatorio.",
      "en": "It isn't yours yet, so there's nothing to photograph. Upload whatever you have from the listing or the development. Nothing here is required.",
      "grupo": "p3",
      "o": 164
    },
    "¿Ya elegiste el equipo de la barra?": {
      "es": "¿Ya elegiste el equipo de la barra?",
      "en": "Have you chosen the bar equipment?",
      "grupo": "p3",
      "o": 165
    },
    "Fregadero, hielera, enfriador de bebidas, cafetera.": {
      "es": "Fregadero, hielera, enfriador de bebidas, cafetera.",
      "en": "Sink, ice bin, beverage cooler, coffee machine.",
      "grupo": "p3",
      "o": 166
    },
    "Equipo de barra": {
      "es": "Equipo de barra",
      "en": "Bar equipment",
      "grupo": "final",
      "o": 167
    },
    "¿Qué tipo de espacio es?": {
      "es": "¿Qué tipo de espacio es?",
      "en": "What kind of space is it?",
      "grupo": "p1",
      "o": 168
    },
    "Varias respuestas sin definir. Va a rango y a llamada.": {
      "es": "Varias respuestas sin definir. Va a rango y a llamada.",
      "en": "Several answers undefined. Goes to range and a call.",
      "grupo": "final",
      "o": 169
    }
  }
} as Config,
  av: {
  "formato": 2,
  "servicio": "av",
  "clave": "borsoga.cuestionario.av.v1",
  "listas": {
    "projectType": {
      "nombre": "Tipo de proyecto",
      "ops": [
        {
          "es": "Residencial multifamiliar",
          "en": "Multifamily residential"
        },
        {
          "es": "Residencial unifamiliar",
          "en": "Single-family residential"
        },
        {
          "es": "Comercial",
          "en": "Commercial",
          "rol": "comercial"
        },
        {
          "es": "Hospitalidad",
          "en": "Hospitality",
          "rol": "hospitalidad"
        },
        {
          "es": "Uso mixto",
          "en": "Mixed use",
          "rol": "mixto"
        },
        {
          "es": "Producto o mobiliario",
          "en": "Product or furniture"
        }
      ]
    },
    "stage": {
      "nombre": "Etapa",
      "ops": [
        {
          "es": "Concepto",
          "en": "Concept"
        },
        {
          "es": "Diseño desarrollado",
          "en": "Developed design"
        },
        {
          "es": "En permisos",
          "en": "In permitting"
        },
        {
          "es": "En construcción",
          "en": "Under construction"
        },
        {
          "es": "Ya construido",
          "en": "Already built"
        }
      ]
    },
    "role": {
      "nombre": "Quién escribe",
      "ops": [
        {
          "es": "Developer",
          "en": "Developer"
        },
        {
          "es": "Arquitecto o diseñador",
          "en": "Architect or designer"
        },
        {
          "es": "Fabricante",
          "en": "Manufacturer"
        },
        {
          "es": "Corredor o agencia",
          "en": "Broker or agency"
        },
        {
          "es": "Otro",
          "en": "Other"
        }
      ]
    },
    "scenes": {
      "nombre": "Escenas",
      "ops": [
        {
          "es": "Fachada",
          "en": "Façade",
          "marcas": {
            "contexto": true
          }
        },
        {
          "es": "Vista aérea",
          "en": "Aerial view",
          "marcas": {
            "contexto": true
          }
        },
        {
          "es": "Exterior a nivel",
          "en": "Street-level exterior"
        },
        {
          "es": "Interior",
          "en": "Interior",
          "rol": "interior"
        },
        {
          "es": "Detalle o producto",
          "en": "Detail or product",
          "marcas": {
            "pieza": true
          }
        }
      ]
    },
    "context": {
      "nombre": "¿Contexto urbano?",
      "ops": [
        {
          "es": "Sí, el entorno real",
          "en": "Yes, the real surroundings"
        },
        {
          "es": "Solo el edificio, sin contexto",
          "en": "Just the building, no context"
        },
        {
          "es": "No lo sé todavía",
          "en": "I don't know yet",
          "duda": true
        }
      ]
    },
    "rooms": {
      "nombre": "Espacios interiores",
      "ops": [
        {
          "es": "Lobby o acceso",
          "en": "Lobby or entrance",
          "grupo": "residencial"
        },
        {
          "es": "Cocina",
          "en": "Kitchen",
          "grupo": "residencial"
        },
        {
          "es": "Sala",
          "en": "Living room",
          "grupo": "residencial"
        },
        {
          "es": "Comedor",
          "en": "Dining room",
          "grupo": "residencial"
        },
        {
          "es": "Dormitorio",
          "en": "Bedroom",
          "grupo": "residencial"
        },
        {
          "es": "Baño",
          "en": "Bathroom",
          "grupo": "residencial"
        },
        {
          "es": "Home office",
          "en": "Home office",
          "grupo": "residencial"
        },
        {
          "es": "Clóset o vestidor",
          "en": "Closet or dressing room",
          "grupo": "residencial"
        },
        {
          "es": "Amenidad",
          "en": "Amenity",
          "grupo": "residencial",
          "rol": "amenidad"
        },
        {
          "es": "Circulación o común",
          "en": "Circulation or common area",
          "grupo": "residencial"
        },
        {
          "es": "Recepción o lobby",
          "en": "Reception or lobby",
          "grupo": "comercial"
        },
        {
          "es": "Área de trabajo",
          "en": "Work area",
          "grupo": "comercial"
        },
        {
          "es": "Sala de juntas",
          "en": "Meeting room",
          "grupo": "comercial"
        },
        {
          "es": "Piso de venta",
          "en": "Sales floor",
          "grupo": "comercial"
        },
        {
          "es": "Restaurante o comedor",
          "en": "Restaurant or dining room",
          "grupo": "comercial"
        },
        {
          "es": "Barra",
          "en": "Bar",
          "grupo": "comercial"
        },
        {
          "es": "Baños",
          "en": "Restrooms",
          "grupo": "comercial"
        },
        {
          "es": "Circulación",
          "en": "Circulation",
          "grupo": "comercial"
        },
        {
          "es": "Lobby",
          "en": "Lobby",
          "grupo": "hospitalidad"
        },
        {
          "es": "Habitación tipo",
          "en": "Typical room",
          "grupo": "hospitalidad"
        },
        {
          "es": "Suite",
          "en": "Suite",
          "grupo": "hospitalidad"
        },
        {
          "es": "Restaurante",
          "en": "Restaurant",
          "grupo": "hospitalidad"
        },
        {
          "es": "Bar",
          "en": "Bar",
          "grupo": "hospitalidad"
        },
        {
          "es": "Spa o gimnasio",
          "en": "Spa or gym",
          "grupo": "hospitalidad"
        },
        {
          "es": "Salón de eventos",
          "en": "Event hall",
          "grupo": "hospitalidad"
        },
        {
          "es": "Piscina o deck",
          "en": "Pool or deck",
          "grupo": "hospitalidad"
        }
      ]
    },
    "amenities": {
      "nombre": "Amenidades",
      "ops": [
        {
          "es": "Gimnasio",
          "en": "Gym"
        },
        {
          "es": "Piscina o deck",
          "en": "Pool or deck"
        },
        {
          "es": "Coworking",
          "en": "Coworking"
        },
        {
          "es": "Salón social",
          "en": "Social lounge"
        },
        {
          "es": "Spa",
          "en": "Spa"
        },
        {
          "es": "Otra",
          "en": "Other"
        }
      ]
    },
    "interiorDesign": {
      "nombre": "¿Interior diseñado?",
      "ops": [
        {
          "es": "Sí, tengo el diseño definido",
          "en": "Yes, I have the design defined"
        },
        {
          "es": "Parcialmente",
          "en": "Partially",
          "marcas": {
            "abierto": true
          }
        },
        {
          "es": "No, habría que resolverlo",
          "en": "No, it would need resolving",
          "marcas": {
            "abierto": true
          }
        }
      ]
    },
    "piece": {
      "nombre": "¿La pieza existe?",
      "ops": [
        {
          "es": "Existe y tengo el modelo",
          "en": "It exists and I have the model"
        },
        {
          "es": "Existe pero solo tengo planos o fotos",
          "en": "It exists but I only have drawings or photos"
        },
        {
          "es": "Es un diseño nuevo",
          "en": "It's a new design"
        }
      ]
    },
    "material": {
      "nombre": "Material del proyecto",
      "ops": [
        {
          "es": "Modelo 3D listo",
          "en": "3D model ready",
          "rol": "modelo"
        },
        {
          "es": "Planos en CAD",
          "en": "CAD drawings"
        },
        {
          "es": "Planos en PDF",
          "en": "PDF drawings"
        },
        {
          "es": "Solo bocetos o croquis",
          "en": "Only sketches",
          "rol": "bocetos"
        },
        {
          "es": "Todavía nada",
          "en": "Nothing yet",
          "duda": true,
          "rol": "ninguno"
        }
      ]
    },
    "spec": {
      "nombre": "¿Materiales y acabados definidos?",
      "ops": [
        {
          "es": "Sí, tengo la especificación",
          "en": "Yes, I have the specification"
        },
        {
          "es": "Tengo una idea general",
          "en": "I have a general idea"
        },
        {
          "es": "Todavía no",
          "en": "Not yet",
          "duda": true
        }
      ]
    },
    "uses": {
      "nombre": "Uso de las imágenes",
      "ops": [
        {
          "es": "Preventa y ventas",
          "en": "Pre-sales and sales"
        },
        {
          "es": "Presentación a inversionistas o banca",
          "en": "Presentation to investors or banks"
        },
        {
          "es": "Concurso o licitación",
          "en": "Competition or tender"
        },
        {
          "es": "Aprobación de diseño interno",
          "en": "Internal design approval"
        },
        {
          "es": "Redes sociales y marketing",
          "en": "Social media and marketing"
        },
        {
          "es": "Catálogo de producto",
          "en": "Product catalogue"
        },
        {
          "es": "Presentación oficial o permisos",
          "en": "Official presentation or permits"
        }
      ]
    },
    "tone": {
      "nombre": "Tono",
      "ops": [
        {
          "es": "Neutro",
          "en": "Neutral",
          "slot": {
            "es": "Proyecto real · tono neutro",
            "en": "Real project · neutral tone"
          }
        },
        {
          "es": "Atmosférico",
          "en": "Atmospheric",
          "slot": {
            "es": "Proyecto real · tono atmosférico",
            "en": "Real project · atmospheric tone"
          }
        },
        {
          "es": "Editorial",
          "en": "Editorial",
          "slot": {
            "es": "Proyecto real · tono editorial",
            "en": "Real project · editorial tone"
          }
        }
      ]
    },
    "extras": {
      "nombre": "Extras",
      "ops": [
        {
          "es": "Borsoga Immersive",
          "en": "Borsoga Immersive",
          "desc": {
            "es": "Que tu comprador camine el proyecto antes de que existan las paredes.",
            "en": "Let your buyer walk the project before the walls exist."
          }
        },
        {
          "es": "Tour 360",
          "en": "Tour 360",
          "desc": {
            "es": "El proyecto navegable desde cualquier pantalla.",
            "en": "The project, walkable from any screen."
          }
        },
        {
          "es": "Vistas adicionales",
          "en": "Additional views",
          "desc": {
            "es": "Más cámaras dentro de una escena que ya construimos.",
            "en": "More cameras inside a scene we already built."
          }
        },
        {
          "es": "Escenas adicionales",
          "en": "Additional scenes",
          "desc": {
            "es": "Un espacio nuevo, con su modelado, su iluminación y su ambientación.",
            "en": "A new space, with its own modeling, lighting and set dressing."
          }
        }
      ]
    },
    "cross": {
      "nombre": "Alrededor del proyecto",
      "ops": [
        {
          "es": "Identidad o nombre del desarrollo",
          "en": "Identity or name of the development"
        },
        {
          "es": "Un sitio de preventa",
          "en": "A pre-sales site"
        },
        {
          "es": "Material para corredores",
          "en": "Material for brokers"
        },
        {
          "es": "No, por ahora no",
          "en": "Not for now",
          "rol": "ninguno"
        }
      ]
    },
    "signer": {
      "nombre": "¿Firma personal o empresa?",
      "ops": [
        {
          "es": "A título personal",
          "en": "Personally",
          "rol": "personal"
        },
        {
          "es": "Como empresa",
          "en": "As a company",
          "rol": "empresa"
        }
      ]
    },
    "launch": {
      "nombre": "¿Fecha de lanzamiento?",
      "ops": [
        {
          "es": "No, sin fecha fija",
          "en": "No fixed date"
        },
        {
          "es": "Sí, pero es flexible",
          "en": "Yes, but it's flexible"
        },
        {
          "es": "Sí, y es fija",
          "en": "Yes, and it's fixed",
          "rol": "fija"
        }
      ]
    },
    "portfolio": {
      "nombre": "¿Publicar el proyecto?",
      "ops": [
        {
          "es": "Sí, sin problema",
          "en": "Yes, no problem"
        },
        {
          "es": "Sí, pero solo después de su lanzamiento",
          "en": "Yes, but only after its launch"
        },
        {
          "es": "No, está bajo confidencialidad",
          "en": "No, it's under confidentiality"
        }
      ]
    }
  },
  "reglas": {
    "planDefecto": "Essential",
    "plan": [
      {
        "plan": "Borsoga Edition",
        "si": [
          {
            "s": "campo",
            "f": "tone",
            "op": "es",
            "v": "Editorial"
          }
        ]
      },
      {
        "plan": "Borsoga Edition",
        "si": [
          {
            "s": "extras",
            "op": ">=",
            "v": 2
          }
        ]
      },
      {
        "plan": "Borsoga Edition",
        "si": [
          {
            "s": "escenas",
            "op": ">",
            "v": 6
          }
        ]
      },
      {
        "plan": "Premium",
        "si": [
          {
            "s": "campo",
            "f": "tone",
            "op": "es",
            "v": "Atmosférico"
          }
        ]
      },
      {
        "plan": "Premium",
        "si": [
          {
            "s": "campo",
            "f": "uses",
            "op": "incluye",
            "v": "Preventa y ventas"
          }
        ]
      },
      {
        "plan": "Premium",
        "si": [
          {
            "s": "campo",
            "f": "uses",
            "op": "incluye",
            "v": "Redes sociales y marketing"
          }
        ]
      }
    ],
    "ruta": [
      {
        "tipo": "call",
        "si": [
          {
            "s": "plan",
            "op": "es",
            "v": "Borsoga Edition"
          }
        ],
        "texto": {
          "es": "Borsoga Edition se cotiza en una llamada. Tenemos todo lo que nos contaste, así que la conversación empieza donde la dejaste.",
          "en": "A project like yours is better handled in a conversation than in an automatic number. We'll reach out to set up a call, and we'll have everything you told us in front of us."
        }
      },
      {
        "tipo": "call",
        "si": [
          {
            "s": "sin_material"
          }
        ],
        "texto": {
          "es": "Todavía no hay material del proyecto. Empezamos por una llamada de arranque y ahí definimos qué necesitamos para arrancar.",
          "en": "There's no project material yet. We start with a kick-off call, and there we define what we need to begin."
        }
      },
      {
        "tipo": "call",
        "si": [
          {
            "s": "escenas",
            "op": ">",
            "v": 6
          }
        ],
        "texto": {
          "es": "Tu proyecto tiene {escenas} escenas. A ese volumen el precio lo armamos contigo, no con una calculadora.",
          "en": "Your project has {escenas} scenes. At that volume we build the price with you, not with a calculator."
        }
      },
      {
        "tipo": "call",
        "si": [
          {
            "s": "dias_lanzamiento",
            "op": "<",
            "v": 28
          }
        ],
        "texto": {
          "es": "Tu fecha está a menos de cuatro semanas. Eso lo confirmamos en una llamada antes de comprometer nada.",
          "en": "Your date is less than four weeks away. We confirm that on a call before committing to anything."
        }
      },
      {
        "tipo": "call",
        "si": [
          {
            "s": "campo",
            "f": "projectType",
            "op": "es",
            "v": "Uso mixto"
          }
        ],
        "texto": {
          "es": "Uso mixto: son varias tipologías dentro de un mismo proyecto, y el alcance se define mejor hablando.",
          "en": "Mixed use: several typologies inside one project, and the scope is better defined by talking."
        }
      },
      {
        "tipo": "range",
        "si": [
          {
            "s": "sin_definir",
            "op": ">=",
            "v": 4
          }
        ],
        "texto": {
          "es": "Quedaron varias cosas por definir, así que en vez de un número te mandamos un rango y lo cerramos contigo en una llamada.",
          "en": "There were a few things you weren't sure about yet, so what we send will be a range rather than a number. We close it at the visit."
        }
      }
    ],
    "rutaDefecto": {
      "tipo": "mail",
      "texto": {
        "es": "Y agendamos una llamada para revisar las escenas y el calendario: el precio se cierra ahí.",
        "en": "And we'll book a call to go over the scenes and the schedule: the price is settled there."
      }
    },
    "titulos": {
      "call": {
        "es": "Vamos a hablar",
        "en": "Let's talk"
      },
      "range": {
        "es": "Te enviamos un rango",
        "en": "We'll send you a range"
      },
      "mail": {
        "es": "Recibimos tu proyecto",
        "en": "We got your project"
      }
    },
    "avisos": []
  },
  "ajustes": {
    "vistas": {
      "Essential": 2,
      "Premium": 4,
      "Borsoga Edition": 4
    },
    "vistasSinPlan": 2,
    "vistasMax": 12
  },
  "textos": {
    "q_plan_none": {
      "es": "Sin plan todavía",
      "en": "No plan yet",
      "grupo": "cabecera",
      "o": 0
    },
    "Tu proyecto": {
      "es": "Tu proyecto",
      "en": "Your project",
      "grupo": "cabecera",
      "o": 1
    },
    "avq_s1_type": {
      "es": "¿Qué tipo de proyecto es?",
      "en": "What kind of project is it?",
      "grupo": "cabecera",
      "o": 2
    },
    "step_counter": {
      "es": "Paso {n} de 6",
      "en": "Step {n} of 6",
      "grupo": "cabecera",
      "o": 3
    },
    "q_plan_sug": {
      "es": "Sugerido",
      "en": "Suggested",
      "grupo": "p1",
      "o": 4
    },
    "avq_s1_stage": {
      "es": "¿En qué etapa está?",
      "en": "What stage is it at?",
      "grupo": "p1",
      "o": 5
    },
    "avq_s1_role": {
      "es": "¿Desde dónde nos escribes?",
      "en": "Who are you writing as?",
      "grupo": "p1",
      "o": 6
    },
    "avq_step2": {
      "es": "Las escenas",
      "en": "The scenes",
      "grupo": "p2",
      "o": 7
    },
    "avq_s2_q": {
      "es": "¿Qué escenas necesitas?",
      "en": "Which scenes do you need?",
      "grupo": "p2",
      "o": 8
    },
    "q_scene_def": {
      "es": "Una escena es un encuadre del proyecto.",
      "en": "A scene is one framing of the project.",
      "grupo": "p2",
      "o": 9
    },
    "avq_s2_def2": {
      "es": "Una vista es una cámara dentro de esa escena.",
      "en": "A view is a camera inside that scene.",
      "grupo": "p2",
      "o": 10
    },
    "avq_s2_context": {
      "es": "¿Necesitas el contexto urbano alrededor?",
      "en": "Do you need the surrounding urban context?",
      "grupo": "p2",
      "o": 11
    },
    "avq_s2_rooms_q": {
      "es": "¿Qué espacios interiores?",
      "en": "Which interior spaces?",
      "grupo": "p2",
      "o": 12
    },
    "avq_s2_amen": {
      "es": "¿Cuáles?",
      "en": "Which ones?",
      "grupo": "p2",
      "o": 13
    },
    "avq_s2_interior_q": {
      "es": "¿El interior ya está diseñado?",
      "en": "Is the interior already designed?",
      "grupo": "p2",
      "o": 14
    },
    "avq_s2_int_notice": {
      "es": "Resolver el interior es trabajo de diseño, no de visualización. Podemos hacerlo nosotros y se cotiza aparte, o trabajamos con el diseño que nos entregues.",
      "en": "Resolving the interior is design work, not visualization. We can do it and it's quoted separately, or we work with the design you hand us.",
      "grupo": "p2",
      "o": 15
    },
    "avq_s2_piece_q": {
      "es": "¿Es una pieza que ya existe o hay que modelarla desde cero?",
      "en": "Does the piece already exist, or does it need modelling from scratch?",
      "grupo": "p2",
      "o": 16
    },
    "q_views_hint": {
      "es": "Cada escena trae {n} vistas{plan}. Ajusta las que necesiten más.",
      "en": "Each scene comes with {n} views{plan}. Adjust the ones that need more.",
      "grupo": "p2",
      "o": 17
    },
    "q_images_total": {
      "es": "imágenes en total · {n} escenas",
      "en": "images in total · {n} scenes",
      "grupo": "p2",
      "o": 18
    },
    "avq_step3": {
      "es": "Qué nos entregas",
      "en": "What you send us",
      "grupo": "p3",
      "o": 19
    },
    "avq_s3_q": {
      "es": "¿Qué material tienes del proyecto?",
      "en": "What project material do you have?",
      "grupo": "p3",
      "o": 20
    },
    "avq_s3_none": {
      "es": "Sin material no podemos dar un rango. Esto pasa a una llamada de arranque, y ahí definimos qué hace falta para empezar.",
      "en": "Without material we can't give you a range. This moves to a kick-off call, where we define what's needed to start.",
      "grupo": "p3",
      "o": 21
    },
    "avq_s3_spec": {
      "es": "¿Tienes definidos los materiales y acabados?",
      "en": "Have you defined materials and finishes?",
      "grupo": "p3",
      "o": 22
    },
    "avq_step4": {
      "es": "Para qué son y con qué tono",
      "en": "What they're for and in what tone",
      "grupo": "p4",
      "o": 23
    },
    "avq_s4_use": {
      "es": "¿Para qué vas a usar las imágenes?",
      "en": "What will you use the images for?",
      "grupo": "p4",
      "o": 24
    },
    "avq_s4_use_h": {
      "es": "Define resolución, formato y qué piezas entregamos. Marca todo lo que aplique.",
      "en": "This sets resolution, format and which pieces we deliver. Tick everything that applies.",
      "grupo": "p4",
      "o": 25
    },
    "avq_s4_tone": {
      "es": "¿Qué tono buscas?",
      "en": "What tone are you after?",
      "grupo": "p4",
      "o": 26
    },
    "avq_s4_tone_h": {
      "es": "Tres proyectos nuestros. Señala el que se parece a lo que buscas.",
      "en": "Three of our projects. Point to the one closest to what you want.",
      "grupo": "p4",
      "o": 27
    },
    "Extras": {
      "es": "Extras",
      "en": "Extras",
      "grupo": "p5",
      "o": 28
    },
    "avq_s5_cross": {
      "es": "¿Vas a necesitar algo más alrededor del proyecto?",
      "en": "Will you need anything else around the project?",
      "grupo": "p5",
      "o": 29
    },
    "avq_step6": {
      "es": "Tú y tu proyecto",
      "en": "You and your project",
      "grupo": "p6",
      "o": 30
    },
    "avq_s6_company": {
      "es": "Empresa",
      "en": "Company",
      "grupo": "p6",
      "o": 31
    },
    "avq_s6_loc": {
      "es": "Ubicación del proyecto",
      "en": "Project location",
      "grupo": "p6",
      "o": 32
    },
    "avq_s6_loc_h": {
      "es": "Ciudad y país. Nos sirve para husos horarios y contexto, no para cobertura.",
      "en": "City and country. We use it for time zones and context, not for coverage.",
      "grupo": "p6",
      "o": 33
    },
    "avq_country": {
      "es": "País",
      "en": "Country",
      "grupo": "p6",
      "o": 34
    },
    "avq_s6_launch": {
      "es": "¿Tienes fecha de lanzamiento o de entrega?",
      "en": "Do you have a launch or delivery date?",
      "grupo": "p6",
      "o": 35
    },
    "avq_s6_portfolio": {
      "es": "¿Podemos publicar el proyecto?",
      "en": "May we publish the project?",
      "grupo": "p6",
      "o": 36
    },
    "qi_privacy_accept": {
      "es": "He leído y acepto la {link}",
      "en": "I have read and accept the {link}",
      "grupo": "p6",
      "o": 37
    },
    "qi_privacy_link": {
      "es": "política de privacidad",
      "en": "privacy policy",
      "grupo": "p6",
      "o": 38
    },
    "q_missing": {
      "es": "Falta responder esto",
      "en": "This one still needs an answer",
      "grupo": "p6",
      "o": 39
    },
    "qi_not_contract": {
      "es": "Esto no es un contrato ni una cotización. Es la información con la que preparamos tu propuesta.",
      "en": "This is not a contract or a quote. It's the information we use to prepare your proposal.",
      "grupo": "p6",
      "o": 40
    },
    "q_missing_one": {
      "es": "Falta 1 respuesta",
      "en": "1 answer to go",
      "grupo": "p6",
      "o": 41
    },
    "qi_your_plan": {
      "es": "Tu plan",
      "en": "Your plan",
      "grupo": "final",
      "o": 42
    },
    "qi_plan_reco": {
      "es": "Por lo que nos contaste, el plan que te sirve es <strong>{plan}</strong>. Te mandamos el estimado con esa base y lo ajustamos si prefieres otro.",
      "en": "From what you told us, the plan that fits is <strong>{plan}</strong>. We'll send the estimate on that basis and adjust it if you prefer another.",
      "grupo": "final",
      "o": 43
    },
    "avq_sum_role": {
      "es": "Quién escribe",
      "en": "Who's writing",
      "grupo": "final",
      "o": 44
    },
    "avq_sum_images": {
      "es": "Imágenes estimadas",
      "en": "Estimated images",
      "grupo": "final",
      "o": 45
    },
    "avq_sum_interior": {
      "es": "Diseño interior",
      "en": "Interior design",
      "grupo": "final",
      "o": 46
    },
    "avq_flag_interior": {
      "es": "Oportunidad de interior design: el interior no está resuelto.",
      "en": "Interior design opportunity: the interior isn't resolved.",
      "grupo": "final",
      "o": 47
    },
    "avq_sum_use": {
      "es": "Uso de las imágenes",
      "en": "Image use",
      "grupo": "final",
      "o": 48
    },
    "avq_sum_location": {
      "es": "Ubicación",
      "en": "Location",
      "grupo": "final",
      "o": 49
    },
    "avq_s3_sketch_t": {
      "es": "Súbenos lo que tengas",
      "en": "Upload whatever you have",
      "grupo": "p3",
      "o": 50
    },
    "avq_s3_link_ph": {
      "es": "Enlace de descarga (Drive, WeTransfer, Dropbox)",
      "en": "Download link (Drive, WeTransfer, Dropbox)",
      "grupo": "p3",
      "o": 51
    },
    "srv_email_bad": {
      "es": "Escríbelo completo, con arroba y dominio: nombre@correo.com",
      "en": "That doesn't look like an email address.",
      "grupo": "p1",
      "o": 52
    },
    "q_missing_many": {
      "es": "Faltan {n} respuestas",
      "en": "{n} answers to go",
      "grupo": "p6",
      "o": 53
    },
    "avq_s3_cad_t": {
      "es": "Súbenos plantas, alzados y secciones",
      "en": "Upload plans, elevations and sections",
      "grupo": "p3",
      "o": 54
    },
    "avq_link_added": {
      "es": "Enlace añadido",
      "en": "Link added",
      "grupo": "p3",
      "o": 55
    },
    "avq_s3_model_t": {
      "es": "Súbenos el modelo o pega el enlace de descarga",
      "en": "Upload the model or paste the download link",
      "grupo": "p3",
      "o": 56
    },
    "qi_didyoumean": {
      "es": "¿Quisiste decir <strong>{email}</strong>?",
      "en": "Did you mean <strong>{email}</strong>?",
      "grupo": "p1",
      "o": 57
    },
    "srv_fix": {
      "es": "Sí, corregir",
      "en": "Yes, fix it",
      "grupo": "p1",
      "o": 58
    },
    "q_views_plan": {
      "es": " con el plan {plan}",
      "en": " on the {plan} plan",
      "grupo": "p2",
      "o": 59
    },
    "qi_plan_picked": {
      "es": "Elegiste <strong>{plan}</strong>. Preparamos el estimado con esa base.",
      "en": "You chose <strong>{plan}</strong>. We prepare the estimate on that basis.",
      "grupo": "final",
      "o": 60
    },
    "Paso 01 de 06": {
      "es": "Paso 01 de 06",
      "en": "Step 01 of 06",
      "grupo": "cabecera",
      "o": 61
    },
    "Continuar": {
      "es": "Continuar",
      "en": "Continue",
      "grupo": "cabecera",
      "o": 62
    },
    "Guardado": {
      "es": "Guardado",
      "en": "Saved",
      "grupo": "p1",
      "o": 63
    },
    "tu@correo.com": {
      "es": "tu@correo.com",
      "en": "you@email.com",
      "grupo": "p1",
      "o": 64
    },
    "¿A dónde te guardamos el avance?": {
      "es": "¿A dónde te guardamos el avance?",
      "en": "Where should we save your progress?",
      "grupo": "p1",
      "o": 65
    },
    "Lo guardamos en este navegador para que puedas volver donde quedaste. Te lo pedimos también para poder contactarte.": {
      "es": "Lo guardamos en este navegador para que puedas volver donde quedaste. Te lo pedimos también para poder contactarte.",
      "en": "We save it in this browser so you can come back where you left off. We also ask for it so we can contact you.",
      "grupo": "p1",
      "o": 66
    },
    "Paso 02 de 06": {
      "es": "Paso 02 de 06",
      "en": "Step 02 of 06",
      "grupo": "p2",
      "o": 67
    },
    "Vistas por escena": {
      "es": "Vistas por escena",
      "en": "Views per scene",
      "grupo": "p2",
      "o": 68
    },
    "escena": {
      "es": "escena",
      "en": "scene",
      "grupo": "p2",
      "o": 69
    },
    "escenas": {
      "es": "escenas",
      "en": "scenes",
      "grupo": "p2",
      "o": 70
    },
    "Paso 03 de 06": {
      "es": "Paso 03 de 06",
      "en": "Step 03 of 06",
      "grupo": "p3",
      "o": 71
    },
    "Paso 04 de 06": {
      "es": "Paso 04 de 06",
      "en": "Step 04 of 06",
      "grupo": "p4",
      "o": 72
    },
    "Paso 05 de 06": {
      "es": "Paso 05 de 06",
      "en": "Step 05 of 06",
      "grupo": "p5",
      "o": 73
    },
    "Se cotizan aparte. Lo que no marques aquí queda fuera del proyecto.": {
      "es": "Se cotizan aparte. Lo que no marques aquí queda fuera del proyecto.",
      "en": "These are quoted separately. Whatever you don't tick here stays out of the project.",
      "grupo": "p5",
      "o": 74
    },
    "Paso 06 de 06": {
      "es": "Paso 06 de 06",
      "en": "Step 06 of 06",
      "grupo": "p6",
      "o": 75
    },
    "Nombre completo": {
      "es": "Nombre completo",
      "en": "Full name",
      "grupo": "p6",
      "o": 76
    },
    "Correo": {
      "es": "Correo",
      "en": "Email",
      "grupo": "p6",
      "o": 77
    },
    "Teléfono": {
      "es": "Teléfono",
      "en": "Phone",
      "grupo": "p6",
      "o": 78
    },
    "Tus datos": {
      "es": "Tus datos",
      "en": "Your details",
      "grupo": "p6",
      "o": 79
    },
    "Nombre legal de la empresa": {
      "es": "Nombre legal de la empresa",
      "en": "Company's legal name",
      "grupo": "p6",
      "o": 80
    },
    "Estado o país de registro": {
      "es": "Estado o país de registro",
      "en": "State or country of registration",
      "grupo": "p6",
      "o": 81
    },
    "Quién firma": {
      "es": "Quién firma",
      "en": "Who signs",
      "grupo": "p6",
      "o": 82
    },
    "Su cargo": {
      "es": "Su cargo",
      "en": "Their title",
      "grupo": "p6",
      "o": 83
    },
    "¿Firmas a título personal o como empresa?": {
      "es": "¿Firmas a título personal o como empresa?",
      "en": "Are you signing personally or as a company?",
      "grupo": "p6",
      "o": 84
    },
    "Ciudad": {
      "es": "Ciudad",
      "en": "City",
      "grupo": "p6",
      "o": 85
    },
    "Menos de cuatro semanas: lo confirmamos en una llamada.": {
      "es": "Menos de cuatro semanas: lo confirmamos en una llamada.",
      "en": "Less than four weeks away: we'll confirm it on a call.",
      "grupo": "p6",
      "o": 86
    },
    "Enviar mi proyecto": {
      "es": "Enviar mi proyecto",
      "en": "Send my project",
      "grupo": "p6",
      "o": 87
    },
    "Listo": {
      "es": "Listo",
      "en": "Done",
      "grupo": "final",
      "o": 88
    },
    "Recomendado": {
      "es": "Recomendado",
      "en": "Recommended",
      "grupo": "final",
      "o": 89
    },
    "Ninguno": {
      "es": "Ninguno",
      "en": "None",
      "grupo": "final",
      "o": 90
    },
    "Plan": {
      "es": "Plan",
      "en": "Plan",
      "grupo": "final",
      "o": 91
    },
    "Tipo de proyecto": {
      "es": "Tipo de proyecto",
      "en": "Project type",
      "grupo": "final",
      "o": 92
    },
    "Etapa": {
      "es": "Etapa",
      "en": "Stage",
      "grupo": "final",
      "o": 93
    },
    "Escenas": {
      "es": "Escenas",
      "en": "Scenes",
      "grupo": "final",
      "o": 94
    },
    "Contexto urbano": {
      "es": "Contexto urbano",
      "en": "Urban context",
      "grupo": "final",
      "o": 95
    },
    "Marcado": {
      "es": "Marcado",
      "en": "Flagged",
      "grupo": "final",
      "o": 96
    },
    "La pieza": {
      "es": "La pieza",
      "en": "The piece",
      "grupo": "final",
      "o": 97
    },
    "Material": {
      "es": "Material",
      "en": "Material",
      "grupo": "final",
      "o": 98
    },
    "Especificación": {
      "es": "Especificación",
      "en": "Specification",
      "grupo": "final",
      "o": 99
    },
    "Tono": {
      "es": "Tono",
      "en": "Tone",
      "grupo": "final",
      "o": 100
    },
    "Alrededor del proyecto": {
      "es": "Alrededor del proyecto",
      "en": "Around the project",
      "grupo": "final",
      "o": 101
    },
    "Lanzamiento": {
      "es": "Lanzamiento",
      "en": "Launch",
      "grupo": "final",
      "o": 102
    },
    "Portafolio": {
      "es": "Portafolio",
      "en": "Portfolio",
      "grupo": "final",
      "o": 103
    },
    "Elegir archivos": {
      "es": "Elegir archivos",
      "en": "Choose files",
      "grupo": "p3",
      "o": 104
    },
    "Modelos, planos, PDF o imágenes.": {
      "es": "Modelos, planos, PDF o imágenes.",
      "en": "Models, drawings, PDF or images.",
      "grupo": "p3",
      "o": 105
    },
    "Elegir": {
      "es": "Elegir",
      "en": "Choose",
      "grupo": "p3",
      "o": 106
    },
    "Los modelos 3D suelen ser grandes: si no cabe, pega un enlace de descarga.": {
      "es": "Los modelos 3D suelen ser grandes: si no cabe, pega un enlace de descarga.",
      "en": "3D models tend to be big: if it doesn't fit, paste a download link.",
      "grupo": "p3",
      "o": 107
    },
    "enlace": {
      "es": "enlace",
      "en": "link",
      "grupo": "final",
      "o": 108
    },
    "Te escribimos en persona en menos de 48 horas": {
      "es": "Te escribimos en persona en menos de 48 horas",
      "en": "A person from the studio writes to you within 48 hours",
      "grupo": "final",
      "o": 109
    }
  }
} as Config,
};
