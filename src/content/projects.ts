import type { Locale } from "@/i18n/routing";
import type { Project } from "@/types/content";

type Copy = Pick<
  Project,
  "title" | "client" | "excerpt" | "description" | "objectives" | "results" | "testimonial" | "seoTitle" | "seoDescription"
>;

const shot = (file: string) => `/realisations/${file}`;

function web(
  slug: string,
  cover: string,
  gallery: string[],
  technologies: string[],
  websiteUrl: string,
  fr: Copy,
  en: Copy,
) {
  return { slug, category: "site-web", cover, gallery, technologies, websiteUrl, copy: { fr, en } };
}

const raw: Array<Omit<Project, keyof Copy> & { copy: Record<Locale, Copy> }> = [
  web(
    "tangier-morocco-travel",
    shot("tangier-morocco-travel.jpg"),
    [shot("tangier-morocco-travel.jpg"), shot("tangier-2.jpg"), shot("tangier-3.jpg")],
    ["Site vitrine", "Circuits", "Multilingue"],
    "https://tangiermoroccotravel.com/",
    {
      title: "Tangier Morocco Travel",
      client: "Voyages privés, Tanger",
      excerpt: "Un site pour choisir un circuit privé, du détroit aux dunes, et demander un voyage sur mesure.",
      description:
        "Tangier Morocco Travel présente des expéditions privées au départ de Tanger : villes impériales, Chefchaouen, désert et héritage. Le site classe les voyages, raconte le terrain et ouvre une demande claire, en français, en anglais et en espagnol.",
      objectives: ["Rendre les circuits lisibles", "Recevoir des demandes de voyage", "Parler à une clientèle internationale"],
      results: [
        { label: "Langues", value: "FR · EN · ES" },
        { label: "Départ", value: "Tanger" },
        { label: "Format", value: "Privé" },
      ],
      seoTitle: "Tangier Morocco Travel — site de circuits privés",
      seoDescription: "Site de voyages privés au départ de Tanger : villes impériales, désert et demande de circuit.",
    },
    {
      title: "Tangier Morocco Travel",
      client: "Private travel, Tangier",
      excerpt: "A site to choose a private journey, from the strait to the dunes, and request a tailor-made trip.",
      description:
        "Tangier Morocco Travel presents private expeditions from Tangier: imperial cities, Chefchaouen, the desert and heritage. The site organises the journeys, tells the ground, and opens a clear request in French, English and Spanish.",
      objectives: ["Make the tours readable", "Receive trip requests", "Speak to an international clientele"],
      results: [
        { label: "Languages", value: "FR · EN · ES" },
        { label: "Departure", value: "Tangier" },
        { label: "Format", value: "Private" },
      ],
      seoTitle: "Tangier Morocco Travel — private tour website",
      seoDescription: "Private travel website from Tangier: imperial cities, desert and trip requests.",
    },
  ),
  web(
    "humanoids",
    shot("humanoids.png"),
    [shot("humanoids.png")],
    ["Média", "Actualités", "Newsletter"],
    "https://www.humanoids.ma/",
    {
      title: "Humanoids",
      client: "Média, robotique humanoïde",
      excerpt: "Le média qui relie l'actualité mondiale des robots humanoïdes aux opportunités au Maroc.",
      description:
        "Humanoids.ma est un média dédié aux robots humanoïdes, lu depuis le Maroc. Le site pose la vision, les cas d'usage et l'actualité, avec une newsletter pour suivre le sujet sans bruit.",
      objectives: ["Installer une référence éditoriale", "Relier l'innovation au marché marocain", "Ouvrir une lecture régulière"],
      results: [
        { label: "Sujet", value: "Robotique" },
        { label: "Regard", value: "Maroc" },
        { label: "Format", value: "Média" },
      ],
      seoTitle: "Humanoids — média des robots humanoïdes",
      seoDescription: "Site média sur les robots humanoïdes, avec une lecture orientée vers le Maroc.",
    },
    {
      title: "Humanoids",
      client: "Media, humanoid robotics",
      excerpt: "The publication that connects global humanoid-robot news with opportunities in Morocco.",
      description:
        "Humanoids.ma is a media site devoted to humanoid robots, read from Morocco. It sets the vision, the use cases and the news, with a newsletter for a quiet follow-up.",
      objectives: ["Establish an editorial reference", "Connect innovation to the Moroccan market", "Open a regular reading"],
      results: [
        { label: "Subject", value: "Robotics" },
        { label: "Lens", value: "Morocco" },
        { label: "Format", value: "Media" },
      ],
      seoTitle: "Humanoids — humanoid robot media",
      seoDescription: "A media website on humanoid robots, read through a Moroccan lens.",
    },
  ),
  web(
    "amappe",
    shot("amappe.png"),
    [shot("amappe.png")],
    ["Site institutionnel", "Programmes", "Actualités"],
    "https://www.amappe.ma/",
    {
      title: "AMAPPE",
      client: "Inclusion économique, depuis 1991",
      excerpt: "Le site d'une association qui accompagne vers l'activité, l'emploi et l'autonomie.",
      description:
        "L'AMAPPE présente ses programmes, ses résultats et ses actualités : femmes, jeunes, personnes réfugiées et publics en situation de vulnérabilité. Le site rend l'institution lisible pour les bénéficiaires, les partenaires et les institutions.",
      objectives: ["Expliquer les programmes", "Montrer des résultats concrets", "Ouvrir le contact et l'accompagnement"],
      results: [
        { label: "Depuis", value: "1991" },
        { label: "Siège", value: "Rabat" },
        { label: "Publics", value: "Inclusion" },
      ],
      seoTitle: "AMAPPE — site institutionnel",
      seoDescription: "Site de l'AMAPPE : programmes d'inclusion économique, résultats et actualités.",
    },
    {
      title: "AMAPPE",
      client: "Economic inclusion, since 1991",
      excerpt: "The site of an organisation that supports people toward work, income and autonomy.",
      description:
        "AMAPPE presents its programmes, results and news: women, young people, refugees and people in vulnerable situations. The site makes the institution readable for beneficiaries, partners and public bodies.",
      objectives: ["Explain the programmes", "Show concrete results", "Open contact and support"],
      results: [
        { label: "Since", value: "1991" },
        { label: "Base", value: "Rabat" },
        { label: "Focus", value: "Inclusion" },
      ],
      seoTitle: "AMAPPE — institutional website",
      seoDescription: "AMAPPE website: economic inclusion programmes, results and news.",
    },
  ),
  web(
    "la-villa",
    shot("la-villa.png"),
    [shot("la-villa.png")],
    ["Réservation", "Multilingue", "WhatsApp"],
    "https://lavilla.ma/",
    {
      title: "La Villa",
      client: "Appartements de vacances, Al Hoceima",
      excerpt: "Un site pour choisir un appartement, voir les dates et réserver sans passer par une plateforme.",
      description:
        "La Villa présente ses appartements à Al Hoceima : capacité, vue, équipements et prix à la nuit. Le visiteur choisit ses dates et envoie une demande directe, en français, en anglais, en arabe et en néerlandais.",
      objectives: ["Montrer les appartements", "Recevoir des demandes directes", "Répondre dans la langue du voyageur"],
      results: [
        { label: "Lieu", value: "Al Hoceima" },
        { label: "Langues", value: "4" },
        { label: "Réservation", value: "Directe" },
      ],
      seoTitle: "La Villa — appartements à Al Hoceima",
      seoDescription: "Site de réservation directe pour les appartements La Villa à Al Hoceima.",
    },
    {
      title: "La Villa",
      client: "Holiday apartments, Al Hoceima",
      excerpt: "A site to choose an apartment, check dates and book without a platform fee.",
      description:
        "La Villa presents its apartments in Al Hoceima: capacity, view, amenities and nightly price. The visitor picks dates and sends a direct request, in French, English, Arabic and Dutch.",
      objectives: ["Show the apartments", "Receive direct requests", "Answer in the traveller's language"],
      results: [
        { label: "Place", value: "Al Hoceima" },
        { label: "Languages", value: "4" },
        { label: "Booking", value: "Direct" },
      ],
      seoTitle: "La Villa — apartments in Al Hoceima",
      seoDescription: "Direct booking website for La Villa apartments in Al Hoceima.",
    },
  ),
  web(
    "restaurants-fez",
    shot("restaurants-fez.png"),
    [shot("restaurants-fez.png")],
    ["Guide", "Éditorial", "Adresses"],
    "https://restaurantsfez.com/",
    {
      title: "Restaurants Fez",
      client: "Guide des tables de Fès",
      excerpt: "Un guide sélectif des restaurants de Fès : médina, tables modernes, adresses locales et rooftops.",
      description:
        "Restaurants Fez choisit des tables plutôt que d'en lister des centaines. Chaque adresse a son cadre, sa cuisine et le moyen de réserver. Le site se lit comme un journal de ville, pas comme un annuaire.",
      objectives: ["Aider à choisir une table", "Distinguer les adresses", "Rendre la réservation immédiate"],
      results: [
        { label: "Ville", value: "Fès" },
        { label: "Format", value: "Guide" },
        { label: "Sélection", value: "Tables" },
      ],
      seoTitle: "Restaurants Fez — guide des tables",
      seoDescription: "Guide sélectif des restaurants de Fès : médina, tables modernes et rooftops.",
    },
    {
      title: "Restaurants Fez",
      client: "A guide to the tables of Fez",
      excerpt: "A selective guide to restaurants in Fez: the medina, modern tables, local addresses and rooftops.",
      description:
        "Restaurants Fez chooses tables instead of listing hundreds. Each address has its setting, its cooking and a way to book. The site reads like a city journal, not a directory.",
      objectives: ["Help choose a table", "Distinguish the addresses", "Make booking immediate"],
      results: [
        { label: "City", value: "Fez" },
        { label: "Format", value: "Guide" },
        { label: "Edit", value: "Selected" },
      ],
      seoTitle: "Restaurants Fez — a guide to the tables",
      seoDescription: "A selective guide to restaurants in Fez: medina, modern tables and rooftops.",
    },
  ),
  web(
    "dar-marjana",
    shot("dar-marjana.png"),
    [shot("dar-marjana.png")],
    ["Restaurant", "Menus", "Réservation"],
    "https://www.darmarjana.com/",
    {
      title: "Dar Marjana",
      client: "Dîner-spectacle, Marrakech",
      excerpt: "Le site d'un riad-restaurant de la médina : menus, salle et réservation d'une table.",
      description:
        "Dar Marjana accueille à Marrakech depuis 1981 pour un dîner marocain accompagné de musique. Le site présente les menus, la salle et la galerie, puis mène à la réservation sans détour.",
      objectives: ["Présenter la maison", "Rendre les menus comparables", "Remplir les tables"],
      results: [
        { label: "Depuis", value: "1981" },
        { label: "Lieu", value: "Médina" },
        { label: "Soirée", value: "Spectacle" },
      ],
      seoTitle: "Dar Marjana — restaurant à Marrakech",
      seoDescription: "Site du restaurant Dar Marjana à Marrakech : menus, dîner-spectacle et réservation.",
    },
    {
      title: "Dar Marjana",
      client: "Dinner and show, Marrakech",
      excerpt: "The site of a medina restaurant: menus, the room, and a table reservation.",
      description:
        "Dar Marjana has welcomed guests in Marrakech since 1981 for a Moroccan dinner with music. The site presents the menus, the room and the gallery, then leads straight to a reservation.",
      objectives: ["Present the house", "Make the menus comparable", "Fill the tables"],
      results: [
        { label: "Since", value: "1981" },
        { label: "Place", value: "Medina" },
        { label: "Evening", value: "Show" },
      ],
      seoTitle: "Dar Marjana — restaurant in Marrakech",
      seoDescription: "Dar Marjana restaurant website in Marrakech: menus, dinner show and reservation.",
    },
  ),
];

export function staticProjects(locale: Locale): Project[] {
  return raw.map((project) => ({
    slug: project.slug,
    category: project.category,
    cover: project.cover,
    gallery: project.gallery,
    technologies: project.technologies,
    websiteUrl: project.websiteUrl,
    ...project.copy[locale],
  }));
}

export const projectSlugs = raw.map((project) => project.slug);
