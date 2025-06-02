// backend/server/edge_functions/supabase/functions/send-powerup/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// backend/lib/powerups/send_powerup.js
var sendPowerup = async (
  supabaseClient,
  gameId,
  senderId,
  receiverId,
  power_type
) => {
  const { error, data } = await supabaseClient.from("Powerups").insert({
    game: gameId,
    sender_id: senderId,
    receiver_id: receiverId,
    type: power_type,
  });
  if (error) {
    console.error("Error in sendPowerup:", error.message);
    return { error };
  }
  return { data };
};

// backend/server/edge_functions/supabase/functions/send-powerup/index.ts
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    const { game_id, sender_id, receiver_id, power_type } = await req.json();
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        "Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables"
      );
    }
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: req.headers.get("Authorization") ?? "" },
      },
    });
    const { error, data } = await sendPowerup(
      supabase,
      game_id,
      sender_id,
      receiver_id,
      power_type
    );
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: corsHeaders,
      });
    }
    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    console.error("Request parsing failed", err);
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: corsHeaders,
    });
  }
});
//# sourceMappingURL=index.mjs.map
