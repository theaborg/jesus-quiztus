export const updateQuestion = async (
  supabase,
  id,
  question,
  answer,
  alt1,
  alt2,
  alt3,
  category
) => {
  console.log("Updating question with ID:", id);
  const { error } = await supabase
    .from("Questions")
    .update({
      question,
      answer,
      alt_1: alt1,
      alt_2: alt2,
      alt_3: alt3,
      category,
    })
    .eq("id", id);

  if (error) throw error;
};