export const createSet = async (supabase, name, category, amount, userId) => {
  const { data, error } = await supabase
    .from("QuestionsSet")
    .insert({
      name: name || "Name",
      category: category || "Category",
      user: userId,
      amount: amount,
    })
    .select("id") // tror att detta hämtar tillbaka id:t
    .single();

  if (error) throw error;
  return data.id;
};