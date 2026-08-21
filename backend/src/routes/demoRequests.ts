import type { FastifyPluginAsync } from "fastify";
import { supabase } from "../lib/supabase.js";

export const demoRequests: FastifyPluginAsync = async (fastify) => {
  // PUBLIC: submit contact/demo request
  fastify.post("/demo-requests", async (request, reply) => {
    try {
      const {
        name,
        contact,
        organisation,
        request: requestText,
      } = request.body as {
        name: string;
        contact: string;
        organisation?: string;
        request: string;
      };

      if (!name || !contact || !requestText) {
        return reply.code(400).send({
          error: "Name, contact and request are required.",
        });
      }

      const { data, error } = await supabase
        .from("demo_requests")
        .insert({
          name,
          contact,
          organisation: organisation || null,
          request: requestText,
        })
        .select()
        .single();

      if (error) {
        fastify.log.error(error);

        return reply.code(500).send({
          error: error.message,
        });
      }

      return reply.code(201).send({
        success: true,
        item: data,
      });
    } catch (error) {
      fastify.log.error(error);

      return reply.code(500).send({
        error: "Failed to submit demo request.",
      });
    }
  });

  // ADMIN: get all contact/demo requests
  fastify.get("/admin/demo-requests", async (_request, reply) => {
    try {
      const { data, error } = await supabase
        .from("demo_requests")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        fastify.log.error(error);

        return reply.code(500).send({
          error: error.message,
        });
      }

      return reply.send({
        success: true,
        items: data ?? [],
      });
    } catch (error) {
      fastify.log.error(error);

      return reply.code(500).send({
        error: "Failed to load demo requests.",
      });
    }
  });
};