import { useEffect, useState } from "react";

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

function getReadableTextColor({ r, g, b }) {
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.55 ? "#13293D" : "#ffffff";
}

function SiteNav({ theme, activeThemeKey, animatedColorsRef }) {
  const [activeBg, setActiveBg] = useState(theme?.buttonBg);
  const [activeText, setActiveText] = useState(
    getReadableTextColor(hexToRgbObject(theme?.buttonBg || "#13293D")),
  );

  useEffect(() => {
    let mounted = true;
    let raf = 0;

    function tick() {
      const ac = animatedColorsRef?.current;
      const nextActiveBg = ac
        ? `rgba(${ac.base.r}, ${ac.base.g}, ${ac.base.b}, 1)`
        : theme?.buttonBg;
      const nextActiveText = ac
        ? getReadableTextColor(ac.base)
        : getReadableTextColor(hexToRgbObject(theme?.buttonBg || "#13293D"));

      if (mounted) {
        setActiveBg(nextActiveBg);
        setActiveText(nextActiveText);
      }

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => {
      mounted = false;
      cancelAnimationFrame(raf);
    };
  }, [animatedColorsRef, theme]);

  const links = [
    { href: "#accueil", label: "Accueil", themeKey: "home" },
    { href: "#projets", label: "Projets", themeKey: "projets" },
    { href: "#apropos", label: "À propos", themeKey: "apropos" },
    { href: "#contact", label: "Contact", themeKey: "contact" },
  ];

  function scrollToSection(event, href) {
    event.preventDefault();

    const target = document.querySelector(href);
    if (!target) return;

    const startY = window.scrollY;
    const targetY = target.getBoundingClientRect().top + window.scrollY;
    const distance = targetY - startY;
    const duration = 300;
    let startTime = 0;

    function easeInOutCubic(value) {
      return value < 0.5
        ? 4 * value * value * value
        : 1 - Math.pow(-2 * value + 2, 3) / 2;
    }

    function animate(currentTime) {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easedProgress = easeInOutCubic(progress);
      window.scrollTo(0, startY + distance * easedProgress);
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }

  return (
    <nav
      className="fixed bottom-4 left-1/2 z-30 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 pb-[env(safe-area-inset-bottom)] md:bottom-auto md:left-4 md:top-1/2 md:w-auto md:max-w-none md:-translate-y-1/2 md:translate-x-0 md:pb-0"
      aria-label="Site Navigation"
    >
      <ul className="m-0 flex list-none items-center gap-1 rounded-lg bg-white/75 p-1 shadow-lg ring-1 ring-black/10 backdrop-blur-md md:flex-col md:items-stretch md:gap-2 md:bg-transparent md:p-0 md:shadow-none md:ring-0 md:backdrop-blur-none">
        {links.map((link) => {
          const isActive = link.themeKey === activeThemeKey;
          const activeClass = "";
          const textClass = "";
          return (
            <li key={link.href} className="min-w-0 flex-1 md:flex-none">
              <a
                href={link.href}
                onClick={(event) => scrollToSection(event, link.href)}
                className={`block truncate rounded-md px-2 py-2 text-center text-[11px] leading-none no-underline transition-colors duration-300 md:inline-block md:px-2.5 md:py-1.5 md:text-left md:text-base md:leading-normal ${activeClass} ${textClass}`}
                style={
                  isActive
                    ? {
                        backgroundColor: activeBg,
                        color: activeText,
                      }
                    : { color: theme?.text }
                }
                onMouseEnter={(event) => {
                  if (!isActive) {
                    if (animatedColorsRef?.current) {
                      event.currentTarget.style.backgroundColor = `rgba(${animatedColorsRef.current.hover.r}, ${animatedColorsRef.current.hover.g}, ${animatedColorsRef.current.hover.b}, 1)`;
                      event.currentTarget.style.color = getReadableTextColor(
                        animatedColorsRef.current.hover,
                      );
                    } else {
                      event.currentTarget.style.backgroundColor =
                        theme?.buttonHoverBg;
                      event.currentTarget.style.color = getReadableTextColor(
                        hexToRgbObject(theme?.buttonHoverBg || "#13293D"),
                      );
                    }
                  }
                }}
                onMouseLeave={(event) => {
                  if (!isActive) {
                    event.currentTarget.style.color = theme?.text;
                    event.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                {link.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default SiteNav;
