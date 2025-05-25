export const setFriendStatus = async (userId, friendId, answer) => {
  const { error } = await supabase
    .from("friendships")
    .update({ status: answer })
    .eq("user_id", friendId)
    .eq("friend_id", userId);

  if (error) {
    console.error("Error in setFriendStatus:", error.message);
    return null;
  }
};
