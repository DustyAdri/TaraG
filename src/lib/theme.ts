import { useEffect, useState } from "react";

export type Theme = "default" | "light" | "dark";
const KEY = "tarag.theme";

function readTheme(): Theme {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === "light" || saved === "dark" || saved === "default") return saved;
  } catch {
    /* storage blocked */
  }
  return "default";
}

/** The default / light / dark switch at the bottom of the sidebar. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(KEY, theme);
    } catch {
      /* storage blocked */
    }
  }, [theme]);

  return [theme, setTheme] as const;
}
