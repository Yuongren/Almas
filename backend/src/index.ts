import "dotenv/config";

import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";

import { audioRoutes } from "./routes/audio.js";
import { demoRequests } from "./routes/demoRequests.js";

import { blogRoutes } from "./routes/blog.js";

const server = Fastify({
  logger: true,

  // Allow audio uploads up to 50 MB.
  bodyLimit: 50 * 1024 * 1024,
});

async function start() {
  try {
    await server.register(cors, {
      origin: true,
    });

    await server.register(multipart, {
      limits: {
        fileSize: 50 * 1024 * 1024,
        files: 1,
        fields: 20,
      },

      // Important:
      // Do not automatically consume the whole file into memory.
      attachFieldsToBody: false,
    });

    await server.register(audioRoutes, {
      prefix: "/api",
    });

    await server.register(demoRequests, {
      prefix: "/api",
    });

    await server.register(blogRoutes, { prefix: "/api" });

    const port = Number(
      process.env.PORT || 4000
    );

    await server.listen({
      port,
      host: "0.0.0.0",
    });

    console.log(
      `Backend running on port ${port}`
    );

    console.log(
      "Supabase URL configured:",
      Boolean(process.env.SUPABASE_URL)
    );

    console.log(
      "Supabase service role key configured:",
      Boolean(
        process.env.SUPABASE_SERVICE_ROLE_KEY
      )
    );
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
}

start();