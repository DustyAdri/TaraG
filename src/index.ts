import { serve } from "bun";
import index from "./index.html";
import { generateTripBudgetPlan } from "./geminiService.js";

const server = serve({
  idleTimeout: 120,
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/plan": {
      async POST(req: Request) {
        const body = await req.json();
        const { destination, weeksLeft, groupSize, currentSavings } = body;

        // Server-side validation
        if (
          !destination ||
          !(weeksLeft > 0) ||
          !(groupSize > 0) ||
          !(currentSavings >= 0)
        ) {
          return Response.json({ error: "Invalid input" }, { status: 400 });
        }

        const encoder = new TextEncoder();
        const send = (c: ReadableStreamDefaultController, obj: unknown) =>
          c.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));

        const stream = new ReadableStream({
          async start(controller) {
            try {
              const plan = await generateTripBudgetPlan(body, (text: string) =>
                send(controller, { type: "chunk", text })
              );
              send(controller, { type: "done", plan });
            } catch (err: any) {
              send(controller, { type: "error", message: err.message });
            }
            controller.close();
          },
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
          },
        });
      },
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);