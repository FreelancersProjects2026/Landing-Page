import type { LandingContentSource } from '../application/landingContent.ts'
import {
  validateLandingContent,
  type Contact,
  type ExternalLink,
} from '../domain/landingContent.ts'
import { validateSiteUrl } from '../domain/siteUrl.ts'

// Textos copiados literalmente de docs/specs/003-generarContenido/contenido.md (aprobado).

const company: Contact = {
  name: 'solutionsPJM',
  location: 'Paraíso de Cartago, Costa Rica',
  address: { locality: 'Paraíso', region: 'Cartago', country: 'CR' },
  areaServed: 'Costa Rica',
  phone: '+506 6440-0832',
}

// Origen canónico del sitio (spec 004): sin www; www.solutionspjm.com redirige aquí con 308.
export const siteUrl = validateSiteUrl('https://solutionspjm.com')

const linkedIn = (url: string): ExternalLink => ({ label: 'LinkedIn', url })
const gitHub = (url: string): ExternalLink => ({ label: 'GitHub', url })

const team = {
  patrick: {
    name: 'Patrick Jackson Gómez',
    links: [
      linkedIn('https://www.linkedin.com/in/patrickjacksongomez/'),
      gitHub('https://github.com/Jackson11p'),
    ],
  },
  jason: {
    name: 'Jason Moya Brenes',
    links: [
      linkedIn('https://www.linkedin.com/in/jason-moya-brns/'),
      gitHub('https://github.com/jasonmoyaB'),
    ],
  },
  michael: {
    name: 'Michael Brenes Chaves',
    links: [linkedIn('https://www.linkedin.com/in/michaelbreneschaves/')],
  },
}

const projectNames = {
  agro: 'Agromonitoreo',
  tourism: 'Sistema Centralizado para el Control y Manejo de Turismo',
  payments: 'Seguimiento de Cuentas mediante Lectura de Correos Electrónicos',
}

const rights = '© 2026 solutionsPJM'

const es = validateLandingContent({
  locale: 'es',
  company,
  seo: {
    title: 'Desarrollo de software a medida Costa Rica | solutionsPJM',
    description:
      'Desarrollo de software a medida en Costa Rica. Creamos sistemas de gestión, control y métricas para tu negocio. Escríbenos por WhatsApp y cotiza tu proyecto.',
  },
  whatsappMessage:
    'Hola solutionsPJM, quiero cotizar un software a la medida para mi negocio.',
  menu: {
    services: 'Servicios',
    process: 'Cómo trabajamos',
    projects: 'Proyectos',
    team: 'Equipo',
    contact: 'Contacto',
    toggleLabel: 'Menú',
  },
  hero: {
    heading: 'Desarrollo de software a medida en Costa Rica',
    slogan: 'Software que comienza por entender tu negocio',
    sloganWords: ['negocio', 'empresa', 'operación', 'proceso', 'idea'],
    subtitle:
      'Desarrollamos software a medida para negocios en Costa Rica: sistemas de gestión, control y métricas hechos para tu operación real.',
    cta: 'Cotiza por WhatsApp',
  },
  services: {
    title: 'Aplicaciones web a medida para tu operación',
    intro:
      'Si buscas crear software a la medida, hacer un sistema para tu negocio o desarrollar una aplicación web, construimos la herramienta que tu operación necesita.',
    items: [
      {
        title: 'Sistemas de gestión empresarial',
        description:
          'Centraliza la información de tu negocio en un solo lugar, con software administrativo pensado para pymes.',
      },
      {
        title: 'Control de personal y producción',
        description: 'Registra qué hizo cada trabajador, cuándo y cuánto.',
      },
      {
        title: 'Control de cuentas y cobros',
        description:
          'Lleva tus cuentas, viajes, pedidos y cobros sin hojas sueltas.',
      },
      {
        title: 'Historial y métricas del negocio',
        description:
          'Consulta tu historial y toma decisiones con datos reales.',
      },
    ],
  },
  process: {
    title: 'Primero entendemos tu negocio, después programamos',
    steps: [
      {
        title: 'Entender',
        description:
          'Conversamos contigo para conocer tu operación, tus procesos y tus problemas.',
      },
      {
        title: 'Diseñar',
        description:
          'Convertimos lo que aprendimos en un modelo claro del sistema que necesitas.',
      },
      {
        title: 'Construir',
        description:
          'Desarrollamos tu software con avances que puedes revisar.',
      },
      {
        title: 'Acompañar',
        description:
          'Entregamos el sistema funcionando y te acompañamos en su puesta en marcha.',
      },
    ],
    differentiatorsTitle: 'Diferenciadores',
    differentiators: [
      'Trato directo con quienes construyen tu software, sin intermediarios.',
      'Software hecho para tu operación real, no plantillas genéricas.',
    ],
  },
  projects: {
    title: 'Proyectos que ya resuelven problemas reales',
    items: [
      {
        name: projectNames.agro,
        description:
          'Software agrícola que centraliza las métricas de los agricultores: control de cosechas con su historial, tramos trabajados y registro de producción por trabajador mediante plantillas.',
      },
      {
        name: projectNames.tourism,
        description:
          'Software para empresas de turismo que reúne el control de transporte privado en un solo sistema: gestión de viajes, cuentas y cobros.',
      },
      {
        name: projectNames.payments,
        description:
          'Plataforma que registra automáticamente cada pago recibido: lee únicamente los correos de los bancos autorizados y los presenta en un dashboard claro y siempre actualizado.',
      },
    ],
  },
  team: {
    title: 'Tres desarrolladores, un mismo equipo',
    intro:
      'Somos una empresa de desarrollo de software de Paraíso de Cartago. Hablas directamente con las personas que construyen tu sistema.',
    members: [
      {
        ...team.patrick,
        role: 'Desarrollador full-stack y análisis de datos. Es el enlace con los clientes: entiende tu negocio y lo traduce en tareas para el equipo.',
      },
      {
        ...team.jason,
        role: 'Desarrollador full-stack, enfocado en inteligencia artificial, agentes y modelos de lenguaje (LLM).',
      },
      { ...team.michael, role: 'Desarrollador full-stack.' },
    ],
  },
  contact: {
    title: '¿Listo para crear software a la medida?',
    text: 'Cuéntanos qué problema quieres resolver y cotiza tu proyecto sin compromiso.',
    cta: 'Escríbenos por WhatsApp',
  },
  footer: {
    text: 'solutionsPJM — desarrollo de software en Cartago para negocios de todo Costa Rica.',
    rights,
  },
})

