/**
 * Identité studio. Remplacez email / téléphone / URL par vos valeurs finales.
 * Studio international — pas de siège ni de ville mis en avant.
 */
export const site = {
  name: "LYNE",
  legalName: "LYNE Studio",
  tagline: "Digital marketing studio for ambitious brands",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  email: "hello@lyne.studio",
  phone: "+1 555 010 2000",
  phoneHref: "tel:+15550102000",
  whatsapp: "15550102000",
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
  hours: "Mon–Fri · 9:00–18:00 (UTC)",
  stats: [
    { id: "projects", value: 48, suffix: "", label: "projets livrés" },
    { id: "companies", value: 36, suffix: "", label: "marques accompagnées" },
    { id: "years", value: 6, suffix: "", label: "années d'exercice" },
    { id: "recommend", value: 96, suffix: "%", label: "de clients qui nous recommandent" },
  ],
};

export const projectCategories = [
  { id: "all", fr: "Tous", en: "All", ar: "الكل" },
  { id: "site-web", fr: "Site web", en: "Website", ar: "موقع ويب" },
  { id: "ecommerce", fr: "E-commerce", en: "E-commerce", ar: "تجارة إلكترونية" },
  { id: "branding", fr: "Branding", en: "Branding", ar: "هوية بصرية" },
  { id: "seo", fr: "SEO", en: "SEO", ar: "SEO" },
  { id: "marketing", fr: "Marketing", en: "Marketing", ar: "تسويق" },
  { id: "social-media", fr: "Social media", en: "Social media", ar: "شبكات اجتماعية" },
] as const;

export type ProjectCategoryId = (typeof projectCategories)[number]["id"];
