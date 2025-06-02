export const setGameState = async (supabase, gameId, new_state) => {
  const { error } = await supabase
    .from("games")
    .update({ state: new_state })
    .eq("id", gameId);
  if (error) throw error;
};