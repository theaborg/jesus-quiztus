export const getFriends = async (supabaseClient, userId) => {
  const { data, error } = await supabaseClient
    .from("friendships")
    .select("friend_id, user_id")
    .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
    .eq("status", "accepted");

  if (error) {
    console.error("Error in getFriends:", error.message);
    return null;
  }

  return { data };
};
