import Background from "./components/Background";
import ContentSection from "./components/ContentSection";
import HomeHero from "./components/HomeHero";
import SiteNav from "./components/SiteNav";
import SocialFooter from "./components/SocialFooter";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

  // GSAP ScrollTrigger: animate canvas colors smoothly when scrolling between sections
  useEffect(() => {
    // cleanup any existing ScrollTriggers
    ScrollTrigger.getAll().forEach((t) => t.kill());

    Object.keys(sectionRefs.current).forEach((key) => {
      const el = sectionRefs.current[key];
      if (!el) return;
      const theme = THEMES[key];
      if (!theme) return;

      const baseTarget = (() => {
        const v = theme.dotBase.replace("#", "");
        const n = v.length === 3 ? v.replace(/./g, "$&$&") : v;
        const int = Number.parseInt(n, 16);
        return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
      })();

      const hoverTarget = (() => {
        const v = theme.dotHover.replace("#", "");
        const n = v.length === 3 ? v.replace(/./g, "$&$&") : v;
        const int = Number.parseInt(n, 16);
        return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
      })();

      const glowTarget = (() => {
        const v = theme.glowColor.replace("#", "");
        const n = v.length === 3 ? v.replace(/./g, "$&$&") : v;
        const int = Number.parseInt(n, 16);
        return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
      })();

      gsap.to(animatedColorsRef.current.base, {
        r: baseTarget.r,
        g: baseTarget.g,
        b: baseTarget.b,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top center",
          end: "bottom center",
          scrub: true,
        },
      });

      gsap.to(animatedColorsRef.current.hover, {
        r: hoverTarget.r,
        g: hoverTarget.g,
        b: hoverTarget.b,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top center",
          end: "bottom center",
          scrub: true,
        },
      });

      gsap.to(animatedColorsRef.current.glow, {
        r: glowTarget.r,
        g: glowTarget.g,
        b: glowTarget.b,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top center",
          end: "bottom center",
          scrub: true,
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <Background
      pageBg={activeTheme.pageBg}
      baseColor={activeTheme.dotBase}
      glowColor={activeTheme.glowColor}
      hoverColor={activeTheme.dotHover}
      animatedColorsRef={animatedColorsRef}
    >
      <main
        className="relative px-4 transition-colors duration-700"
        style={themeVars}
      >
        <SiteNav theme={activeTheme} animatedColorsRef={animatedColorsRef} />

        <section
          id="accueil"
          ref={(element) => {
            sectionRefs.current.home = element;
          }}
          data-theme-key="home"
          className="relative h-screen flex items-center justify-center scroll-mt-16"
        >
          <HomeHero
            arrowDots={arrowDots}
            theme={activeTheme}
            animatedColorsRef={animatedColorsRef}
          />
        </section>

        <ContentSection
          id="projets"
          sectionRef={(element) => {
            sectionRefs.current.projets = element;
          }}
          dataThemeKey="projets"
          theme={THEMES.projets}
          animatedColorsRef={animatedColorsRef}
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
          animatedColorsRef={animatedColorsRef}
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
          animatedColorsRef={animatedColorsRef}
          title="Contact"
          subtitle="On travaille ensemble ?"
        >
          Écris-moi pour une collaboration, une écoute ou un devis.
        </ContentSection>

        <SocialFooter
          theme={activeTheme}
          animatedColorsRef={animatedColorsRef}
        />
      </main>
    </Background>
  );
}

export default App;
