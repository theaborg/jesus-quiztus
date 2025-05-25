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

// backend/lib/questions/create_set.js
var createSet = async (supabase, name, category, amount, userId) => {
  const { data, error } = await supabase.from("QuestionsSet").insert({
    name: name || "Name",
    category: category || "Category",
    user: userId,
    amount
  }).select("id").single();
  if (error) throw error;
  return data.id;
};

// backend/server/edge_functions/supabase/functions/create-set/index.ts
var index_default = withSupabaseHandler(async (req, supabase) => {
  try {
    const { name, category, amount, userId } = await req.json();
    if (!userId || amount === void 0) return new Response(JSON.stringify({ error: "Missing userId or amount" }), { status: 400 });
    const setId = await createSet(supabase, name, category, amount, userId);
    return new Response(JSON.stringify({ setId }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
});
export {
  index_default as default
};
//# sourceMappingURL=index.mjs.map