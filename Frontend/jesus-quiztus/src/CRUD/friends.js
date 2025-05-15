import { supabase } from "../supabaseClient";

export const getFriends = async (userId) => {
  console.log("the user id: ", userId);
  const { data, error } = await supabase
    .from("friendships")
    .select("friend_id, user_id")
    .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
    .eq("status", "accepted");

  if (error) {
    console.error("Error in getFriends:", error.message);
    return null;
  }

  return data;
};

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
