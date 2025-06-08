export const answerFriendRequest = async (
  supabaseClient,
  userId,
  friendId,
  answer
) => {
  const { error, data } = await supabaseClient
    .from("friendships")
    .update({ status: answer })
    .eq("user_id", friendId)
    .eq("friend_id", userId);

  if (error) {
    console.error("Error in setFriendStatus:", error.message);
    return null;
  }
  return { error, data };
};
