export const getUser = async (supabaseClient, userId) => {
  const { data, error } = await supabaseClient
    .from("users")
    .select("id, nickname, profile_picture")
    .eq("id", userId)
    .single();
  if (error) {
    console.error("Error fetching user:", error.message);
    return null;
  }
  let avatarUrl = "/images/profile_picture.jpg"; // fallback
  if (data?.profile_picture) {
    const { data: urlData } = supabaseClient.storage
      .from("profile-pictures")
      .getPublicUrl(`${userId}/${data.profile_picture}`);
    avatarUrl = urlData?.publicUrl || avatarUrl;
  }
  return { ...data, avatarUrl };
};
