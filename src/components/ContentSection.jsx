function ContentSection({ id, title, subtitle, children }) {
  return (
    <section
      id={id}
      className="flex min-h-screen items-center justify-center px-4 py-20 scroll-mt-16"
    >
      <div className="max-w-xl rounded-3xl bg-white/70 p-8 shadow-lg ring-1 ring-black/5 backdrop-blur-sm">
        <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">
          {title}
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-zinc-900">
          {subtitle}
        </h2>
        <p className="mt-4 text-base leading-7 text-zinc-700">{children}</p>
      </div>
    </section>
  );
}

export default ContentSection;
