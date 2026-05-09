import Background from "./components/Background";
import ContentSection from "./components/ContentSection";
import HomeHero from "./components/HomeHero";
import SiteNav from "./components/SiteNav";
import SocialFooter from "./components/SocialFooter";
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
    surfaceBg: "#F6F6F6",
    titleBg: "#111111",
    titleText: "#FFFFFF",
    text: "#111111",
    buttonBg: "#111111",
    buttonHoverBg: "#2A2A2A",
    buttonText: "#FFFFFF",
    dotBase: "#111111",
    dotHover: "#C9DDF2",
    glowColor: "#FFFFFF",
  },
  projets: {
    slug: "projets",
    pageBg: "#EEF5FF",
    surfaceBg: "#DCEBFF",
    titleBg: "#C9DDF2",
    titleText: "#0F1D33",
    text: "#0F1D33",
    buttonBg: "#C9DDF2",
    buttonHoverBg: "#5A88FF",
    buttonText: "#0F1D33",
    dotBase: "#C9DDF2",
    dotHover: "#C9DDF2",
    glowColor: "#FFFFFF",
  },
  apropos: {
    slug: "apropos",
    pageBg: "#EEF9F1",
    surfaceBg: "#D7F1E0",
    titleBg: "#D9F2E6",
    titleText: "#103226",
    text: "#103226",
    buttonBg: "#D9F2E6",
    buttonHoverBg: "#52B38B",
    buttonText: "#103226",
    dotBase: "#D9F2E6",
    dotHover: "#D9F2E6",
    glowColor: "#FFFFFF",
  },
  contact: {
    slug: "contact",
    pageBg: "#FFF0F5",
    surfaceBg: "#FDDCE7",
    titleBg: "#F3D9DE",
    titleText: "#34111F",
    text: "#34111F",
    buttonBg: "#F3D9DE",
    buttonHoverBg: "#EF84AC",
    buttonText: "#34111F",
    dotBase: "#F3D9DE",
    dotHover: "#F3D9DE",
    glowColor: "#FFFFFF",
  },
};

