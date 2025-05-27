export const getGameStartTime = async (supabase, gameId) => {
  const { data, error } = await supabase
    .from("games")
    .select("start_time")
    .eq("id", gameId);

  if (error) {
    //console.error("Error in getGameStartTime:", error.message);
    
    return null;
  }

  return data;
};