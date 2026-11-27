import { useEffect, useState, type ButtonHTMLAttributes } from "react";

/** A wireframe button whose feature isn't built yet: briefly says "Coming soon" when clicked. */
export function ComingSoonButton({ children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const [notice, setNotice] = useState(false);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(false), 1600);
    return () => clearTimeout(t);
  }, [notice]);

  return (
    <button type="button" {...rest} onClick={() => setNotice(true)} aria-live="polite">
      {notice ? "Coming soon!" : children}
    </button>
  );
}
