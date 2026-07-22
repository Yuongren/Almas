import { supabase } from "@/integrations/supabase/client";

export const AUDIO_CATEGORIES = [
  { value: "campaign_tunes", label: "Campaign Tunes" },
  { value: "church_audio", label: "Church Audio" },
  { value: "native_languages", label: "Native Languages" },
  { value: "business_greetings", label: "Business Greetings" },
  { value: "hold_music", label: "Hold Music" },
  { value: "voice_overs", label: "Voice Overs" },
] as const;

export type AudioCategory = (typeof AUDIO_CATEGORIES)[number]["value"];

export type AudioTrack = {
  id: string;
  title: string;
  description: string | null;
  category: AudioCategory;
  storage_path: string;
  is_paid: boolean;
  skiza_code: string | null;
  created_at: string;
};

export type RatingSummary = { avg: number; count: number };

export function categoryLabel(v: string) {
  return AUDIO_CATEGORIES.find((c) => c.value === v)?.label ?? v;
}

export async function fetchTracks(): Promise<AudioTrack[]> {
  const { data, error } = await supabase
    .from("audio_tracks")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as AudioTrack[];
}

export async function fetchRatings(): Promise<Record<string, RatingSummary>> {
  const { data, error } = await supabase.from("track_ratings").select("track_id, rating");
  if (error) throw error;
  const map: Record<string, { sum: number; count: number }> = {};
  for (const r of data ?? []) {
    const id = (r as { track_id: string }).track_id;
    const rating = (r as { rating: number }).rating;
    map[id] ??= { sum: 0, count: 0 };
    map[id].sum += rating;
    map[id].count += 1;
  }
  const out: Record<string, RatingSummary> = {};
  for (const [id, v] of Object.entries(map)) {
    out[id] = { avg: v.sum / v.count, count: v.count };
  }
  return out;
}

export async function fetchMyRatings(userId: string): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from("track_ratings")
    .select("track_id, rating")
    .eq("user_id", userId);
  if (error) throw error;
  const out: Record<string, number> = {};
  for (const r of data ?? []) {
    out[(r as { track_id: string }).track_id] = (r as { rating: number }).rating;
  }
  return out;
}

export async function rateTrack(trackId: string, rating: number, userId: string) {
  const { error } = await supabase
    .from("track_ratings")
    .upsert(
      { track_id: trackId, user_id: userId, rating },
      { onConflict: "track_id,user_id" },
    );
  if (error) throw error;
}
