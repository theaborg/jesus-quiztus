export const getQuestionSetInfo = async (supabase, questionSetId, userId) => {
  const { data, error } = await supabase
    .from("QuestionsSet")
    .select("*")
    .eq("id", questionSetId)
    .eq("user", userId);

  if (error) throw error;

  return data;
};