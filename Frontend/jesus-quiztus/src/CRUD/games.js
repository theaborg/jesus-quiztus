import { supabase } from "../supabaseClient";

export const fetchGameDetails = async (gameId) => {
  console.log("Fetching game details");
  const { data, error } = await supabase
    .from("games")
    .select("host, state, question_set")
    .eq("id", gameId)
    .single();

  if (error) throw error;
  console.log("This was the result: ", data);
  return data;
};

export const setGameQuestionIndex = async (gameId, questionIndex) => {
  const { error } = await supabase
    .from("games")
    .update({ question_index: questionIndex })
    .eq("id", gameId);

  if (error) throw error;
};

export const getQuestionIndex = async (gameId) => {
  const { error } = await supabase
    .from("games")
    .select("question_index")
    .eq("id", gameId);

  if (error) throw error;
};

export const setState = async (gameId, new_state) => {
  //console.log("Setting game  ", gameId, " to state ", new_state);
  const { error } = await supabase
    .from("games")
    .update({ state: new_state })
    .eq("id", gameId);
  //console.log("finished writing to db with game state");
  if (error) throw error;
};

export const setGameStartTime = async (gameId, time) => {
  const { error } = await supabase
    .from("games")
    .update({ start_time: time })
    .eq("id", gameId);

  if (error) throw error;
};

export const getGameStartTime = async (gameId) => {
  const { data, error } = await supabase
    .from("games")
    .select("start_time")
    .eq("id", gameId);

  if (error) {
    console.error("Error in getGameStartTime:", error.message);
    return null;
  }

  return data;
};

export const getActivePlayers = async (gameId) => {
  const { data, error } = await supabase
    .from("users")
    .select("nickname, id")
    .eq("game", gameId);

  //console.log("Active players data:", data);

  if (error) {
    console.error("Error in getActivePlayers:", error.message);
    return null;
  }

  return data;
};

export const createCustomGame = async (questionSetId, userId, name) => {
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
