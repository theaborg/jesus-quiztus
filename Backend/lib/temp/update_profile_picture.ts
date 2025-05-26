import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const user_id = formData.get("user_id");
    if (!file || !user_id) {
      return new Response(
        JSON.stringify({
          error: "Missing file or user_id",
        }),
        {
          headers: corsHeaders,
          status: 400,
        }
      );
    }
    const supabase = createClient(
      "https://rixhhkmrhhmiajvxrfli.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpeGhoa21yaGhtaWFqdnhyZmxpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDAxODcwOCwiZXhwIjoyMDU5NTk0NzA4fQ.RkbgDMDjUyJGr4Ilg4ppvBbQog3JX3yv8899tbpcyAc",
      {
        global: {
          headers: {
            Authorization: req.headers.get("Authorization"),
          },
        },
      }
    );
    const currentDate = new Date();
    const filePath = `${user_id}/profile.${currentDate}`;
    console.log(`Uploading file: ${filePath}`);
    const { error: uploadError } = await supabase.storage
      .from("profile-pictures")
      .upload(filePath, file.stream(), {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type,
      });
    if (uploadError) {
      console.error("Upload failed:", uploadError.message);
      return new Response(
        JSON.stringify({
          error: "File upload failed",
        }),
        {
          headers: corsHeaders,
          status: 500,
        }
      );
    }
    // Remove old profile picture
    const { data: old_picture_data, error: old_picture_error } = await supabase
      .from("users")
      .select("profile_picture")
      .eq("id", user_id)
      .single();
    if (old_picture_error) {
      console.error("Error fetching data:", old_picture_error.message);
      return;
    }
    console.log("Old name", old_picture_data.profile_picture);
    const { data, error } = await supabase.storage
      .from("profile-pictures")
      .remove([`${user_id}/${old_picture_data.profile_picture}`]);
    console.log("After removing from storage: ", data, error);
    // Update user table with new profile picture
    const { error: dbError } = await supabase
      .from("users")
      .update({
        profile_picture: `profile.${currentDate}`,
      })
      .eq("id", user_id);
    if (dbError) {
      console.error("Database update failed:", dbError.message);
      return new Response(
        JSON.stringify({
          error: "Database update failed",
        }),
        {
          headers: corsHeaders,
          status: 500,
        }
      );
    }
    const { data: urlData, error: urlError } = supabase.storage
      .from("profile-pictures")
      .getPublicUrl(filePath);
    if (urlError) {
      console.error("Could not get public URL:", urlError.message);
      return new Response(
        JSON.stringify({
          error: "Could not fetch public URL",
        }),
        {
          headers: corsHeaders,
          status: 500,
        }
      );
    }
    return new Response(
      JSON.stringify({
        success: true,
        publicUrl: urlData.publicUrl,
      }),
      {
        status: 200,
        headers: corsHeaders,
      }
    );
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
