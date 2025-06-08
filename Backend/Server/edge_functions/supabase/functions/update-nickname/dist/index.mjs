// backend/server/edge_functions/supabase/functions/update_nickname/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// backend/lib/user/update_user_nickname.js
var updateUserNickname = async (supabaseClient, userId, nickname, corsHeaders2) => {
  const { error } = await supabaseClient.from("users").update({ nickname }).eq("id", userId);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders2
    });
  }
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: corsHeaders2
  });
};

// backend/server/edge_functions/supabase/functions/update_nickname/index.ts
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    });
  }
  try {
    const { nickname, user_id } = await req.json();
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        "Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variable"
      );
    }
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: req.headers.get("Authorization") ?? "" }
      }
    });
    const response = await updateUserNickname(
      supabase,
      user_id,
      nickname,
      corsHeaders
    );
    return response;
  } catch (_err) {
    return new Response(
      JSON.stringify({
        error: "Invalid request body"
      }),
      {
        status: 400,
        headers: corsHeaders
      }
    );
  }
});
//# sourceMappingURL=index.mjs.map