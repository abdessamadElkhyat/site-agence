import type { TeamMember, Testimonial } from "@/types/content";

const face = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

export const staticTestimonials: Testimonial[] = [
  {
    name: "Nadia Bennani",
    company: "Velora Hotel",
    role: "Gérante",
    quote:
      "Les demandes sont devenues plus précises. Les gens ont déjà vu les chambres et savent ce qu'ils veulent réserver.",
    photo: face("photo-1544005313-94ddf0286df2"),
    rating: 5,
  },
  {
    name: "Karim Tazi",
    company: "Clearview Clinic",
    role: "Directeur",
    quote:
      "On a arrêté de payer des clics qui ne menaient nulle part. Le secrétariat le sent dans la qualité des appels.",
    photo: face("photo-1506794778202-cad84cf45f1d"),
    rating: 5,
  },
  {
    name: "Salma Idrissi",
    company: "Lumina Interiors",
    role: "Fondatrice",
    quote:
      "Le compte ressemble enfin à ce que l'on fabrique. Les visites du showroom ne partent plus de zéro.",
    photo: face("photo-1580489944761-15a19d654956"),
    rating: 5,
  },
];

export const staticTeam: TeamMember[] = [
  {
    name: "Amira Benjelloun",
    role: "Direction",
    bio: "Elle tient le cap des missions : ce qui est promis, ce qui est livré, et ce qui doit attendre.",
    photo: face("photo-1573496359142-b8d87734a5a2"),
    linkedin: "https://www.linkedin.com",
  },
  {
    name: "Youssef El Idrissi",
    role: "Technique",
    bio: "Sites, performance et mise en ligne. Il préfère un parcours simple à une fonctionnalité dont personne ne se sert.",
    photo: face("photo-1500648767791-00dcc994a43e"),
    linkedin: "https://www.linkedin.com",
  },
  {
    name: "Leila Cherkaoui",
    role: "Stratégie",
    bio: "Elle relie l'offre, les recherches et les campagnes. Son travail commence par les questions des clients, pas par les outils.",
    photo: face("photo-1531123897727-8f129e1688ce"),
    linkedin: "https://www.linkedin.com",
  },
  {
    name: "Mehdi Alaoui",
    role: "Création",
    bio: "Direction visuelle et contenus. Il cherche le signe que l'on reconnaît, pas le décor que l'on oublie.",
    photo: face("photo-1507003211169-0a1dd7228f2d"),
    linkedin: "https://www.linkedin.com",
  },
];

export const categories = [
  { name: "Guides", slug: "guides", description: "Repères pour choisir et budgéter." },
  { name: "Sites web", slug: "sites-web", description: "Conception, refonte et e-commerce." },
  { name: "SEO", slug: "seo", description: "Visibilité organique sur Google, pour marques locales et internationales." },
  { name: "Stratégie", slug: "strategie", description: "Acquisition et priorités." },
];

export const tags = [
  { name: "SEO", slug: "seo" },
  { name: "PME", slug: "pme" },
  { name: "E-commerce", slug: "e-commerce" },
  { name: "Agence", slug: "agence" },
  { name: "Site web", slug: "site-web" },
  { name: "Budget", slug: "budget" },
  { name: "Google", slug: "google" },
  { name: "Guide", slug: "guide" },
  { name: "Acquisition", slug: "acquisition" },
  { name: "Branding", slug: "branding" },
];
