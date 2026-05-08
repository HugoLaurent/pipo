import { useEffect, useState } from "react";

function SocialFooter({ theme, animatedColorsRef }) {
  const items = [
    { href: "#", label: "Facebook" },
    { href: "#", label: "LinkedIn" },
    { href: "#", label: "Instagram" },
  ];

  const [linkColor, setLinkColor] = useState(theme?.text || "#111");

  useEffect(() => {
    let raf = 0;
    let mounted = true;
    function tick() {
      const ac = animatedColorsRef?.current;
      if (ac && mounted) {
        setLinkColor(`rgba(${ac.base.r}, ${ac.base.g}, ${ac.base.b}, 1)`);
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => {
      mounted = false;
      cancelAnimationFrame(raf);
    };
  }, [animatedColorsRef, theme]);

  return (
    <footer className="fixed bottom-6 right-6 z-30" aria-label="Social links">
      <ul className="m-0 flex list-none items-center gap-3 p-0">
        {items.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              className="inline-flex items-center justify-center rounded text-sm"
              aria-label={item.label}
              style={{ color: linkColor }}
            >
              {item.label}
            </a>
          </li>
        ))}
        <li>
          <a
            href="#"
            aria-label="Favicon"
            className="inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded"
            style={{ boxShadow: `0 0 12px ${theme?.pageBg || "#fff"}` }}
          >
            <img
              src="/favicon.png"
              alt="favicon"
              className="h-full w-full object-cover"
            />
          </a>
        </li>
      </ul>
    </footer>
  );
}

export default SocialFooter;
