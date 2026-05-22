import Background from "./components/Background";
import ContentSection from "./components/ContentSection";
import HomeHero from "./components/HomeHero";
import SiteNav from "./components/SiteNav";
import SocialFooter from "./components/SocialFooter";
import { PROJECTS, getProjectBySlug, getProjectPath } from "./data/projects";
import { getAbsoluteUrl, getSeoPageByPath, normalizePath } from "./data/seo";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import gsap from "gsap";

const THEMES = {
  home: {
    slug: "home",
    pageBg: "#FFFFFF",
    surfaceBg: "#F4E4BA",
    titleBg: "#13293D",
    titleText: "#FFFFFF",
    text: "#13293D",
    buttonBg: "#13293D",
    buttonHoverBg: "#A26769",
    buttonText: "#FFFFFF",
    dotBase: "#13293D",
    dotHover: "#95B8D1",
    glowColor: "#FFFFFF",
  },
  projets: {
    slug: "projets",
    pageBg: "#FFFFFF",
    surfaceBg: "#95B8D1",
    titleBg: "#95B8D1",
    titleText: "#13293D",
    text: "#13293D",
    buttonBg: "#95B8D1",
    buttonHoverBg: "#13293D",
    buttonText: "#13293D",
    dotBase: "#95B8D1",
    dotHover: "#95B8D1",
    glowColor: "#FFFFFF",
  },
  apropos: {
    slug: "apropos",
    pageBg: "#FFFFFF",
    surfaceBg: "#F4E4BA",
    titleBg: "#F4E4BA",
    titleText: "#13293D",
    text: "#13293D",
    buttonBg: "#F4E4BA",
    buttonHoverBg: "#95B8D1",
    buttonText: "#13293D",
    dotBase: "#F4E4BA",
    dotHover: "#F4E4BA",
    glowColor: "#FFFFFF",
  },
  contact: {
    slug: "contact",
    pageBg: "#FFFFFF",
    surfaceBg: "#A26769",
    titleBg: "#A26769",
    titleText: "#FFFFFF",
    text: "#13293D",
    buttonBg: "#A26769",
    buttonHoverBg: "#13293D",
    buttonText: "#FFFFFF",
    dotBase: "#A26769",
    dotHover: "#A26769",
    glowColor: "#FFFFFF",
  },
};

const SECTION_PATHS = {
  home: "/",
  projets: "/projets/",
  apropos: "/a-propos/",
  contact: "/contact/",
};

function getRouteState(pathname) {
  const path = normalizePath(pathname);
  const projectMatch = path.match(/^\/projets\/([^/]+)\/$/);

  if (projectMatch) {
    const project = getProjectBySlug(projectMatch[1]);
    if (project) {
      return {
        path,
        sectionKey: "projets",
        project,
        projectIndex: PROJECTS.findIndex((item) => item.slug === project.slug),
      };
    }
  }

  const page = getSeoPageByPath(path);
  return {
    path,
    sectionKey: page.sectionKey,
    project: null,
    projectIndex: -1,
  };
}

function updateMetaTag(selector, attribute, value) {
  const element = document.head.querySelector(selector);
  if (element) {
    element.setAttribute(attribute, value);
  }
}

function hexToRgbTriplet(hex) {
  const value = hex.replace("#", "");
  const normalized = value.length === 3 ? value.replace(/./g, "$&$&") : value;
  const intValue = Number.parseInt(normalized, 16);
  const r = (intValue >> 16) & 255;
  const g = (intValue >> 8) & 255;
  const b = intValue & 255;
  return `${r}, ${g}, ${b}`;
}

function hexToRgbObject(hex) {
  const value = hex.replace("#", "");
  const normalized = value.length === 3 ? value.replace(/./g, "$&$&") : value;
  const intValue = Number.parseInt(normalized, 16);
  return {
    r: (intValue >> 16) & 255,
    g: (intValue >> 8) & 255,
    b: intValue & 255,
  };
}

function interpolateRgb(from, to, progress) {
  return {
    r: Math.round(from.r + (to.r - from.r) * progress),
    g: Math.round(from.g + (to.g - from.g) * progress),
    b: Math.round(from.b + (to.b - from.b) * progress),
  };
}

