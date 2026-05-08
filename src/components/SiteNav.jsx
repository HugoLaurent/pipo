import { useEffect, useState } from "react";

function SiteNav({ theme, activeThemeKey, animatedColorsRef }) {
  const [activeBg, setActiveBg] = useState(theme?.buttonBg);

  useEffect(() => {
    let mounted = true;
    let raf = 0;

    function tick() {
      const ac = animatedColorsRef?.current;
      const nextActiveBg = ac
        ? `rgba(${ac.base.r}, ${ac.base.g}, ${ac.base.b}, 1)`
        : theme?.buttonBg;

      if (mounted) {
        setActiveBg(nextActiveBg);
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
    const duration = 1100;
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
      className="fixed left-4 top-1/2 z-30 -translate-y-1/2"
      aria-label="Site Navigation"
    >
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {links.map((link) => {
          const isActive = link.themeKey === activeThemeKey;
          const activeClass = "";
          const textClass = "";
          return (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(event) => scrollToSection(event, link.href)}
                className={`inline-block rounded-md px-2.5 py-1.5 no-underline transition-colors duration-300 ${activeClass} ${textClass}`}
                style={
                  isActive
                    ? {
                        backgroundColor: activeBg,
                        color: theme?.buttonText,
                      }
                    : { color: theme?.text }
                }
                onMouseEnter={(event) => {
                  if (!isActive) {
                    event.currentTarget.style.color = theme?.buttonText;
                    if (animatedColorsRef?.current)
                      event.currentTarget.style.backgroundColor = `rgba(${animatedColorsRef.current.hover.r}, ${animatedColorsRef.current.hover.g}, ${animatedColorsRef.current.hover.b}, 1)`;
                    else
                      event.currentTarget.style.backgroundColor =
                        theme?.buttonHoverBg;
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
