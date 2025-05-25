export const getUser = async (userId) => {
  const { data, error } = await supabase
    .from("users")
    .select("id, nickname, profile_picture")
    .eq("id", userId)
    .single();
  if (error) {
    console.error("Error fetching user:", error.message);
    return null;
  }
  let avatarUrl = "/profile_picture.jpg"; // fallback
  if (data?.profile_picture) {
    const { data: urlData } = supabase.storage
      .from("profile-pictures")
      .getPublicUrl(`${userId}/${data.profile_picture}`);
    avatarUrl = urlData?.publicUrl || avatarUrl;
  }
  return { ...data, avatarUrl };
};
