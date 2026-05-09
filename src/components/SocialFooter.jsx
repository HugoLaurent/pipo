function SocialFooter({ theme }) {
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
              className="inline-flex items-center justify-center rounded text-sm"
              aria-label={item.label}
              style={{ color: theme?.text || "#13293D" }}
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
