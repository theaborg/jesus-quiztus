// backend/server/edge_functions/supabase/functions/get-game-details/index.ts
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// backend/lib/games/get_game_details.js
var getGameDetails = async (supabase, gameId) => {
  const { data, error } = await supabase.from("games").select("host, state, question_set").eq("id", gameId).single();
  if (error) throw error;
  return data;
};

// backend/server/edge_functions/supabase/functions/get-game-details/index.ts
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  const { gameId } = await req.json();
  if (!gameId) {
    return new Response("Missing gameId", {
      status: 400,
      headers: corsHeaders
    });
  }
  const supabase = createClient(
    "https://rixhhkmrhhmiajvxrfli.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpeGhoa21yaGhtaWFqdnhyZmxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMTg3MDgsImV4cCI6MjA1OTU5NDcwOH0.0vubc3l45l2WK8QBlFZNqZwjzJ-1TopoHC1cljVD7RM",
    {
      global: {
        headers: {
          Authorization: req.headers.get("Authorization")
        }
      }
    }
  );
  try {
    const gameDetails = await getGameDetails(supabase, gameId);
    return new Response(JSON.stringify(gameDetails), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      },
      status: 200
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: corsHeaders
      }
    );
  }
});
//# sourceMappingURL=index.mjs.map