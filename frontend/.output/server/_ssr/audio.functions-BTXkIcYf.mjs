import process from "node:process";
import { T as TSS_SERVER_FUNCTION, a as createServerFn } from "./server-BDFhVokW.mjs";
import { Buffer } from "node:buffer";
import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
import { A as AUDIO_CATEGORY_VALUES } from "./audio-DIfY7T1V.mjs";

import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType, b as booleanType, e as enumType } from "../_libs/zod.mjs";
import "../_libs/h3-v2.mjs";
import "../_libs/unenv.mjs";

import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";





import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";

import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/tslib.mjs";
import "../_libs/supabase__functions-js.mjs";
import "./client-CT4naPST.mjs";
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
function isNewSupabaseApiKey(value) {
  return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}
function createSupabaseFetch(supabaseKey) {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : void 0
    );
    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }
    if (isNewSupabaseApiKey(supabaseKey) && headers.get("Authorization") === `Bearer ${supabaseKey}`) {
      headers.delete("Authorization");
    }
    headers.set("apikey", supabaseKey);
    return fetch(input, { ...init, headers });
  };
}
function createSupabaseAdminClient() {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    const missing = [
      ...!SUPABASE_URL ? ["SUPABASE_URL"] : [],
      ...!SUPABASE_SERVICE_ROLE_KEY ? ["SUPABASE_SERVICE_ROLE_KEY"] : []
    ];
    const message = `Missing Supabase environment variable(s): ${missing.join(", ")}. Connect Supabase in Lovable Cloud.`;
    console.error(`[Supabase] ${message}`);
    throw new Error(message);
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    global: {
      fetch: createSupabaseFetch(SUPABASE_SERVICE_ROLE_KEY)
    },
    auth: {
      storage: void 0,
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
let _supabaseAdmin;
const supabaseAdmin = new Proxy({}, {
  get(_, prop, receiver) {
    if (!_supabaseAdmin) _supabaseAdmin = createSupabaseAdminClient();
    return Reflect.get(_supabaseAdmin, prop, receiver);
  }
});
const uploadAudioTrack_createServerFn_handler = createServerRpc({
  id: "89ff173fbe56a8ca331e9ac50d31ad63f4a7c5acc7e881bde011b8bacae2fd8f",
  name: "uploadAudioTrack",
  filename: "src/lib/api/audio.functions.ts"
}, (opts) => uploadAudioTrack.__executeServer(opts));
const uploadAudioTrack = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  title: stringType().min(1),
  description: stringType().max(400).nullable().optional(),
  category: enumType(AUDIO_CATEGORY_VALUES),
  isPaid: booleanType(),
  skizaCode: stringType().max(50).nullable().optional(),
  fileName: stringType().min(1),
  fileType: stringType().min(1),
  fileData: stringType().min(1)
})).handler(uploadAudioTrack_createServerFn_handler, async ({
  data
}) => {
  const safeName = `${Date.now()}-${crypto.randomUUID()}-${data.fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const fileBuffer = Buffer.from(data.fileData, "base64");
  const {
    data: uploadData,
    error: uploadError
  } = await supabaseAdmin.storage.from("audio-tracks").upload(safeName, fileBuffer, {
    contentType: data.fileType || "audio/mpeg",
    cacheControl: "3600",
    upsert: false
  });
  if (uploadError || !uploadData) {
    throw new Error(uploadError?.message || "Unable to upload the audio file to Supabase.");
  }
  const {
    data: trackData,
    error: insertError
  } = await supabaseAdmin.from("audio_tracks").insert({
    title: data.title,
    description: data.description ?? null,
    category: data.category,
    storage_path: uploadData.path ?? safeName,
    is_paid: data.isPaid,
    skiza_code: data.skizaCode ?? null
  }).select("*").single();
  if (insertError || !trackData) {
    await supabaseAdmin.storage.from("audio-tracks").remove([uploadData.path ?? safeName]);
    throw new Error(insertError?.message || "Unable to save the audio track metadata.");
  }
  return {
    success: true,
    track: trackData
  };
});
export {
  uploadAudioTrack_createServerFn_handler
};
