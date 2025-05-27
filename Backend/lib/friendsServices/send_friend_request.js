export const sendFriendRequest = async (
  supabaseClient,
  userId,
  friendId
) => {
  const { data, error } = await supabaseClient.from("friendships").insert({
    user_id: userId,
    friend_id: friendId,
    status: "pending",
  });

  if (error) {
    console.error("Error in sendFriendRequest:", error.message);
    return { error };
  }

  return { data };
};
