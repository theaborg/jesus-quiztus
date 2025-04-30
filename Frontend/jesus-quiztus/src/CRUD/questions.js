import { supabase } from "../supabaseClient";

export const fetchQuestions = async (questionSetId) => {
  const { data, error } = await supabase
    .from("Questions")
    .select("*")
    .eq("set", questionSetId)
    .order("id", { ascending: true });

  if (error) throw error;

  return data.map((q) => ({
    text: q.question,
    alternatives: shuffle([q.answer, q.alt_1, q.alt_2, q.alt_3]),
    correct: q.answer,
  }));
};

const shuffle = (array) => array.sort(() => Math.random() - 0.5);