// backend/server/edge_functions/supabase/functions/get-user-avatar/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// backend/lib/user/get_user_avatar.js
const getUserProfilePicture = async (supabaseClient, userId) => {
  const { data, error } = await supabaseClient
    .from("users")
    .select("profile_picture")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching profile picture:", error.message);
    return { error };
  }

  if (!data?.profile_picture) {
    return { publicUrl: null }; // Explicit fallback
  }

  const { data: urlData, error: urlError } = supabaseClient.storage
    .from("profile-pictures")
    .getPublicUrl(`${userId}/${data.profile_picture}`);

  if (urlError) {
    const errorMessage = `Error getting public URL for user ${userId}: ${urlError.message}`;
    console.error(errorMessage);
    return { error: new Error(errorMessage) };
  }

  return { publicUrl: urlData?.publicUrl ?? null };
};

// backend/server/edge_functions/supabase/functions/get-user-avatar/index.ts
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
    const result = await getUserProfilePicture(supabase, userId);
    if (!result || result.error) {
      return new Response(JSON.stringify({ error: result.error.message }), {
        status: 500,
        headers: corsHeaders,
      });
    }
    return new Response(
      JSON.stringify({
        success: true,
        profilePictureUrl: result?.publicUrl,
      }),
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (err) {
    console.error("Request parsing failed", err);
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: corsHeaders,
    });
  }
});
//# sourceMappingURL=index.mjs.map
