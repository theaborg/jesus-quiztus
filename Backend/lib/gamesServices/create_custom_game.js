export const createCustomGame = async (supabase, questionSetId, userId, name) => {
  if (!name) {
    name = "unnamed";
  }
  const { data, error } = await supabase
    .from("games")
    .insert({
      host: userId,
      question_set: questionSetId,
      name: name,
      state: "pending",
    })
    .select("id")
    .single();

  if (error) throw error;

  return data.id;
};
