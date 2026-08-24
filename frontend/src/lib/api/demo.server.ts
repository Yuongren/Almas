// frontend/src/lib/api/demo.server.ts

export async function sendDemoRequest(data: {
  name: string;
  contact: string;
  organisation?: string;
  request: string;
}) {
  const response = await fetch(
    "http://127.0.0.1:4000/api/demo-requests",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const text = await response.text();

  console.log("Backend demo request status:", response.status);
  console.log("Backend demo request response:", text);

  let result: {
    success?: boolean;
    error?: string;
    item?: unknown;
  } = {};

  const contentType =
    response.headers.get("content-type") || "";

  if (text) {
    if (!contentType.includes("application/json")) {
      throw new Error(
        `Backend returned a non-JSON response (${response.status}).`
      );
    }

    try {
      result = JSON.parse(text);
    } catch {
      throw new Error(
        "Backend returned invalid JSON."
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