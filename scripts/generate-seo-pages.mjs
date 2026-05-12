import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PROJECTS, getProjectBySlug, getProjectPath } from "../src/data/projects.js";
import {
  DEFAULT_OG_IMAGE,
  SEO_PAGES,
  SITE_NAME,
  SITE_URL,
  getAbsoluteUrl,
} from "../src/data/seo.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const distIndexPath = path.join(distDir, "index.html");
const lastmod = new Date().toISOString().slice(0, 10);

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function replaceOrInsert(html, pattern, replacement, before = "</head>") {
  if (pattern.test(html)) {
    return html.replace(pattern, replacement);
  }
  return html.replace(before, `  ${replacement}\n${before}`);
}

function getPageProject(page) {
  return page.projectSlug ? getProjectBySlug(page.projectSlug) : null;
}

function createJsonLd(page) {
  const project = getPageProject(page);
  const pageUrl = getAbsoluteUrl(page.path);
  const graph = [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#vincent-gelee`,
      name: "Vincent Gelée",
      jobTitle: "Compositeur de musique à l'image",
      email: "mailto:vgelee@gmail.com",
      url: `${SITE_URL}/`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Paris",
        addressCountry: "FR",
      },
      knowsAbout: [
        "musique à l'image",
        "composition musicale",
        "sound design",
        "rescoring",
        "musique de jeu vidéo",
        "musique de publicité",
        "musique de film",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      inLanguage: "fr-FR",
      publisher: { "@id": `${SITE_URL}/#vincent-gelee` },
      description:
        "Portfolio de Vincent Gelée, compositeur de musique à l'image à Paris.",
    },
    {
      "@type": project ? "CreativeWork" : "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: page.title,
      description: page.description,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#vincent-gelee` },
      inLanguage: "fr-FR",
    },
  ];

  if (project) {
    graph[2].creator = { "@id": `${SITE_URL}/#vincent-gelee` };
    graph[2].genre = "Musique à l'image";
    graph[2].keywords = [
      "rescoring",
      "sound design",
      "composition musicale",
      "musique à l'image",
    ];
    graph[2].text = project.description.join(" ");
    return {
      "@context": "https://schema.org",
      "@graph": graph,
    };
  }

  graph.push({
    "@type": "ItemList",
    "@id": `${SITE_URL}/projets/#project-list`,
    name: "Projets de rescoring et sound design",
    itemListElement: PROJECTS.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: getAbsoluteUrl(getProjectPath(item)),
      item: {
        "@type": "CreativeWork",
        name: item.shortTitle,
        description: item.seoDescription,
      },
    })),
  });

  graph[2].mainEntity = { "@id": `${SITE_URL}/projets/#project-list` };

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

function renderProjectLinks() {
  return PROJECTS.map(
    (project) =>
      `<li><a href="${getProjectPath(project)}">${escapeHtml(project.shortTitle)}</a> - ${escapeHtml(project.seoDescription)}</li>`,
  ).join("\n          ");
}

function renderStaticContent(page) {
  const project = getPageProject(page);
  const projectBody = project
    ? `
      <article>
        <p>${escapeHtml(project.seoDescription)}</p>
        ${project.description.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("\n        ")}
        <p><a href="/projets/">Voir tous les projets de rescoring et sound design</a></p>
      </article>`
    : `
      <p>${escapeHtml(page.description)}</p>
      <section>
        <h2>Projets de rescoring et sound design</h2>
        <ul>
          ${renderProjectLinks()}
        </ul>
      </section>
      <section>
        <h2>Composition, sound design et musique à l'image</h2>
        <p>Vincent Gelée compose des musiques pensées pour l'image, avec une approche centrée sur l'émotion, le rythme, la narration et l'identité sonore.</p>
      </section>
      <section>
        <h2>Contact</h2>
        <p><a href="mailto:vgelee@gmail.com">vgelee@gmail.com</a></p>
      </section>`;

  return `
  <main id="seo-prerender" style="max-width: 920px; margin: 0 auto; padding: 48px 24px; color: #13293D; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.7;">
    <h1 style="font-size: clamp(2rem, 6vw, 4.5rem); line-height: 1.05; margin: 0 0 24px;">${escapeHtml(page.sectionTitle)}</h1>
    ${projectBody}
  </main>`;
}

