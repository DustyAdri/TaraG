import { serve } from "bun";
import index from "./index.html";
import { handlePlan } from "./planRoute";

const server = serve({
  idleTimeout: 120,
  routes: {
    // Serve the React app for every other path.
    "/*": index,

    "/api/plan": {
      POST: handlePlan,
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Tara, G! running at ${server.url}`);
