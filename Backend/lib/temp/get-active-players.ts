// backend/server/edge_functions/supabase/functions/get-active-players/index.ts
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// backend/lib/games/get_active_players.js
var getActivePlayers = async (supabase, gameId) => {
  const { data, error } = await supabase
    .from("users")
    .select("nickname, id")
    .eq("game", gameId);
  if (error) {
    console.error("Error in getActivePlayers:", error.message);
    return null;
  }
  return data;
};
// backend/server/edge_functions/supabase/functions/get-active-players/index.ts
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }
  try {
    const { gameId } = await req.json();
    if (!gameId) {
      return new Response("Missing gameId", {
        status: 400,
        headers: corsHeaders,
      });
    }
    const supabase = createClient(
      "https://rixhhkmrhhmiajvxrfli.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpeGhoa21yaGhtaWFqdnhyZmxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMTg3MDgsImV4cCI6MjA1OTU5NDcwOH0.0vubc3l45l2WK8QBlFZNqZwjzJ-1TopoHC1cljVD7RM",
      {
        global: {
          headers: {
            Authorization: req.headers.get("Authorization"),
          },
        },
      }
    );
    const players = await getActivePlayers(supabase, gameId);
    return new Response(JSON.stringify(players), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}); //# sourceMappingURL=index.mjs.map
