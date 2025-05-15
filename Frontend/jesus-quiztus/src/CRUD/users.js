import { data } from "react-router-dom";
import { supabase } from "../supabaseClient";


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


export const setGame = async (gameId, userId) => {
  //console.log("Setting game for user:", userId, "to game:", gameId);
  const { error } = await supabase
    .from("users")
    .update({ game: gameId })
    .eq("id", userId);

  if (error) throw error;
};

export const getPlayers = async (gameId) => {
  const { data, error } = await supabase
    .from("users")
    .select("id, nickname, game")
    .eq("game", gameId);

  if (error) throw error;

  return data;
};

export const getPlayersWithAvatars = async (player) => {
  const { data, error } = await supabase
    .from("users")
    .select("profile_picture")
    .eq("id", player.id) // assumes `p.id` is the Supabase user ID
    .single();

  let avatarUrl = "/profile_picture.jpg"; // fallback

  if (data?.profile_picture) {
    const { data: urlData } = supabase.storage
      .from("profile-pictures")
      .getPublicUrl(`${player.id}/${data.profile_picture}`);
    avatarUrl = urlData?.publicUrl || avatarUrl;
  }

  return { ...player, avatarUrl };
};
