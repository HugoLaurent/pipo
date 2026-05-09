import gsap from "gsap";
import { useLayoutEffect, useRef, useEffect, useState } from "react";

function hexToRgba(hex, alpha) {
  const value = hex.replace("#", "");
  const normalized = value.length === 3 ? value.replace(/./g, "$&$&") : value;
  const intValue = Number.parseInt(normalized, 16);
  const r = (intValue >> 16) & 255;
  const g = (intValue >> 8) & 255;
  const b = intValue & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getReadableTextColor({ r, g, b }) {
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.55 ? "#13293D" : "#ffffff";
}

function HomeHero({ arrowDots, theme, animatedColorsRef }) {
  const anchorRef = useRef(null);
  const cardRef = useRef(null);
  const arrowRef = useRef(null);

  const [baseRgba, setBaseRgba] = useState(
    hexToRgba(theme?.titleBg || "#13293D", 1),
  );
  const [titleTextColor, setTitleTextColor] = useState(
    theme?.titleText || "#fff",
  );
  const [hoverFill, setHoverFill] = useState(
    hexToRgba(theme?.dotBase || "#13293D", 0.9),
  );
  /* const [glowRgba, setGlowRgba] = useState(
    hexToRgba(theme?.glowColor || "#ffffff", 0.6),
  );

  const palette = [
    { name: "Deep Space Blue", value: "#13293D" },
    { name: "Powder Blue", value: "#95B8D1" },
    { name: "Pearl Beige", value: "#F4E4BA" },
    { name: "Smoky Rose", value: "#A26769" },
  ]; */

  useLayoutEffect(() => {
    let isInitialRender = true;

    function moveCard(shouldStick) {
      if (!anchorRef.current || !cardRef.current) return;

      const anchorRect = anchorRef.current.getBoundingClientRect();
      const cardRect = cardRef.current.getBoundingClientRect();

      if (shouldStick) {
        gsap.to(cardRef.current, {
          top: 24,
          left: window.innerWidth - cardRect.width - 24,
          xPercent: 0,
          yPercent: 0,
          scale: 0.98,
          duration: 0.7,
          ease: "power3.out",
          overwrite: true,
        });
        return;
      }

      gsap.to(cardRef.current, {
        top: anchorRect.top + anchorRect.height / 2,
        left: anchorRect.left + anchorRect.width / 2,
        xPercent: -50,
        yPercent: -50,
        scale: 1,
        duration: 0.7,
        ease: "power3.out",
        overwrite: true,
      });
    }

    function syncPosition() {
      if (!anchorRef.current || !cardRef.current) return;
      const rect = anchorRef.current.getBoundingClientRect();
      const shouldStick = rect.top <= 6;

      if (isInitialRender && !shouldStick) {
        gsap.set(cardRef.current, {
          top: rect.top + rect.height / 2,
          left: rect.left + rect.width / 2,
          xPercent: -50,
          yPercent: -50,
          scale: 1,
          autoAlpha: 1,
        });
        isInitialRender = false;
        return;
      }

      isInitialRender = false;
      moveCard(shouldStick);
    }

    syncPosition();

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(syncPosition);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    let raf = 0;

    function tick() {
      const ac = animatedColorsRef?.current;
      if (ac) {
        const b = `rgba(${ac.base.r}, ${ac.base.g}, ${ac.base.b}, 1)`;
        if (mounted) {
          setBaseRgba(b);
          setTitleTextColor(getReadableTextColor(ac.base));
          setHoverFill(hexToRgba(theme?.dotBase || "#13293D", 0.9));
          /* setGlowRgba(hexToRgba(theme?.glowColor || "#ffffff", 0.6)); */
        }
      } else if (mounted) {
        setBaseRgba(hexToRgba(theme?.titleBg || "#13293D", 1));
        setTitleTextColor(theme?.titleText || "#fff");
        setHoverFill(hexToRgba(theme?.dotBase || "#13293D", 0.9));
        /* setGlowRgba(hexToRgba(theme?.glowColor || "#ffffff", 0.6)); */
      }
      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => {
      mounted = false;
      cancelAnimationFrame(raf);
    };
  }, [animatedColorsRef, theme]);

  useLayoutEffect(() => {
    function updateArrowVisibility() {
      if (!arrowRef.current) return;

      const shouldHide = window.scrollY > 40;

      gsap.to(arrowRef.current, {
        autoAlpha: shouldHide ? 0 : 1,
        y: shouldHide ? 16 : 0,
        scale: shouldHide ? 0.96 : 1,
        duration: 0.45,
        ease: "power2.out",
        overwrite: true,
      });
    }

    updateArrowVisibility();

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateArrowVisibility);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      <div ref={anchorRef} className="relative">
        <div
          className="invisible pointer-events-none select-none rounded-3xl px-6 py-5 text-right shadow-lg ring-1 ring-black/5 backdrop-blur-sm"
          aria-hidden="true"
        >
          <h1
            className={`inline-block rounded-lg px-4 py-2 text-2xl font-medium leading-none`}
            style={{
              backgroundColor: baseRgba,
              color: titleTextColor,
            }}
          >
            Vincent Gelée
          </h1>
          <span className="mt-0.5 mr-1 text-sm leading-none text-[#13293D]">
            Compositeur
          </span>
        </div>
      </div>

      <div
        ref={cardRef}
        className="fixed z-40 rounded-3xl px-6 py-5 text-right shadow-lg ring-1 ring-black/5 backdrop-blur-sm transition-colors duration-700"
        style={{ top: 0, left: 0 }}
      >
        <h1
          className={`inline-block rounded-lg px-4 py-2 text-2xl font-medium leading-none`}
          style={{
            backgroundColor: baseRgba,
            color: titleTextColor,
          }}
        >
          Vincent Gelée
        </h1>
        <span
          className={`mt-0.5 mr-1 block text-sm leading-none ${theme?.slug}-text`}
        >
          Compositeur
        </span>
      </div>

      <div className="absolute left-1/2 top-[calc(50%+92px)] -translate-x-1/2">
        {/*    <div
          className="grid grid-cols-4 gap-3 rounded-2xl p-3 shadow-md ring-1 ring-black/5 backdrop-blur-sm"
          style={{ backgroundColor: glowRgba }}
        >
          {palette.map((color) => (
            <div key={color.name} className="flex flex-col items-center gap-2">
              <div
                className="h-14 w-14 rounded-2xl shadow-sm ring-1 ring-black/5"
                style={{ backgroundColor: color.value }}
                aria-label={color.name}
                title={color.name}
              />
              <span className="text-[11px] leading-none text-zinc-700">
                {color.name}
              </span>
            </div>
          ))}
        </div>*/}
      </div>

      <svg
        ref={arrowRef}
        className="absolute bottom-8 left-1/2 h-36 w-28 -translate-x-1/2"
        viewBox="0 0 120 140"
        aria-hidden="true"
      >
        {arrowDots.map((dot, index) => (
          <circle
            key={`arrow-dot-${index}`}
            cx={dot.x}
            cy={dot.y}
            r={dot.r}
            fill={hoverFill}
            style={{ filter: "drop-shadow(0 0 10px rgba(0,0,0,0.12))" }}
          />
        ))}
      </svg>
    </>
  );
}

export default HomeHero;
