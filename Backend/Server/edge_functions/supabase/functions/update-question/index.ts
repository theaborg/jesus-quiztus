// backend/server/edge_functions/supabase/utils/withSupabaseHandler.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
};
function withSupabaseHandler(handler) {
  serve(async (req) => {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }
    try {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL"),
        Deno.env.get("SUPABASE_ANON_KEY"),
        {
          global: {
            headers: {
              Authorization: req.headers.get("Authorization") ?? ""
            }
          }
        }
      );
      const response = await handler(req, supabase);
      return new Response(await response.text(), {
        status: response.status,
        headers: { ...corsHeaders, ...Object.fromEntries(response.headers.entries()) }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: "Server error", details: err.message }), {
        status: 500,
        headers: corsHeaders
      });
    }
  });
}

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
var index_default = withSupabaseHandler(async (req, supabase) => {
  try {
    const { id, question, answer, alt1, alt2, alt3, category } = await req.json();
    if (!id) return new Response(JSON.stringify({ error: "Missing question ID" }), { status: 400 });
    await updateQuestion(supabase, id, question, answer, alt1, alt2, alt3, category);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
});
export {
  index_default as default
};
//# sourceMappingURL=index.mjs.map