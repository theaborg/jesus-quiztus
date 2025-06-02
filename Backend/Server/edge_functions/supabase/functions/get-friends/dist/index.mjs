// backend/server/edge_functions/supabase/functions/get-friends/index.ts
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// backend/lib/friends/get_friends.js
var getFriends = async (supabaseClient, userId) => {
  const { data, error } = await supabaseClient.from("friendships").select("friend_id, user_id").or(`user_id.eq.${userId},friend_id.eq.${userId}`).eq("status", "accepted");
  if (error) {
    console.error("Error in getFriends:", error.message);
    return null;
  }
  return { data };
};

// backend/server/edge_functions/supabase/functions/get-friends/index.ts
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders
    });
  }
  try {
    const { userId } = await req.json();
    console.log("get-friends", userId);
    if (!userId) {
      return new Response("Missing userId", {
        status: 400,
        headers: corsHeaders
      });
    }
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL"),
      Deno.env.get("SUPABASE_ANON_KEY"),
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization") ?? "" }
        }
      }
    );
    const friends = await getFriends(supabase, userId);
    return new Response(JSON.stringify(friends), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return new Response(
      JSON.stringify({
        error: errorMessage
      }),
      {
        status: 500,
        headers: corsHeaders
      }
    );
  }
});
//# sourceMappingURL=index.mjs.map