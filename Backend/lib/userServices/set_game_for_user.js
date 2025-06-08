export const setGameForUser = async (supabaseClient, gameId, userId) => {
  const { error, data } = await supabaseClient
    .from("users")
    .update({ game: gameId })
    .eq("id", userId);

  if (error) {
    console.error("Error in setGameForUser:", error.message);
    return { error };
  }
  return data;
};
