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
