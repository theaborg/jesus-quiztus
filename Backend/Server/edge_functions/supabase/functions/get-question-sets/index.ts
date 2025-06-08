// backend/server/edge_functions/supabase/functions/get-question-sets/index.ts
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// backend/lib/questions/get_question_sets.js
var getQuestionSets = async (supabase, userId) => {
  const { data, error } = await supabase.from("QuestionsSet").select("*").eq("user", userId);
  if (error) throw error;
  return data;
};

// backend/server/edge_functions/supabase/functions/get-question-sets/index.ts
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const { userId } = await req.json();
  if (!userId) {
    return new Response("Missing userId", { status: 400, headers: corsHeaders });
  }
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL"),
    Deno.env.get("SUPABASE_ANON_KEY"),
    { global: { headers: { Authorization: req.headers.get("Authorization") } } }
  );
  try {
    const sets = await getQuestionSets(supabase, userId);
    return new Response(JSON.stringify(sets), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
});
//# sourceMappingURL=index.mjs.map