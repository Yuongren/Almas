import type { FastifyPluginAsync } from "fastify";
import { Resend } from "resend";
import { supabase } from "../lib/supabase.js";

const resendApiKey = process.env.RESEND_API_KEY;
const recipientEmail = process.env.DEMO_REQUEST_RECIPIENT;

if (!resendApiKey) {
  console.warn("WARNING: RESEND_API_KEY is missing.");
}

if (!recipientEmail) {
  console.warn("WARNING: DEMO_REQUEST_RECIPIENT is missing.");
}

const resend = new Resend(resendApiKey ?? "");

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

      // Save to Supabase first, so the request is never lost
      // even if the email send fails.
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

      // Send notification email via Resend.
      // Failure here should not fail the whole request —
      // the record is already safely saved in Supabase.
      if (resendApiKey && recipientEmail) {
        try {
          const { error: emailError } = await resend.emails.send({
            from: "Demo Requests <onboarding@resend.dev>",
            to: recipientEmail,
            replyTo: contact,
            subject: `New demo request from ${name}`,
            html: `
              <h2>New demo request</h2>
              <p><strong>Name:</strong> ${escapeHtml(name)}</p>
              <p><strong>Contact:</strong> ${escapeHtml(contact)}</p>
              ${
                organisation
                  ? `<p><strong>Organisation:</strong> ${escapeHtml(organisation)}</p>`
                  : ""
              }
              <p><strong>Request:</strong></p>
              <p>${escapeHtml(requestText).replace(/\n/g, "<br />")}</p>
            `,
          });

          if (emailError) {
            fastify.log.error(emailError, "Failed to send demo request email");
          }
        } catch (emailSendError) {
          fastify.log.error(
            emailSendError,
            "Unexpected error sending demo request email"
          );
        }
      } else {
        fastify.log.warn(
          "Skipping email notification: RESEND_API_KEY or DEMO_REQUEST_RECIPIENT not configured."
        );
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

// Basic HTML escaping so user-submitted text can't break
// the email markup or inject arbitrary HTML.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}