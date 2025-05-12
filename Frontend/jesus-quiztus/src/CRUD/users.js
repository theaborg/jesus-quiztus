import { data } from "react-router-dom";
import { supabase } from "../supabaseClient";

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
      .eq("game", gameId)
  
    if (error) throw error;
  
    return data;
  };