export const getActivePlayers = async (supabase, gameId) => {
  const { data, error } = await supabase
    .from("users")
    .select("nickname, id")
    .eq("game", gameId);

  //console.log("Active players data:", data);

  if (error) {
    console.error("Error in getActivePlayers:", error.message);
    return null;
  }

  return data;
};