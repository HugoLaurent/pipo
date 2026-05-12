import { PROJECTS, getProjectPath } from "./projects.js";

export const SITE_URL = "https://vincentgelee.fr";
export const SITE_NAME = "Vincent Gelée";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export const BASE_SEO = {
  title: "Vincent Gelée | Compositeur musique à l'image & sound design",
  description:
    "Portfolio de Vincent Gelée, compositeur de musique à l'image à Paris : rescoring, sound design et créations sonores pour jeu vidéo, publicité et cinéma.",
  path: "/",
  sectionTitle: "Vincent Gelée - compositeur musique à l'image",
};

export const SECTION_PAGES = [
  {
    path: "/",
    sectionKey: "home",
    title: BASE_SEO.title,
    description: BASE_SEO.description,
    sectionTitle: BASE_SEO.sectionTitle,
  },
  {
    path: "/projets/",
    sectionKey: "projets",
    title: "Projets de rescoring et sound design | Vincent Gelée",
    description:
      "Découvrez les projets de rescoring, sound design et musique à l'image de Vincent Gelée pour jeu vidéo, publicité et formats narratifs.",
    sectionTitle: "Projets de rescoring et sound design",
  },
  {
    path: "/a-propos/",
    sectionKey: "apropos",
    title: "À propos | Vincent Gelée compositeur à Paris",
    description:
      "Vincent Gelée est compositeur et créateur sonore basé à Paris, spécialisé en musique à l'image, jeu vidéo, cinéma et publicité.",
    sectionTitle: "À propos de Vincent Gelée",
  },
  {
    path: "/contact/",
    sectionKey: "contact",
    title: "Contact compositeur musique à l'image | Vincent Gelée",
    description:
      "Contactez Vincent Gelée pour une composition musicale, un rescoring ou une direction sonore pour jeu vidéo, film, bande-annonce ou publicité.",
    sectionTitle: "Contact compositeur musique à l'image",
  },
];

export const PROJECT_PAGES = PROJECTS.map((project) => ({
  path: getProjectPath(project),
  sectionKey: "projets",
  projectSlug: project.slug,
  title: project.seoTitle,
  description: project.seoDescription,
  sectionTitle: project.shortTitle,
}));

export const SEO_PAGES = [...SECTION_PAGES, ...PROJECT_PAGES];

export function normalizePath(pathname) {
  if (!pathname || pathname === "/") return "/";
  const cleanPath = pathname.split(/[?#]/)[0];
  return cleanPath.endsWith("/") ? cleanPath : `${cleanPath}/`;
}

export function getAbsoluteUrl(path) {
  return `${SITE_URL}${path === "/" ? "/" : path}`;
}

export function getSeoPageByPath(pathname) {
  const normalizedPath = normalizePath(pathname);
  return (
    SEO_PAGES.find((page) => page.path === normalizedPath) ||
    SECTION_PAGES[0]
  );
}
