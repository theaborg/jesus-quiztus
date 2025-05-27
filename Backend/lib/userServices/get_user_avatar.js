export const getUserAvatar = async (supabaseClient, player) => {
  const { data, error } = await supabaseClient
    .from("users")
    .select("profile_picture")
    .eq("id", player.id)
    .single();

  let avatarUrl = "/images/profile_picture.jpg"; // fallback

  if (data?.profile_picture) {
    const { data: urlData, error: storageError } = supabaseClient.storage
      .from("profile-pictures")
      .getPublicUrl(`${player.id}/${data.profile_picture}`);
    avatarUrl = urlData?.publicUrl || avatarUrl;

    if (storageError) {
      console.error("Error fetching profile picture:", error);
    }
  }

  return { ...player, avatarUrl };
};
