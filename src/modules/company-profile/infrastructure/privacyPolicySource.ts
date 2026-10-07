import type { PrivacyPolicySource } from '../application/privacyPolicy.ts'
import { validatePrivacyPolicy } from '../domain/privacyPolicy.ts'

// Textos copiados literalmente de docs/specs/007-privacidad/contenido.md (borrador, aprobación en T11).

const es = validatePrivacyPolicy({
  locale: 'es',
  seo: {
    title: 'Política de privacidad | solutionsPJM',
    description:
      'Qué datos personales trata solutionsPJM cuando nos contactas por WhatsApp o correo, para qué los usamos y cómo ejercer tus derechos.',
  },
  footerLink: 'Privacidad',
  title: 'Política de privacidad',
  updated: 'Última actualización: 7 de octubre de 2026',
  intro:
    'Esta política explica qué datos personales tratamos cuando visitas este sitio o nos contactas, para qué los usamos y cómo puedes ejercer tus derechos. Se rige por la Ley 8968 de Costa Rica y, para visitantes de la Unión Europea, por el Reglamento General de Protección de Datos (RGPD).',
  sections: [
    {
      heading: '1. Responsable',
      paragraphs: [
        'El responsable del tratamiento es Jason Moya Brenes, cédula 3-0549-0443, bajo el nombre comercial solutionsPJM, con domicilio en Paraíso de Cartago, Costa Rica. Contacto: solutionspjm@gmail.com.',
      ],
    },
    {
      heading: '2. Qué datos tratamos',
      items: [
        'Los que nos envías al escribirnos por WhatsApp o correo: nombre, teléfono, correo y el contenido de tu mensaje.',
        'Métricas de visitas anónimas y agregadas (páginas vistas, país y tipo de dispositivo), mediante Vercel Analytics, que no usa cookies ni te identifica.',
        'Datos técnicos de cada visita (dirección IP y navegador), que registra nuestro proveedor de alojamiento por seguridad y funcionamiento.',
      ],
      paragraphs: ['Este sitio no tiene formularios ni cuentas de usuario.'],
    },
    {
      heading: '3. Para qué los usamos',
      paragraphs: [
        'Para responder tus consultas, preparar cotizaciones y dar seguimiento a los proyectos que acordemos, y para mejorar el sitio con estadísticas agregadas. No vendemos tus datos ni los usamos para publicidad.',
      ],
    },
    {
      heading: '4. Base del tratamiento',
      paragraphs: [
        'Tu consentimiento, que das al escribirnos, y, si nos contratas, la ejecución del acuerdo. Puedes retirar tu consentimiento en cualquier momento.',
      ],
    },
    {
      heading: '5. Terceros y transferencias internacionales',
      paragraphs: [
        'Usamos servicios que pueden tratar datos fuera de Costa Rica: WhatsApp (Meta), Gmail (Google) y Vercel (alojamiento y analítica). Cada uno trata los datos según su propia política de privacidad.',
      ],
    },
    {
      heading: '6. Cuánto tiempo los conservamos',
      paragraphs: [
        'Las conversaciones y correos de quienes no nos contratan se conservan 12 meses desde el último contacto y después se eliminan. Si nos contratas, los conservamos mientras dure la relación y el tiempo que exijan las obligaciones legales y fiscales.',
      ],
    },
    {
      heading: '7. Tus derechos',
      paragraphs: [
        'Puedes pedir acceso, rectificación, supresión u oposición al tratamiento de tus datos y, bajo el RGPD, también su limitación y portabilidad, escribiendo a solutionspjm@gmail.com. Respondemos en un máximo de 5 días hábiles. Si consideras que no atendimos tu solicitud, puedes acudir a la Agencia de Protección de Datos de los Habitantes (PRODHAB) o, en la Unión Europea, a la autoridad de protección de datos de tu país.',
      ],
    },
    {
      heading: '8. Cookies',
      paragraphs: [
        'Este sitio no usa cookies de seguimiento ni de publicidad.',
      ],
    },
    {
      heading: '9. Cambios',
      paragraphs: [
        'Podemos actualizar esta política. Publicaremos aquí la versión vigente con su fecha.',
      ],
    },
  ],
})

const en = validatePrivacyPolicy({
  locale: 'en',
  seo: {
    title: 'Privacy Policy | solutionsPJM',
    description:
      'What personal data solutionsPJM processes when you contact us by WhatsApp or email, why we use it and how to exercise your rights.',
  },
  footerLink: 'Privacy',
  title: 'Privacy Policy',
  updated: 'Last updated: October 7, 2026',
  intro:
    "This policy explains what personal data we process when you visit this site or contact us, why we use it and how you can exercise your rights. It is governed by Costa Rica's Law 8968 and, for visitors from the European Union, by the General Data Protection Regulation (GDPR).",
  sections: [
    {
      heading: '1. Data controller',
      paragraphs: [
        'The data controller is Jason Moya Brenes, ID 3-0549-0443, trading as solutionsPJM, based in Paraíso de Cartago, Costa Rica. Contact: solutionspjm@gmail.com.',
      ],
    },
    {
      heading: '2. What data we process',
      items: [
        'What you send us when you write to us by WhatsApp or email: name, phone number, email address and the content of your message.',
        'Anonymous, aggregated visit metrics (page views, country and device type) through Vercel Analytics, which uses no cookies and does not identify you.',
        'Technical data from each visit (IP address and browser), logged by our hosting provider for security and operation.',
      ],
      paragraphs: ['This site has no forms or user accounts.'],
    },
    {
      heading: '3. Why we use it',
      paragraphs: [
        'To answer your questions, prepare quotes and follow up on the projects we agree on, and to improve the site with aggregated statistics. We do not sell your data or use it for advertising.',
      ],
    },
    {
      heading: '4. Legal basis',
      paragraphs: [
        'Your consent, which you give by writing to us, and, if you hire us, the performance of our agreement. You can withdraw your consent at any time.',
      ],
    },
    {
      heading: '5. Third parties and international transfers',
      paragraphs: [
        'We use services that may process data outside Costa Rica: WhatsApp (Meta), Gmail (Google) and Vercel (hosting and analytics). Each one processes data under its own privacy policy.',
      ],
    },
    {
      heading: '6. How long we keep it',
      paragraphs: [
        'Conversations and emails from people who do not hire us are kept for 12 months from the last contact and then deleted. If you hire us, we keep your data for as long as the relationship lasts and for as long as legal and tax obligations require.',
      ],
    },
    {
      heading: '7. Your rights',
      paragraphs: [
        "You can request access, rectification, erasure or objection to the processing of your data and, under the GDPR, also restriction and portability, by writing to solutionspjm@gmail.com. We reply within 5 business days at most. If you believe we did not handle your request, you can contact Costa Rica's Data Protection Agency (PRODHAB) or, in the European Union, the data protection authority of your country.",
      ],
    },
    {
      heading: '8. Cookies',
      paragraphs: ['This site does not use tracking or advertising cookies.'],
    },
    {
      heading: '9. Changes',
      paragraphs: [
        'We may update this policy. The current version and its date will always be published here.',
      ],
    },
  ],
})

export const privacyPolicySource: PrivacyPolicySource = { es, en }
