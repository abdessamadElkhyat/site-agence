import type { Locale } from "@/i18n/routing";
import type { Project } from "@/types/content";

type Copy = Pick<
  Project,
  "title" | "client" | "excerpt" | "description" | "objectives" | "results" | "testimonial" | "seoTitle" | "seoDescription"
>;

const photo = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80`;

const raw: Array<Omit<Project, keyof Copy> & { copy: Record<Locale, Copy> }> = [
  {
    slug: "velora-hotel",
    category: "site-web",
    cover: photo("photo-1566073771259-6a8506099945"),
    gallery: [photo("photo-1566073771259-6a8506099945"), photo("photo-1551882547-ff40c63fe5fa"), photo("photo-1542314831-068cd1dbfeeb")],
    technologies: ["Next.js", "Tailwind", "Réservation"],
    websiteUrl: "https://example.com",
    copy: {
      fr: {
        title: "Velora Hotel",
        client: "Hôtel boutique, Europe",
        excerpt: "Un site qui montre les chambres avant le discours, et mène à une demande de séjour.",
        description:
          "L'établissement avait de belles photos et un site qui les cachait. Nous avons reconstruit le parcours : une arrivée pleine page, les chambres en grand, les disponibilités, puis un formulaire court. Le référencement a suivi, avec des pages claires sur l'expérience et les offres.",
        objectives: ["Montrer le lieu sans détour", "Recevoir des demandes directes", "Être trouvé sur les recherches liées au séjour"],
        results: [
          { label: "Demandes directes", value: "+62 %" },
          { label: "Temps de chargement", value: "1,4 s" },
          { label: "Pages indexées utiles", value: "12" },
        ],
        testimonial: "Les gens arrivent sur le site et comprennent tout de suite le lieu. Les demandes sont plus précises.",
        seoTitle: "Velora Hotel — site d'hôtel boutique",
        seoDescription: "Refonte du site d'un hôtel boutique : chambres, demande de séjour et visibilité organique.",
      },
      en: {
        title: "Velora Hotel",
        client: "Boutique hotel, Europe",
        excerpt: "A site that shows the rooms before the speech, and leads to a stay request.",
        description: "The property had strong photographs and a website that hid them. We rebuilt the path: a full-bleed arrival, large rooms, availability, then a short form. Organic search followed, with clear pages about the stay and offers.",
        objectives: ["Show the place directly", "Receive direct enquiries", "Be found for relevant stay searches"],
        results: [
          { label: "Direct enquiries", value: "+62%" },
          { label: "Load time", value: "1.4s" },
          { label: "Useful indexed pages", value: "12" },
        ],
        testimonial: "People land on the site and understand the place at once. The enquiries are more precise.",
        seoTitle: "Velora Hotel — boutique hotel website",
        seoDescription: "Website redesign for a boutique hotel: rooms, stay requests and organic visibility.",
      },
      ar: {
        title: "فيلورا هوتيل",
        client: "فندق بوتيك، أوروبا",
        excerpt: "موقع يُظهر الغرف قبل الخطاب، ويقود إلى طلب إقامة.",
        description: "كانت الصور قوية والموقع يخفيها. أعدنا المسار: وصول بملء الصفحة، غرف كبيرة، التوفر، ثم نموذج قصير. وتبع ذلك ظهور في البحث وصفحات واضحة عن الإقامة.",
        objectives: ["إظهار المكان مباشرة", "استقبال طلبات مباشرة", "الظهور في بحوث الإقامة ذات الصلة"],
        results: [
          { label: "طلبات مباشرة", value: "+62%" },
          { label: "زمن التحميل", value: "1.4 ث" },
          { label: "صفحات مفيدة", value: "12" },
        ],
        testimonial: "يصل الناس إلى الموقع ويفهمون المكان فورًا. الطلبات أصبحت أدق.",
        seoTitle: "فيلورا هوتيل — موقع فندق بوتيك",
        seoDescription: "إعادة بناء موقع فندق بوتيك: الغرف وطلبات الإقامة والظهور العضوي.",
      },
    },
  },
  {
    slug: "harvest-pantry",
    category: "ecommerce",
    cover: photo("photo-1441986300917-64674bd600d8"),
    gallery: [photo("photo-1441986300917-64674bd600d8"), photo("photo-1472851294608-062f824d29cc"), photo("photo-1483985988355-763728e1935b")],
    technologies: ["Next.js", "Stripe", "PayPal"],
    copy: {
      fr: {
        title: "Harvest Pantry",
        client: "Épicerie spécialisée, en ligne",
        excerpt: "Une boutique qui vend des produits sélectionnés sans perdre le client au paiement.",
        description:
          "Le catalogue existait sur Instagram. Nous l'avons structuré : fiches courtes, poids, origine, frais de livraison annoncés tôt, et un paiement via Stripe et PayPal. La publicité n'a été branchée qu'une fois les premières commandes test passées.",
        objectives: ["Sortir de la vente uniquement par message", "Rassurer avant le paiement", "Préparer les campagnes produit"],
        results: [
          { label: "Commandes en ligne", value: "180 / mois" },
          { label: "Panier moyen", value: "78 €" },
          { label: "Abandon au paiement", value: "−28 %" },
        ],
        testimonial: "On sait enfin ce qui se vend sans passer la soirée dans les messages.",
        seoTitle: "Harvest Pantry — boutique e-commerce",
        seoDescription: "Création d'une boutique en ligne : catalogue, livraison et paiement Stripe / PayPal.",
      },
      en: {
        title: "Harvest Pantry",
        client: "Specialty grocery, online",
        excerpt: "A shop that sells curated products without losing the customer at checkout.",
        description: "The catalogue lived on Instagram. We structured it: short product pages, weight, origin, delivery fees shown early, and checkout via Stripe and PayPal. Ads were connected only after test orders.",
        objectives: ["Leave message-only sales", "Reassure before payment", "Prepare product campaigns"],
        results: [
          { label: "Online orders", value: "180 / month" },
          { label: "Average basket", value: "€78" },
          { label: "Checkout drop-off", value: "−28%" },
        ],
        testimonial: "We finally know what sells without spending the evening in the inbox.",
        seoTitle: "Harvest Pantry — e-commerce shop",
        seoDescription: "An online shop for specialty products: catalogue, delivery and Stripe / PayPal checkout.",
      },
      ar: {
        title: "هارفست بانتري",
        client: "بقالة متخصصة، على الإنترنت",
        excerpt: "متجر يبيع منتجات مختارة دون أن يضيع الزبون عند الدفع.",
        description: "كان الكتالوج على إنستغرام. نظّمناه: بطاقات قصيرة، الوزن، الأصل، مصاريف التوصيل مبكرًا، ودفع عبر Stripe وPayPal.",
        objectives: ["الخروج من البيع بالرسائل فقط", "الطمأنة قبل الدفع", "تحضير حملات المنتجات"],
        results: [
          { label: "طلبات", value: "180 / شهر" },
          { label: "متوسط السلة", value: "78 €" },
          { label: "ترك الدفع", value: "−28%" },
        ],
        testimonial: "صرنا نعرف ما يُباع دون قضاء المساء في الرسائل.",
        seoTitle: "هارفست بانتري — متجر إلكتروني",
        seoDescription: "متجر لمنتجات متخصصة: كتالوج وتوصيل ودفع Stripe / PayPal.",
      },
    },
  },
  {
    slug: "brightpath-academy",
    category: "seo",
    cover: photo("photo-1503676260728-1c00da094a0b"),
    gallery: [photo("photo-1503676260728-1c00da094a0b"), photo("photo-1580582932707-520aed937b7b"), photo("photo-1509062522246-3755977927d7")],
    technologies: ["SEO", "Search Console", "Contenus"],
    copy: {
      fr: {
        title: "Brightpath Academy",
        client: "Établissement scolaire privé",
        excerpt: "Des pages par niveau et par question de parent, à la place d'un site fourre-tout.",
        description:
          "Les parents cherchaient des réponses précises : inscriptions, langues, transport. Le site parlait de « l'excellence ». Nous avons réécrit l'architecture autour de ces questions, corrigé l'indexation, et publié des pages que l'équipe peut mettre à jour à chaque rentrée.",
        objectives: ["Répondre aux questions des parents", "Remonter sur les recherches pertinentes", "Rendre les inscriptions trouvables"],
        results: [
          { label: "Visites organiques", value: "+79 %" },
          { label: "Pages inscriptions", value: "top 5" },
          { label: "Demandes de visite", value: "+41 %" },
        ],
        testimonial: "Les familles arrivent en ayant déjà lu ce qu'il faut. Les visites de l'école sont plus calmes, et plus sérieuses.",
        seoTitle: "Brightpath Academy — SEO éducation",
        seoDescription: "Refonte éditoriale et SEO pour un établissement scolaire : inscriptions, niveaux et visites.",
      },
      en: {
        title: "Brightpath Academy",
        client: "Private school",
        excerpt: "Pages by level and by parents' questions, instead of a catch-all site.",
        description: "Parents searched for precise answers: enrolment, languages, transport. The site talked about excellence. We rebuilt the architecture around those questions, fixed indexing, and published pages the team can update each term.",
        objectives: ["Answer parents' questions", "Rise on relevant searches", "Make enrolment findable"],
        results: [
          { label: "Organic visits", value: "+79%" },
          { label: "Enrolment pages", value: "top 5" },
          { label: "Visit requests", value: "+41%" },
        ],
        testimonial: "Families arrive having already read what matters. School visits are calmer, and more serious.",
        seoTitle: "Brightpath Academy — education SEO",
        seoDescription: "Editorial rebuild and SEO for a private school: enrolment, levels and visits.",
      },
      ar: {
        title: "أكاديمية برايت باث",
        client: "مؤسسة تعليمية خاصة",
        excerpt: "صفحات حسب المستوى وأسئلة الآباء، بدل موقع عام.",
        description: "كان الآباء يبحثون عن إجابات دقيقة: التسجيل واللغات والنقل. أعدنا البنية حول هذه الأسئلة وصححنا الفهرسة.",
        objectives: ["الإجابة عن أسئلة الآباء", "الصعود في البحث ذي الصلة", "جعل التسجيل قابلًا للإيجاد"],
        results: [
          { label: "زيارات عضوية", value: "+79%" },
          { label: "صفحات التسجيل", value: "ضمن 5" },
          { label: "طلبات زيارة", value: "+41%" },
        ],
        testimonial: "تصل الأسر وقد قرأت ما يلزم. زيارات المدرسة أصبحت أهدأ وأجدّ.",
        seoTitle: "أكاديمية برايت باث — SEO تعليم",
        seoDescription: "إعادة تحرير وSEO لمؤسسة تعليمية: التسجيل والمستويات والزيارات.",
      },
    },
  },
  {
    slug: "craftform-studio",
    category: "branding",
    cover: photo("photo-1452860606245-08befc0ff44b"),
    gallery: [photo("photo-1452860606245-08befc0ff44b"), photo("photo-1503602642458-232111445657"), photo("photo-1610701596007-11502861dcfa")],
    technologies: ["Identité", "Photo", "Instagram"],
    copy: {
      fr: {
        title: "Craftform Studio",
        client: "Atelier de design & menuiserie",
        excerpt: "Une identité qui montre la main, pas un logo d'agence posé sur l'atelier.",
        description:
          "L'atelier travaillait pour des architectes et des particuliers, avec deux discours différents et aucun signe stable. Nous avons gardé le nom, dessiné un système typographique simple, et produit une série de photos qui sert autant au site qu'aux réseaux.",
        objectives: ["Unifier le discours", "Montrer le geste", "Rendre l'atelier mémorable auprès des architectes"],
        results: [
          { label: "Demandes architectes", value: "+3 / mois" },
          { label: "Supports alignés", value: "site + réseaux" },
          { label: "Délai de validation", value: "2 semaines" },
        ],
        testimonial: "On nous reconnaît avant de lire le nom. C'est nouveau pour nous.",
        seoTitle: "Craftform Studio — identité d'atelier",
        seoDescription: "Identité visuelle et photographie pour un atelier de design et menuiserie.",
      },
      en: {
        title: "Craftform Studio",
        client: "Design & joinery workshop",
        excerpt: "An identity that shows the hand, not an agency logo pasted on the workshop.",
        description: "The workshop served architects and private clients with two different speeches and no stable mark. We kept the name, drew a simple type system, and produced photographs that serve the site and social equally.",
        objectives: ["Unify the speech", "Show the craft", "Be remembered by architects"],
        results: [
          { label: "Architect enquiries", value: "+3 / month" },
          { label: "Aligned touchpoints", value: "site + social" },
          { label: "Approval time", value: "2 weeks" },
        ],
        testimonial: "People recognise us before they read the name. That is new for us.",
        seoTitle: "Craftform Studio — workshop identity",
        seoDescription: "Visual identity and photography for a design and joinery workshop.",
      },
      ar: {
        title: "كرافتفورم ستوديو",
        client: "ورشة تصميم ونجارة",
        excerpt: "هوية تُظهر اليد، لا شعار وكالة ملصقًا على الورشة.",
        description: "كانت الورشة تشتغل مع المهندسين والأفراد بخطابين مختلفين وبلا علامة ثابتة. أبقينا الاسم ورسمنا نظام حروف بسيطًا وصورًا تخدم الموقع والشبكات.",
        objectives: ["توحيد الخطاب", "إظهار الحرفة", "أن تُذكر الورشة لدى المهندسين"],
        results: [
          { label: "طلبات مهندسين", value: "+3 / شهر" },
          { label: "دعامات متسقة", value: "موقع + شبكات" },
          { label: "مدة الاعتماد", value: "أسبوعان" },
        ],
        testimonial: "يتعرفون علينا قبل قراءة الاسم. هذا جديد علينا.",
        seoTitle: "كرافتفورم ستوديو — هوية ورشة",
        seoDescription: "هوية بصرية وتصوير لورشة تصميم ونجارة.",
      },
    },
  },
  {
    slug: "clearview-clinic",
    category: "marketing",
    cover: photo("photo-1519494026892-80bbd2d6fd0d"),
    gallery: [photo("photo-1519494026892-80bbd2d6fd0d"), photo("photo-1666214280557-f1b5022eb634"), photo("photo-1576091160399-112ba8d25d1d")],
    technologies: ["Google Ads", "SEO", "Pages soins"],
    copy: {
      fr: {
        title: "Clearview Clinic",
        client: "Clinique privée",
        excerpt: "Des campagnes et des pages par soin, pour des prises de rendez-vous plus justes.",
        description:
          "La clinique achetait des clics trop larges. Nous avons séparé les campagnes par spécialité, réécrit les pages d'arrivée, et arrêté les mots-clés qui amenaient des recherches sans intention de rendez-vous. Le SEO a pris le relais sur les soins récurrents.",
        objectives: ["Baisser le coût d'un rendez-vous", "Clarifier chaque spécialité", "Éviter les clics hors sujet"],
        results: [
          { label: "Coût par rendez-vous", value: "−34 %" },
          { label: "Taux de formulaire", value: "6,8 %" },
          { label: "Spécialités cadrées", value: "7" },
        ],
        testimonial: "Le secrétariat reçoit des demandes qui correspondent vraiment aux spécialités ouvertes.",
        seoTitle: "Clearview Clinic — acquisition de rendez-vous",
        seoDescription: "Google Ads et pages de soins pour une clinique, avec un coût par rendez-vous en baisse.",
      },
      en: {
        title: "Clearview Clinic",
        client: "Private clinic",
        excerpt: "Campaigns and pages per treatment, for more accurate appointments.",
        description: "The clinic was buying overly broad clicks. We split campaigns by specialty, rewrote landing pages, and stopped keywords that brought searches with no intent to book. SEO took over the recurring treatments.",
        objectives: ["Lower the cost per appointment", "Clarify each specialty", "Avoid off-topic clicks"],
        results: [
          { label: "Cost per appointment", value: "−34%" },
          { label: "Form rate", value: "6.8%" },
          { label: "Framed specialties", value: "7" },
        ],
        testimonial: "The desk receives requests that actually match the open specialties.",
        seoTitle: "Clearview Clinic — appointment acquisition",
        seoDescription: "Google Ads and treatment pages for a private clinic, with a lower cost per appointment.",
      },
      ar: {
        title: "عيادة كليرفيو",
        client: "عيادة خاصة",
        excerpt: "حملات وصفحات لكل علاج، لمواعيد أدق.",
        description: "كانت العيادة تشتري نقرات عريضة. فصلنا الحملات حسب التخصص وأعدنا صفحات الوصول وأوقفنا الكلمات بلا نية حجز.",
        objectives: ["خفض تكلفة الموعد", "توضيح كل تخصص", "تجنب النقرات خارج الموضوع"],
        results: [
          { label: "تكلفة الموعد", value: "−34%" },
          { label: "نسبة النموذج", value: "6.8%" },
          { label: "تخصصات مؤطرة", value: "7" },
        ],
        testimonial: "الاستقبال يتلقى طلبات تطابق التخصصات المفتوحة فعلًا.",
        seoTitle: "عيادة كليرفيو — اكتساب المواعيد",
        seoDescription: "إعلانات Google وصفحات علاجات لعيادة خاصة.",
      },
    },
  },
  {
    slug: "lumina-interiors",
    category: "social-media",
    cover: photo("photo-1618221195710-dd6b41faaea6"),
    gallery: [photo("photo-1618221195710-dd6b41faaea6"), photo("photo-1616486338812-3dadae4b4ace"), photo("photo-1615874959474-d609969a20ed")],
    technologies: ["Instagram", "Direction photo", "Meta Ads"],
    copy: {
      fr: {
        title: "Lumina Interiors",
        client: "Marque de décoration",
        excerpt: "Une ligne de contenus qui montre les intérieurs, et des campagnes qui amènent des visites showroom.",
        description:
          "La marque publiait sans suite. Nous avons fixé trois sujets — matières, chantiers, conseils — et un rythme de deux publications par semaine. Les meilleures images alimentent des campagnes ciblées vers la prise de rendez-vous showroom.",
        objectives: ["Tenir une voix", "Remplir le showroom", "Réutiliser les photos de chantier"],
        results: [
          { label: "Visites showroom", value: "+27 / mois" },
          { label: "Formats tenus", value: "3" },
          { label: "Campagnes actives", value: "Meta Ads" },
        ],
        testimonial: "Le compte ressemble enfin à la maison. Les gens qui viennent ont déjà vu le travail.",
        seoTitle: "Lumina Interiors — contenus et showroom",
        seoDescription: "Ligne éditoriale et campagnes sociales pour une marque de décoration intérieure.",
      },
      en: {
        title: "Lumina Interiors",
        client: "Interior design brand",
        excerpt: "A content line that shows interiors, and campaigns that fill the showroom.",
        description: "The brand was posting without a thread. We set three subjects — materials, sites, advice — and a rhythm of two posts a week. The best images feed targeted campaigns toward showroom appointments.",
        objectives: ["Hold a voice", "Fill the showroom", "Reuse site photographs"],
        results: [
          { label: "Showroom visits", value: "+27 / month" },
          { label: "Held formats", value: "3" },
          { label: "Active campaigns", value: "Meta Ads" },
        ],
        testimonial: "The account finally looks like the house. People who visit have already seen the work.",
        seoTitle: "Lumina Interiors — content and showroom",
        seoDescription: "Editorial line and social campaigns for an interior design brand.",
      },
      ar: {
        title: "لومينا للديكور الداخلي",
        client: "علامة ديكور داخلي",
        excerpt: "خط محتوى يُظهر الدواخل، وحملات تملأ فضاء العرض.",
        description: "كانت العلامة تنشر بلا خيط. ثبتنا ثلاثة مواضيع — المواد، الأوراش، النصائح — وإيقاع منشورين في الأسبوع.",
        objectives: ["تثبيت صوت", "ملء فضاء العرض", "إعادة استعمال صور الورش"],
        results: [
          { label: "زيارات العرض", value: "+27 / شهر" },
          { label: "قوالب ثابتة", value: "3" },
          { label: "حملات", value: "Meta Ads" },
        ],
        testimonial: "الحساب يشبه الدار أخيرًا. من يأتي قد رأى العمل.",
        seoTitle: "لومينا — محتوى وفضاء عرض",
        seoDescription: "خط تحريري وحملات اجتماعية لعلامة ديكور داخلي.",
      },
    },
  },
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
