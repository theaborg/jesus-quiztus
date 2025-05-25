import { supabase } from "../supabaseClient";

export const fetchQuestions = async (questionSetId) => {
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

export const getQuestionSets = async (userId) => {
  //console.log("userId in getQuestionSets: ", userId);
  const { data, error } = await supabase
    .from("QuestionsSet")
    .select("*")
    .eq("user", userId);

  if (error) throw error;

  //console.log("data in getQuestionSets: ", data);
  return data; //.map((set) => ({id: set.id,name: set.name,description: set.description,}));
};

export const createSet = async (name, category, amount, userId) => {
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

export const createQuestion = async (
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

export const updateQuestion = async (
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

export const getQuestionSetInfo = async (questionSetId, userId) => {
  const { data, error } = await supabase
    .from("QuestionsSet")
    .select("*")
    .eq("id", questionSetId)
    .eq("user", userId);

  if (error) throw error;

  return data;
};



export const updateQuestionsSet = async (setId, userId, name, category) => {
  //console.log("userId in getQuestionSets: ", userId);
  const { error } = await supabase
    .from("QuestionsSet")
    .update({ name: name, category: category })
    .eq("id", setId)
    .eq("user", userId);

  if (error) throw error;
};