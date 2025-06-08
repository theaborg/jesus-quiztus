export const setGameStartTime = async (supabase, gameId, time) => {
  const { error } = await supabase
    .from("games")
    .update({ start_time: time })
    .eq("id", gameId);

  if (error) throw error;
};