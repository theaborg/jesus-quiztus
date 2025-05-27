// backend/server/edge_functions/supabase/functions/create-question/index.ts
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// backend/lib/questions/create_question.js
var createQuestion = async (supabase, question, answer, alt1, alt2, alt3, category, image, set) => {
  const { error } = await supabase.from("Questions").insert({
    question: question || "Question",
    answer: answer || "Answer",
    alt_1: alt1 || "Alternative 1",
    alt_2: alt2 || "Alternative 2",
    alt_3: alt3 || "Alternative 3",
    category: category || "Category",
    //image: image || null,
    set
  });
  if (error) throw error;
};

// backend/server/edge_functions/supabase/functions/create-question/index.ts
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const { question, answer, alt1, alt2, alt3, category, image, set } = await req.json();
  if (!set) {
    return new Response("Missing set ID", { status: 400, headers: corsHeaders });
  }
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL"),
    Deno.env.get("SUPABASE_ANON_KEY"),
    { global: { headers: { Authorization: req.headers.get("Authorization") } } }
  );
  try {
    await createQuestion(supabase, question, answer, alt1, alt2, alt3, category, image, set);
    return new Response("Question created", { headers: corsHeaders });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
});
//# sourceMappingURL=index.mjs.map