// backend/server/edge_functions/supabase/functions/init_game/index.ts
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
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
  const { gameId, questionSetId } = await req.json();
  if (!gameId || !questionSetId) {
    return new Response("Missing gameId or questionsSetId", {
      status: 400,
      headers: corsHeaders,
    });
  }
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
        Authorization: req.headers.get("Authorization") ?? "",
      },
    },
  });
  const { data: questionSetData, error: qError } = await supabase
    .from("QuestionsSet")
    .select("amount")
    .eq("id", questionSetId)
    .single();
  if (qError || !questionSetData) {
    return new Response("Could not find question amount", {
      status: 500,
      headers: corsHeaders,
    });
  }
  const questionCount = questionSetData.amount;
  const { error: startError } = await supabase
    .from("games")
    .update({ state: "active" })
    .eq("id", gameId);
  if (startError) {
    return new Response(`Failed to start game: ${startError.message}`, {
      status: 500,
      headers: corsHeaders,
    });
  }
  return new Response("Game started and will end automatically.", {
    headers: corsHeaders,
  });
});
//# sourceMappingURL=index.mjs.map
