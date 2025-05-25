// backend/server/edge_functions/supabase/functions/create-set/index.ts
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const { name, category, amount, userId } = await req.json();
  if (!userId || !amount) {
    return new Response("Missing userId or amount", { status: 400, headers: corsHeaders });
  }
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL"),
    Deno.env.get("SUPABASE_ANON_KEY"),
    { global: { headers: { Authorization: req.headers.get("Authorization") } } }
  );
  try {
    const id = await createSet(supabase, name, category, amount, userId);
    return new Response(JSON.stringify({ id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
});
//# sourceMappingURL=index.mjs.map