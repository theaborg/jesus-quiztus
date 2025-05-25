// backend/server/edge_functions/supabase/functions/get-game-start-time/index.ts
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// backend/lib/games/get_game_start_time.js
var getGameStartTime = async (supabase, gameId) => {
  const { data, error } = await supabase.from("games").select("start_time").eq("id", gameId);
  if (error) {
    return null;
  }
  return data;
};

// backend/server/edge_functions/supabase/functions/get-game-start-time/index.ts
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const { gameId } = await req.json();
  if (!gameId) {
    return new Response("Missing gameId", { status: 400, headers: corsHeaders });
  }
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL"),
    Deno.env.get("SUPABASE_ANON_KEY"),
    { global: { headers: { Authorization: req.headers.get("Authorization") } } }
  );
  try {
    const data = await getGameStartTime(supabase, gameId);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
});
//# sourceMappingURL=index.mjs.map