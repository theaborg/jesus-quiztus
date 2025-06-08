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
