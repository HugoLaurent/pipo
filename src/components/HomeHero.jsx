import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";

function HomeHero({ arrowDots }) {
  const anchorRef = useRef(null);
  const cardRef = useRef(null);
  const arrowRef = useRef(null);

  const palette = [
    { name: "Noir doux", value: "#1A1A1A" },
    { name: "Bleu pastel", value: "#C9DDF2" },
    { name: "Menthe", value: "#D9F2E6" },
    { name: "Rose poudré", value: "#F3D9DE" },
  ];

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
          className="invisible pointer-events-none select-none rounded-3xl bg-white/75 px-6 py-5 text-right shadow-lg ring-1 ring-black/5 backdrop-blur-sm"
          aria-hidden="true"
        >
          <h1 className="inline-block rounded-lg bg-zinc-900 px-4 py-2 text-2xl font-medium leading-none text-white">
            Vincent Gelée
          </h1>
          <span className="mt-0.5 mr-1 block text-sm leading-none text-zinc-900/90">
            Compositeur
          </span>
        </div>
      </div>

      <div
        ref={cardRef}
        className="fixed z-40 rounded-3xl bg-white/75 px-6 py-5 text-right shadow-lg ring-1 ring-black/5 backdrop-blur-sm"
        style={{ top: 0, left: 0 }}
      >
        <h1 className="inline-block rounded-lg bg-zinc-900 px-4 py-2 text-2xl font-medium leading-none text-white">
          Vincent Gelée
        </h1>
        <span className="mt-0.5 mr-1 block text-sm leading-none text-zinc-900/90">
          Compositeur
        </span>
      </div>

      <div className="absolute left-1/2 top-[calc(50%+92px)] -translate-x-1/2">
        <div className="grid grid-cols-4 gap-3 rounded-2xl bg-white/55 p-3 shadow-md ring-1 ring-black/5 backdrop-blur-sm">
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
        </div>
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
            fill="rgba(24, 24, 27, 0.88)"
            style={{ filter: "drop-shadow(0 0 10px rgba(0,0,0,0.12))" }}
          />
        ))}
      </svg>
    </>
  );
}

export default HomeHero;
