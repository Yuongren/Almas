import { supabase } from "@/integrations/supabase/client";

export const AUDIO_CATEGORIES = [
  { value: "campaign_tunes", label: "Campaign Tunes" },
  { value: "church_audio", label: "Church Audio" },
  { value: "native_languages", label: "Native Languages" },
  { value: "business_greetings", label: "Business Greetings" },
  { value: "hold_music", label: "Hold Music" },
  { value: "voice_overs", label: "Voice Overs" },
] as const;

export const AUDIO_CATEGORY_VALUES = AUDIO_CATEGORIES.map(
  (category) => category.value
) as [
  (typeof AUDIO_CATEGORIES)[number]["value"],
  ...(typeof AUDIO_CATEGORIES)[number]["value"][]
];

export type AudioCategory =
  (typeof AUDIO_CATEGORIES)[number]["value"];

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

export type RatingSummary = {
  avg: number;
  count: number;
};

export function categoryLabel(value: string) {
  return (
    AUDIO_CATEGORIES.find((category) => category.value === value)?.label ??
    value
  );
}

/**
 * Get (or create) a per-browser anonymous session id.
 * Used to dedupe plays and to let a visitor update their own
 * rating later, without requiring any sign-in.
 */
function getSessionId(): string {
  let sessionId = localStorage.getItem("audio_session_id");

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("audio_session_id", sessionId);
  }

  return sessionId;
}

/**
 * Fetch all audio tracks from Supabase.
 */
export async function fetchTracks(): Promise<AudioTrack[]> {
  const { data, error } = await supabase
    .from("audio_tracks")
    .select(
      `
      id,title,description,category,storage_path,is_paid,skiza_code,play_count,created_at
      `
    )
    .order("created_at", { ascending: false });

  console.log("========== AUDIO TRACK DEBUG ==========");
  console.log(
    "Supabase URL:",
    import.meta.env.VITE_SUPABASE_URL
  );
  console.log("Audio tracks data:", data);
  console.log("Audio tracks error:", error);
  console.log("=======================================");

  if (error) {
    console.error("Unable to load audio tracks:", error);
    throw new Error(
      error.message || "Unable to load audio library"
    );
  }

  const tracks: AudioTrack[] = (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description ?? null,
    category: row.category as AudioCategory,
    storage_path: row.storage_path,
    is_paid: row.is_paid,
    skiza_code: row.skiza_code ?? null,
    created_at: row.created_at,
  }));

  console.log("Processed audio tracks:", tracks);

  return tracks;
}

/**
 * Fetch average ratings for all audio tracks.
 *
 * Ratings are optional. If the ratings table is unavailable,
 * the audio library should still continue working.
 */
export async function fetchRatings(): Promise<
  Record<string, RatingSummary>
> {
  const { data, error } = await supabase
    .from("track_ratings")
    .select("track_id, rating");

  if (error) {
    console.warn(
      "Ratings could not be loaded:",
      error.message
    );

    // Do not allow ratings failure to break the audio library.
    return {};
  }

  const grouped = new Map<
    string,
    { sum: number; count: number }
  >();

  for (const row of data ?? []) {
    const current = grouped.get(row.track_id) ?? {
      sum: 0,
      count: 0,
    };

    current.sum += row.rating;
    current.count += 1;

    grouped.set(row.track_id, current);
  }

  return Object.fromEntries(
    Array.from(grouped.entries()).map(
      ([trackId, value]) => [
        trackId,
        {
          avg: value.sum / value.count,
          count: value.count,
        },
      ]
    )
  );
}

/**
 * Fetch this browser's own ratings, keyed by track id.
 * No sign-in required — identified by an anonymous session id
 * stored in localStorage.
 */
export async function fetchMyRatings(): Promise<
  Record<string, number>
> {
  const sessionId = getSessionId();

  const { data, error } = await supabase
    .from("track_ratings")
    .select("track_id, rating")
    .eq("session_id", sessionId);

  if (error) {
    console.warn(
      "Unable to load your ratings:",
      error.message
    );

    return {};
  }

  return Object.fromEntries(
    (data ?? []).map((row) => [
      row.track_id,
      row.rating,
    ])
  );
}

/**
 * Create or update this browser's rating for a track.
 * Anonymous — no sign-in required.
 */
export async function rateTrack(
  trackId: string,
  rating: number
) {
  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5.");
  }

  const sessionId = getSessionId();

  const { data: existing, error: existingError } =
    await supabase
      .from("track_ratings")
      .select("id")
      .eq("track_id", trackId)
      .eq("session_id", sessionId)
      .maybeSingle();

  if (existingError) {
    throw new Error(
      existingError.message ||
        "Unable to check existing rating"
    );
  }

  if (existing) {
    const { error } = await supabase
      .from("track_ratings")
      .update({ rating })
      .eq("id", existing.id);

    if (error) {
      throw new Error(
        error.message || "Unable to update rating"
      );
    }

    return;
  }

  const { error } = await supabase
    .from("track_ratings")
    .insert({
      track_id: trackId,
      session_id: sessionId,
      rating,
    });

  if (error) {
    throw new Error(
      error.message || "Unable to create rating"
    );
  }
}

/**
 * Record a play of a track. Deduped per browser session on the
 * server side (via record_audio_play), so replaying the same
 * track in the same session won't inflate the count.
 */
export async function recordTrackPlay(trackId: string) {
  try {
    const sessionId = getSessionId();

    const { error } = await supabase.rpc("record_audio_play", {
      p_track_id: trackId,
      p_session_id: sessionId,
    });

    if (error) {
      console.warn("Unable to record audio play:", error.message);
    }
  } catch (error) {
    console.warn("Audio play tracking failed:", error);
  }
}