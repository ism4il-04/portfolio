import type { Localized, LocalizedList } from "../lib/schema";

export const profileData = {
  name: "Ismail LYAMANI",
  title: {
    fr: "Étudiant en Master 2 DOSI",
    en: "Master 2 DOSI Student",
  } satisfies Localized,
  availability: {
    fr: "À la recherche d'un stage à partir de début avril 2027",
    en: "Looking for an internship starting early April 2027",
  } satisfies Localized,
  tagline: {
    fr: "Développeur full-stack passionné, avec un intérêt grandissant pour le DevOps",
    en: "Full-stack developer with a growing interest in DevOps",
  } satisfies Localized,
  location: "Brest, France",
  email: "ismaillyamani4@gmail.com",
  phone: "+33 7 46 00 76 82",
  githubUrl: "https://github.com/ism4il-04",
  aboutSummary: {
    fr: [
      "Actuellement en Master 2 Développement Logiciel des Systèmes d'Information (DOSI) à l'Université de Bretagne Occidentale (UBO), dans le cadre de mon cursus d'ingénieur en Génie Informatique à l'ENSATE, je me concentre sur la création de solutions logicielles robustes et évolutives.",
      "Je m'intéresse particulièrement au développement full-stack, avec une attirance croissante pour les pratiques DevOps (CI/CD, conteneurisation, orchestration).",
      "Passionné par l'apprentissage continu et l'innovation technologique, je m'efforce de combiner excellence technique et rigueur professionnelle dans chaque projet.",
    ],
    en: [
      "Currently completing a Master's degree in Software Engineering for Information Systems (DOSI) at Université de Bretagne Occidentale (UBO), as part of my engineering program in Computer Science at ENSATE, I focus on building robust, scalable software solutions.",
      "I'm particularly interested in full-stack development, with a growing interest in DevOps practices (CI/CD, containerization, orchestration).",
      "Driven by continuous learning and technological innovation, I strive to combine technical excellence with professional rigor in every project.",
    ],
  } satisfies LocalizedList,
  avatarUrl: null,
  resumeUrlFr: null,
  resumeUrlEn: null,
};

export const skillsData: { name: string; category: string }[] = [
  { name: "C", category: "languages" },
  { name: "Java", category: "languages" },
  { name: "C#", category: "languages" },
  { name: ".NET", category: "languages" },
  { name: "JavaScript", category: "languages" },
  { name: "TypeScript", category: "languages" },
  { name: "HTML/CSS", category: "languages" },
  { name: "PHP", category: "languages" },
  { name: "Python", category: "languages" },
  { name: "React", category: "frameworks" },
  { name: "Angular", category: "frameworks" },
  { name: "Spring Boot", category: "frameworks" },
  { name: "Laravel", category: "frameworks" },
  { name: "Bootstrap", category: "frameworks" },
  { name: "MySQL", category: "databases" },
  { name: "PostgreSQL", category: "databases" },
  { name: "Oracle", category: "databases" },
  { name: "SQL Server", category: "databases" },
  { name: "Git", category: "tools" },
  { name: "GitHub", category: "tools" },
  { name: "Docker", category: "tools" },
  { name: "Kubernetes", category: "tools" },
  { name: "Claude Code", category: "tools" },
  { name: "LaTeX", category: "tools" },
];

