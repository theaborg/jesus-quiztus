// backend/server/edge_functions/supabase/functions/update-question/index.ts
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// backend/lib/questions/update_question.js
var updateQuestion = async (supabase, id, question, answer, alt1, alt2, alt3, category) => {
  console.log("Updating question with ID:", id);
  const { error } = await supabase.from("Questions").update({
    question,
    answer,
    alt_1: alt1,
    alt_2: alt2,
    alt_3: alt3,
    category
  }).eq("id", id);
  if (error) throw error;
};

// backend/server/edge_functions/supabase/functions/update-question/index.ts
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const { id, question, answer, alt1, alt2, alt3, category } = await req.json();
  if (!id || !question || !answer) {
    return new Response("Missing required fields", { status: 400, headers: corsHeaders });
  }
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL"),
    Deno.env.get("SUPABASE_ANON_KEY"),
    { global: { headers: { Authorization: req.headers.get("Authorization") } } }
  );
  try {
    await updateQuestion(supabase, id, question, answer, alt1, alt2, alt3, category);
    return new Response("Question updated", { headers: corsHeaders });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
});
//# sourceMappingURL=index.mjs.map