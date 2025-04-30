import { supabase } from "../supabaseClient";

export const fetchQuestionSetId = async (gameId) => {
  if (!gameId || gameId === "undefined") throw new Error("Invalid gameId");
  const { data, error } = await supabase
    .from("games")
    .select("question_set")
    .eq("id", gameId)
    .single();
  if (error) throw error;
  return data.question_set;
};

export const fetchQuestionsForSet = async (questionSetId) => {
  const { data, error } = await supabase
    .from("Questions")
    .select("*")
    .eq("set", questionSetId)
    .order("id", { ascending: true });
  if (error) throw error;
  return data;
};