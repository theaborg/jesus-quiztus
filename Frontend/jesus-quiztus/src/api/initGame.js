export async function initGame(gameId, setId, access_token) {
    /**
     * * Starts a new game by sending a POST request to the Supabase function.
     * Using authentication token for authorization.
     * sent via the headers.
     */
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
        //console.log("Edge function kördes:", text);
        return { error: null };
      }
    }
    