export const createTriviaGame = async (supabase, userId, { amount, category, difficulty, type, encoding }) => {
  const apiUrl = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=${type}&encode=${encoding}`;
  const response = await fetch(apiUrl);
  const data = await response.json();

  if (!data.results || !Array.isArray(data.results)) {
    throw new Error("Invalid question API response");
  }

  const questions = data.results;

  // Insert new QuestionsSet
  const { data: questionSet, error: qsError } = await supabase
    .from("QuestionsSet")
    .insert([
      {
        name: "Trivia Game Set",
        amount,
        category: category.toString(),
        user: userId,
      },
    ])
    .select()
    .single();

  if (qsError) throw qsError;

  const formattedQuestions = questions.map((q) => ({
    question: q.question,
    answer: q.correct_answer,
    alt_1: q.incorrect_answers[0] ?? "",
    alt_2: q.incorrect_answers[1] ?? "",
    alt_3: q.incorrect_answers[2] ?? "",
    category: q.category,
    set: questionSet.id,
  }));

  const { error: insertError } = await supabase
    .from("Questions")
    .insert(formattedQuestions);
  if (insertError) throw insertError;

  const { data: gameData, error: gameError } = await supabase
    .from("games")
    .insert([
      {
        state: "pending",
        question_set: questionSet.id,
        name: "Trivia Game",
        host: userId,
        statistics: JSON.stringify({ correct: 0, incorrect: 0 }),
      },
    ])
    .select()
    .single();

  if (gameError) throw gameError;

  return gameData.id;
};