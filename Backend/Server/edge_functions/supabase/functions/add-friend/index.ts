// backend/server/edge_functions/supabase/functions/add-friend/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

var sendFriendRequest = async (supabaseClient, userId, friendId) => {
  const { data, error } = await supabaseClient.from("friendships").insert({
    user_id: userId,
    friend_id: friendId,
    status: "pending",
  });
  if (error) {
    console.error("Error in sendFriendRequest:", error.message);
    return { error };
  }
  return { data };
};
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
    const { user_id, friend_id } = await req.json();
    const supabase = createClient(
      "https://rixhhkmrhhmiajvxrfli.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpeGhoa21yaGhtaWFqdnhyZmxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMTg3MDgsImV4cCI6MjA1OTU5NDcwOH0.0vubc3l45l2WK8QBlFZNqZwjzJ-1TopoHC1cljVD7RM",
      // Use env vars in production
      {
        global: {
          headers: {
            Authorization: req.headers.get("Authorization"),
          },
        },
      }
    );
    const { error, data } = await sendFriendRequest(
      supabase,
      user_id,
      friend_id
    );
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: corsHeaders,
      });
    }
    return new Response(JSON.stringify({ success: true, data }), {
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
