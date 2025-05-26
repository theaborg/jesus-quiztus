export const updateQuestionsSet = async (supabase, setId, userId, name, category) => {
  //console.log("userId in getQuestionSets: ", userId);
  const { error } = await supabase
    .from("QuestionsSet")
    .update({ name: name, category: category })
    .eq("id", setId)
    .eq("user", userId);

  if (error) throw error;
};