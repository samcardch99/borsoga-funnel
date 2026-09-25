// Los dos cuestionarios tal como salieron del código (borsoga-studio,
// src/plans/forms/*.json). Solo se usan una vez: la primera vez que se piden y
// la base de datos no tiene ninguna versión, se guardan como versión 1.
import type { Esquema } from "./_esquema.js";

export const SEMILLAS: Record<string, Esquema> = {
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
};
