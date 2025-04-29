import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";


// Setting up CORS headers
// This allows the function to be called from any origin like localhost or any other domain
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabase = createClient(
    // Creating a supabase client instance
    // Should change this like in the Frontend maybe
    "https://rixhhkmrhhmiajvxrfli.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpeGhoa21yaGhtaWFqdnhyZmxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMTg3MDgsImV4cCI6MjA1OTU5NDcwOH0.0vubc3l45l2WK8QBlFZNqZwjzJ-1TopoHC1cljVD7RM",
    {
      global: {
        headers: {
          Authorization: req.headers.get("Authorization")!,
        },
      },
    }
  );

  // Authenticate user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    // Errors with the authentication or no user found send a 401 response
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: corsHeaders,
    });
  }

  // Getting the form data from the request body
  const body = await req.json();
  const { amount, category, difficulty, type, encoding } = body;

  // Fetch questions from OpenTDB
  const apiUrl = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=${type}&encode=${encoding}`;
  const response = await fetch(apiUrl);
  const data = await response.json();

  if (!data.results || !Array.isArray(data.results)) {
    return new Response(
      JSON.stringify({ error: "Invalid question API response" }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }

  const questions = data.results;

  // Insert new QuestionsSet
  const { data: questionSet, error: qsError } = await supabase
    .from("QuestionsSet")
    .insert([
      { name: "Trivia Game Set", category: category.toString(), user: user.id },
    ])
    .select()
    .single();

  if (qsError) {
    return new Response(JSON.stringify({ error: qsError.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }

  // Format and insert questions
  const formattedQuestions = questions.map((q: any) => ({
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

  if (insertError) {
    return new Response(JSON.stringify({ error: insertError.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }

  // Create the Game row
  const { data: gameData, error: gameError } = await supabase
    .from("games")
    .insert([
      {
        state: "pending",
        question_set: questionSet.id,
        name: "Trivia Game",
        statistics: JSON.stringify({ correct: 0, incorrect: 0 }),
      },
    ])
    .select()
    .single();

  if (gameError) {
    return new Response(JSON.stringify({ error: gameError.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }

  return new Response(JSON.stringify({ gameId: gameData.id }), {
    status: 200,
    headers: corsHeaders,
  });
});
