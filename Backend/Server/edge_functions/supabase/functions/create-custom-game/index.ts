// backend/server/edge_functions/supabase/functions/create-custom-game/index.ts
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// backend/lib/games/create_custom_game.js
var createCustomGame = async (supabase, questionSetId, userId, name) => {
  if (!name) {
    name = "unnamed";
  }
  const { data, error } = await supabase.from("games").insert({
    host: userId,
    question_set: questionSetId,
    name,
    state: "pending"
  }).select("id").single();
  if (error) throw error;
  return data.id;
};

// backend/server/edge_functions/supabase/functions/create-custom-game/index.ts
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const { questionSetId, userId, name } = await req.json();
  if (!questionSetId || !userId) {
    return new Response("Missing questionSetId or userId", { status: 400, headers: corsHeaders });
  }
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL"),
    Deno.env.get("SUPABASE_ANON_KEY"),
    { global: { headers: { Authorization: req.headers.get("Authorization") } } }
  );
  try {
    const id = await createCustomGame(supabase, questionSetId, userId, name);
    return new Response(JSON.stringify({ id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
});
//# sourceMappingURL=index.mjs.map