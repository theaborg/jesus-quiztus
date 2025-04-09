import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

// Start the Edge Function
serve(async (req) => {
  // Handle preflight (CORS)
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  const { email, password, username, name } = await req.json();

  // Init Supabase client
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")! // Must be service role key
  );

  // 1. Create Auth user
  const { data: user, error: signupError } = await supabase.auth.admin.createUser({
    email,
    password,
  });

  if (signupError || !user) {
    return new Response(JSON.stringify({ error: signupError?.message || "User creation failed" }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  // 2. Add profile info
  const { error: profileError } = await supabase.from("profiles").insert([
    {
      id: user.user.id,
      username,
      name,
    },
  ]);

  if (profileError) {
    return new Response(JSON.stringify({ error: profileError.message }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  return new Response(JSON.stringify({ message: "User created successfully!" }), {
    status: 200,
    headers: corsHeaders,
  });
});

// Common CORS headers
const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
