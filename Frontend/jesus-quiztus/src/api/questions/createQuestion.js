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
