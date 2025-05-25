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
