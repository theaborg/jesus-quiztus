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

// backend/lib/games/set_game_state.js
var setGameState = async (supabase, gameId, new_state) => {
  const { error } = await supabase.from("games").update({ state: new_state }).eq("id", gameId);
  if (error) throw error;
};

// backend/server/edge_functions/supabase/functions/set-game-state/index.ts
var index_default = withSupabaseHandler(async (req, supabase) => {
  try {
    const { gameId, new_state } = await req.json();
    if (!gameId || !new_state) {
      return new Response(
        JSON.stringify({ error: "Missing gameId or new_state" }),
        { status: 400 }
      );
    }
    await setGameState(supabase, gameId, new_state);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400
    });
  }
});
export {
  index_default as default
};
//# sourceMappingURL=index.mjs.map