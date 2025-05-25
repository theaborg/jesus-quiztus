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

// backend/lib/games/get_active_players.js
var getActivePlayers = async (supabase, gameId) => {
  const { data, error } = await supabase.from("users").select("nickname, id").eq("game", gameId);
  if (error) {
    console.error("Error in getActivePlayers:", error.message);
    return null;
  }
  return data;
};

// backend/server/edge_functions/supabase/functions/get-active-players/index.ts
var index_default = withSupabaseHandler(async (req, supabase) => {
  try {
    const { gameId } = await req.json();
    if (!gameId) {
      return new Response(JSON.stringify({ error: "Missing gameId" }), { status: 400 });
    }
    const result = await getActivePlayers(supabase, gameId);
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
});
export {
  index_default as default
};
//# sourceMappingURL=index.mjs.map