function updateHead(html, page) {
  const url = getAbsoluteUrl(page.path);
  const jsonLd = JSON.stringify(createJsonLd(page), null, 2);

  let nextHtml = html;
  nextHtml = replaceOrInsert(
    nextHtml,
    /<title>[\s\S]*?<\/title>/,
    `<title>${escapeHtml(page.title)}</title>`,
  );
  nextHtml = replaceOrInsert(
    nextHtml,
    /<meta\s+name="description"[\s\S]*?\/>/,
    `<meta name="description" content="${escapeHtml(page.description)}" />`,
  );
  nextHtml = replaceOrInsert(
    nextHtml,
    /<link\s+rel="canonical"[\s\S]*?\/>/,
    `<link rel="canonical" href="${url}" />`,
  );
  nextHtml = replaceOrInsert(
    nextHtml,
    /<link\s+rel="alternate"\s+hreflang="fr"[\s\S]*?\/>/,
    `<link rel="alternate" hreflang="fr" href="${url}" />`,
  );
  nextHtml = replaceOrInsert(
    nextHtml,
    /<link\s+rel="alternate"\s+hreflang="x-default"[\s\S]*?\/>/,
    `<link rel="alternate" hreflang="x-default" href="${url}" />`,
  );
  nextHtml = replaceOrInsert(
    nextHtml,
    /<meta\s+property="og:title"[\s\S]*?\/>/,
    `<meta property="og:title" content="${escapeHtml(page.title)}" />`,
  );
  nextHtml = replaceOrInsert(
    nextHtml,
    /<meta\s+property="og:description"[\s\S]*?\/>/,
    `<meta property="og:description" content="${escapeHtml(page.description)}" />`,
  );
  nextHtml = replaceOrInsert(
    nextHtml,
    /<meta\s+property="og:url"[\s\S]*?\/>/,
    `<meta property="og:url" content="${url}" />`,
  );
  nextHtml = replaceOrInsert(
    nextHtml,
    /<meta\s+property="og:image"[\s\S]*?\/>/,
    `<meta property="og:image" content="${DEFAULT_OG_IMAGE}" />`,
  );
  nextHtml = replaceOrInsert(
    nextHtml,
    /<meta\s+name="twitter:title"[\s\S]*?\/>/,
    `<meta name="twitter:title" content="${escapeHtml(page.title)}" />`,
  );
  nextHtml = replaceOrInsert(
    nextHtml,
    /<meta\s+name="twitter:description"[\s\S]*?\/>/,
    `<meta name="twitter:description" content="${escapeHtml(page.description)}" />`,
  );
  nextHtml = replaceOrInsert(
    nextHtml,
    /<meta\s+name="twitter:image"[\s\S]*?\/>/,
    `<meta name="twitter:image" content="${DEFAULT_OG_IMAGE}" />`,
  );
  nextHtml = replaceOrInsert(
    nextHtml,
    /<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script type="application/ld+json">\n${jsonLd}\n  </script>`,
  );

  return nextHtml;
}

function updateBody(html, page) {
  const withoutNoscript = html.replace(/\s*<noscript>[\s\S]*?<\/noscript>/, "");
  return withoutNoscript.replace(
    /<div id="root"><\/div>/,
    `${renderStaticContent(page)}\n  <div id="root"></div>`,
  );
}

function getOutputPath(pagePath) {
  if (pagePath === "/") return distIndexPath;

  const segments = pagePath.split("/").filter(Boolean);
  return path.join(distDir, ...segments, "index.html");
}

async function writePage(baseHtml, page) {
  const outputPath = getOutputPath(page.path);
  const pageHtml = updateBody(updateHead(baseHtml, page), page);

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, pageHtml, "utf8");
}

async function writeSitemap() {
  const urls = SEO_PAGES.map((page) => {
    const priority = page.path === "/" ? "1.00" : page.projectSlug ? "0.70" : "0.85";
    return `  <url>
    <loc>${getAbsoluteUrl(page.path)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }).join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  await writeFile(path.join(distDir, "sitemap.xml"), sitemap, "utf8");
}

const baseHtml = await readFile(distIndexPath, "utf8");

await Promise.all(SEO_PAGES.map((page) => writePage(baseHtml, page)));
await writeSitemap();
