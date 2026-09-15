export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type LegalDoc = {
  title: string;
  updated: string;
  sections: LegalSection[];
};

export const LEGAL_UPDATED = "2026-09-14";

export const legalNotice: Record<"fr" | "en", LegalDoc> = {
  fr: {
    title: "Mentions légales",
    updated: LEGAL_UPDATED,
    sections: [
      {
        heading: "Éditeur du site",
        paragraphs: [
          "Le présent site est édité à titre personnel et non professionnel par Ismail LYAMANI, étudiant.",
          "Contact : ismaillyamani4@gmail.com",
          "Conformément à l'article 6 III-2 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique, l'éditeur, personne physique éditant le site à titre non professionnel, a communiqué ses coordonnées complètes à l'hébergeur et peut en préserver l'anonymat auprès du public.",
        ],
      },
      {
        heading: "Directeur de la publication",
        paragraphs: ["Ismail LYAMANI"],
      },
      {
        heading: "Hébergement",
        paragraphs: [
          "Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis — vercel.com.",
          "Les données du site sont stockées par Neon Inc. sur une infrastructure située dans l'Union européenne (Francfort, Allemagne).",
        ],
      },
      {
        heading: "Propriété intellectuelle",
        paragraphs: [
          "L'ensemble des contenus présents sur ce site — textes, code, mise en page, photographies — sauf mention contraire, est la propriété d'Ismail LYAMANI.",
          "Toute reproduction, représentation ou diffusion, totale ou partielle, sans autorisation écrite préalable, est interdite.",
          "Les noms et logos de tiers cités (établissements, entreprises, technologies) demeurent la propriété de leurs détenteurs respectifs et sont mentionnés à titre informatif.",
        ],
      },
      {
        heading: "Responsabilité",
        paragraphs: [
          "Les informations publiées sur ce site le sont à titre informatif. L'éditeur s'efforce d'en assurer l'exactitude et la mise à jour, sans pouvoir le garantir.",
          "Ce site peut contenir des liens vers des sites tiers. L'éditeur n'exerce aucun contrôle sur leur contenu et décline toute responsabilité à leur égard.",
        ],
      },
      {
        heading: "Données personnelles",
        paragraphs: [
          "Le traitement des données transmises via le formulaire de contact est décrit dans la politique de confidentialité.",
        ],
      },
    ],
  },
  en: {
    title: "Legal notice",
    updated: LEGAL_UPDATED,
    sections: [
      {
        heading: "Site publisher",
        paragraphs: [
          "This site is published in a personal, non-professional capacity by Ismail LYAMANI, student.",
          "Contact: ismaillyamani4@gmail.com",
          "Under Article 6 III-2 of French Law No. 2004-575 of 21 June 2004 on confidence in the digital economy, a natural person publishing a site in a non-professional capacity has provided full contact details to the host and may withhold them from public display.",
        ],
      },
      {
        heading: "Publication director",
        paragraphs: ["Ismail LYAMANI"],
      },
      {
        heading: "Hosting",
        paragraphs: [
          "This site is hosted by Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, United States — vercel.com.",
          "Site data is stored by Neon Inc. on infrastructure located in the European Union (Frankfurt, Germany).",
        ],
      },
      {
        heading: "Intellectual property",
        paragraphs: [
          "All content on this site — text, code, layout, photographs — is the property of Ismail LYAMANI unless stated otherwise.",
          "Any reproduction, representation or distribution, in whole or in part, without prior written permission is prohibited.",
          "Third-party names and logos referenced (institutions, companies, technologies) remain the property of their respective owners and are mentioned for informational purposes.",
        ],
      },
      {
        heading: "Liability",
        paragraphs: [
          "Information published on this site is provided for informational purposes. The publisher makes every effort to keep it accurate and current but cannot guarantee it.",
          "This site may link to third-party sites. The publisher exercises no control over their content and accepts no responsibility for it.",
        ],
      },
      {
        heading: "Personal data",
        paragraphs: [
          "Processing of data submitted through the contact form is described in the privacy policy.",
        ],
      },
    ],
  },
};

