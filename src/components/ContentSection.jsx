

function ContentSection({
  id,
  title,
  subtitle,
  children,
  sectionRef,
  dataThemeKey,
  contentClassName = "max-w-xl",
}) {
  return (
    <section
      id={id}
      ref={sectionRef}
      data-theme-key={dataThemeKey}
      className="snap-section h-dvh"
      style={{ backgroundColor: "transparent" }}
    >
      <div className="flex h-full w-full items-center justify-center px-4 py-24 md:pl-32 md:pr-8 lg:pl-40 lg:pr-10">
        <div className={`${contentClassName} max-h-full overflow-visible`}>
          <p
            className="text-sm uppercase tracking-[0.25em]"
            style={{ color: "#111" }}
          >
            {title}
          </p>
          <h2
            className="mt-3 text-3xl font-semibold"
            style={{ color: "#111" }}
          >
            {subtitle}
          </h2>
          <div className="mt-4 text-base leading-7" style={{ color: "#111" }}>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContentSection;
