import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { sendFriendRequest } from "../../../../../lib/friends/send_friend_request";

const corsHeaders = {
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
      "YOUR_SERVICE_ROLE_KEY", // Use env vars in production
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
