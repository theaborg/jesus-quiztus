// backend/server/edge_functions/supabase/functions/set-game-for-user/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
var setGameForUser = async (supabaseClient, gameId, userId) => {
  const { error, data } = await supabaseClient.from("users").update({
    game: gameId
  }).eq("id", userId);
  if (error) {
    console.error("Error in setGameForUser:", error.message);
    return {
      error
    };
  }
  return data;
};
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
    const { user_id, game_id } = await req.json();
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        "Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables"
      );
    }
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: req.headers.get("Authorization") ?? ""
        }
      }
    });
    const result = await setGameForUser(supabase, game_id, user_id);
    if (!result) {
      return new Response(
        JSON.stringify({
          error: "No response from answerFriendRequest"
        }),
        {
          status: 500,
          headers: corsHeaders
        }
      );
    }
    const { error, data } = result;
    if (error) {
      return new Response(
        JSON.stringify({
          error: error.message
        }),
        {
          status: 500,
          headers: corsHeaders
        }
      );
    }
    return new Response(
      JSON.stringify({
        success: true,
        data
      }),
      {
        status: 200,
        headers: corsHeaders
      }
    );
  } catch (err) {
    console.error("Request parsing failed", err);
    return new Response(
      JSON.stringify({
        error: "Invalid request body"
      }),
      {
        status: 400,
        headers: corsHeaders
      }
    );
  }
});
//# sourceMappingURL=index.mjs.map