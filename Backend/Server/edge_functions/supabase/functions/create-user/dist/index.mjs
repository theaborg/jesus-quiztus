// backend/server/edge_functions/supabase/functions/create-user/index.ts
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// backend/lib/user/create_user.js
var CreateUser = async (supabaseClient, nickname, corsHeaders2) => {
  const { data, error } = await supabaseClient.from("Users").insert({ nickname }).select();
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: corsHeaders2
    });
  }
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: corsHeaders2
  });
};

// backend/server/edge_functions/supabase/functions/create-user/index.ts
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  const { nickname } = await req.json();
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!supabaseUrl || !supabaseAnonKey) {
    return new Response("Missing Supabase environment variables", {
      status: 500,
      headers: corsHeaders
    });
  }
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: { Authorization: req.headers.get("Authorization") ?? "" }
    }
  });
  const response = await CreateUser(supabase, nickname, corsHeaders);
  if (response instanceof Response) {
    return response;
  }
  return new Response("Internal Server Error", {
    status: 500,
    headers: corsHeaders
  });
});
//# sourceMappingURL=index.mjs.map