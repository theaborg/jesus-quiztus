export const sendPowerup = async (
  supabaseClient,
  gameId,
  senderId,
  receiverId,
  power_type
) => {
  const { error, data } = await supabaseClient.from("Powerups").insert({
    game: gameId,
    sender_id: senderId,
    receiver_id: receiverId,
    type: power_type,
  });

  if (error) {
    console.error("Error in sendPowerup:", error.message);
    return { error };
  }

  return { data };
};
