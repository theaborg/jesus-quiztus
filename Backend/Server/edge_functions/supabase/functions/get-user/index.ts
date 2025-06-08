// backend/server/edge_functions/supabase/functions/get-user/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// backend/lib/user/get_user.js
var getUser = async (supabaseClient, userId) => {
  const { data, error } = await supabaseClient
    .from("users")
    .select("id, nickname, profile_picture")
    .eq("id", userId)
    .single();
  if (error) {
    console.error("Error fetching user:", error.message);
    return null;
  }
  let profilePictureUrl = "/images/profile_piconsocture.jpg";
  if (data?.profile_picture) {
    const { data: urlData } = supabaseClient.storage
      .from("profile-pictures")
      .getPublicUrl(`${userId}/${data.profile_picture}`);
    profilePictureUrl = urlData?.publicUrl || profilePictureUrl;
  }
  return { ...data, profilePictureUrl };
};

// backend/server/edge_functions/supabase/functions/get-user/index.ts
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    const { userId } = await req.json();
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        "Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variable"
      );
    }
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: req.headers.get("Authorization") ?? "" },
      },
    });
    const user = await getUser(supabase, userId);
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: corsHeaders,
      });
    }
    return new Response(JSON.stringify({ success: true, data: user }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    console.error("Request parsing failed", err);
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: corsHeaders,
    });
  }
});
//# sourceMappingURL=index.mjs.map
