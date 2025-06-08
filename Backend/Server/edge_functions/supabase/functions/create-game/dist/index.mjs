// backend/server/edge_functions/supabase/functions/create-game/index.ts
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// backend/lib/games/create_game.js
var createTriviaGame = async (supabase, userId, { amount, category, difficulty, type, encoding }) => {
  const apiUrl = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=${type}&encode=${encoding}`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  if (!data.results || !Array.isArray(data.results)) {
    throw new Error("Invalid question API response");
  }
  const questions = data.results;
  const { data: questionSet, error: qsError } = await supabase.from("QuestionsSet").insert([
    {
      name: "Trivia Game Set",
      amount,
      category: category.toString(),
      user: userId
    }
  ]).select().single();
  if (qsError) throw qsError;
  const formattedQuestions = questions.map((q) => ({
    question: q.question,
    answer: q.correct_answer,
    alt_1: q.incorrect_answers[0] ?? "",
    alt_2: q.incorrect_answers[1] ?? "",
    alt_3: q.incorrect_answers[2] ?? "",
    category: q.category,
    set: questionSet.id
  }));
  const { error: insertError } = await supabase.from("Questions").insert(formattedQuestions);
  if (insertError) throw insertError;
  const { data: gameData, error: gameError } = await supabase.from("games").insert([
    {
      state: "pending",
      question_set: questionSet.id,
      name: "Trivia Game",
      host: userId,
      statistics: JSON.stringify({ correct: 0, incorrect: 0 })
    }
  ]).select().single();
  if (gameError) throw gameError;
  return gameData.id;
};

// backend/server/edge_functions/supabase/functions/create-game/index.ts
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const body = await req.json();
  const { amount, category, difficulty, type, encoding } = body;
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL"),
    Deno.env.get("SUPABASE_ANON_KEY"),
    {
      global: {
        headers: {
          Authorization: req.headers.get("Authorization")
        }
      }
    }
  );
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: corsHeaders
    });
  }
  try {
    const gameId = await createTriviaGame(supabase, user.id, {
      amount,
      category,
      difficulty,
      type,
      encoding
    });
    return new Response(JSON.stringify({ gameId }), {
      status: 200,
      headers: corsHeaders
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders
    });
  }
});
//# sourceMappingURL=index.mjs.map