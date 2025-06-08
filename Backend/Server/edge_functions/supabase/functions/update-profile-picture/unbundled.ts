// backend/server/edge_functions/supabase/functions/update_profile_picture/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { updateUserProfilePicture } from "../../../../../lib/user/update_user_profile_picture.js";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const userId = formData.get("userId");
    if (!file || !userId) {
      return new Response(
        JSON.stringify({
          error: "Missing file or userId",
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        "Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variable"
      );
    }
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: req.headers.get("Authorization") ?? "",
        },
      },
    });
    const response = await updateUserProfilePicture(
      supabase,
      userId,
      file,
      corsHeaders
    );
    return response;
  } catch (err) {
    console.error("Error:", err);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
      }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
});
