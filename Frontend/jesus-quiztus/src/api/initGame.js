
export async function initGame(gameId, setId, access_token) {

  const response = await fetch(
    "https://rixhhkmrhhmiajvxrfli.supabase.co/functions/v1/init_game",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        gameId,
        questionSetId: setId,
      }),
    }
  );

  const text = await response.text();
  if (!response.ok) {
    console.error("Fel från Edge Function:", text);
    return { error: text };
  } else {
    return { error: null };
  }
}