export const educationData: {
  degree: Localized;
  field: Localized;
  institution: string;
  location: string;
  period: Localized;
  achievements: Localized[];
}[] = [
  {
    degree: { fr: "Master 2 — DOSI", en: "Master's — DOSI" },
    field: {
      fr: "Développement Logiciel des Systèmes d'Information",
      en: "Software Development for Information Systems",
    },
    institution: "Université de Bretagne Occidentale (UBO)",
    location: "Brest, France",
    period: { fr: "2026 - présent", en: "2026 - present" },
    achievements: [],
  },
  {
    degree: { fr: "Diplôme d'Ingénieur", en: "Engineering Degree" },
    field: { fr: "Génie Informatique", en: "Computer Engineering" },
    institution:
      "École Nationale des Sciences Appliquées de Tétouan (ENSATE)",
    location: "Tétouan, Maroc",
    period: { fr: "2024 - présent", en: "2024 - present" },
    achievements: [
      {
        fr: "Stage d'initiation dans une entreprise multinationale",
        en: "Introductory internship at a multinational company",
      },
      {
        fr: "Membre actif de plusieurs clubs",
        en: "Active member of several clubs",
      },
      {
        fr: "Réalisation de plusieurs projets",
        en: "Completed several projects",
      },
    ],
  },
  {
    degree: { fr: "Classes Préparatoires", en: "Preparatory Classes" },
    field: { fr: "Ingénierie", en: "Engineering" },
    institution: "École Nationale des Sciences Appliquées",
    location: "Tétouan, Maroc",
    period: { fr: "2022 - 2024", en: "2022 - 2024" },
    achievements: [],
  },
  {
    degree: { fr: "Baccalauréat", en: "Baccalaureate" },
    field: {
      fr: "Sciences Physiques et Chimie — Mention très bien",
      en: "Physics and Chemistry — Highest Honors",
    },
    institution: "Lycée Qualifiant Abdelmalek Essaadi",
    location: "Kénitra, Maroc",
    period: { fr: "2022", en: "2022" },
    achievements: [],
  },
];

export const experienceData: {
  position: Localized;
  company: string;
  location: string;
  period: Localized;
  duration: Localized;
  type: string;
  description: Localized;
  responsibilities: LocalizedList;
  technologies: string[];
}[] = [
  {
    position: {
      fr: "Stagiaire QA — Automatisation des tests (PFA)",
      en: "QA Intern — Test Automation (PFA)",
    },
    company: "PortNet S.A.",
    location: "Casablanca, Maroc",
    period: { fr: "Juillet - Août 2026", en: "July - August 2026" },
    duration: { fr: "2 mois", en: "2 months" },
    type: "internship",
    description: {
      fr: "Automatisation des tests fonctionnels pour l'équipe QA de PortNet S.A., auparavant validés manuellement, ce qui ralentissait les cycles de livraison.",
      en: "Automated functional testing for PortNet S.A.'s QA team, which had been validating test cases manually, slowing down delivery cycles.",
    },
    responsibilities: {
      fr: [
        "Conception et développement d'une suite de tests automatisés avec Playwright couvrant les scénarios fonctionnels clés",
        "Intégration d'un pipeline de génération automatique de rapports (résultats, statistiques, anomalies)",
        "Réduction du temps de test de régression de 70%",
        "Augmentation de la couverture des tests à plus de 85% des cas critiques",
        "Réduction de 50% des anomalies détectées tardivement en production",
      ],
      en: [
        "Designed and built an automated test suite with Playwright covering key functional scenarios",
        "Integrated an automatic report-generation pipeline (results, statistics, anomalies)",
        "Cut regression testing time by 70%",
        "Raised test coverage to over 85% of critical cases",
        "Reduced anomalies detected late in production by 50%",
      ],
    },
    technologies: ["Playwright", "Git", "GitHub"],
  },
  {
    position: { fr: "Stagiaire Développeur", en: "Developer Intern" },
    company: "Cegedim Maroc",
    location: "Rabat, Maroc",
    period: { fr: "Été 2025", en: "Summer 2025" },
    duration: { fr: "1 mois", en: "1 month" },
    type: "internship",
    description: {
      fr: "Stage d'initiation dans une entreprise multinationale spécialisée dans les solutions de santé et technologies.",
      en: "Introductory internship at a multinational company specializing in healthcare solutions and technology.",
    },
    responsibilities: {
      fr: [
        "Développement et amélioration d'une application desktop pour le calcul de charge jours-hommes",
        "Implémentation de fonctionnalités de filtrage et d'analyse de données d'entreprise",
        "Traitement et manipulation de données avec Pandas",
        "Développement d'interfaces graphiques avec PyQt5",
        "Gestion de versions avec Git et suivi de tâches avec Jira",
      ],
      en: [
        "Developed and improved a desktop application for man-day workload calculation",
        "Implemented filtering and analysis features for enterprise data",
        "Processed and manipulated data with Pandas",
        "Built graphical interfaces with PyQt5",
        "Managed version control with Git and task tracking with Jira",
      ],
    },
    technologies: ["Python", "Pandas", "PyQt5", "Git", "Jira"],
  },
];

