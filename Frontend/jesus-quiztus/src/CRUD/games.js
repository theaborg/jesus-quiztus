import { supabase } from "../supabaseClient";

export const fetchGameDetails = async (gameId) => {
  const { data, error } = await supabase
    .from("games")
    .select("host, state, question_set")
    .eq("id", gameId)
    .single();

  if (error) throw error;

  return data;
};
