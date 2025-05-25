
export const getFriendRequests = async (userId) => {
  const { data, error } = await supabase
    .from("friendships")
    .select("user_id")
    .eq("friend_id", userId)
    .eq("status", "pending");

  if (error) {
    console.error("Error in getRequests:", error.message);
    return null;
  }
  console.log("Friend requests: ", data);
  return data;
};