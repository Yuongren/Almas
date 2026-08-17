import { Buffer } from "node:buffer";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { AUDIO_CATEGORY_VALUES } from "@/lib/audio";

export const uploadAudioTrack = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      title: z.string().min(1),
      description: z.string().max(400).nullable().optional(),
      category: z.enum(AUDIO_CATEGORY_VALUES),
      isPaid: z.boolean(),
      skizaCode: z.string().max(50).nullable().optional(),
      fileName: z.string().min(1),
      fileType: z.string().min(1),
      fileData: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    const safeName = `${Date.now()}-${crypto.randomUUID()}-${data.fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const fileBuffer = Buffer.from(data.fileData, "base64");

    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("audio-tracks")
      .upload(safeName, fileBuffer, {
        contentType: data.fileType || "audio/mpeg",
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError || !uploadData) {
      throw new Error(uploadError?.message || "Unable to upload the audio file to Supabase.");
    }

    const { data: trackData, error: insertError } = await supabaseAdmin
      .from("audio_tracks")
      .insert({
        title: data.title,
        description: data.description ?? null,
        category: data.category,
        storage_path: uploadData.path ?? safeName,
        is_paid: data.isPaid,
        skiza_code: data.skizaCode ?? null,
      })
      .select("*")
      .single();

    if (insertError || !trackData) {
      await supabaseAdmin.storage.from("audio-tracks").remove([uploadData.path ?? safeName]);
      throw new Error(insertError?.message || "Unable to save the audio track metadata.");
    }

    return { success: true, track: trackData };
  });
