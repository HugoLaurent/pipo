function SocialFooter() {
  const items = [
    { href: "#", label: "Facebook" },
    { href: "#", label: "LinkedIn" },
    { href: "#", label: "Instagram" },
  ];

  return (
    <footer className="fixed bottom-6 right-6 z-30" aria-label="Social links">
      <ul className="m-0 flex list-none items-center gap-3 p-0">
        {items.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              className="inline-flex h-8 items-center justify-center rounded px-3 text-sm text-zinc-900 hover:bg-zinc-100"
              aria-label={item.label}
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
