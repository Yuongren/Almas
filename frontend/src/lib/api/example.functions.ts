import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getServerConfig } from "../config.server";

export const getGreeting = createServerFn({ method: "POST" })
  .inputValidator(z.object({ name: z.string().min(1) }))
  .handler(async ({ data }) => {
    const config = getServerConfig();

    return {
      greeting: `Hello, ${data.name}!`,
      mode: config.nodeEnv ?? "unknown",
    };
  });

const demoRequestSchema = z.object({
  name: z.string().trim().min(1),
  contact: z.string().trim().min(1),
  organisation: z.string().trim().max(200).optional(),
  request: z.string().trim().min(1).max(2000),
});

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:4000"
).replace(/\/$/, "");

export async function submitDemoRequest(
  input: z.input<typeof demoRequestSchema>
) {
  const data = demoRequestSchema.parse(input);

  const endpoint = `${API_URL}/api/demo-requests`;

  console.log("================================");
  console.log("Submitting demo request");
  console.log("API URL:", API_URL);
  console.log("Endpoint:", endpoint);
  console.log("Data:", data);
  console.log("================================");

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  const text = await response.text();

  console.log("Demo request status:", response.status);
  console.log("Demo request URL:", response.url);
  console.log("Demo request response:", text);

  let result: {
    success?: boolean;
    item?: unknown;
    error?: string;
  } = {};

  const contentType =
    response.headers.get("content-type") || "";

  if (text) {
    if (contentType.includes("application/json")) {
      try {
        result = JSON.parse(text);
      } catch {
        throw new Error(
          "The server returned invalid JSON."
        );
      }
    } else {
      console.error(
        "Expected JSON but received:",
        text
      );

      throw new Error(
        `Server returned HTML instead of JSON (${response.status}).`
      );
    }
  }

  if (!response.ok) {
    throw new Error(
      result.error ||
        "Unable to submit your demo request."
    );
  }

  return result;
}