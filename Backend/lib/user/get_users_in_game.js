export const getPlayers = async (gameId) => {
  const { data, error } = await supabase
    .from("users")
    .select("id, nickname, game")
    .eq("game", gameId);

  if (error) throw error;

  return data;
};

