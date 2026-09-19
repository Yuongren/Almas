import { randomUUID } from "node:crypto";
import {
  createWriteStream,
  existsSync,
} from "node:fs";
import {
  mkdir,
  readFile,
  unlink,
} from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { FastifyPluginAsync } from "fastify";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.resolve(
  __dirname,
  "../../uploads"
);

const supabaseUrl =
  process.env.SUPABASE_URL;

const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    "WARNING: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing."
  );
}

const supabase = createClient(
  supabaseUrl ?? "",
  supabaseKey ?? "",
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

export const audioRoutes: FastifyPluginAsync =
  async (fastify) => {

    /*
     * =====================================================
     * PUBLIC AUDIO
     *
     * GET /api/audio
     * =====================================================
     */

    fastify.get(
      "/audio",
      async (_request, reply) => {
        try {
          const { data, error } = await supabase
            .from("audio_tracks")
            .select(
              "id,title,description,category,storage_path,is_paid,skiza_code,created_at"
            )
            .order("created_at", { ascending: false });

          if (error) {
            fastify.log.error(error, "Failed to load public audio");
            return reply.code(500).send({ error: error.message });
          }

          return { items: data ?? [] };
        } catch (error) {
          fastify.log.error(error, "Public audio request failed");
          return reply.code(500).send({
            error: "Unable to load audio tracks.",
          });
        }
      }
    );

    /*
     * =====================================================
     * ADMIN AUDIO LIST
     *
     * GET /api/admin/audio
     * =====================================================
     */

    fastify.get(
      "/admin/audio",
      async (_request, reply) => {
        try {
          const { data, error } = await supabase
            .from("audio_tracks")
            .select(
              "id,title,description,category,storage_path,is_paid,skiza_code,play_count,created_at"
            )
            .order("created_at", { ascending: false });

          if (error) {
            fastify.log.error(
              {
                error: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code,
              },
              "Failed to load admin audio tracks"
            );

            return reply.code(500).send({
              error: error.message || "Unable to load audio tracks.",
            });
          }

          return reply.send({
            success: true,
            items: data ?? [],
            count: data?.length ?? 0,
          });
        } catch (error) {
          fastify.log.error(error, "Admin audio list failed");
          return reply.code(500).send({
            error: "Unable to load admin audio tracks.",
          });
        }
      }
    );

    /*
     * =====================================================
     * ADMIN AUDIO UPLOAD
     *
     * POST /api/admin/audio/upload
     *
     * FIX: the file part is now streamed to disk
     * IMMEDIATELY when encountered inside the
     * `for await (const part of request.parts())`
     * loop, instead of being stored and piped after
     * the loop ends. busboy/fastify-multipart can't
     * advance past a file part (or detect the end of
     * the request, if the file is the last field) until
     * that file's stream has been fully drained. Storing
     * a reference to `part.file` and consuming it later
     * causes the loop to hang forever waiting on a part
     * that will never arrive -> eventual 504 from any
     * proxy in front of the server (Codespaces, nginx, etc).
     * =====================================================
     */

    fastify.post(
      "/admin/audio/upload",
      async (request, reply) => {

        let localFilePath: string | null = null;

        try {
          fastify.log.info("=== AUDIO UPLOAD STARTED ===");

          await mkdir(uploadDir, { recursive: true });

          const body: Record<string, string> = {};

          let uploadedMeta:
            | { filename: string; mimetype: string }
            | null = null;

          /*
           * -----------------------------------------------
           * READ MULTIPART REQUEST
           * Consume the file stream INLINE, the moment
           * we encounter it, so busboy can keep parsing
           * the rest of the request.
           * -----------------------------------------------
           */

          for await (const part of request.parts()) {

            fastify.log.info({
              type: part.type,
              fieldname: part.fieldname,
              filename:
                part.type === "file" ? part.filename : undefined,
            });

            if (part.type === "file") {

              if (uploadedMeta) {
                fastify.log.warn(
                  "Multiple files received. Ignoring additional file."
                );
                part.file.resume();
                continue;
              }

              const originalFileName = part.filename || "audio.mp3";

              const cleanedFileName = originalFileName.replace(
                /[^a-zA-Z0-9._-]/g,
                "_"
              );

              const safeName = `${Date.now()}-${randomUUID()}-${cleanedFileName}`;

              localFilePath = path.join(uploadDir, safeName);

              uploadedMeta = {
                filename: originalFileName,
                mimetype: part.mimetype || "audio/mpeg",
              };

              fastify.log.info(
                { filename: originalFileName, destination: localFilePath },
                "Streaming upload to local disk..."
              );

              // Consume the stream NOW, while it's the active part.
              // Do not defer this to after the loop.
              await pipeline(part.file, createWriteStream(localFilePath));

              fastify.log.info("File successfully written to disk.");

              continue;
            }

            body[part.fieldname] = String(part.value ?? "");
          }

          /*
           * -----------------------------------------------
           * VALIDATE FILE
           * -----------------------------------------------
           */

          if (!uploadedMeta || !localFilePath) {
            return reply.code(400).send({
              error: "No audio file uploaded.",
            });
          }

          /*
           * -----------------------------------------------
           * FORM DATA
           * -----------------------------------------------
           */

          const title = body.title?.trim() || "Untitled";
          const description = body.description?.trim() || null;
          const category = body.category || "general";
          const isPaid =
            body.isPaid === "true" || body.isPaid === "True";
          const skizaCode = body.skizaCode?.trim() || null;

          /*
           * -----------------------------------------------
           * CHECK FILE
           * -----------------------------------------------
           */

          if (!existsSync(localFilePath)) {
            throw new Error("Uploaded file was not created on disk.");
          }

          /*
           * -----------------------------------------------
           * READ FILE FOR SUPABASE
           * -----------------------------------------------
           */

          fastify.log.info("Reading local file for Supabase upload...");

          const fileBuffer = await readFile(localFilePath);

          fastify.log.info(
            { bytes: fileBuffer.length },
            "Local file read successfully."
          );

          /*
           * -----------------------------------------------
           * SUPABASE STORAGE
           * -----------------------------------------------
           */

          const safeStorageName = path.basename(localFilePath);

          fastify.log.info(
            { storagePath: safeStorageName, bytes: fileBuffer.length },
            "Uploading audio to Supabase Storage..."
          );

          const { data: uploadData, error: uploadError } =
            await supabase.storage
              .from("audio-tracks")
              .upload(safeStorageName, fileBuffer, {
                contentType: uploadedMeta.mimetype || "audio/mpeg",
                cacheControl: "3600",
                upsert: false,
              });

          if (uploadError || !uploadData) {
            fastify.log.error(uploadError, "Supabase Storage upload failed");
            return reply.code(500).send({
              error:
                uploadError?.message ||
                "Unable to upload audio file to Supabase.",
            });
          }

          fastify.log.info(
            { path: uploadData.path },
            "Supabase Storage upload successful."
          );

          /*
           * -----------------------------------------------
           * DATABASE RECORD
           * -----------------------------------------------
           */

          fastify.log.info("Saving audio metadata...");

          const { data: trackData, error: insertError } = await supabase
            .from("audio_tracks")
            .insert({
              title,
              description,
              category,
              storage_path: uploadData.path || safeStorageName,
              is_paid: isPaid,
              skiza_code: skizaCode,
            })
            .select("*")
            .single();

          if (insertError || !trackData) {
            fastify.log.error(insertError, "Database insert failed");

            // Roll back Storage upload.
            await supabase.storage
              .from("audio-tracks")
              .remove([uploadData.path || safeStorageName]);

            return reply.code(500).send({
              error:
                insertError?.message || "Unable to save track metadata.",
            });
          }

          fastify.log.info(
            { id: trackData.id },
            "Audio database record created."
          );

          /*
           * -----------------------------------------------
           * SUCCESS
           * -----------------------------------------------
           */

          return reply.code(201).send({
            success: true,
            item: trackData,
          });
        } catch (error) {
          fastify.log.error(error, "=== AUDIO UPLOAD FAILED ===");

          return reply.code(500).send({
            error:
              error instanceof Error ? error.message : "Audio upload failed.",
          });
        } finally {
          /*
           * -----------------------------------------------
           * LOCAL FILE CLEANUP
           * -----------------------------------------------
           */

          if (localFilePath && existsSync(localFilePath)) {
            try {
              await unlink(localFilePath);
              fastify.log.info("Temporary local upload removed.");
            } catch (cleanupError) {
              fastify.log.warn(
                cleanupError,
                "Failed to remove temporary upload."
              );
            }
          }
        }
      }
    );

    /*
     * =====================================================
     * DELETE AUDIO
     *
     * DELETE /api/admin/audio/:id
     * =====================================================
     */

    fastify.delete(
      "/admin/audio/:id",
      async (request, reply) => {
        try {
          const { id } = request.params as { id: string };

          if (!id) {
            return reply.code(400).send({
              error: "Audio ID is required.",
            });
          }

          const { data: track, error: findError } = await supabase
            .from("audio_tracks")
            .select("id,storage_path")
            .eq("id", id)
            .maybeSingle();

          if (findError) {
            fastify.log.error(findError, "Failed to find audio track");
            return reply.code(500).send({ error: findError.message });
          }

          if (!track) {
            return reply.code(404).send({
              error: "Audio track not found.",
            });
          }

          if (track.storage_path) {
            const { error: storageError } = await supabase.storage
              .from("audio-tracks")
              .remove([track.storage_path]);

            if (storageError) {
              fastify.log.error(
                storageError,
                "Failed to delete audio from Storage"
              );
              return reply.code(500).send({
                error:
                  storageError.message || "Unable to delete audio file.",
              });
            }
          }

          const { error: deleteError } = await supabase
            .from("audio_tracks")
            .delete()
            .eq("id", id);

          if (deleteError) {
            fastify.log.error(
              deleteError,
              "Failed to delete audio database record"
            );
            return reply.code(500).send({
              error: deleteError.message || "Unable to delete audio record.",
            });
          }

          return reply.send({
            success: true,
            message: "Audio deleted successfully.",
          });
        } catch (error) {
          fastify.log.error(error, "Audio deletion failed");
          return reply.code(500).send({
            error: "Unable to delete audio.",
          });
        }
      }
    );
  };
