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
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const dotsRef = useRef([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef();
  const startTimeRef = useRef(Date.now());
  const [scrollProgress, setScrollProgress] = useState(0);

  const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor]);
  const glowRgb = useMemo(() => hexToRgb(glowColor), [glowColor]);
  const hoverRgb = useMemo(() => hexToRgb(hoverColor), [hoverColor]);

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
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
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
      let r = baseRgb.r;
      let g = baseRgb.g;
      let b = baseRgb.b;
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
        r = Math.round(baseRgb.r + (hoverRgb.r - baseRgb.r) * easedT);
        g = Math.round(baseRgb.g + (hoverRgb.g - baseRgb.g) * easedT);
        b = Math.round(baseRgb.b + (hoverRgb.b - baseRgb.b) * easedT);

        opacity = Math.min(1, waveOpacity + easedT * 0.7);
        scale = waveScale + easedT * 0.8;
        glow = easedT * glowIntensity;
      }

      const radius = (dotSize / 2) * scale;
      const finalOpacity = Math.max(0.08, opacity * baseReveal);

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
          `rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, ${glow * 0.4 * baseReveal})`,
        );
        gradient.addColorStop(
          0.5,
          `rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, ${glow * 0.1 * baseReveal})`,
        );
        gradient.addColorStop(
          1,
          `rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, 0)`,
        );
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, radius * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Draw dot
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${finalOpacity})`;
      ctx.fill();
    }

    animationRef.current = requestAnimationFrame(draw);
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
    animationRef.current = requestAnimationFrame(draw);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [draw]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleScroll = () => {
      const maxScroll = Math.max(1, window.innerHeight * 0.9);
      const nextProgress = Math.min(1, window.scrollY / maxScroll);
      setScrollProgress(nextProgress);
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      if (container) {
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
