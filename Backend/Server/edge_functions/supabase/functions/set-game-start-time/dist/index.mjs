// backend/server/edge_functions/supabase/utils/withSupabaseHandler.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
};
function withSupabaseHandler(handler) {
  serve(async (req) => {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }
    try {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL"),
        Deno.env.get("SUPABASE_ANON_KEY"),
        {
          global: {
            headers: {
              Authorization: req.headers.get("Authorization") ?? ""
            }
          }
        }
      );
      const response = await handler(req, supabase);
      return new Response(await response.text(), {
        status: response.status,
        headers: { ...corsHeaders, ...Object.fromEntries(response.headers.entries()) }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: "Server error", details: err.message }), {
        status: 500,
        headers: corsHeaders
      });
    }
  });
}

// backend/lib/games/set_game_start_time.js
var setGameStartTime = async (supabase, gameId, time) => {
  const { error } = await supabase.from("games").update({ start_time: time }).eq("id", gameId);
  if (error) throw error;
};

// backend/server/edge_functions/supabase/functions/set-game-start-time/index.ts
var index_default = withSupabaseHandler(async (req, supabase) => {
  try {
    const { gameId, time } = await req.json();
    if (!gameId || !time) {
      return new Response(JSON.stringify({ error: "Missing gameId or time" }), { status: 400 });
    }
    await setGameStartTime(supabase, gameId, time);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
});
export {
  index_default as default
};
//# sourceMappingURL=index.mjs.map