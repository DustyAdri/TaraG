import { useSyncExternalStore } from "react";

export type Route =
  | { name: "login" }
  | { name: "dashboard" }
  | { name: "groups" }
  | { name: "funds"; id?: string }
  | { name: "calendar" }
  | { name: "planner" }
  | { name: "notFound" };

export function parseRoute(hash: string): Route {
  const [first = "", second] = hash.replace(/^#\/?/, "").split("/");
  switch (first) {
    case "":
    case "login":
      return { name: "login" };
    case "dashboard":
    case "groups":
    case "calendar":
    case "planner":
      return { name: first };
    case "funds":
      return { name: "funds", id: second };
    default:
      return { name: "notFound" };
  }
}

const subscribe = (cb: () => void) => {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
};

/** Tiny hash router: #/dashboard, #/groups, #/funds/boracay-27, ... */
export function useRoute(): Route {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash);
  return parseRoute(hash);
}

export const navigate = (path: string) => {
  window.location.hash = path;
};
