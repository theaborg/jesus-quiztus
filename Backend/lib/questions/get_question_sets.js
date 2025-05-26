export const getQuestionSets = async (supabase, userId) => {
  //console.log("userId in getQuestionSets: ", userId);
  const { data, error } = await supabase
    .from("QuestionsSet")
    .select("*")
    .eq("user", userId);

  if (error) throw error;

  //console.log("data in getQuestionSets: ", data);
  return data; //.map((set) => ({id: set.id,name: set.name,description: set.description,}));
};