export const privacyPolicy: Record<"fr" | "en", LegalDoc> = {
  fr: {
    title: "Politique de confidentialité",
    updated: LEGAL_UPDATED,
    sections: [
      {
        heading: "Responsable du traitement",
        paragraphs: [
          "Ismail LYAMANI — ismaillyamani4@gmail.com",
          "Cette politique décrit le traitement des données personnelles effectué sur ce site, conformément au Règlement (UE) 2016/679 (RGPD) et à la loi Informatique et Libertés.",
        ],
      },
      {
        heading: "Données collectées",
        paragraphs: [
          "Ce site ne collecte aucune donnée à votre insu. Les seules données personnelles traitées sont celles que vous saisissez volontairement dans le formulaire de contact :",
        ],
        bullets: [
          "votre nom",
          "votre adresse e-mail",
          "le sujet (facultatif) et le contenu de votre message",
          "la langue d'affichage du site et la date d'envoi",
        ],
      },
      {
        heading: "Finalité et base légale",
        paragraphs: [
          "Ces données sont utilisées dans un seul but : lire votre message et y répondre.",
          "La base légale est votre consentement, donné par l'envoi volontaire du formulaire (article 6.1.a du RGPD).",
          "Aucune donnée n'est utilisée à des fins de prospection, de profilage ou de publicité, et aucune donnée n'est vendue ni cédée à des tiers.",
        ],
      },
      {
        heading: "Destinataires",
        paragraphs: [
          "Vos messages sont lus uniquement par Ismail LYAMANI. Les prestataires techniques suivants interviennent dans leur acheminement et leur conservation :",
        ],
        bullets: [
          "Vercel Inc. — hébergement du site",
          "Neon Inc. — hébergement de la base de données (Union européenne, Francfort)",
          "Google Ireland Limited (Gmail) — acheminement et conservation de la notification par e-mail",
          "Cloudflare, Inc. (Turnstile) — vérification anti-robot du formulaire, qui traite votre adresse IP et des signaux techniques de navigateur le temps de la vérification",
        ],
      },
      {
        heading: "Durée de conservation",
        paragraphs: [
          "Les messages sont conservés trois ans à compter du dernier échange, puis supprimés.",
          "Vous pouvez demander leur suppression à tout moment.",
        ],
      },
      {
        heading: "Cookies",
        paragraphs: [
          "Ce site n'utilise aucun cookie de mesure d'audience, de publicité ou de suivi.",
          "Un unique cookie technique (NEXT_LOCALE) peut être enregistré pour mémoriser votre choix de langue. Strictement nécessaire au fonctionnement du site, il est dispensé de consentement et ne permet pas de vous identifier.",
        ],
      },
      {
        heading: "Vos droits",
        paragraphs: [
          "Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation et d'opposition au traitement, ainsi que d'un droit à la portabilité de vos données.",
          "Pour les exercer, écrivez à ismaillyamani4@gmail.com. Une réponse vous sera apportée dans un délai d'un mois.",
          "Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la CNIL (www.cnil.fr).",
        ],
      },
      {
        heading: "Sécurité",
        paragraphs: [
          "Les échanges avec ce site sont chiffrés (HTTPS) et l'accès à la base de données est restreint à l'éditeur du site.",
        ],
      },
    ],
  },
  en: {
    title: "Privacy policy",
    updated: LEGAL_UPDATED,
    sections: [
      {
        heading: "Data controller",
        paragraphs: [
          "Ismail LYAMANI — ismaillyamani4@gmail.com",
          "This policy describes how personal data is processed on this site, in accordance with Regulation (EU) 2016/679 (GDPR) and French data protection law.",
        ],
      },
      {
        heading: "Data collected",
        paragraphs: [
          "This site collects nothing without your knowledge. The only personal data processed is what you voluntarily enter into the contact form:",
        ],
        bullets: [
          "your name",
          "your email address",
          "the subject (optional) and the content of your message",
          "the site display language and the date sent",
        ],
      },
      {
        heading: "Purpose and legal basis",
        paragraphs: [
          "This data is used for one purpose only: to read your message and reply to it.",
          "The legal basis is your consent, given by voluntarily submitting the form (GDPR Article 6(1)(a)).",
          "No data is used for marketing, profiling or advertising, and no data is sold or transferred to third parties.",
        ],
      },
      {
        heading: "Recipients",
        paragraphs: [
          "Your messages are read only by Ismail LYAMANI. The following technical providers are involved in delivering and storing them:",
        ],
        bullets: [
          "Vercel Inc. — site hosting",
          "Neon Inc. — database hosting (European Union, Frankfurt)",
          "Google Ireland Limited (Gmail) — email notification delivery and storage",
          "Cloudflare, Inc. (Turnstile) — anti-bot verification of the form, which processes your IP address and technical browser signals for the duration of the check",
        ],
      },
      {
        heading: "Retention",
        paragraphs: [
          "Messages are kept for three years from the last exchange, then deleted.",
          "You may request deletion at any time.",
        ],
      },
      {
        heading: "Cookies",
        paragraphs: [
          "This site uses no analytics, advertising or tracking cookies.",
          "A single technical cookie (NEXT_LOCALE) may be stored to remember your language choice. Strictly necessary for the site to work, it is exempt from consent requirements and cannot identify you.",
        ],
      },
      {
        heading: "Your rights",
        paragraphs: [
          "You have the right to access, rectify, erase, restrict and object to the processing of your data, as well as the right to data portability.",
          "To exercise these rights, write to ismaillyamani4@gmail.com. You will receive a reply within one month.",
          "If you believe your rights are not being respected, you may lodge a complaint with the CNIL (www.cnil.fr).",
        ],
      },
      {
        heading: "Security",
        paragraphs: [
          "Traffic to this site is encrypted (HTTPS) and database access is restricted to the site publisher.",
        ],
      },
    ],
  },
};
