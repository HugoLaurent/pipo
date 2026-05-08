function SiteNav() {
  const links = [
    { href: "#accueil", label: "Accueil", active: true },
    { href: "#projets", label: "Projets" },
    { href: "#apropos", label: "À propos" },
    { href: "#contact", label: "Contact" },
  ];

  function scrollToSection(event, href) {
    event.preventDefault();

    const target = document.querySelector(href);
    if (!target) return;

    const startY = window.scrollY;
    const targetY = target.getBoundingClientRect().top + window.scrollY;
    const distance = targetY - startY;
    const duration = 1100;
    const startTime = performance.now();

    function easeInOutCubic(value) {
      return value < 0.5
        ? 4 * value * value * value
        : 1 - Math.pow(-2 * value + 2, 3) / 2;
    }

    function animate(currentTime) {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easedProgress = easeInOutCubic(progress);

      window.scrollTo(0, startY + distance * easedProgress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }

  return (
    <nav
      className="fixed left-4 top-1/2 z-30 -translate-y-1/2"
      aria-label="Site Navigation"
    >
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              onClick={(event) => scrollToSection(event, link.href)}
              className={
                link.active
                  ? "inline-block rounded-md bg-zinc-900 px-2.5 py-1.5 text-zinc-50 no-underline transition-colors hover:bg-zinc-800"
                  : "inline-block rounded-md px-2.5 py-1.5 text-zinc-900 no-underline transition-colors hover:bg-zinc-100"
              }
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default SiteNav;
