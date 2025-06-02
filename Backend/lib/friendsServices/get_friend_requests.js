export const getFriendRequests = async (supabaseClient, userId) => {
  const { data, error } = await supabaseClient
    .from("friendships")
    .select("user_id")
    .eq("friend_id", userId)
    .eq("status", "pending");

  if (error) {
    console.error("Error in getRequests:", error.message);
    return null;
  }
  return { data };
};