export const projectsData: {
  title: string;
  slug: string;
  technologies: string[];
  featured: boolean;
  description: Localized;
  demoUrl: string | null;
  repoUrl: string | null;
}[] = [
  {
    title: "Spawnta – Spontaneous Meetups & Travel App",
    slug: "spawnta",
    technologies: ["Java", "Spring Boot", "Kafka", "Docker", "GitHub Actions"],
    featured: true,
    description: {
      fr: "Application temps réel basée sur une architecture microservices pour organiser des rencontres spontanées entre utilisateurs à proximité. Back-end Java/Spring Boot, messagerie asynchrone via Kafka pour découpler les services, et pipeline CI/CD complet (GitHub Actions, Docker) pour des déploiements entièrement automatisés. Latence de notification <200ms, déploiements automatisés à 100%.",
      en: "Real-time application built on a microservices architecture to organize spontaneous meetups between nearby users. Java/Spring Boot back-end, asynchronous messaging via Kafka to decouple services, and a complete CI/CD pipeline (GitHub Actions, Docker) for fully automated deployments. Notification latency <200ms, 100% automated deployments.",
    },
    demoUrl: null,
    repoUrl: null,
  },
  {
    title: "RepoGuard – GitHub Repository Abandonment Prediction",
    slug: "repoguard",
    technologies: [
      "Python",
      "Scikit-learn",
      "Pandas",
      "GitHub API",
      "Streamlit",
    ],
    featured: true,
    description: {
      fr: "Constitution d'un jeu de données de plus de 10 000 dépôts via l'API GitHub et développement d'un pipeline complet de Machine Learning pour prédire l'abandon de dépôts : ingénierie de caractéristiques sur 19 variables, gestion du déséquilibre des classes (~15% de dépôts inactifs), et classification supervisée visant un rappel ≥0.80 sur la classe inactive. Déployé avec Streamlit sur Railway.",
      en: "Built a dataset of +10,000 repositories via the GitHub API and a complete Machine Learning pipeline to predict repository abandonment: feature engineering across 19 variables, class imbalance handling (~15% inactive repositories), and supervised classification targeting a recall ≥0.80 on the inactive class. Deployed with Streamlit on Railway.",
    },
    demoUrl: null,
    repoUrl: null,
  },
  {
    title: "Plateforme de Services Domestiques",
    slug: "plateforme-de-services-domestiques",
    technologies: ["Laravel", "React", "MySQL"],
    featured: true,
    description: { fr: "", en: "" },
    demoUrl: null,
    repoUrl: null,
  },
  {
    title: "Site E-Commerce",
    slug: "site-e-commerce",
    technologies: ["ASP.NET", "SQL Server", "N8N", "Azure"],
    featured: true,
    description: { fr: "", en: "" },
    demoUrl: null,
    repoUrl: null,
  },
  {
    title: "Système de Réservation des Terrains Sportifs",
    slug: "systeme-de-reservation-des-terrains-sportifs",
    technologies: ["PHP", "MySQL"],
    featured: false,
    description: { fr: "", en: "" },
    demoUrl: null,
    repoUrl: null,
  },
  {
    title: "Gestion des Événements des Clubs",
    slug: "gestion-des-evenements-des-clubs",
    technologies: ["PHP", "MySQL"],
    featured: false,
    description: { fr: "", en: "" },
    demoUrl: null,
    repoUrl: null,
  },
  {
    title: "Site Web pour Association aFi",
    slug: "site-web-pour-association-afi",
    technologies: ["Laravel", "React", "MySQL"],
    featured: false,
    description: { fr: "", en: "" },
    demoUrl: null,
    repoUrl: null,
  },
  {
    title: "Site Informatif - CAN 2025",
    slug: "site-informatif-can-2025",
    technologies: ["HTML", "CSS", "JavaScript"],
    featured: false,
    description: { fr: "", en: "" },
    demoUrl: null,
    repoUrl: null,
  },
  {
    title: "Application de Gestion des Dettes",
    slug: "application-de-gestion-des-dettes",
    technologies: ["Laravel", "MySQL", "Docker"],
    featured: false,
    description: { fr: "", en: "" },
    demoUrl: null,
    repoUrl: null,
  },
  {
    title: "Jeu de Tir 2D",
    slug: "jeu-de-tir-2d",
    technologies: ["Java", "LibGDX", "MySQL"],
    featured: false,
    description: { fr: "", en: "" },
    demoUrl: null,
    repoUrl: null,
  },
  {
    title: "API Multi-SGBD",
    slug: "api-multi-sgbd",
    technologies: ["Java", "MySQL", "PostgreSQL", "SQL Server"],
    featured: false,
    description: { fr: "", en: "" },
    demoUrl: null,
    repoUrl: null,
  },
  {
    title: "Conception SGITU (UML)",
    slug: "conception-sgitu-uml",
    technologies: ["UML", "Architecture Logicielle"],
    featured: false,
    description: { fr: "", en: "" },
    demoUrl: null,
    repoUrl: null,
  },
];