const PROJECTS = Array.from({ length: 8 }, (_, index) => ({
  title: `Projet ${index + 1}`,
  youtubeEmbedUrl:
    "https://www.youtube.com/embed/gQ5N6neDmZI?si=6Am02UggXtPoGJJ6",
  thumbnailUrl: "https://img.youtube.com/vi/gQ5N6neDmZI/hqdefault.jpg",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae sem vel neque posuere luctus.",
}));

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
  const [activeThemeKey, setActiveThemeKey] = useState("home");
  const [projectsPage, setProjectsPage] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectModalOrigin, setProjectModalOrigin] = useState(null);
  const projectCardsRef = useRef([]);
  const paginationDotsRef = useRef([]);
  const projectModalOverlayRef = useRef(null);
  const projectModalPanelRef = useRef(null);
  const isProjectModalClosingRef = useRef(false);
  const animatedColorsRef = useRef({
    base: { r: 17, g: 17, b: 17 },
    hover: { r: 201, g: 221, b: 242 },
    glow: { r: 255, g: 255, b: 255 },
  });

  const activeTheme = THEMES[activeThemeKey];
  const projectsPerPage = 3;
  const projectsPageCount = Math.ceil(PROJECTS.length / projectsPerPage);
  const visibleProjects = PROJECTS.slice(
    projectsPage * projectsPerPage,
    projectsPage * projectsPerPage + projectsPerPage,
  );

  const themeVars = useMemo(
    () => ({
      "--theme-text-rgb": hexToRgbTriplet(activeTheme.text),
      "--theme-button-bg-rgb": hexToRgbTriplet(activeTheme.buttonBg),
      "--theme-button-hover-bg-rgb": hexToRgbTriplet(activeTheme.buttonHoverBg),
      "--theme-button-text-rgb": hexToRgbTriplet(activeTheme.buttonText),
    }),
    [activeTheme],
  );

  const openProjectModal = useCallback((project, element) => {
    const rect = element.getBoundingClientRect();
    isProjectModalClosingRef.current = false;
    setProjectModalOrigin({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    });
    setSelectedProject(project);
  }, []);

  const closeProjectModal = useCallback(() => {
    if (isProjectModalClosingRef.current) return;
    isProjectModalClosingRef.current = true;

    const overlay = projectModalOverlayRef.current;
    const panel = projectModalPanelRef.current;

    if (!overlay || !panel || !projectModalOrigin) {
      setSelectedProject(null);
      setProjectModalOrigin(null);
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
      },
    });
  }, [projectModalOrigin]);

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
      scale: (index) => (index === projectsPage ? 1.45 : 1),
      opacity: (index) => (index === projectsPage ? 1 : 0.55),
      duration: 0.28,
      ease: "power2.out",
      overwrite: true,
    });
  }, [projectsPage, visibleProjects.length]);

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
    let snapTimer = 0;
    let releaseSnapTimer = 0;
    let isSnapping = false;

    function getSections() {
      return Object.entries(sectionRefs.current)
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
    }

    function getClosestSection() {
      const viewportCenter = window.scrollY + window.innerHeight / 2;
      let closestKey = "home";
      let closestSection = null;
      let closestDistance = Number.POSITIVE_INFINITY;
      const sections = getSections();

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
      const { closestKey, sections, viewportCenter } = getClosestSection();

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

      setActiveThemeKey((currentKey) =>
        closestKey !== currentKey ? closestKey : currentKey,
      );
    }

    function snapToClosestSection() {
      if (isSnapping) return;

      const { closestSection } = getClosestSection();
      if (!closestSection) return;

      const distanceToSection = Math.abs(
        window.scrollY - closestSection.element.offsetTop,
      );
      if (distanceToSection < 4) return;

      isSnapping = true;
      closestSection.element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      clearTimeout(releaseSnapTimer);
      releaseSnapTimer = setTimeout(() => {
        isSnapping = false;
      }, 700);
    }

    function requestUpdate() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateActiveTheme);

      if (!isSnapping) {
        clearTimeout(snapTimer);
        snapTimer = setTimeout(snapToClosestSection, 140);
      }
    }

    updateActiveTheme();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(snapTimer);
      clearTimeout(releaseSnapTimer);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
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
        className="relative px-4 transition-colors duration-700"
        style={themeVars}
      >
        <SiteNav
          theme={activeTheme}
          activeThemeKey={activeThemeKey}
          animatedColorsRef={animatedColorsRef}
        />

        <section
          id="accueil"
          ref={(element) => {
            sectionRefs.current.home = element;
          }}
          data-theme-key="home"
          className="snap-section relative flex h-dvh items-center justify-center"
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
          title="Projets"
          subtitle="Sélection de travaux et collaborations"
        >
          <div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {visibleProjects.map((project, index) => (
                <button
                  key={project.title}
                  ref={(element) => {
                    projectCardsRef.current[index] = element;
                  }}
                  type="button"
                  className="overflow-hidden rounded-lg bg-white/90 text-left shadow-sm ring-1 ring-black/10 backdrop-blur-sm transition-colors hover:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-950"
                  onClick={(event) =>
                    openProjectModal(project, event.currentTarget)
                  }
                >
                  <img
                    className="pointer-events-none aspect-video w-full bg-zinc-100 object-cover"
                    src={project.thumbnailUrl}
                    alt=""
                  />
                  <div className="p-4">
                    <h3 className="text-base font-semibold leading-tight text-zinc-950">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">
                      {project.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between gap-4">
              <button
                type="button"
                className="rounded-md bg-white/90 px-3 py-2 text-sm font-medium text-zinc-950 shadow-sm ring-1 ring-black/10 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                disabled={projectsPage === 0}
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
                    aria-current={projectsPage === index ? "page" : undefined}
                    className={`h-2.5 w-2.5 rounded-full transition-colors ${
                      projectsPage === index ? "bg-zinc-950" : "bg-zinc-300"
                    }`}
                    onClick={() => setProjectsPage(index)}
                  />
                ))}
              </div>

              <button
                type="button"
                className="rounded-md bg-white/90 px-3 py-2 text-sm font-medium text-zinc-950 shadow-sm ring-1 ring-black/10 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                disabled={projectsPage === projectsPageCount - 1}
                onClick={() =>
                  setProjectsPage((currentPage) =>
                    Math.min(projectsPageCount - 1, currentPage + 1),
                  )
                }
              >
                Suivant
              </button>
            </div>
          </div>
        </ContentSection>

        <ContentSection
          id="apropos"
          sectionRef={(element) => {
            sectionRefs.current.apropos = element;
          }}
          dataThemeKey="apropos"
          contentClassName="w-full max-w-4xl"
          title="À propos"
          subtitle="Compositeur et univers personnel"
        >
          <div className="grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(220px,0.8fr)]">
            <div className="space-y-5 text-zinc-800">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
                vitae sem vel neque posuere luctus. Sed non magna at augue
                facilisis tincidunt vitae et lectus.
              </p>
              <p>
                Praesent euismod, mi non fermentum faucibus, lorem justo
                suscipit sapien, vitae cursus libero arcu in neque. Suspendisse
                potenti. Donec accumsan, ipsum in luctus imperdiet, erat sem
                porttitor nunc, non blandit nibh nibh sit amet erat.
              </p>
              <p>
                Curabitur tempor augue at lacus pretium, ac pharetra lorem
                gravida. Aliquam erat volutpat. Vestibulum ante ipsum primis in
                faucibus orci luctus et ultrices posuere cubilia curae.
              </p>
            </div>

            <div className="grid gap-3 text-sm text-zinc-800">
              {[
                ["Approche", "Lorem ipsum dolor sit amet", "#111111"],
                ["Formats", "Film, scène, installation", "#C9DDF2"],
                ["Univers", "Acoustique, électronique, silence", "#D9F2E6"],
                ["Lieu", "Paris et collaborations à distance", "#F3D9DE"],
              ].map(([label, value, accentColor]) => (
                <div
                  key={label}
                  className="rounded-lg border-l-4 bg-white/70 p-4 shadow-sm ring-1 ring-black/10 backdrop-blur-sm"
                  style={{ borderLeftColor: accentColor }}
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                    {label}
                  </p>
                  <p className="mt-2 font-medium text-zinc-950">{value}</p>
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
          title="Contact"
          subtitle="On travaille ensemble ?"
        >
          Écris-moi pour une collaboration, une écoute ou un devis.
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
            className="fixed grid grid-rows-[1fr_auto] overflow-hidden rounded-lg bg-white shadow-2xl ring-1 ring-black/10 md:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.6fr)] md:grid-rows-1"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex min-h-0 items-center justify-center bg-zinc-950">
              <iframe
                className="h-full w-full"
                src={selectedProject.youtubeEmbedUrl}
                title={selectedProject.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>

            <aside className="flex flex-col justify-between gap-8 p-6 text-zinc-950 md:p-8">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">
                  Projet
                </p>
                <h2
                  id="project-modal-title"
                  className="mt-3 text-3xl font-semibold"
                >
                  {selectedProject.title}
                </h2>
                <p className="mt-5 text-base leading-7 text-zinc-700">
                  {selectedProject.description}
                </p>
              </div>

              <button
                type="button"
                className="self-start rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
                onClick={closeProjectModal}
              >
                Fermer
              </button>
            </aside>
          </div>
        </div>
      )}
    </Background>
  );
}

export default App;
