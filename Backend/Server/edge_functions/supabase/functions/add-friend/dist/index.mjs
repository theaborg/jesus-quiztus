// backend/server/edge_functions/supabase/functions/add-friend/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// backend/lib/friendsServices/send_friend_request.js
var sendFriendRequest = async (supabaseClient, userId, friendId) => {
  const { data, error } = await supabaseClient.from("friendships").insert({
    user_id: userId,
    friend_id: friendId,
    status: "pending"
  });
  if (error) {
    console.error("Error in sendFriendRequest:", error.message);
    return { error };
  }
  return { data };
};

// backend/server/edge_functions/supabase/functions/add-friend/index.ts
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
    const { userId, friendId } = await req.json();
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        "Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables"
      );
    }
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: req.headers.get("Authorization") ?? ""
        }
      }
    });
    const { error, data } = await sendFriendRequest(supabase, userId, friendId);
    if (error) {
      return new Response(
        JSON.stringify({
          error: error.message
        }),
        {
          status: 500,
          headers: corsHeaders
        }
      );
    }
    return new Response(
      JSON.stringify({
        success: true,
        data
      }),
      {
        status: 200,
        headers: corsHeaders
      }
    );
  } catch (err) {
    console.error("Request parsing failed", err);
    return new Response(
      JSON.stringify({
        error: "Invalid request body"
      }),
      {
        status: 400,
        headers: corsHeaders
      }
    );
  }
});
//# sourceMappingURL=index.mjs.map