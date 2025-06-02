export const updateUserProfilePicture = async (
  supabaseClient,
  userId,
  file,
  corsHeaders
) => {
  const currentDate = new Date().toISOString();
  const filePath = `${userId}/profile.${currentDate}`;

  // Upload new profile picture
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
      headers: corsHeaders,
      status: 500,
    });
  }

  // Fetch old picture filename
  const { data: userData, error: fetchError } = await supabaseClient
    .from("users")
    .select("profile_picture")
    .eq("id", userId)
    .single();

  if (fetchError) {
    console.error("Error fetching user:", fetchError.message);
    return new Response(JSON.stringify({ error: "User lookup failed" }), {
      headers: corsHeaders,
      status: 500,
    });
  }

  // Delete old picture if exists
  if (userData?.profile_picture) {
    const { data: deleteData, error: deleteError } =
      await supabaseClient.storage
        .from("profile-pictures")
        .remove([`${userId}/${userData.profile_picture}`]);

    if (deleteError) {
      console.error("Delete failed:", deleteError.message);
    }
  }

  // Update DB
  const { error: dbError } = await supabaseClient
    .from("users")
    .update({ profile_picture: `profile.${currentDate}` })
    .eq("id", userId);

  if (dbError) {
    console.error("DB update failed:", dbError.message);
    return new Response(JSON.stringify({ error: "Database update failed" }), {
      headers: corsHeaders,
      status: 500,
    });
  }

  // Get public URL
  const { data: urlData, error: urlError } = supabaseClient.storage
    .from("profile-pictures")
    .getPublicUrl(filePath);

  if (urlError) {
    console.error("Public URL error:", urlError.message);
    return new Response(JSON.stringify({ error: "Public URL fetch failed" }), {
      headers: corsHeaders,
      status: 500,
    });
  }

  return new Response(
    JSON.stringify({ success: true, publicUrl: urlData.publicUrl }),
    { status: 200, headers: corsHeaders }
  );
};
