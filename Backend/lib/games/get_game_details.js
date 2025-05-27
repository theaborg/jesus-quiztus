export const getGameDetails = async (supabase, gameId) => {
  //console.log("Fetching game details");
  const { data, error } = await supabase
    .from("games")
    .select("host, state, question_set")
    .eq("id", gameId)
    .single();

  if (error) throw error;
  //console.log("This was the result: ", data);
  return data;
};