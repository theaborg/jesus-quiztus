export const getPlayersWithAvatars = async (player) => {
  const { data, error } = await supabase
    .from("users")
    .select("profile_picture")
    .eq("id", player.id) // assumes `p.id` is the Supabase user ID
    .single();

  let avatarUrl = "/profile_picture.jpg"; // fallback

  if (data?.profile_picture) {
    const { data: urlData } = supabase.storage
      .from("profile-pictures")
      .getPublicUrl(`${player.id}/${data.profile_picture}`);
    avatarUrl = urlData?.publicUrl || avatarUrl;
  }

  return { ...player, avatarUrl };
};
