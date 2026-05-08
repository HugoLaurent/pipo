function hexToRgba(hex, alpha) {
  const value = hex.replace("#", "");
  const normalized = value.length === 3 ? value.replace(/./g, "$&$&") : value;
  const intValue = Number.parseInt(normalized, 16);
  const r = (intValue >> 16) & 255;
  const g = (intValue >> 8) & 255;
  const b = intValue & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function ContentSection({
  id,
  title,
  subtitle,
  children,
  sectionRef,
  dataThemeKey,
}) {
  return (
    <section
      id={id}
      ref={sectionRef}
      data-theme-key={dataThemeKey}
      className="snap-section flex h-[100dvh] items-center justify-center px-4"
      style={{ backgroundColor: "transparent" }}
    >
      <div
        className="max-w-xl rounded-3xl p-8 shadow-lg ring-1 ring-black/5 backdrop-blur-sm"
        style={{ backgroundColor: "rgba(255,255,255,0.92)", color: "#111" }}
      >
        <p
          className="text-sm uppercase tracking-[0.25em]"
          style={{ color: "#111" }}
        >
          {title}
        </p>
        <h2 className="mt-3 text-3xl font-semibold" style={{ color: "#111" }}>
          {subtitle}
        </h2>
        <p className="mt-4 text-base leading-7" style={{ color: "#111" }}>
          {children}
        </p>
      </div>
    </section>
  );
}

export default ContentSection;
