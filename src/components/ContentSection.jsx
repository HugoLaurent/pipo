

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
      className="snap-section min-h-dvh md:h-dvh"
      style={{ backgroundColor: "transparent" }}
    >
      <div className="flex min-h-dvh w-full items-center justify-center px-2 pb-28 pt-12 md:h-full md:min-h-0 md:px-4 md:py-24 md:pl-32 md:pr-8 lg:pl-40 lg:pr-10">
        <div className={`${contentClassName} max-h-full overflow-visible`}>
          <p
            className="text-xs uppercase tracking-[0.22em] md:text-sm md:tracking-[0.25em]"
            style={{ color: "#13293D" }}
          >
            {title}
          </p>
          <h2
            className="mt-3 text-2xl font-semibold leading-tight md:text-3xl"
            style={{ color: "#13293D" }}
          >
            {subtitle}
          </h2>
          <div
            className="mt-4 text-sm leading-7 md:text-base"
            style={{ color: "#13293D" }}
          >
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContentSection;
