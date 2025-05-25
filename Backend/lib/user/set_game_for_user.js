export const setGame = async (gameId, userId) => {
  //console.log("Setting game for user:", userId, "to game:", gameId);
  const { error } = await supabase
    .from("users")
    .update({ game: gameId })
    .eq("id", userId);

  if (error) throw error;
};