function App() {
  const [currentPath, setCurrentPath] = useState(() =>
    normalizePath(window.location.pathname),
  );

  useLayoutEffect(() => {
    let lastWidth = window.innerWidth;

    function setAppHeight() {
      document.documentElement.style.setProperty(
        "--app-height",
        `${window.innerHeight}px`,
      );
      window.dispatchEvent(new Event("app-height-change"));
    }

    function handleResize() {
      const nextWidth = window.innerWidth;
      const isMobile = nextWidth < 768;

      if (!isMobile || nextWidth !== lastWidth) {
        lastWidth = nextWidth;
        setAppHeight();
      }
    }

    setAppHeight();
    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("orientationchange", setAppHeight, {
      passive: true,
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", setAppHeight);
    };
  }, []);

  const arrowDots = [
    { x: 50, y: 52, r: 3 },
    { x: 60, y: 52, r: 3 },
    { x: 70, y: 52, r: 3 },
    { x: 50, y: 66, r: 3 },
    { x: 60, y: 66, r: 3 },
    { x: 70, y: 66, r: 3 },
    { x: 50, y: 80, r: 3 },
    { x: 60, y: 80, r: 3 },
    { x: 70, y: 80, r: 3 },
    { x: 40, y: 94, r: 3 },
    { x: 50, y: 94, r: 3 },
    { x: 60, y: 94, r: 3 },
    { x: 70, y: 94, r: 3 },
    { x: 80, y: 94, r: 3 },
    { x: 50, y: 108, r: 3 },
    { x: 60, y: 108, r: 3 },
    { x: 70, y: 108, r: 3 },
    { x: 60, y: 120, r: 3 },
  ];

  const sectionRefs = useRef({});
  const sectionsPositionsRef = useRef([]);
  const [activeThemeKey, setActiveThemeKey] = useState("home");
  const activeThemeKeyRef = useRef("home");
  const [projectsPage, setProjectsPage] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectModalOrigin, setProjectModalOrigin] = useState(null);
  const aboutCardsRef = useRef([]);
  const projectCardsRef = useRef([]);
  const paginationDotsRef = useRef([]);
  const projectModalOverlayRef = useRef(null);
  const projectModalPanelRef = useRef(null);
  const isProjectModalClosingRef = useRef(false);
  const animatedColorsRef = useRef({
    base: { r: 19, g: 41, b: 61 },
    hover: { r: 149, g: 184, b: 209 },
    glow: { r: 255, g: 255, b: 255 },
  });

  const activeTheme = THEMES[activeThemeKey];
  const [projectsPerPage, setProjectsPerPage] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < 768 ? 2 : 3,
  );

  const navigateToPath = useCallback((path) => {
    const nextPath = normalizePath(path);
    if (normalizePath(window.location.pathname) !== nextPath) {
      window.history.pushState({}, "", nextPath);
    }
    setCurrentPath(nextPath);
  }, []);

  useEffect(() => {
    function handlePopState() {
      setCurrentPath(normalizePath(window.location.pathname));
    }

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    const page = getSeoPageByPath(currentPath);
    const canonicalUrl = getAbsoluteUrl(page.path);

    document.title = page.title;
    updateMetaTag('meta[name="description"]', "content", page.description);
    updateMetaTag('link[rel="canonical"]', "href", canonicalUrl);
    updateMetaTag('meta[property="og:title"]', "content", page.title);
    updateMetaTag(
      'meta[property="og:description"]',
      "content",
      page.description,
    );
    updateMetaTag('meta[property="og:url"]', "content", canonicalUrl);
    updateMetaTag('meta[name="twitter:title"]', "content", page.title);
    updateMetaTag(
      'meta[name="twitter:description"]',
      "content",
      page.description,
    );
  }, [currentPath]);

  useEffect(() => {
    activeThemeKeyRef.current = activeThemeKey;
  }, [activeThemeKey]);

  useEffect(() => {
    function updateProjectsPerPage() {
      const value = window.innerWidth < 768 ? 2 : 3;
      setProjectsPerPage(value);
    }

    updateProjectsPerPage();
    window.addEventListener("resize", updateProjectsPerPage, { passive: true });
    window.addEventListener("orientationchange", updateProjectsPerPage, {
      passive: true,
    });

    return () => {
      window.removeEventListener("resize", updateProjectsPerPage);
      window.removeEventListener("orientationchange", updateProjectsPerPage);
    };
  }, []);

  const currentRoute = useMemo(() => getRouteState(currentPath), [currentPath]);
  const projectsPageCount = Math.ceil(PROJECTS.length / projectsPerPage);
  const routeProjectsPage =
    currentRoute.projectIndex >= 0
      ? Math.floor(currentRoute.projectIndex / projectsPerPage)
      : null;
  const activeProjectsPage = Math.min(
    routeProjectsPage ?? projectsPage,
    Math.max(0, projectsPageCount - 1),
  );
  const visibleProjects = PROJECTS.slice(
    activeProjectsPage * projectsPerPage,
    activeProjectsPage * projectsPerPage + projectsPerPage,
  );

  useEffect(() => {
    const targetSection = sectionRefs.current[currentRoute.sectionKey];
    const scrollFrame = requestAnimationFrame(() => {
      targetSection?.scrollIntoView({ block: "start", behavior: "smooth" });
    });

    if (currentRoute.project) {
      if (selectedProject?.slug !== currentRoute.project.slug) {
        const modalFrame = requestAnimationFrame(() => {
          setProjectModalOrigin({
            top: Math.max(24, window.innerHeight / 2 - 90),
            left: Math.max(16, window.innerWidth / 2 - 160),
            width: Math.min(320, window.innerWidth - 32),
            height: 180,
          });
          setSelectedProject(currentRoute.project);
        });
        return () => {
          cancelAnimationFrame(scrollFrame);
          cancelAnimationFrame(modalFrame);
        };
      }
      return () => {
        cancelAnimationFrame(scrollFrame);
      };
    }

    if (selectedProject) {
      const closeFrame = requestAnimationFrame(() => {
        setSelectedProject(null);
        setProjectModalOrigin(null);
        isProjectModalClosingRef.current = false;
      });
      return () => {
        cancelAnimationFrame(scrollFrame);
        cancelAnimationFrame(closeFrame);
      };
    }

    return () => {
      cancelAnimationFrame(scrollFrame);
    };
  }, [currentRoute, selectedProject]);

  const themeVars = useMemo(
    () => ({
      "--theme-text-rgb": hexToRgbTriplet(activeTheme.text),
      "--theme-button-bg-rgb": hexToRgbTriplet(activeTheme.buttonBg),
      "--theme-button-hover-bg-rgb": hexToRgbTriplet(activeTheme.buttonHoverBg),
      "--theme-button-text-rgb": hexToRgbTriplet(activeTheme.buttonText),
    }),
    [activeTheme],
  );

  const openProjectModal = useCallback(
    (project, element) => {
      const rect = element.getBoundingClientRect();
      isProjectModalClosingRef.current = false;
      navigateToPath(getProjectPath(project));
      setProjectModalOrigin({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
      setSelectedProject(project);
    },
    [navigateToPath],
  );

  const closeProjectModal = useCallback(() => {
    if (isProjectModalClosingRef.current) return;
    isProjectModalClosingRef.current = true;

    const overlay = projectModalOverlayRef.current;
    const panel = projectModalPanelRef.current;

    if (!overlay || !panel || !projectModalOrigin) {
      setSelectedProject(null);
      setProjectModalOrigin(null);
      navigateToPath(SECTION_PATHS.projets);
      return;
    }

    gsap.to(overlay, {
      opacity: 0,
      duration: 0.2,
      ease: "power2.out",
      overwrite: true,
    });

    gsap.to(panel, {
      top: projectModalOrigin.top,
      left: projectModalOrigin.left,
      width: projectModalOrigin.width,
      height: projectModalOrigin.height,
      duration: 0.36,
      ease: "power3.inOut",
      overwrite: true,
      onComplete: () => {
        setSelectedProject(null);
        setProjectModalOrigin(null);
        isProjectModalClosingRef.current = false;
        navigateToPath(SECTION_PATHS.projets);
      },
    });
  }, [navigateToPath, projectModalOrigin]);

  const liftProjectCard = useCallback((element) => {
    gsap.to(element, {
      y: -5,
      boxShadow: "0 14px 28px rgba(19, 41, 61, 0.16)",
      duration: 0.24,
      ease: "power2.out",
      overwrite: true,
    });
  }, []);

  const resetProjectCard = useCallback((element) => {
    gsap.to(element, {
      y: 0,
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
      duration: 0.24,
      ease: "power2.out",
      overwrite: true,
      clearProps: "transform,boxShadow",
    });
  }, []);

  useLayoutEffect(() => {
    const cards = projectCardsRef.current
      .slice(0, visibleProjects.length)
      .filter(Boolean);
    const dots = paginationDotsRef.current.filter(Boolean);

    gsap.fromTo(
      cards,
      { autoAlpha: 0, y: 16 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.42,
        ease: "power3.out",
        stagger: 0.06,
        overwrite: true,
        clearProps: "transform",
      },
    );

    gsap.to(dots, {
      scale: (index) => (index === activeProjectsPage ? 1.45 : 1),
      opacity: (index) => (index === activeProjectsPage ? 1 : 0.55),
      duration: 0.28,
      ease: "power2.out",
      overwrite: true,
    });
  }, [activeProjectsPage, visibleProjects.length]);

  useLayoutEffect(() => {
    if (activeThemeKey !== "apropos") return;

    const cards = aboutCardsRef.current.filter(Boolean);
    gsap.fromTo(
      cards,
      { autoAlpha: 0, x: 28 },
      {
        autoAlpha: 1,
        x: 0,
        duration: 0.48,
        ease: "power3.out",
        stagger: 0.08,
        overwrite: true,
        clearProps: "transform",
      },
    );
  }, [activeThemeKey]);

  useLayoutEffect(() => {
    const overlay = projectModalOverlayRef.current;
    const panel = projectModalPanelRef.current;
    if (!selectedProject || !projectModalOrigin || !overlay || !panel) return;

    const finalWidth = Math.min(window.innerWidth - 32, 1152);
    const finalHeight = Math.min(window.innerHeight - 64, 900);
    const finalTop = (window.innerHeight - finalHeight) / 2;
    const finalLeft = (window.innerWidth - finalWidth) / 2;

    gsap.set(overlay, { opacity: 0 });
    gsap.set(panel, {
      top: projectModalOrigin.top,
      left: projectModalOrigin.left,
      width: projectModalOrigin.width,
      height: projectModalOrigin.height,
    });

    gsap.to(overlay, {
      opacity: 1,
      duration: 0.24,
      ease: "power2.out",
      overwrite: true,
    });

    gsap.to(panel, {
      top: finalTop,
      left: finalLeft,
      width: finalWidth,
      height: finalHeight,
      duration: 0.48,
      ease: "power3.inOut",
      overwrite: true,
    });
  }, [projectModalOrigin, selectedProject]);

  useEffect(() => {
    if (!selectedProject) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        closeProjectModal();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeProjectModal, selectedProject]);

  useEffect(() => {
    let frame = 0;

    function computeSections() {
      const sections = Object.entries(sectionRefs.current)
        .map(([key, element]) => {
          if (!element || !THEMES[key]) return null;

          return {
            key,
            element,
            center: element.offsetTop + element.offsetHeight / 2,
          };
        })
        .filter(Boolean)
        .sort((a, b) => a.center - b.center);

      sectionsPositionsRef.current = sections;
      return sections;
    }

    function getClosestFromCache() {
      const sections = sectionsPositionsRef.current;
      const viewportCenter = window.scrollY + window.innerHeight / 2;
      let closestKey = "home";
      let closestSection = null;
      let closestDistance = Number.POSITIVE_INFINITY;

      sections.forEach((section) => {
        const distance = Math.abs(section.center - viewportCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestKey = section.key;
          closestSection = section;
        }
      });

      return { closestKey, closestSection, sections, viewportCenter };
    }

    function updateActiveTheme() {
      const { closestKey, sections, viewportCenter } = getClosestFromCache();

      if (!sections || sections.length === 0) return;

      const nextSectionIndex = sections.findIndex(
        (section) => section.center >= viewportCenter,
      );
      const fromSection =
        nextSectionIndex === -1
          ? sections[sections.length - 1]
          : sections[Math.max(0, nextSectionIndex - 1)];
      const toSection =
        nextSectionIndex === -1
          ? sections[sections.length - 1]
          : sections[nextSectionIndex];

      if (fromSection && toSection) {
        const span = Math.max(1, toSection.center - fromSection.center);
        const progress =
          fromSection.key === toSection.key
            ? 0
            : Math.min(
                1,
                Math.max(0, (viewportCenter - fromSection.center) / span),
              );
        const fromTheme = THEMES[fromSection.key];
        const toTheme = THEMES[toSection.key];

        animatedColorsRef.current.base = interpolateRgb(
          hexToRgbObject(fromTheme.dotBase),
          hexToRgbObject(toTheme.dotBase),
          progress,
        );
        animatedColorsRef.current.hover = interpolateRgb(
          hexToRgbObject(fromTheme.dotHover),
          hexToRgbObject(toTheme.dotHover),
          progress,
        );
        animatedColorsRef.current.glow = interpolateRgb(
          hexToRgbObject(fromTheme.glowColor),
          hexToRgbObject(toTheme.glowColor),
          progress,
        );
      }

      if (closestKey !== activeThemeKeyRef.current) {
        activeThemeKeyRef.current = closestKey;
        setActiveThemeKey(closestKey);
      }
    }

    function requestUpdate() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateActiveTheme);
    }

    // compute initial cache and wire listeners
    computeSections();
    updateActiveTheme();

    const onResize = () => {
      computeSections();
      requestUpdate();
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);

  return (
    <Background
      baseColor={activeTheme.dotBase}
      glowColor={activeTheme.glowColor}
      hoverColor={activeTheme.dotHover}
      animatedColorsRef={animatedColorsRef}
    >
      <main
        className="relative px-4 transition-colors duration-700 md:px-4"
        style={themeVars}
      >
        <SiteNav
          theme={activeTheme}
          activeThemeKey={activeThemeKey}
          animatedColorsRef={animatedColorsRef}
          onNavigate={navigateToPath}
        />

        <section
          id="accueil"
          ref={(element) => {
            sectionRefs.current.home = element;
          }}
          data-theme-key="home"
          className="snap-section relative flex h-[var(--app-height)] items-center justify-center md:h-dvh"
          style={{ minHeight: "var(--app-height)" }}
        >
          <HomeHero
            arrowDots={arrowDots}
            theme={THEMES.home}
            animatedColorsRef={animatedColorsRef}
          />
        </section>

        <ContentSection
          id="projets"
          sectionRef={(element) => {
            sectionRefs.current.projets = element;
          }}
          dataThemeKey="projets"
          contentClassName="w-full max-w-5xl"
          title="Projets de rescoring et sound design"
          subtitle="Musiques à l’image pour jeu vidéo, publicité et formats narratifs"
        >
          <div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-5">
              {visibleProjects.map((project, index) => (
                <a
                  key={project.title}
                  href={getProjectPath(project)}
                  ref={(element) => {
                    projectCardsRef.current[index] = element;
                  }}
                  aria-label={`Voir le détail du projet ${project.title}`}
                  className="grid overflow-hidden rounded-lg bg-white/90 text-left no-underline shadow-sm ring-1 ring-black/10 backdrop-blur-sm transition-colors hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#13293D] sm:grid-cols-[minmax(120px,0.9fr)_minmax(0,1.1fr)] md:block"
                  onMouseEnter={(event) => liftProjectCard(event.currentTarget)}
                  onMouseLeave={(event) =>
                    resetProjectCard(event.currentTarget)
                  }
                  onFocus={(event) => liftProjectCard(event.currentTarget)}
                  onBlur={(event) => resetProjectCard(event.currentTarget)}
                  onClick={(event) => {
                    event.preventDefault();
                    openProjectModal(project, event.currentTarget);
                  }}
                >
                  <video
                    className="pointer-events-none aspect-video h-full w-full bg-zinc-100 object-cover"
                    src={
                      project.previewTime
                        ? `${project.videoUrl}#t=${project.previewTime}`
                        : project.videoUrl
                    }
                    muted
                    playsInline
                    preload="metadata"
                    aria-label={`Extrait vidéo du projet ${project.title}`}
                    title={`Extrait vidéo du projet ${project.title}`}
                  />
                  <div className="border-l-4 border-[#95B8D1] p-3 md:p-4">
                    <h3 className="text-sm font-semibold leading-tight text-[#13293D] md:text-base">
                      {project.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#13293D]/80 md:text-sm md:leading-6">
                      {project.description.join(" ")}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            <nav className="sr-only" aria-label="Tous les projets">
              <ul>
                {PROJECTS.map((project) => (
                  <li key={project.slug}>
                    <a href={getProjectPath(project)}>{project.title}</a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-4 flex items-center justify-between gap-3 md:mt-5 md:gap-4">
              <button
                type="button"
                className="rounded-md bg-white/90 px-3 py-2 text-xs font-medium text-[#13293D] shadow-sm ring-1 ring-black/10 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 md:text-sm"
                disabled={activeProjectsPage === 0}
                onClick={() =>
                  setProjectsPage((currentPage) => Math.max(0, currentPage - 1))
                }
              >
                Précédent
              </button>

              <div className="flex items-center gap-2" aria-label="Pagination">
                {Array.from({ length: projectsPageCount }, (_, index) => (
                  <button
                    key={index}
                    ref={(element) => {
                      paginationDotsRef.current[index] = element;
                    }}
                    type="button"
                    aria-label={`Page ${index + 1}`}
                    aria-current={
                      activeProjectsPage === index ? "page" : undefined
                    }
                    className={`h-2.5 w-2.5 rounded-full transition-colors ${
                      activeProjectsPage === index
                        ? "bg-[#13293D]"
                        : "bg-[#95B8D1]"
                    }`}
                    onClick={() => setProjectsPage(index)}
                  />
                ))}
              </div>

              <button
                type="button"
                className="rounded-md bg-white/90 px-3 py-2 text-xs font-medium text-[#13293D] shadow-sm ring-1 ring-black/10 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 md:text-sm"
                disabled={activeProjectsPage === projectsPageCount - 1}
                onClick={() =>
                  setProjectsPage((currentPage) =>
                    Math.min(projectsPageCount - 1, currentPage + 1),
                  )
                }
              >
                Suivant
              </button>
            </div>

            <p className="mt-3 text-center text-[11px] leading-5 text-[#13293D]/65 md:mt-4 md:text-xs">
              Exercices personnels de rescoring sonore. Les images et marques
              appartiennent à leurs ayants droit respectifs ; ces projets ne
              sont pas affiliés aux marques présentées.
            </p>
          </div>
        </ContentSection>

        <ContentSection
          id="apropos"
          sectionRef={(element) => {
            sectionRefs.current.apropos = element;
          }}
          dataThemeKey="apropos"
          contentClassName="w-full max-w-4xl"
          title="À propos de Vincent Gelée"
          subtitle="Compositeur et créateur sonore basé à Paris"
        >
          <div className="grid gap-5 md:grid-cols-[minmax(0,1.2fr)_minmax(220px,0.8fr)] md:gap-8">
            <div className="space-y-4 rounded-lg bg-white/35 text-[#13293D]  md:space-y-5">
              <p>
                Compositeur et créateur sonore basé à Paris, je compose des
                musiques pensées pour l’image, avec une approche centrée sur
                l’émotion, le rythme et la narration.
              </p>
              <p>
                Influencé par le jeu vidéo, les trailers et la publicité, je
                cherche avant tout à créer des univers sonores capables de
                s’intégrer à une atmosphère et de renforcer l’identité d’un
                projet.
              </p>
              <p>
                Ma manière de composer commence par la dynamique et l’énergie,
                avant de laisser place à l’émotion puis au détail sonore.
                Guitariste de formation et passionné par de nombreux styles
                musicaux, j’aime explorer différentes couleurs et sensibilités à
                travers chaque collaboration.
              </p>
              <p>
                Aujourd’hui, je développe principalement des créations autour du
                jeu vidéo, des formats cinématographiques et de la publicité.
              </p>
            </div>

            <div className="grid gap-2 text-sm text-[#13293D] sm:grid-cols-2 md:grid-cols-1 md:gap-3">
              {[
                ["Approche", "Émotion, rythme, narration"],
                ["Formats", "Jeu vidéo, cinéma, publicité"],
                ["Univers", "Atmosphère, émotion, identité sonore"],
                ["Base", "Paris et collaborations à distance"],
              ].map(([label, value], index) => (
                <div
                  key={label}
                  ref={(element) => {
                    aboutCardsRef.current[index] = element;
                  }}
                  className="rounded-lg border-l-4 border-[#F4E4BA] bg-white/70 p-3 shadow-sm ring-1 ring-black/10 backdrop-blur-sm md:p-4"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-[#13293D]/60">
                    {label}
                  </p>
                  <p className="mt-2 font-medium text-[#13293D]">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </ContentSection>

        <ContentSection
          id="contact"
          sectionRef={(element) => {
            sectionRefs.current.contact = element;
          }}
          dataThemeKey="contact"
          contentClassName="w-full max-w-4xl"
          title="Contact compositeur musique à l'image"
          subtitle="Parler d'un projet sonore ou musical"
        >
          <div className="grid items-center gap-5 md:grid-cols-[minmax(0,1.1fr)_minmax(240px,0.9fr)] md:gap-8">
            <div className="space-y-4 rounded-lg bg-white/35 text-[#13293D]  md:space-y-5">
              <p>
                Vous préparez un jeu, un film, une bande-annonce ou une campagne
                ? Je suis disponible pour échanger autour de votre projet,
                comprendre son intention et imaginer une direction sonore
                adaptée.
              </p>
              <p>
                Envoyez-moi quelques lignes sur le format, l’univers, les délais
                et les besoins musicaux. Je vous répondrai avec plaisir pour
                discuter d’une collaboration, d’une écoute ou d’un devis.
              </p>

              <a
                href="mailto:vgelee@gmail.com"
                className="inline-flex rounded-md bg-[#13293D] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#A26769]"
              >
                Écrire un message
              </a>
            </div>

            <div className="grid gap-2 text-sm text-[#13293D] sm:grid-cols-2 md:grid-cols-1 md:gap-3">
              {[
                ["Email", "vgelee@gmail.com"],
                ["Disponibilité", "Collaborations et commandes"],
                ["Formats", "Jeu vidéo, cinéma, publicité"],
                ["Basé à", "Paris"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-lg border-l-4 border-[#A26769] bg-white/70 p-3 shadow-sm ring-1 ring-black/10 backdrop-blur-sm md:p-4"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-[#13293D]/60">
                    {label}
                  </p>
                  <p className="mt-2 font-medium text-[#13293D]">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </ContentSection>

        <SocialFooter theme={THEMES.home} />
      </main>

      {selectedProject && (
        <div
          ref={projectModalOverlayRef}
          className="fixed inset-0 z-50 bg-white/95 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          onClick={closeProjectModal}
        >
          <div
            ref={projectModalPanelRef}
            className="fixed grid grid-rows-[minmax(220px,45vh)_minmax(0,1fr)] overflow-hidden rounded-lg bg-white shadow-2xl ring-1 ring-black/10 md:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.6fr)] md:grid-rows-1"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Fermer le projet"
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-xl leading-none text-[#13293D] shadow-sm ring-1 ring-black/10 transition-colors hover:bg-white md:hidden"
              onClick={closeProjectModal}
            >
              ×
            </button>

            <div className="flex min-h-0 items-center justify-center bg-zinc-950">
              <video
                className="h-full w-full object-contain"
                src={selectedProject.videoUrl}
                controls
                autoPlay
                playsInline
              />
            </div>

            <aside className="flex min-h-0 flex-col justify-between gap-5 overflow-y-auto p-5 text-[#13293D] md:gap-10 md:p-10">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-[#13293D]/60">
                  Projet
                </p>
                <h2
                  id="project-modal-title"
                  className="mt-3 text-2xl font-semibold md:text-3xl"
                >
                  {selectedProject.title}
                </h2>
                <div className="mt-5 max-w-prose space-y-3 text-sm leading-7 text-[#13293D]/80 md:mt-7 md:space-y-4 md:text-base md:leading-8">
                  {selectedProject.description.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4 border-t border-[#13293D]/10 pt-5 md:items-end">
                <p className="text-[11px] leading-5 text-white md:hidden">
                  Exercice personnel de rescoring sonore. Images et marques :
                  ayants droit respectifs.
                </p>
                <button
                  type="button"
                  className="self-start rounded-md bg-[#13293D] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#A26769] md:self-auto"
                  onClick={closeProjectModal}
                >
                  Fermer
                </button>
              </div>
            </aside>

            <p className="pointer-events-none absolute bottom-4 left-4 hidden max-w-xs text-left text-xs leading-5 text-white md:block">
              Exercice personnel de rescoring sonore. Images et marques : ayants
              droit respectifs.
            </p>
          </div>
        </div>
      )}
    </Background>
  );
}

export default App;
