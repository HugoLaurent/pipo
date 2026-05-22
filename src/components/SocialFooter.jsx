function SocialFooter({ theme }) {
  const items = [
    {
      href: "https://fr.linkedin.com/in/vincent-gelee-7b8bb8251",
      label: "LinkedIn",
    },
    {
      href: "https://www.instagram.com/v.i.n.i_music?igsh=MW16MjRlZnNjdjR2Nw==",
      label: "Instagram",
    },
  ];

  return (
    <footer
      className="fixed bottom-6 right-6 z-30 hidden md:block"
      aria-label="Social links"
    >
      <ul className="m-0 flex list-none items-center gap-3 p-0">
        <li>
          <a
            href="https://hugolaurent.fr/"
            className="inline-flex items-center justify-center rounded text-sm"
            aria-label="Site réalisé par Hugo Laurent"
            style={{ color: theme?.text || "#13293D" }}
            target="_blank"
            rel="noreferrer"
          >
            Site réalisé par Hugo Laurent
          </a>
        </li>
        {items.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              className="inline-flex items-center justify-center rounded text-sm"
              aria-label={item.label}
              style={{ color: theme?.text || "#13293D" }}
              target="_blank"
              rel="noreferrer"
            >
              {item.label}
            </a>
          </li>
        ))}
        <li className="flex items-center">
          <a
            href="#"
            aria-label="Favicon"
            className="inline-flex h-4 w-4 translate-y-[2px] items-center justify-center overflow-hidden rounded"
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
