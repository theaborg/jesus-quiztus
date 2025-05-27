export const setGameQuestionIndex = async (supabase, gameId, questionIndex) => {
  const { error } = await supabase
    .from("games")
    .update({ question_index: questionIndex })
    .eq("id", gameId);

  if (error) throw error;
};