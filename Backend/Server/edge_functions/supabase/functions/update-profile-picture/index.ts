// backend/server/edge_functions/supabase/functions/update_profile_picture/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// backend/lib/user/update_user_avatar.js
var updateUserAvatar = async (supabaseClient, userId, file, corsHeaders2) => {
  const currentDate = /* @__PURE__ */ new Date().toISOString();
  const filePath = `${userId}/profile.${currentDate}`;
  const { error: uploadError } = await supabaseClient.storage
    .from("profile-pictures")
    .upload(filePath, file.stream(), {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type,
    });
  if (uploadError) {
    console.error("Upload failed:", uploadError.message);
    return new Response(JSON.stringify({ error: "File upload failed" }), {
      headers: corsHeaders2,
      status: 500,
    });
  }
  const { data: userData, error: fetchError } = await supabaseClient
    .from("users")
    .select("profile_picture")
    .eq("id", userId)
    .single();
  if (fetchError) {
    console.error("Error fetching user:", fetchError.message);
    return new Response(JSON.stringify({ error: "User lookup failed" }), {
      headers: corsHeaders2,
      status: 500,
    });
  }
  if (userData?.profile_picture) {
    const { data: _deleteData, error: deleteError } =
      await supabaseClient.storage
        .from("profile-pictures")
        .remove([`${userId}/${userData.profile_picture}`]);
    if (deleteError) {
      console.error("Delete failed:", deleteError.message);
    }
  }
  const { error: dbError } = await supabaseClient
    .from("users")
    .update({ profile_picture: `profile.${currentDate}` })
    .eq("id", userId);
  if (dbError) {
    console.error("DB update failed:", dbError.message);
    return new Response(JSON.stringify({ error: "Database update failed" }), {
      headers: corsHeaders2,
      status: 500,
    });
  }
  const { data: urlData, error: urlError } = supabaseClient.storage
    .from("profile-pictures")
    .getPublicUrl(filePath);
  if (urlError) {
    console.error("Public URL error:", urlError.message);
    return new Response(JSON.stringify({ error: "Public URL fetch failed" }), {
      headers: corsHeaders2,
      status: 500,
    });
  }
  return new Response(
    JSON.stringify({ success: true, publicUrl: urlData.publicUrl }),
    { status: 200, headers: corsHeaders2 }
  );
};

// backend/server/edge_functions/supabase/functions/update_profile_picture/index.ts
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    const { user_id } = await req.json();
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
    const formData = await req.formData();
    const file = formData.get("avatar");
    const response = await updateUserAvatar(
      supabase,
      user_id,
      file,
      corsHeaders
    );
    return response;
  } catch (err) {
    console.error("Error:", err);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
      }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
});
//# sourceMappingURL=index.mjs.map
