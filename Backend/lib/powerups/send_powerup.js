import { data } from "react-router-dom";
import { supabase } from "../supabaseClient";

export const sendPowerup = async (gameId, senderId, receiverId, power_type) => {
  const { error } = await supabase.from("Powerups").insert({
    game: gameId,
    sender_id: senderId,
    receiver_id: receiverId,
    type: power_type,
  });

  if (error) throw error;

  return data;
};
