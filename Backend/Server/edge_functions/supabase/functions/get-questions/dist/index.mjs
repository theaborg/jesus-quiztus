// backend/server/edge_functions/supabase/functions/get-questions/index.ts
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// backend/lib/questions/get_questions.js
var getQuestions = async (supabase, questionSetId) => {
  const { data, error } = await supabase.from("Questions").select("*").eq("set", questionSetId);
  if (error) throw error;
  return data.map((q) => ({
    text: q.question,
    alternatives: shuffle([q.answer, q.alt_1, q.alt_2, q.alt_3]),
    correct: q.answer,
    category: q.category,
    image: q.image,
    id: q.id
  }));
};
var shuffle = (array) => array.sort(() => Math.random() - 0.5);

// backend/server/edge_functions/supabase/functions/get-questions/index.ts
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const { questionSetId } = await req.json();
  if (!questionSetId) {
    return new Response("Missing questionSetId", { status: 400, headers: corsHeaders });
  }
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL"),
    Deno.env.get("SUPABASE_ANON_KEY"),
    { global: { headers: { Authorization: req.headers.get("Authorization") } } }
  );
  try {
    const questions = await getQuestions(supabase, questionSetId);
    return new Response(JSON.stringify(questions), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
});
//# sourceMappingURL=index.mjs.map