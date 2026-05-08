import Background from "./components/Background";
import ContentSection from "./components/ContentSection";
import HomeHero from "./components/HomeHero";
import SiteNav from "./components/SiteNav";
import SocialFooter from "./components/SocialFooter";
import { useEffect, useMemo, useRef, useState } from "react";

const THEMES = {
  home: {
    pageBg: "#FFFFFF",
    surfaceBg: "#F6F6F6",
    titleBg: "#111111",
    titleText: "#FFFFFF",
    text: "#111111",
    buttonBg: "#111111",
    buttonHoverBg: "#2A2A2A",
    buttonText: "#FFFFFF",
    dotBase: "#111111",
    dotHover: "#A8D0FF",
    glowColor: "#FFFFFF",
  },
  projets: {
    pageBg: "#EEF5FF",
    surfaceBg: "#DCEBFF",
    titleBg: "#2F6BFF",
    titleText: "#FFFFFF",
    text: "#0F1D33",
    buttonBg: "#2F6BFF",
    buttonHoverBg: "#5A88FF",
    buttonText: "#FFFFFF",
    dotBase: "#2F6BFF",
    dotHover: "#C9DDF2",
    glowColor: "#FFFFFF",
  },
  apropos: {
    pageBg: "#EEF9F1",
    surfaceBg: "#D7F1E0",
    titleBg: "#2F8F68",
    titleText: "#FFFFFF",
    text: "#103226",
    buttonBg: "#2F8F68",
    buttonHoverBg: "#52B38B",
    buttonText: "#FFFFFF",
    dotBase: "#2F8F68",
    dotHover: "#F3D9DE",
    glowColor: "#FFFFFF",
  },
  contact: {
    pageBg: "#FFF0F5",
    surfaceBg: "#FDDCE7",
    titleBg: "#D85F8C",
    titleText: "#FFFFFF",
    text: "#34111F",
    buttonBg: "#D85F8C",
    buttonHoverBg: "#EF84AC",
    buttonText: "#FFFFFF",
    dotBase: "#D85F8C",
    dotHover: "#111111",
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

  const activeTheme = THEMES[activeThemeKey];

  const themeVars = useMemo(
    () => ({
      "--theme-text-rgb": hexToRgbTriplet(activeTheme.text),
      "--theme-button-bg-rgb": hexToRgbTriplet(activeTheme.buttonBg),
      "--theme-button-hover-bg-rgb": hexToRgbTriplet(
        activeTheme.buttonHoverBg,
      ),
      "--theme-button-text-rgb": hexToRgbTriplet(activeTheme.buttonText),
    }),
    [activeTheme],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const nextThemeKey = visibleEntries[0]?.target?.dataset?.themeKey;
        if (nextThemeKey && THEMES[nextThemeKey]) {
          setActiveThemeKey(nextThemeKey);
        }
      },
      {
        threshold: [0.35, 0.5, 0.65, 0.8],
        rootMargin: "-20% 0px -20% 0px",
      },
    );

    Object.values(sectionRefs.current).forEach((element) => {
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <Background
      pageBg={activeTheme.pageBg}
      baseColor={activeTheme.dotBase}
      glowColor={activeTheme.glowColor}
      hoverColor={activeTheme.dotHover}
    >
      <main
        className="relative px-4 transition-colors duration-700"
        style={themeVars}
      >
        <SiteNav theme={activeTheme} />

        <section
          id="accueil"
          ref={(element) => {
            sectionRefs.current.home = element;
          }}
          data-theme-key="home"
          className="relative h-screen flex items-center justify-center scroll-mt-16"
        >
          <HomeHero arrowDots={arrowDots} theme={activeTheme} />
        </section>

        <ContentSection
          id="projets"
          sectionRef={(element) => {
            sectionRefs.current.projets = element;
          }}
          dataThemeKey="projets"
          theme={THEMES.projets}
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
          theme={THEMES.apropos}
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
          theme={THEMES.contact}
          title="Contact"
          subtitle="On travaille ensemble ?"
        >
          Écris-moi pour une collaboration, une écoute ou un devis.
        </ContentSection>

        <SocialFooter theme={activeTheme} />
      </main>
    </Background>
  );
}

export default App;
