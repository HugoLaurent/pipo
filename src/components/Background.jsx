import { useCallback, useEffect, useMemo, useRef, useState } from "react";

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

function DotPattern({
  className,
  children,
  dotSize = 4,
  gap = 24,
  baseColor = "#222222",
  glowColor = "#ffffff",
  hoverColor = "#a8d0ff",
  proximity = 120,
  glowIntensity = 1,
  waveSpeed = 0.5,
  animatedColorsRef,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const dotsRef = useRef([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef();
  const startTimeRef = useRef(Date.now());
  const [scrollProgress, setScrollProgress] = useState(0);
  const isMobileRef = useRef(
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );
  const visualIntensityRef = useRef(isMobileRef.current ? 0.18 : 0.6);
  const opacityMultiplierRef = useRef(isMobileRef.current ? 0.6 : 1);

  const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor]);
  const glowRgb = useMemo(() => hexToRgb(glowColor), [glowColor]);
  const hoverRgb = useMemo(() => hexToRgb(hoverColor), [hoverColor]);
  // Smoothed color refs to interpolate when theme props change
  const currentBaseRef = useRef(baseRgb);
  const targetBaseRef = useRef(baseRgb);
  const currentHoverRef = useRef(hoverRgb);
  const targetHoverRef = useRef(hoverRgb);
  const currentGlowRef = useRef(glowRgb);
  const targetGlowRef = useRef(glowRgb);

  useEffect(() => {
    targetBaseRef.current = hexToRgb(baseColor);
  }, [baseColor]);

  useEffect(() => {
    targetHoverRef.current = hexToRgb(hoverColor);
  }, [hoverColor]);

  useEffect(() => {
    targetGlowRef.current = hexToRgb(glowColor);
  }, [glowColor]);

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  const getArrowMask = useCallback((dot, width, height) => {
    const centerX = width / 2;
    const arrowTop = height * 0.34;
    const arrowHeight = height * 0.26;
    const halfWidthAtDot = Math.max(24, (dot.y - arrowTop) * 1.35);
    const dy = dot.y - arrowTop;

    if (dy < 0 || dy > arrowHeight) return 0;

    const xDistance = Math.abs(dot.x - centerX);
    if (xDistance > halfWidthAtDot) return 0;

    const tipWeight = 1 - dy / arrowHeight;
    const edgeWeight = 1 - xDistance / halfWidthAtDot;
    return Math.max(0, tipWeight * edgeWeight);
  }, []);

  const buildGrid = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    // reduce devicePixelRatio on mobile to avoid expensive high-res canvas
    const rawDpr = window.devicePixelRatio || 1;
    const dpr = isMobileRef.current ? Math.min(1, rawDpr) : rawDpr;

    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);

    const cellSize = dotSize + gap;
    const cols = Math.ceil(rect.width / cellSize) + 1;
    const rows = Math.ceil(rect.height / cellSize) + 1;

    const offsetX = (rect.width - (cols - 1) * cellSize) / 2;
    const offsetY = (rect.height - (rows - 1) * cellSize) / 2;

    const dots = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        dots.push({
          x: offsetX + col * cellSize,
          y: offsetY + row * cellSize,
          baseOpacity: 0.3 + Math.random() * 0.2,
        });
      }
    }
    dotsRef.current = dots;
  }, [dotSize, gap]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

    const { x: mx, y: my } = mouseRef.current;
    const proxSq = proximity * proximity;
    const time = (Date.now() - startTimeRef.current) * 0.001 * waveSpeed;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    // Smooth current colors a bit each frame for a softer transition
    // increase blend for slower, smoother transitions between theme colors
    const blend = 0.12; // smaller -> slower, smoother transitions

    // If an external animatedColorsRef is present (GSAP-controlled), use it as targets
    if (animatedColorsRef && animatedColorsRef.current) {
      const tBase = animatedColorsRef.current.base;
      const tHover = animatedColorsRef.current.hover;
      const tGlow = animatedColorsRef.current.glow;
      if (tBase) targetBaseRef.current = tBase;
      if (tHover) targetHoverRef.current = tHover;
      if (tGlow) targetGlowRef.current = tGlow;
    }
    currentBaseRef.current = {
      r: Math.round(
        lerp(currentBaseRef.current.r, targetBaseRef.current.r, blend),
      ),
      g: Math.round(
        lerp(currentBaseRef.current.g, targetBaseRef.current.g, blend),
      ),
      b: Math.round(
        lerp(currentBaseRef.current.b, targetBaseRef.current.b, blend),
      ),
    };
    currentHoverRef.current = {
      r: Math.round(
        lerp(currentHoverRef.current.r, targetHoverRef.current.r, blend),
      ),
      g: Math.round(
        lerp(currentHoverRef.current.g, targetHoverRef.current.g, blend),
      ),
      b: Math.round(
        lerp(currentHoverRef.current.b, targetHoverRef.current.b, blend),
      ),
    };
    currentGlowRef.current = {
      r: Math.round(
        lerp(currentGlowRef.current.r, targetGlowRef.current.r, blend),
      ),
      g: Math.round(
        lerp(currentGlowRef.current.g, targetGlowRef.current.g, blend),
      ),
      b: Math.round(
        lerp(currentGlowRef.current.b, targetGlowRef.current.b, blend),
      ),
    };

    for (const dot of dotsRef.current) {
      const dx = dot.x - mx;
      const dy = dot.y - my;
      const distSq = dx * dx + dy * dy;

      // Wave animation
      const wave = Math.sin(dot.x * 0.02 + dot.y * 0.02 + time) * 0.5 + 0.5;
      const waveOpacity = dot.baseOpacity + wave * 0.15;
      const waveScale = 1 + wave * 0.2;

      let opacity = waveOpacity;
      let scale = waveScale;
      // use smoothed current base/hover colors
      let r = currentBaseRef.current.r;
      let g = currentBaseRef.current.g;
      let b = currentBaseRef.current.b;
      let glow = 0;
      const arrowMask = getArrowMask(dot, width, height);
      const reveal = Math.min(1, 0.35 + scrollProgress * 0.65);
      const baseReveal = Math.max(arrowMask, reveal);

      // Mouse proximity effect
      if (distSq < proxSq) {
        const dist = Math.sqrt(distSq);
        const t = 1 - dist / proximity;
        const easedT = t * t * (3 - 2 * t); // smoothstep

        // Interpolate color towards hover color (dark blue)
        r = Math.round(
          currentBaseRef.current.r +
            (currentHoverRef.current.r - currentBaseRef.current.r) * easedT,
        );
        g = Math.round(
          currentBaseRef.current.g +
            (currentHoverRef.current.g - currentBaseRef.current.g) * easedT,
        );
        b = Math.round(
          currentBaseRef.current.b +
            (currentHoverRef.current.b - currentBaseRef.current.b) * easedT,
        );

        opacity = Math.min(1, waveOpacity + easedT * 0.7);
        scale = waveScale + easedT * 0.8;
        glow = easedT * glowIntensity;
      }

      const radius = (dotSize / 2) * scale;
      const finalOpacity = Math.max(0.08, opacity * baseReveal);

      // Subtly blend dot color toward near-white and reduce opacity on small screens
      const vi = visualIntensityRef.current;
      const gray = 240;
      r = Math.round(r * vi + gray * (1 - vi));
      g = Math.round(g * vi + gray * (1 - vi));
      b = Math.round(b * vi + gray * (1 - vi));
      const finalOpacityWithMultiplier = finalOpacity * opacityMultiplierRef.current;

      // Draw glow
      if (glow > 0) {
        const gradient = ctx.createRadialGradient(
          dot.x,
          dot.y,
          0,
          dot.x,
          dot.y,
          radius * 4,
        );
        gradient.addColorStop(
          0,
          `rgba(${currentGlowRef.current.r}, ${currentGlowRef.current.g}, ${currentGlowRef.current.b}, ${glow * 0.4 * baseReveal})`,
        );
        gradient.addColorStop(
          0.5,
          `rgba(${currentGlowRef.current.r}, ${currentGlowRef.current.g}, ${currentGlowRef.current.b}, ${glow * 0.1 * baseReveal})`,
        );
        gradient.addColorStop(
          1,
          `rgba(${currentGlowRef.current.r}, ${currentGlowRef.current.g}, ${currentGlowRef.current.b}, 0)`,
        );
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, radius * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Draw dot (use adjusted opacity)
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${finalOpacityWithMultiplier})`;
      ctx.fill();
    }

    // schedule next frame only when not on mobile to save CPU
    if (!isMobileRef.current) {
      animationRef.current = requestAnimationFrame(draw);
    } else {
      animationRef.current = null;
    }
  }, [
    proximity,
    baseRgb,
    glowRgb,
    dotSize,
    glowIntensity,
    waveSpeed,
    scrollProgress,
    getArrowMask,
  ]);

  useEffect(() => {
    buildGrid();

    const container = containerRef.current;
    if (!container) return;

    const ro = new ResizeObserver(buildGrid);
    ro.observe(container);
    return () => ro.disconnect();
  }, [buildGrid]);

  useEffect(() => {
    // re-evaluate mobile flag on mount and on resize; adjust visual intensity/opactiy
    function updateIsMobile() {
      const isMobile = window.innerWidth < 768;
      isMobileRef.current = isMobile;
      visualIntensityRef.current = isMobile ? 0.18 : 0.6;
      opacityMultiplierRef.current = isMobile ? 0.6 : 1;
    }

    updateIsMobile();
    window.addEventListener("resize", updateIsMobile, { passive: true });
    window.addEventListener("orientationchange", updateIsMobile, {
      passive: true,
    });

    // Start animation loop only for non-mobile. For mobile, draw one frame for a static background.
    if (!isMobileRef.current) {
      animationRef.current = requestAnimationFrame(draw);
    } else {
      // draw a single frame to render background without continuous rAF
      draw();
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", updateIsMobile);
      window.removeEventListener("orientationchange", updateIsMobile);
    };
  }, [draw]);

  useEffect(() => {
    const container = containerRef.current;

    function handleScroll() {
      const maxScroll = Math.max(1, window.innerHeight * 0.9);
      const nextProgress = Math.min(1, window.scrollY / maxScroll);
      setScrollProgress(nextProgress);
    }

    // Only attach mouse listeners on non-mobile to avoid extra work
    function handleMouseMove(e) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }

    function handleMouseLeave() {
      mouseRef.current = { x: -1000, y: -1000 };
    }

    if (container && !isMobileRef.current) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      if (container && !isMobileRef.current) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative min-h-screen overflow-hidden bg-white ${className || ""}`}
    >
      <canvas ref={canvasRef} className="fixed inset-0 h-full w-full" />

      {/* Vignette overlay */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, transparent 60%, rgba(0,0,0,0.06) 100%)",
        }}
      />

      {/* Content layer */}
      {children && (
        <div className="relative z-10 h-full w-full">{children}</div>
      )}
    </div>
  );
}

export default DotPattern;
