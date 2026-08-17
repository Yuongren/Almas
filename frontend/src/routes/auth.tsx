import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { z } from "zod";

const searchSchema = z.object({ redirect: z.string().optional() });

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "Sign in — Almas Skika" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/auth" });
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      if (mode === "in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
      }
      navigate({ to: (redirect ?? "/admin") as string as never });
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="pt-32 pb-20 px-4 max-w-md mx-auto">
        <div className="p-8 rounded-3xl glass shadow-card">
          <div className="text-xs uppercase tracking-[0.3em] text-gold mb-2">Admin access</div>
          <h1 className="text-2xl font-display font-bold mb-1">
            {mode === "in" ? "Sign in" : "Create account"}
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Restricted area — Almas Skika staff only.
          </p>

          <form onSubmit={submit} className="grid gap-4">
            <div className="grid gap-1.5">
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-3 rounded-xl glass bg-input/40 outline-none focus:border-gold/60"
              />
            </div>
            <div className="grid gap-1.5">
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-4 py-3 rounded-xl glass bg-input/40 outline-none focus:border-gold/60"
              />
            </div>

            {err && <p className="text-sm text-red-400">{err}</p>}

            <button
              type="submit"
              disabled={busy}
              className="mt-2 py-3 rounded-xl bg-gold-gradient text-primary-foreground font-semibold shadow-gold hover:scale-[1.01] transition disabled:opacity-50"
            >
              {busy ? "Please wait…" : mode === "in" ? "Sign in" : "Create account"}
            </button>
          </form>

          <button
            onClick={() => setMode(mode === "in" ? "up" : "in")}
            className="mt-4 text-xs text-muted-foreground hover:text-gold transition w-full text-center"
          >
            {mode === "in"
              ? "No account? Create one"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
