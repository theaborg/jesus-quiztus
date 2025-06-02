// backend/server/edge_functions/supabase/functions/get-active-players/index.ts
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// backend/lib/user/get_users_in_game.js
var getUsersInGame = async (supabaseClient, gameId) => {
  const { data, error } = await supabaseClient.from("users").select("id, nickname, game").eq("game", gameId);
  if (error) {
    console.error("Error fetching active user:", error.message);
    return { error };
  }
  return { data };
};

// backend/server/edge_functions/supabase/functions/get-active-players/index.ts
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders
    });
  }
  try {
    const { gameId } = await req.json();
    if (!gameId) {
      return new Response("Missing gameId", {
        status: 400,
        headers: corsHeaders
      });
    }
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL"),
      Deno.env.get("SUPABASE_ANON_KEY"),
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization") ?? "" }
        }
      }
    );
    const players = await getUsersInGame(supabase, gameId);
    return new Response(JSON.stringify(players), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return new Response(
      JSON.stringify({
        error: errorMessage
      }),
      {
        status: 500,
        headers: corsHeaders
      }
    );
  }
});
//# sourceMappingURL=index.mjs.map