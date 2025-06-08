// backend/server/edge_functions/supabase/functions/get-friend-requests/index.ts
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// backend/lib/friends/get_friend_requests.js
var getFriendRequests = async (supabaseClient, userId) => {
  const { data, error } = await supabaseClient
    .from("friendships")
    .select("user_id")
    .eq("friend_id", userId)
    .eq("status", "pending");
  if (error) {
    console.error("Error in getRequests:", error.message);
    return null;
  }
  return { data };
};

// backend/server/edge_functions/supabase/functions/get-friend-requests/index.ts
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }
  try {
    const { userId } = await req.json();
    if (!userId) {
      return new Response("Missing userId", {
        status: 400,
        headers: corsHeaders,
      });
    }
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL"),
      Deno.env.get("SUPABASE_ANON_KEY"),
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization") ?? "" },
        },
      }
    );
    const friendRequests = await getFriendRequests(supabase, userId);
    return new Response(JSON.stringify(friendRequests), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return new Response(
      JSON.stringify({
        error: errorMessage,
      }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
});
//# sourceMappingURL=index.mjs.map
