export async function createCustomGame(
  questionSetId,
  userId,
  name,
  access_token
) {
  try {
    const response = await fetch(
      "https://rixhhkmrhhmiajvxrfli.supabase.co/functions/v1/create-custom-game",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          questionSetId,
          userId,
          name,
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

export async function getActivePlayers(gameId, access_token) {
  try {
    const response = await fetch(
      "https://rixhhkmrhhmiajvxrfli.supabase.co/functions/v1/get-active-players",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          gameId,
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

export async function fetchGameDetails(gameId, access_token) {
  try {
    const response = await fetch(
      "https://rixhhkmrhhmiajvxrfli.supabase.co/functions/v1/get-game-details",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          gameId,
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

export async function getGameStartTime(gameId, access_token) {
  try {
    const response = await fetch(
      "https://rixhhkmrhhmiajvxrfli.supabase.co/functions/v1/get-game-start-time",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          gameId,
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

export async function setGameQuestionIndex(
  gameId,
  questionIndex,
  access_token
) {
  try {
    const response = await fetch(
      "https://rixhhkmrhhmiajvxrfli.supabase.co/functions/v1/set-game-question-index",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          gameId,
          questionIndex,
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

export async function setGameStartTime(gameId, time, access_token) {
  try {
    const response = await fetch(
      "https://rixhhkmrhhmiajvxrfli.supabase.co/functions/v1/set-game-start-time",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          gameId,
          time,
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

export async function setState(gameId, new_state, access_token) {
  try {
    const response = await fetch(
      "https://rixhhkmrhhmiajvxrfli.supabase.co/functions/v1/set-game-state",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          gameId,
          new_state,
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

export async function createGame(formData, accessToken) {
  /**
   * Starts a new game by sending a POST request to the Supabase function.
   * Using authentication token for authorization.
   * sent via the headers.
   */
  const res = await fetch(
    "https://rixhhkmrhhmiajvxrfli.supabase.co/functions/v1/create-game",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(formData),
    }
  );

  const text = await res.text();
  try {
    const json = JSON.parse(text);
    if (!res.ok) throw new Error(json.error || "Error starting game");
    return json;
  } catch (e) {
    throw new Error("Server did not return valid JSON: " + text);
  }
}

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
