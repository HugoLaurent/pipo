import Background from "./components/Background";
import ContentSection from "./components/ContentSection";
import HomeHero from "./components/HomeHero";
import SiteNav from "./components/SiteNav";
import SocialFooter from "./components/SocialFooter";
import { useEffect, useMemo, useRef, useState } from "react";

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
  const animatedColorsRef = useRef({
    base: { r: 17, g: 17, b: 17 },
    hover: { r: 201, g: 221, b: 242 },
    glow: { r: 255, g: 255, b: 255 },
  });

  const activeTheme = THEMES[activeThemeKey];

  const themeVars = useMemo(
    () => ({
      "--theme-text-rgb": hexToRgbTriplet(activeTheme.text),
      "--theme-button-bg-rgb": hexToRgbTriplet(activeTheme.buttonBg),
      "--theme-button-hover-bg-rgb": hexToRgbTriplet(activeTheme.buttonHoverBg),
      "--theme-button-text-rgb": hexToRgbTriplet(activeTheme.buttonText),
    }),
    [activeTheme],
  );

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
          className="snap-section relative flex h-[100dvh] items-center justify-center"
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
          title="Projets"
          subtitle="Sélection de travaux et collaborations"
        >
          Quelques morceaux, clips et projets à mettre en avant.
        </ContentSection>

        <ContentSection
          id="apropos"
          sectionRef={(element) => {
            sectionRefs.current.apropos = element;
          }}
          dataThemeKey="apropos"
          title="À propos"
          subtitle="Compositeur et univers personnel"
        >
          Musique originale, images sonores et identité simple.
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
    </Background>
  );
}

export default App;
