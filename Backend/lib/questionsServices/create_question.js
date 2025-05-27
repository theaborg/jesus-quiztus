export const createQuestion = async (
  supabase,
  question,
  answer,
  alt1,
  alt2,
  alt3,
  category,
  image,
  set
) => {
  const { error } = await supabase.from("Questions").insert({
    question: question || "Question",
    answer: answer || "Answer",
    alt_1: alt1 || "Alternative 1",
    alt_2: alt2 || "Alternative 2",
    alt_3: alt3 || "Alternative 3",
    category: category || "Category",
    //image: image || null,
    set: set,
  });

  if (error) throw error;
};
