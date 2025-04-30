import { supabase } from "../supabaseClient";

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) throw error || new Error("No user found");
  return data.user;
};

export const getUserGame = async (userId) => {
  const { data, error } = await supabase
    .from("users")
    .select("game")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data.game;
};

export const setUserGame = async (userId, gameId) => {
  const { error } = await supabase
    .from("users")
    .update({ game: gameId })
    .eq("id", userId);
  if (error) throw error;
};
