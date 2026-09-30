export type ProcessStep = { title: string; text: string };
export type FaqItem = { q: string; a: string };
export type ResultItem = { label: string; value: string };

export type Service = {
  slug: string;
  icon: string;
  image: string;
  tools: string[];
  name: string;
  summary: string;
  description: string;
  problem: string;
  solution: string;
  benefits: string[];
  process: ProcessStep[];
  faq: FaqItem[];
  seoTitle: string;
  seoDescription: string;
};

export type Project = {
  slug: string;
  category: string;
  cover: string;
  gallery: string[];
  technologies: string[];
  websiteUrl?: string;
  title: string;
  client: string;
  excerpt: string;
  description: string;
  objectives: string[];
  results: ResultItem[];
  testimonial?: string;
  seoTitle: string;
  seoDescription: string;
};

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string };

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  coverAlt: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  updatedAt?: string;
  blocks: ArticleBlock[];
  seoTitle: string;
  seoDescription: string;
  focusKeyword: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  faq: FaqItem[];
};

export type Testimonial = {
  name: string;
  company: string;
  role: string;
  quote: string;
  photo: string;
  rating: number;
};

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  photo: string;
  linkedin?: string;
};
