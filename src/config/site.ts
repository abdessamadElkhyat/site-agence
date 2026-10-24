/**
 * Identité studio. Remplacez email / téléphone / URL par vos valeurs finales.
 * Studio international — pas de siège ni de ville mis en avant.
 */
export const site = {
  name: "agencemark",
  legalName: "Agence Mark",
  tagline: "Agence de marketing digital",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.agencemark.com",
  email: "Info@agencemark.com",
  phone: "+33 6 36 22 90 08",
  phoneHref: "tel:+33636229008",
  whatsapp: "33636229008",
  address: {
    street: "",
    city: "",
    postalCode: "",
    country: "International",
    countryCode: "",
  },
  mapsEmbed: "",
  socials: {
    linkedin: "https://www.linkedin.com",
    instagram: "https://www.instagram.com",
    facebook: "https://www.facebook.com",
    x: "https://x.com",
  },
  hoursLabel: "Horaires d'ouverture",
  hours: "Du lundi au vendredi : 9h00 - 18h00",
  stats: [
    { id: "projects", value: 48, suffix: "", label: "projets livrés" },
    { id: "companies", value: 36, suffix: "", label: "marques accompagnées" },
    { id: "years", value: 6, suffix: "", label: "années d'exercice" },
    { id: "recommend", value: 96, suffix: "%", label: "de clients qui nous recommandent" },
  ],
};

export const projectCategories = [
  { id: "all", fr: "Tous", en: "All" },
  { id: "site-web", fr: "Site web", en: "Website" },
  { id: "ecommerce", fr: "E-commerce", en: "E-commerce" },
  { id: "branding", fr: "Branding", en: "Branding" },
  { id: "seo", fr: "SEO", en: "SEO" },
  { id: "marketing", fr: "Marketing", en: "Marketing" },
  { id: "social-media", fr: "Social media", en: "Social media" },
] as const;

export type ProjectCategoryId = (typeof projectCategories)[number]["id"];
