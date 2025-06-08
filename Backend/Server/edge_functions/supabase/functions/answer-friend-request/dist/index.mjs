// backend/server/edge_functions/supabase/functions/answer-friend-request/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// backend/lib/friends/answer_friend_request.js
var answerFriendRequest = async (supabaseClient, userId, friendId, answer) => {
  const { error, data } = await supabaseClient.from("friendships").update({ status: answer }).eq("user_id", friendId).eq("friend_id", userId);
  if (error) {
    console.error("Error in setFriendStatus:", error.message);
    return null;
  }
  return { error, data };
};

// backend/server/edge_functions/supabase/functions/answer-friend-request/index.ts
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    const { user_id, friend_id, answer } = await req.json();
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        "Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables"
      );
    }
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: req.headers.get("Authorization") ?? "" }
      }
    });
    const result = await answerFriendRequest(
      supabase,
      user_id,
      friend_id,
      answer
    );
    if (!result) {
      return new Response(
        JSON.stringify({ error: "No response from answerFriendRequest" }),
        {
          status: 500,
          headers: corsHeaders
        }
      );
    }
    const { error, data } = result;
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: corsHeaders
      });
    }
    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: corsHeaders
    });
  } catch (err) {
    console.error("Request parsing failed", err);
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: corsHeaders
    });
  }
});
//# sourceMappingURL=index.mjs.map