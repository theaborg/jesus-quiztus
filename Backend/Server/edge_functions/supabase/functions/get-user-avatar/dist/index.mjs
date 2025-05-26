// backend/server/edge_functions/supabase/functions/get-user-avatar/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// backend/lib/user/get_user_avatar.js
var getUserAvatar = async (supabaseClient, player) => {
  const { data, error } = await supabaseClient.from("users").select("profile_picture").eq("id", player.id).single();
  let avatarUrl = "/profile_picture.jpg";
  if (data?.profile_picture) {
    const { data: urlData, error: storageError } = supabaseClient.storage.from("profile-pictures").getPublicUrl(`${player.id}/${data.profile_picture}`);
    avatarUrl = urlData?.publicUrl || avatarUrl;
    if (storageError) {
      console.error("Error fetching profile picture:", error);
    }
  }
  return { ...player, avatarUrl };
};

// backend/server/edge_functions/supabase/functions/get-user-avatar/index.ts
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    const { user_id } = await req.json();
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
    const { error, data } = await getUserAvatar(supabase, user_id);
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: corsHeaders
      });
    }
    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: corsHeaders
    });
  } catch (err) {
    console.error("Request parsing failed", err);
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: corsHeaders
    });
  }
});
//# sourceMappingURL=index.mjs.map