export const extracurricularData: {
  role: Localized;
  organization: string;
  period: Localized;
  type: string;
}[] = [
  {
    role: { fr: "Trésorier", en: "Treasurer" },
    organization: "Club InfoTech",
    period: { fr: "Septembre 2025 - Présent", en: "September 2025 - Present" },
    type: "leadership",
  },
  {
    role: { fr: "Responsable Sponsoring", en: "Sponsorship Manager" },
    organization: "Club ENSART",
    period: { fr: "Février 2025 - Présent", en: "February 2025 - Present" },
    type: "leadership",
  },
  {
    role: {
      fr: "Chef de Projet - Développement Site Web",
      en: "Project Lead - Website Development",
    },
    organization: "Association Futurs Ingénieurs (aFi)",
    period: { fr: "Février 2026", en: "February 2026" },
    type: "project",
  },
  {
    role: {
      fr: "Membre Comité Conférence IT",
      en: "IT Conference Committee Member",
    },
    organization: "Club InfoTech",
    period: { fr: "Février 2025", en: "February 2025" },
    type: "committee",
  },
  {
    role: {
      fr: "Membre Comité Don du Sang",
      en: "Blood Donation Committee Member",
    },
    organization: "Association Futurs Ingénieurs (aFi)",
    period: { fr: "Novembre 2024", en: "November 2024" },
    type: "committee",
  },
  {
    role: {
      fr: "Membre Comité AFI's MARATHON",
      en: "AFI's Marathon Committee Member",
    },
    organization: "Association Futurs Ingénieurs (aFi)",
    period: { fr: "Novembre 2024", en: "November 2024" },
    type: "committee",
  },
];

export const goalsData: {
  text: Localized;
  term: string;
  isPublic: boolean;
}[] = [
  {
    text: {
      fr: "Obtenir mon diplôme d'ingénieur avec mention",
      en: "Graduate with honors",
    },
    term: "short_term",
    isPublic: true,
  },
  {
    text: {
      fr: "Développer des applications modernes et utiles",
      en: "Build modern, useful applications",
    },
    term: "short_term",
    isPublic: true,
  },
  {
    text: {
      fr: "Approfondir mes connaissances en DevOps et architecture cloud",
      en: "Deepen my knowledge of DevOps and cloud architecture",
    },
    term: "short_term",
    isPublic: true,
  },
  {
    text: {
      fr: "En savoir plus sur les systèmes ERP",
      en: "Learn more about ERP systems",
    },
    term: "short_term",
    isPublic: true,
  },
  {
    text: {
      fr: "Décrocher un poste dans une entreprise innovante",
      en: "Land a role at an innovative company",
    },
    term: "short_term",
    isPublic: true,
  },
  {
    text: {
      fr: "Devenir expert en architecture logicielle et systèmes d'entreprise",
      en: "Become an expert in software architecture and enterprise systems",
    },
    term: "long_term",
    isPublic: true,
  },
  {
    text: {
      fr: "Contribuer à des projets d'envergure internationale",
      en: "Contribute to internationally-scaled projects",
    },
    term: "long_term",
    isPublic: true,
  },
  {
    text: {
      fr: "Approfondir mes connaissances (doctorat ou formation avancée)",
      en: "Further my studies (PhD or advanced training)",
    },
    term: "long_term",
    isPublic: true,
  },
  {
    text: {
      fr: "Apprendre l'entrepreneuriat et développer mes compétences en gestion",
      en: "Learn entrepreneurship and develop management skills",
    },
    term: "long_term",
    isPublic: true,
  },
];
