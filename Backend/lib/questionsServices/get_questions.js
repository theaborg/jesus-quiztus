export const getQuestions = async (supabase, questionSetId) => {
  const { data, error } = await supabase
    .from("Questions")
    .select("*")
    .eq("set", questionSetId);

  if (error) throw error;

  return data.map((q) => ({
    text: q.question,
    alternatives: shuffle([q.answer, q.alt_1, q.alt_2, q.alt_3]),
    correct: q.answer,
    category: q.category,
    image: q.image,
    id: q.id,
  }));
};

const shuffle = (array) => array.sort(() => Math.random() - 0.5);