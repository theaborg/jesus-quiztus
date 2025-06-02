export async function createQuestion(question, answer, alt1, alt2, alt3, category, image, set, access_token) {
  try {
    const response = await fetch(
      "https://rixhhkmrhhmiajvxrfli.supabase.co/functions/v1/create-question",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          question,
        answer,
        alt1,
        alt2,
        alt3,
        category,
        image,
        set
        }),
      }
    );

    const text = await response.text();

    if (!response.ok) {
      console.error("Edge Function Error:", text);
      return { error: text };
    }

    return { error: null, data: text };
  } catch (err) {
    console.error("Request failed:", err);
    return { error: "Network or server error" };
  }
}

export async function createSet(name, category, amount, userId, access_token) {
  try {
    const response = await fetch(
      "https://rixhhkmrhhmiajvxrfli.supabase.co/functions/v1/create-set",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          name,
          category,
          amount,
          userId,
        }),
      }
    );

    const text = await response.text();

    if (!response.ok) {
      console.error("Edge Function Error:", text);
      return { error: text };
    }

    return { error: null, data: text };
  } catch (err) {
    console.error("Request failed:", err);
    return { error: "Network or server error" };
  }
}


export async function getQuestions(questionSetId, access_token) {
  try {
    const response = await fetch(
      "https://rixhhkmrhhmiajvxrfli.supabase.co/functions/v1/get-questions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          questionSetId
        }),
      }
    );

    const text = await response.text();

    if (!response.ok) {
      console.error("Edge Function Error:", text);
      return { error: text };
    }

    return { error: null, data: text };
  } catch (err) {
    console.error("Request failed:", err);
    return { error: "Network or server error" };
  }
}


export async function getQuestionSetInfo(questionSetId, userId, access_token) {
  try {
    const response = await fetch(
      "https://rixhhkmrhhmiajvxrfli.supabase.co/functions/v1/get-question-set-info",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          questionSetId,
        userId
        }),
      }
    );

    const text = await response.text();

    if (!response.ok) {
      console.error("Edge Function Error:", text);
      return { error: text };
    }

    return { error: null, data: text };
  } catch (err) {
    console.error("Request failed:", err);
    return { error: "Network or server error" };
  }
}


export async function getQuestionSets(userId, access_token) {
  try {
    const response = await fetch(
      "https://rixhhkmrhhmiajvxrfli.supabase.co/functions/v1/get-question-sets",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          userId
        }),
      }
    );

    const text = await response.text();

    if (!response.ok) {
      console.error("Edge Function Error:", text);
      return { error: text };
    }

    return { error: null, data: text };
  } catch (err) {
    console.error("Request failed:", err);
    return { error: "Network or server error" };
  }
}


export async function updateQuestion(
  id,
  question,
  answer,
  alt1,
  alt2,
  alt3,
  category,
  _unused,
  access_token
) {
  if (!access_token) {
    console.error("updateQuestion called without access token");
    return { error: "Missing access token" };
  }

  if (!id || !question || !answer || !category) {
    console.error("Missing required fields:", {
      id,
      question,
      answer,
      category,
    });
    return { error: "Missing required fields" };
  }

  try {
    const response = await fetch(
      "https://rixhhkmrhhmiajvxrfli.supabase.co/functions/v1/update-question",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          id,
          question,
          answer,
          alt1,
          alt2,
          alt3,
          category,
        }),
      }
    );

    const text = await response.text();

    if (!response.ok) {
      console.error("Edge Function Error:", text);
      return { error: text };
    }

    return { error: null, data: text };
  } catch (err) {
    console.error("Request failed:", err);
    return { error: "Network or server error" };
  }
}


export async function updateQuestionsSet(setId, userId, name, category, access_token) {
  try {
    const response = await fetch(
      "https://rixhhkmrhhmiajvxrfli.supabase.co/functions/v1/update-questions-set",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          setId,
        userId,
        name,
        category
        }),
      }
    );

    const text = await response.text();

    if (!response.ok) {
      console.error("Edge Function Error:", text);
      return { error: text };
    }

    return { error: null, data: text };
  } catch (err) {
    console.error("Request failed:", err);
    return { error: "Network or server error" };
  }
}
