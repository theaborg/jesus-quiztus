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

// backend/lib/questions/get_question_set_info.js
var getQuestionSetInfo = async (supabase, questionSetId, userId) => {
  const { data, error } = await supabase.from("QuestionsSet").select("*").eq("id", questionSetId).eq("user", userId);
  if (error) throw error;
  return data;
};

// backend/server/edge_functions/supabase/functions/get-question-set-info/index.ts
var index_default = withSupabaseHandler(async (req, supabase) => {
  try {
    const { questionSetId, userId } = await req.json();
    if (!questionSetId || !userId) return new Response(JSON.stringify({ error: "Missing questionSetId or userId" }), { status: 400 });
    const info = await getQuestionSetInfo(supabase, questionSetId, userId);
    return new Response(JSON.stringify(info), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
});
export {
  index_default as default
};
//# sourceMappingURL=index.mjs.map