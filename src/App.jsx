import Background from "./components/Background";
import ContentSection from "./components/ContentSection";
import HomeHero from "./components/HomeHero";
import SiteNav from "./components/SiteNav";
import SocialFooter from "./components/SocialFooter";
import grisBVideo from "./assets/videos/Gris B.mov";
import pubDiorVideo from "./assets/videos/Pub Dior.mp4";
import pubIphoneVideo from "./assets/videos/Pub Iphone 16.mp4";
import pubMercedesVideo from "./assets/videos/Pub-Mercedes-Vincent.mp4";
import pubNikeVideo from "./assets/videos/Pub Nike 142Bpm Drill and bass.mp4";
import pubRollsRoyceVideo from "./assets/videos/Pub Rolls Royce.mp4";
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

const PROJECTS = [
  { title: "Pub Dior", videoUrl: pubDiorVideo },
  { title: "Pub Nike", videoUrl: pubNikeVideo, previewTime: 10 },
  { title: "Pub Mercedes", videoUrl: pubMercedesVideo },
  { title: "Gris B", videoUrl: grisBVideo, previewTime: 39 },
  { title: "Pub iPhone 16", videoUrl: pubIphoneVideo, previewTime: 10.5 },
  { title: "Pub Rolls Royce", videoUrl: pubRollsRoyceVideo, previewTime: 2 },
].map((project) => ({
  ...project,
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
          subtitle="Rescoring, sound design et musiques à l’image"
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
                  className="overflow-hidden rounded-lg bg-white/90 text-left shadow-sm ring-1 ring-black/10 backdrop-blur-sm transition-colors hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#13293D]"
                  onClick={(event) =>
                    openProjectModal(project, event.currentTarget)
                  }
                >
                  <video
                    className="pointer-events-none aspect-video w-full bg-zinc-100 object-cover"
                    src={
                      project.previewTime
                        ? `${project.videoUrl}#t=${project.previewTime}`
                        : project.videoUrl
                    }
                    muted
                    playsInline
                    preload="metadata"
                  />
                  <div className="border-l-4 border-[#95B8D1] p-4">
                    <h3 className="text-base font-semibold leading-tight text-[#13293D]">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#13293D]/80">
                      {project.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between gap-4">
              <button
                type="button"
                className="rounded-md bg-white/90 px-3 py-2 text-sm font-medium text-[#13293D] shadow-sm ring-1 ring-black/10 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
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
                      projectsPage === index ? "bg-[#13293D]" : "bg-[#95B8D1]"
                    }`}
                    onClick={() => setProjectsPage(index)}
                  />
                ))}
              </div>

              <button
                type="button"
                className="rounded-md bg-white/90 px-3 py-2 text-sm font-medium text-[#13293D] shadow-sm ring-1 ring-black/10 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
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

            <p className="mt-4 text-center text-xs leading-5 text-[#13293D]/65">
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
          title="À propos"
          subtitle="Compositeur et univers personnel"
        >
          <div className="grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(220px,0.8fr)]">
            <div className="space-y-5 rounded-lg bg-white/35  text-[#13293D] backdrop-blur-[1px]">
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

            <div className="grid gap-3 text-sm text-[#13293D]">
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
                  className="rounded-lg border-l-4 border-[#F4E4BA] bg-white/70 p-4 shadow-sm ring-1 ring-black/10 backdrop-blur-sm"
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
          title="Contact"
          subtitle="On travaille ensemble ?"
        >
          <div className="grid items-center gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(240px,0.9fr)]">
            <div className="space-y-5 rounded-lg bg-white/35  text-[#13293D] backdrop-blur-[1px]">
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
                href="mailto:contact@vincentgelee.com"
                className="inline-flex rounded-md bg-[#13293D] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#A26769]"
              >
                Écrire un message
              </a>
            </div>

            <div className="grid gap-3 text-sm text-[#13293D]">
              {[
                ["Email", "contact@vincentgelee.com"],
                ["Disponibilité", "Collaborations et commandes"],
                ["Formats", "Jeu vidéo, cinéma, publicité"],
                ["Basé à", "Paris"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-lg border-l-4 border-[#A26769] bg-white/70 p-4 shadow-sm ring-1 ring-black/10 backdrop-blur-sm"
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
            className="fixed grid grid-rows-[1fr_auto] overflow-hidden rounded-lg bg-white shadow-2xl ring-1 ring-black/10 md:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.6fr)] md:grid-rows-1"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex min-h-0 items-center justify-center bg-zinc-950">
              <video
                className="max-h-full w-full object-contain"
                src={selectedProject.videoUrl}
                controls
                autoPlay
                playsInline
              />
            </div>

            <aside className="flex flex-col justify-between gap-8 p-6 text-[#13293D] md:p-8">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-[#13293D]/60">
                  Projet
                </p>
                <h2
                  id="project-modal-title"
                  className="mt-3 text-3xl font-semibold"
                >
                  {selectedProject.title}
                </h2>
                <p className="mt-5 text-base leading-7 text-[#13293D]/80">
                  {selectedProject.description}
                </p>
              </div>

              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <p className="max-w-xs text-xs leading-5 text-[#13293D]/60">
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
          </div>
        </div>
      )}
    </Background>
  );
}

export default App;
