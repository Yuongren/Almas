import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { FastifyPluginAsync } from 'fastify';
import { createClient } from '@supabase/supabase-js';

import {
  createAudioRecord,
  listAudioRecords,
  saveAudioRecord,
} from '../lib/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.resolve(
  __dirname,
  '../../uploads'
);

export const audioRoutes: FastifyPluginAsync = async (
  fastify
) => {
  /*
   * GET AUDIO
   */
  fastify.get('/audio', async () => {
    return {
      items: listAudioRecords(),
    };
  });

  /*
   * UPLOAD AUDIO
   */
  fastify.post(
    '/admin/audio/upload',
    async (request, reply) => {
      try {
        console.log(
          '========================================'
        );
        console.log('Audio upload request received');

        const fields: Record<string, string> = {};

        let fileBuffer: Buffer | null = null;
        let fileName = 'audio.mp3';
        let mimeType = 'audio/mpeg';

        /*
         * Read multipart request
         */
        for await (const part of request.parts()) {
          console.log('Multipart part:', {
            type: part.type,
            fieldname: part.fieldname,
            filename:
              part.type === 'file'
                ? part.filename
                : undefined,
          });

          /*
           * FILE
           */
          if (part.type === 'file') {
            /*
             * IMPORTANT:
             * Read the file immediately while processing
             * the multipart stream.
             */
            fileBuffer = await part.toBuffer();

            fileName = part.filename || 'audio.mp3';
            mimeType =
              part.mimetype || 'audio/mpeg';

            console.log('Audio file received:', {
              fileName,
              mimeType,
              size: fileBuffer.length,
            });

            continue;
          }

          /*
           * NORMAL FORM FIELD
           */
          fields[part.fieldname] = String(
            part.value ?? ''
          );
        }

        /*
         * Make sure a file was received
         */
        if (!fileBuffer) {
          console.error(
            'ERROR: No audio file was received'
          );

          return reply.code(400).send({
            error: 'No file uploaded',
          });
        }

        /*
         * Get form fields
         */
        const title =
          fields.title?.trim() || 'Untitled';

        const description =
          fields.description?.trim() || null;

        const category =
          fields.category?.trim() || 'general';

        const isPaid =
          fields.isPaid === 'true' ||
          fields.isPaid === 'True';

        const skizaCode =
          fields.skizaCode?.trim() || null;

        /*
         * Create safe storage filename
         */
        const safeOriginalName =
          fileName.replace(
            /[^a-zA-Z0-9._-]/g,
            '_'
          );

        const safeName = `${Date.now()}-${randomUUID()}-${safeOriginalName}`;

        console.log('Audio metadata:', {
          title,
          description,
          category,
          isPaid,
          skizaCode,
          safeName,
        });

        /*
         * Validate Supabase configuration
         */
        const supabaseUrl =
          process.env.SUPABASE_URL;

        const supabaseKey =
          process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
          console.error(
            'ERROR: Missing Supabase configuration'
          );

          return reply.code(500).send({
            error:
              'Missing Supabase server configuration.',
          });
        }

        /*
         * Create Supabase client
         */
        const supabase = createClient(
          supabaseUrl,
          supabaseKey,
          {
            auth: {
              persistSession: false,
              autoRefreshToken: false,
            },
          }
        );

        /*
         * Upload to Supabase Storage
         */
        console.log(
          'Uploading audio to Supabase Storage...'
        );

        const {
          data: uploadData,
          error: uploadError,
        } =
          await supabase.storage
            .from('audio-tracks')
            .upload(
              safeName,
              fileBuffer,
              {
                contentType: mimeType,
                cacheControl: '3600',
                upsert: false,
              }
            );

        if (uploadError || !uploadData) {
          console.error(
            'Supabase Storage upload failed:',
            uploadError
          );

          return reply.code(500).send({
            error:
              uploadError?.message ||
              'Unable to upload audio file to Supabase.',
          });
        }

        console.log(
          'Supabase Storage upload successful:',
          uploadData.path
        );

        /*
         * Save metadata to Supabase database
         */
        console.log(
          'Saving audio metadata to Supabase...'
        );

        const {
          data: trackData,
          error: insertError,
        } =
          await supabase
            .from('audio_tracks')
            .insert({
              title,
              description,
              category,
              storage_path:
                uploadData.path || safeName,
              is_paid: isPaid,
              skiza_code: skizaCode,
            })
            .select('*')
            .single();

        /*
         * If database insert fails, remove
         * the uploaded file from Storage.
         */
        if (insertError || !trackData) {
          console.error(
            'Supabase database insert failed:',
            insertError
          );

          await supabase.storage
            .from('audio-tracks')
            .remove([
              uploadData.path || safeName,
            ]);

          return reply.code(500).send({
            error:
              insertError?.message ||
              'Unable to save track metadata.',
          });
        }

        console.log(
          'Audio metadata saved successfully:',
          trackData
        );

        /*
         * Local backup
         */
        try {
          await mkdir(uploadDir, {
            recursive: true,
          });

          const localPath = path.join(
            uploadDir,
            safeName
          );

          await writeFile(
            localPath,
            fileBuffer
          );

          console.log(
            'Local audio backup created:',
            localPath
          );

          /*
           * Save in in-memory library
           */
          const record = saveAudioRecord(
            createAudioRecord({
              title,
              description,
              category,
              file_name: safeName,
              file_path: localPath,
              is_paid: isPaid,
              skiza_code: skizaCode,
            })
          );

          console.log(
            'Audio upload completed successfully'
          );

          console.log(
            '========================================'
          );

          return reply.code(201).send({
            success: true,
            item: trackData,
            backup: record,
          });
        } catch (backupError) {
          /*
           * The Supabase upload/database record already
           * succeeded. Don't report the entire upload as
           * failed just because the optional local backup
           * failed.
           */
          console.error(
            'Local backup failed:',
            backupError
          );

          console.log(
            'Audio upload completed successfully without local backup'
          );

          console.log(
            '========================================'
          );

          return reply.code(201).send({
            success: true,
            item: trackData,
            backup: null,
            warning:
              'Audio uploaded successfully, but local backup failed.',
          });
        }
      } catch (error) {
        console.error(
          '========================================'
        );

        console.error(
          'AUDIO UPLOAD ERROR:',
          error
        );

        console.error(
          '========================================'
        );

        return reply.code(500).send({
          error:
            error instanceof Error
              ? error.message
              : 'Audio upload failed.',
        });
      }
    }
  );
};