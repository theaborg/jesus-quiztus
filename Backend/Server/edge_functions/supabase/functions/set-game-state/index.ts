// backend/server/edge_functions/supabase/functions/set-game-state/index.ts
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// backend/lib/games/set_game_state.js
var setGameState = async (supabase, gameId, new_state) => {
  const { error } = await supabase.from("games").update({ state: new_state }).eq("id", gameId);
  if (error) throw error;
};

// backend/server/edge_functions/supabase/functions/set-game-state/index.ts
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};
serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response("ok", { headers: corsHeaders });
  const { gameId, new_state } = await req.json();
  if (!gameId || !new_state) {
    return new Response("Missing gameId or new_state", {
      status: 400,
      headers: corsHeaders
    });
  }
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL"),
    Deno.env.get("SUPABASE_ANON_KEY"),
    { global: { headers: { Authorization: req.headers.get("Authorization") } } }
  );
  try {
    await setGameState(supabase, gameId, new_state);
    return new Response("State updated", { headers: corsHeaders });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders
    });
  }
});
//# sourceMappingURL=index.mjs.map