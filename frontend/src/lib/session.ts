// A per-browser anonymous identifier, used to let visitors like posts
// and know which comments they've already made — without any login.
export function getSessionId(): string {
  let sessionId = localStorage.getItem("site_session_id");

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("site_session_id", sessionId);
  }

  return sessionId;
}