const en = validateLandingContent({
  locale: 'en',
  company,
  seo: {
    title: 'Custom Software Development Costa Rica | solutionsPJM',
    description:
      'Custom software development in Costa Rica. We build management, tracking and metrics systems for your business. Message us on WhatsApp for a quote.',
  },
  whatsappMessage:
    "Hi solutionsPJM, I'd like a quote for custom software for my business.",
  menu: {
    services: 'Services',
    process: 'How we work',
    projects: 'Projects',
    team: 'Team',
    contact: 'Contact',
    toggleLabel: 'Menu',
  },
  hero: {
    heading: 'Custom software development in Costa Rica',
    slogan: 'Software that starts by understanding your business',
    sloganWords: ['business', 'company', 'operation', 'process', 'idea'],
    subtitle:
      'We build custom software for businesses in Costa Rica: management, tracking and metrics systems made for how you actually operate.',
    cta: 'Get a quote on WhatsApp',
  },
  services: {
    title: 'Custom web applications for your operation',
    intro:
      'Whether you want to build custom software, need custom software for your business or a web application, we build the tool your operation needs.',
    items: [
      {
        title: 'Business management software',
        description:
          'Bring your business information together in one place, with small business software designed around you.',
      },
      {
        title: 'Employee and production tracking',
        description: 'Record what each worker did, when and how much.',
      },
      {
        title: 'Billing and accounts management',
        description:
          'Keep track of accounts, trips, orders and payments without scattered spreadsheets.',
      },
      {
        title: 'History and business metrics',
        description: 'Check your history and make decisions with real data.',
      },
    ],
  },
  process: {
    title: 'We understand your business first, then we code',
    steps: [
      {
        title: 'Understand',
        description:
          'We talk with you to learn your operation, processes and problems.',
      },
      {
        title: 'Design',
        description:
          'We turn what we learned into a clear model of the system you need.',
      },
      {
        title: 'Build',
        description: 'We develop your software with progress you can review.',
      },
      {
        title: 'Support',
        description:
          'We deliver a working system and support you while you put it into use.',
      },
    ],
    differentiatorsTitle: 'What sets us apart',
    differentiators: [
      'Direct contact with the people who build your software, no middlemen.',
      'Software made for your real operation, not generic templates.',
    ],
  },
  projects: {
    title: 'Projects already solving real problems',
    items: [
      {
        name: projectNames.agro,
        description:
          "Agricultural software that centralizes farmers' metrics: harvest tracking with full history, worked sections and production records per worker using templates.",
      },
      {
        name: projectNames.tourism,
        nameTranslation: 'Centralized Tourism Control and Management System',
        description:
          'Tourism management software that brings private transport into one system — a private transport management system for trips, accounts and payments.',
      },
      {
        name: projectNames.payments,
        nameTranslation: 'Account Tracking through Email Reading',
        description:
          'A platform that automatically records every payment received: it reads only emails from authorized bank senders and presents them in a clear, always up-to-date dashboard.',
      },
    ],
  },
  team: {
    title: 'Three developers, one team',
    intro:
      'We are a software development company based in Paraíso de Cartago. You talk directly with the people who build your system. Looking to hire software developers in Costa Rica? Meet us.',
    members: [
      {
        ...team.patrick,
        role: "Full-stack developer and data analyst. The team's link with clients: understands your business and turns it into tasks for the team.",
      },
      {
        ...team.jason,
        role: 'Full-stack developer focused on artificial intelligence, agents and large language models (LLMs).',
      },
      { ...team.michael, role: 'Full-stack developer.' },
    ],
  },
  contact: {
    title: 'Ready to build custom software?',
    text: 'Tell us what problem you want to solve and get a custom software quote, no strings attached.',
    cta: 'Message us on WhatsApp',
  },
  footer: {
    text: 'solutionsPJM — software development in Cartago for businesses across Costa Rica.',
    rights,
  },
})

export const landingContentSource: LandingContentSource = { es, en }
