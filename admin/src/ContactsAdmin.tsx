import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import {
  Mail,
  Phone,
  Building2,
  Download,
  Clock,
  CheckCheck,
  Trash2,
  Loader2,
} from "lucide-react";

type DemoRequestStatus = "pending" | "in_progress" | "responded";

type DemoRequest = {
  id: string;
  name: string;
  contact: string;
  organisation: string | null;
  request: string;
  status: DemoRequestStatus;
  created_at: string;
};

const API_URL = import.meta.env.VITE_API_URL || "/api";

const STATUS_OPTIONS: { value: DemoRequestStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In progress" },
  { value: "responded", label: "Responded" },
];

const STATUS_COLORS: Record<DemoRequestStatus, { bg: string; fg: string }> = {
  pending: { bg: "#3f2d0a", fg: "#fbbf24" },
  in_progress: { bg: "#1e2a4a", fg: "#60a5fa" },
  responded: { bg: "#123524", fg: "#34d399" },
};

export default function ContactsAdmin() {
  const [demoRequests, setDemoRequests] = useState<DemoRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [deletingRequestId, setDeletingRequestId] = useState<string | null>(null);

  async function loadDemoRequests() {
    try {
      setLoadingRequests(true);
      const response = await fetch(`${API_URL}/admin/demo-requests`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load contact requests.");
      }

      setDemoRequests(Array.isArray(data) ? data : data.items ?? []);
    } catch (error) {
      console.error("Failed to load contact requests:", error);
      setDemoRequests([]);
    } finally {
      setLoadingRequests(false);
    }
  }

  useEffect(() => {
    loadDemoRequests();
  }, []);

  async function handleStatusChange(request: DemoRequest, status: DemoRequestStatus) {
    try {
      setUpdatingStatusId(request.id);

      const response = await fetch(`${API_URL}/admin/demo-requests/${request.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "Failed to update status.");

      setDemoRequests((current) =>
        current.map((item) => (item.id === request.id ? { ...item, status } : item))
      );
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to update status.");
    } finally {
      setUpdatingStatusId(null);
    }
  }

  async function handleDeleteRequest(request: DemoRequest) {
    const confirmed = window.confirm(
      `Delete the demo request from "${request.name}"?\n\nThis cannot be undone.`
    );
    if (!confirmed) return;

    try {
      setDeletingRequestId(request.id);

      const response = await fetch(`${API_URL}/admin/demo-requests/${request.id}`, {
        method: "DELETE",
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) throw new Error(payload.error || "Delete failed.");

      setDemoRequests((current) => current.filter((item) => item.id !== request.id));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Delete failed.");
    } finally {
      setDeletingRequestId(null);
    }
  }

  function handleDownloadPdf(request: DemoRequest) {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Demo Request", 14, 20);
    doc.setDrawColor(200);
    doc.line(14, 25, 196, 25);
    doc.setFontSize(11);

    let y = 36;
    const field = (label: string, value: string) => {
      doc.setFont(undefined, "bold");
      doc.text(`${label}:`, 14, y);
      doc.setFont(undefined, "normal");
      doc.text(value, 55, y);
      y += 9;
    };

    field("Name", request.name);
    field("Contact", request.contact);
    if (request.organisation) field("Organisation", request.organisation);
    field(
      "Status",
      STATUS_OPTIONS.find((s) => s.value === request.status)?.label ?? request.status
    );
    field(
      "Submitted",
      request.created_at ? new Date(request.created_at).toLocaleString() : "Unknown"
    );

    y += 4;
    doc.setFont(undefined, "bold");
    doc.text("Request:", 14, y);
    y += 8;
    doc.setFont(undefined, "normal");
    const wrapped = doc.splitTextToSize(request.request, 180);
    doc.text(wrapped, 14, y);

    const safeName = request.name.trim().replace(/\s+/g, "-").toLowerCase() || "request";
    doc.save(`demo-request-${safeName}.pdf`);
  }

  function handleDownloadAllPdf() {
    if (demoRequests.length === 0) {
      alert("There are no demo requests to export yet.");
      return;
    }

    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginLeft = 14;
    const marginRight = 14;
    const contentWidth = pageWidth - marginLeft - marginRight;

    doc.setFontSize(18);
    doc.text("Demo Requests Report", marginLeft, 20);
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(
      `Generated ${new Date().toLocaleString()} · ${demoRequests.length} request${
        demoRequests.length === 1 ? "" : "s"
      }`,
      marginLeft,
      27
    );
    doc.setTextColor(0);

    let y = 38;
    const ensureSpace = (needed: number) => {
      if (y + needed > pageHeight - 15) {
        doc.addPage();
        y = 20;
      }
    };

    demoRequests.forEach((request, index) => {
      ensureSpace(30);

      doc.setDrawColor(210);
      doc.line(marginLeft, y, pageWidth - marginRight, y);
      y += 8;

      doc.setFontSize(13);
      doc.setFont(undefined, "bold");
      doc.text(`${index + 1}. ${request.name}`, marginLeft, y);
      doc.setFont(undefined, "normal");
      y += 7;

      doc.setFontSize(10);
      doc.setTextColor(90);
      const statusLabel =
        STATUS_OPTIONS.find((s) => s.value === request.status)?.label ?? request.status;
      const submitted = request.created_at
        ? new Date(request.created_at).toLocaleString()
        : "Unknown";
      doc.text(`Status: ${statusLabel}   ·   Submitted: ${submitted}`, marginLeft, y);
      y += 6;

      doc.setTextColor(0);
      doc.text(`Contact: ${request.contact}`, marginLeft, y);
      y += 6;

      if (request.organisation) {
        doc.text(`Organisation: ${request.organisation}`, marginLeft, y);
        y += 6;
      }

      doc.setFont(undefined, "bold");
      doc.text("Request:", marginLeft, y);
      doc.setFont(undefined, "normal");
      y += 6;

      const wrapped = doc.splitTextToSize(request.request, contentWidth);
      ensureSpace(wrapped.length * 5.5);
      doc.text(wrapped, marginLeft, y);
      y += wrapped.length * 5.5 + 10;
    });

    doc.save(`demo-requests-${new Date().toISOString().slice(0, 10)}.pdf`);
  }

  return (
    <section style={sectionStyle}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: 22 }}>Contact & Demo Requests</h2>
          <p style={{ color: "#94a3b8", marginTop: 6, marginBottom: 0 }}>
            Requests submitted from the public website.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              background: "#020617",
              border: "1px solid #334155",
            }}
          >
            <span style={{ color: "#94a3b8", fontSize: 12, marginRight: 8 }}>Total</span>
            <strong>{demoRequests.length}</strong>
          </div>

          <button
            onClick={handleDownloadAllPdf}
            disabled={demoRequests.length === 0}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 16px",
              borderRadius: 10,
              border: "1px solid #334155",
              background: "#0f172a",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              cursor: demoRequests.length === 0 ? "not-allowed" : "pointer",
              opacity: demoRequests.length === 0 ? 0.5 : 1,
            }}
          >
            <Download size={15} /> Download All (PDF)
          </button>
        </div>
      </div>

      {loadingRequests ? (
        <EmptyState text="Loading contact requests..." />
      ) : demoRequests.length === 0 ? (
        <EmptyState text="No contact requests yet. Requests submitted from the website will appear here." />
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          {demoRequests.map((item) => {
            const statusColor = STATUS_COLORS[item.status] ?? STATUS_COLORS.pending;

            return (
              <div key={item.id} style={rowCardStyle}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 20,
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: "#94a3b8",
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                      }}
                    >
                      Name
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>{item.name}</div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 700,
                        background: statusColor.bg,
                        color: statusColor.fg,
                        textTransform: "capitalize",
                      }}
                    >
                      {item.status.replace("_", " ")}
                    </span>
                    <div style={{ color: "#94a3b8", fontSize: 12 }}>
                      {item.created_at
                        ? new Date(item.created_at).toLocaleString()
                        : "Date unavailable"}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 16,
                    marginTop: 18,
                  }}
                >
                  <ContactDetail icon={<Phone size={15} />} label="Contact" value={item.contact} />
                  {item.organisation && (
                    <ContactDetail
                      icon={<Building2 size={15} />}
                      label="Organisation"
                      value={item.organisation}
                    />
                  )}
                </div>

                <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid #1e293b" }}>
                  <div
                    style={{
                      color: "#94a3b8",
                      fontSize: 11,
                      textTransform: "uppercase",
                      marginBottom: 6,
                    }}
                  >
                    Request
                  </div>
                  <div style={{ color: "#cbd5e1", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                    {item.request}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: 8,
                    marginTop: 18,
                    paddingTop: 16,
                    borderTop: "1px solid #1e293b",
                  }}
                >
                  {STATUS_OPTIONS.map((option) => {
                    const isActive = item.status === option.value;
                    const isBusy = updatingStatusId === item.id;

                    return (
                      <button
                        key={option.value}
                        onClick={() => handleStatusChange(item, option.value)}
                        disabled={isActive || isBusy}
                        style={{
                          ...ghostButtonStyle,
                          border: isActive ? "1px solid #f59e0b" : "1px solid #334155",
                          background: isActive ? "#3f2d0a" : "#0f172a",
                          color: isActive ? "#fbbf24" : "#cbd5e1",
                          cursor: isActive || isBusy ? "not-allowed" : "pointer",
                          opacity: isBusy ? 0.6 : 1,
                        }}
                      >
                        {option.value === "responded" && <CheckCheck size={13} />}
                        {option.value === "in_progress" && <Clock size={13} />}
                        {option.label}
                      </button>
                    );
                  })}

                  <div style={{ flex: 1 }} />

                  <button onClick={() => handleDownloadPdf(item)} style={ghostButtonStyle}>
                    <Download size={13} /> PDF
                  </button>

                  <button
                    onClick={() => handleDeleteRequest(item)}
                    disabled={deletingRequestId === item.id}
                    style={{
                      ...dangerButtonStyle,
                      cursor: deletingRequestId === item.id ? "not-allowed" : "pointer",
                      opacity: deletingRequestId === item.id ? 0.7 : 1,
                    }}
                  >
                    {deletingRequestId === item.id ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Trash2 size={13} />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function ContactDetail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          color: "#94a3b8",
          fontSize: 11,
          textTransform: "uppercase",
        }}
      >
        {icon}
        {label}
      </div>
      <div style={{ marginTop: 6, color: "#f8f8f8" }}>{value}</div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div
      style={{
        padding: 40,
        textAlign: "center",
        background: "#020617",
        borderRadius: 12,
        color: "#94a3b8",
      }}
    >
      {text}
    </div>
  );
}

const sectionStyle: React.CSSProperties = {
  background: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: 18,
  padding: 24,
};

const rowCardStyle: React.CSSProperties = {
  padding: 20,
  borderRadius: 14,
  background: "#020617",
  border: "1px solid #1e293b",
};

const ghostButtonStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  padding: "7px 12px",
  borderRadius: 8,
  fontSize: 12,
  fontWeight: 600,
  border: "1px solid #334155",
  background: "#0f172a",
  color: "#cbd5e1",
  cursor: "pointer",
};

const dangerButtonStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  padding: "7px 12px",
  borderRadius: 8,
  fontSize: 12,
  fontWeight: 600,
  border: "1px solid #7f1d1d",
  background: "#450a0a",
  color: "#fca5a5",
  cursor: "pointer",
};
