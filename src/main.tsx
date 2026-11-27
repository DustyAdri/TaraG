/**
 * Entry point for the React app, loaded by src/index.html.
 */
import { StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { App } from "./App";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/pages.css";
import "./styles/planner.css";
import "./styles/login.css";

const elem = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

if (import.meta.hot) {
  // With hot reloading, keep one React root across reloads.
  // https://bun.com/docs/bundler/hot-reloading#import-meta-hot-data
  type HotData = { root?: Root };
  ((import.meta.hot.data as HotData).root ??= createRoot(elem)).render(app);
} else {
  createRoot(elem).render(app);
}
