export const getUsersInGame = async (supabaseClient, gameId) => {
  const { data, error } = await supabaseClient
    .from("users")
    .select("id, nickname, game")
    .eq("game", gameId);

  if (error) {
    console.error("Error fetching active user:", error.message);
    return { error };
  }

  return { data };
};
